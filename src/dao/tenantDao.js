const Tenant = require('../models/TenantModel');
const Suite = require("../models/SuiteModel");
const User = require("../models/UserModel")
const crypto = require("crypto")

const LOGGER = require('../logger/logger');
const Building = require('../models/BuildingModel');
const Invite = require('../models/InviteModel');


// ------------------ TENANT CRUD ------------------ //
const getTenantById = async (req, res) => {
    try {   
        const tenant = await Tenant.findById(req.params.tenantId);
        if (!tenant) {
            return res.status(404).json({ message: 'Tenant not found' });
        }
        if (tenant.users.indexOf(req.user.id) === -1 && req.user.permissions !== "admin") {
            return res.status(403).json("Unauthorized")
        }

        // filter the user list to only show specific fields
        const popTenant = await Tenant.findById(req.params.tenantId).populate("users").exec();
        const userList = popTenant.users.map(user => ({
            _id: user._id,
            username: user.username,
            name: user.name,
            role: user.permissions
        }));

        // permission filtering
        if (req.user.permissions === "admin" || req.user.permissions === "owner" || req.user.permissions === "propertyManager") {
            res.status(200).json({
                ...tenant._doc,
                users: userList
            });
        } else if (req.user.permissions === "tenant") {
            res.status(200).json({
                name: tenant.name,
                businessType: tenant.businessType,
                users: userList
            })
        } else {
            res.status(403).json({
                message: "Permissions error",
                currentPermissions: req.user.permissions
            });            
        }

    } catch(err) {
        LOGGER.error("Error getting tenant")
        res.status(500).json(err);
    }
}

// I previously added all users (including building owners/ prop managers/ service contractors)
//  to the tenant users list but this can get convoluted. I suggest changing this in the future
// so that those users don't get readded to tenants if you find it troublesome
const createTenant = async (req, res) => {
    try {
        if (!req.body.suiteId) {
            return res.status(400).json({ message: 'Missing suiteId' });
        }
        const tempSuite = await Suite.findById(req.body.suiteId);
        if (!tempSuite) {
            return res.status(400).json({ message: 'Suite not found' });
        }

        const building = await Building.findById(tempSuite.buildingId);
        // checking if building owner or admin
        if (building.buildingOwner.indexOf(req.user.id) === -1 && req.user.permissions !== "admin") {
            return res.status(401).json({ message: 'User is not building owner' });
        } else {

            // don't add another tenant if suite is already occupied
            if (tempSuite.occupied) {
                return res.status(400).json({ message: 'Suite is occupied' });
            }

            // create tenant and modify the suite
            const tenant = new Tenant({ 
                ...req.body,
                users: [building.buildingOwner, building.propertyManager, building.serviceContractor].flat(),
                buildingId: tempSuite.buildingId
            });
            await tenant.save();
            const suite = await Suite.findByIdAndUpdate(req.body.suiteId, {   
                    tenant: tenant._id,
                    occupied: true 
                }, 
                { new: true }
            ); 
          
 
            LOGGER.debug("Created tenant");
            res.status(201).json({
                tenant: tenant,
                modifiedSuite: suite
            });
        }
    } catch(err) {
        LOGGER.error("Error creating tenant")
        res.status(500).json(err);
    }
    

}

const updateTenant = async (req, res) => {
    try {
        if (req.body.buildingId || req.body.users || req.body.suiteId) {
            res.status(401).json({ message: 'buildingId, users, and suiteId are immutable through this endpoint' });
        }

        // if the user is a building owner, they should have full access of the tenant
        const temp = await Tenant.findById(req.params.tenantId);
        const building = await Building.findById(temp.buildingId);

        if (building.buildingOwner.indexOf(req.user.id) === -1
            && building.propertyManager.indexOf(req.user.id) === -1
            && req.user.permissions !== "admin") {
            return res.status(401).json({ message: 'Unauthorized' });
        } else {
            const tenant = await Tenant.findByIdAndUpdate(req.params.tenantId, req.body, {
                new: true
            });
            if (!tenant) {
                res.status(400).json({ message: 'Tenant not found' });
            }
            LOGGER.debug("Updated tenant")
            res.status(200).json(tenant);
        }
        
    } catch(err) {
        LOGGER.error("Error updating tenant")
        res.status(500).json(err);
    }

}

const deleteTenant = async (req, res) => {
    try {
        const temp = await Tenant.findById(req.params.tenantId);
        const building = await Building.findById(temp.buildingId);
        if (building.buildingOwner.indexOf(req.user.id) === -1 && req.user.permissions !== "admin") {
            return res.status(401).json({ message: 'User is not building owner' });
        }
        else {
            const deletedTenant = await Tenant.findByIdAndDelete(req.params.id);
            let modifiedSuite;
            if (!tenant) {
                res.status(404).json({ message: 'Tenant not found' });
            }
            if (tenant.suiteId) {
                // set the suite that the tenant occupied to have tenant=null
                modifiedSuite = await Suite.findByIdAndUpdate(tenant.suiteId,
                    { tenant: null },
                );
            }

            const updatedUsers = await User.updateMany({ tenants: { $in: tenant._id } }, {
                $pull: { tenants: tenant._id }
            });

            LOGGER.debug("Deleted tenant")
            res.status(200).json({deletedTenant, modifiedSuite});
        }
    } catch(err) {
        LOGGER.error("Error deleting tenant")
        res.status(500).json(err);
    }

}
// ------------------ END TENANT CRUD ------------------ //


// ------------------- USER INVITATION ------------------- //
// this is for inviting an existing user to join a tenant
const addUserToTenant = async(req, res) => {
    try {
        // auth
        const tenant = await Tenant.findById(req.params.tenantId);
        if (!tenant) { return res.status(400).json("No tenant found"); }

        const building = await Building.findById(tenant.buildingId);
        if (!building.buildingOwner.includes(req.user.id)
        && !building.propertyManager.includes(req.user.id)) {
            return res.status(401).json({ message: 'User is not authorized for this building' });
        }
        
        // first check if the user to be added exists
        const user = await User.findOne({ 
            $or: [
                { username: req.body.username },
                { email: req.body.email}
            ]
        });
        if (!user) { return res.status(400).json("No user found"); }

        // adding to invite collection
        const invitation = new Invite({
            from: req.user.id,
            to: user._id,
            inviteType: "tenant",
            data: {
                role: req.body.role ? req.body.role : "tenant",
                tenantId: tenant._id
            }
        });

        // need to add functionality to keep users from resending the same invitation
        const existingInvitation = await Invite.findOne({
            from: req.user.id,
            to: user._id,
            inviteType: "tenant",
            "data.tenantId": tenant._id,
            "data.role": req.body.role ? req.body.role : "tenant"
        });
        if (existingInvitation) { return res.status(400).json({ message:"Invitation already exists" }); }

        // { not used right now, but if you wan't, you can add this back in }
        // doesn't actually add the user, just updates their invitations
        // choose between only having an invite collection or adding the invites to the user's document as well
        // const addedUser = await User.findByIdAndUpdate(user._id, {
        //     $addToSet: { receivedInvites: invitation._id }
        // });
        // const sender = await User.findByIdAndUpdate(req.user.id, {
        //     $addToSet: { sentInvites: invitation._id }
        // });
        await invitation.save();


        LOGGER.debug(`Sent ${user.username} an invite to tenant ${tenant.name}`)
        res.status(200).json({
            message: `Sent ${user.username} an invite to tenant ${tenant.name}`,
        })
    } catch(err) {
        LOGGER.error(`Error sending an invite to a tenant`)
        res.status(500).json(err);
    }
};

const deleteInvite = async(req, res) => {
    try {
        // find the invite
        const invite = await Invite.findById(req.params.inviteId);
        if (!invite) { return res.status(400).json("No invite found"); }

        // get the tenant that the invite is for
        const tenant = await Tenant.findById(invite.data.tenantId);
        if (!tenant) { return res.status(400).json("No tenant found"); }

        // auth
        const building = await Building.findById(tenant.buildingId);
        if (!building.buildingOwner.includes(req.user.id)
        && !building.propertyManager.includes(req.user.id)) {
            return res.status(401).json({ message: 'User is not authorized for this building' });
        }
        // remove it
        const deletedInvite = await Invite.findByIdAndDelete(req.params.inviteId);
        res.status(200).json({ 
            message: "Invite deleted", 
            deletedInvite: deletedInvite
        })
    } catch(err) {
        res.status(500).json(err);
    }
};

const getAllInvites = async(req, res) => {
    try {
        const tenant = await Tenant.findById(req.params.tenantId);
        if (!tenant) { return res.status(400).json("No tenant found"); }

        const building = await Building.findById(tenant.buildingId);
        if (!building.buildingOwner.includes(req.user.id)
        && !building.propertyManager.includes(req.user.id)) {
            return res.status(401).json({ message: 'User is not authorized for this building' });
        }
        const invites = await Invite.find({ "data.tenantId": tenant._id });
        res.status(200).json(invites);
    } catch(err) {
        res.status(500).json(err);
    }
};

const removeUserFromTenant = async(req, res) => {
    try {
        const tenant = await Tenant.findById(req.params.tenantId);
        if (!tenant) { return res.status(400).json("No tenant found"); }

        const building = await Building.findById(tenant.buildingId);
        if (building.buildingOwner.indexOf(req.user.id) === -1 
        && building.propertyManager.indexOf(req.user.id) === -1
        && req.user.permissions !== "admin") {
            return res.status(401).json({ message: 'User is not authorized for this building' });
        }
        
        // first check if the user to be removed exists
        const user = await User.findById(req.body.userId);
        if (!user) { return res.status(400).json("No user found"); }

        if (building.buildingOwner.includes(user._id)) {
            return res.status(403).json({ message: "Cannot remove building owner" });
        }

        // adding the user to the tenant as well as adding the tenant to the user's tenants list
        const removedUser = await User.findByIdAndUpdate(user._id, {
            $pull: { tenants: tenant._id }
        }, { new: true });
        const updatedTenant = await Tenant.findByIdAndUpdate(req.params.tenantId, {
            $pull: { users: user._id }
        }, { new: true });

        res.status(200).json({
            message: `Removed ${removedUser.username} from tenant ${tenant.name}`,
            updatedTenantUsers: updatedTenant.users
        })
    } catch(err) {
        res.status(500).json(err);
    }
};

// this is for sending invite links to join a specific tenant business
const createInviteCode = async(req, res) => {
    try {
        const businessTenant = await Tenant.findById(req.body.tenantId);
        if (!businessTenant) { return res.status(400).json("No tenant found") }

        const building = await Building.findById(businessTenant.buildingId);
        if (!building) { return res.status(400).json("No building found") }
        if (building.buildingOwner.indexOf(req.user.id) === -1 
            && req.user.permissions !== "admin"
            && building.propertyManager.indexOf(req.user.id)) {
            return res.status(401).json('User is not authorized for this building');
        } 

        // create a new invite code
        const codePresent = await Tenant.findOne({ inviteCode: req.body.inviteCode });
        let code = crypto.randomBytes(4).toString('hex');
        while (codePresent) {
            code = crypto.randomBytes(4).toString('hex');
        }

        businessTenant.inviteCode = code;
        await businessTenant.save();

        LOGGER.debug("Created invite code")
        res.status(200).json({
            message: `Created invite code for ${businessTenant.name}`,
            inviteCode: code
        });
        
    } catch(err) {
        res.status(500).json(err);
    }
};

const deleteInviteCode = async(req, res) => {
    try {
        const businessTenant = await Tenant.findById(req.body.tenantId);
        if (!businessTenant) { return res.status(400).json("No tenant found") }

        const building = await Building.findById(businessTenant.buildingId);
        if (!building) { return res.status(400).json("No building found") }
        if (building.buildingOwner.indexOf(req.user.id) === -1 
            && req.user.permissions !== "admin"
            && building.propertyManager.indexOf(req.user.id)) {
            return res.status(401).json('User is not authorized for this building');
        } 

        businessTenant.inviteCode = null;
        await businessTenant.save();

        LOGGER.debug("Deleted invite code")
        res.status(200).json({
            message: `Deleted invite code for ${businessTenant.name}`,
            inviteCode: null
        });
        
    } catch(err) {
        res.status(500).json(err);
    }
}
// ------------------- END USER INVITATION ------------------- //

const getBuildingTenants = async(req, res) => {
    try {
        const building = await Building.findById(req.params.buildingId);
        if (!building) { return res.status(400).json("No building found"); }
        if (!building.buildingOwner.includes(req.user.id) &&
            !building.propertyManager.includes(req.user.id)) {
            return res.status(401).json({ message: 'User is not authorized for this building' });
            }
        const tenants = await Tenant.find({ buildingId: req.params.buildingId });
        res.status(200).json(tenants);
    } catch(err) {
        res.status(500).json(err);
    }
}

const addTenantToSuite = async(req, res) => {
    try {
        const suite = await Suite.findById(req.body.suiteId);
        if (!suite) { return res.status(400).json("Suite not found"); }
        const tenant = await Tenant.findById(req.body.tenantId);
        if (!tenant) { return res.status(400).json("Tenant not found"); }
        const building = await Building.findById(suite.buildingId);
        if (!building.buildingOwner.includes(req.user.id) &&
            !building.propertyManager.includes(req.user.id)) 
        {
            return res.status(401).json({ message: 'User is not authorized for this action' });
        }

        if (suite.occupied) {
            return res.status(400).json({ message:"Suite or tenant not found" });
        }

        suite.tenant = tenant._id;
        suite.occupied = true;
        await suite.save();

        tenant.suiteId = suite._id;
        await tenant.save();

        res.status(200).json({
            message: `Added ${tenant.name} to suite ${suite.suite}`,
            tenant: tenant
        });
    } catch(err) {
        res.status(500).json(err);
    }
}

const removeTenantFromSuite = async(req, res) => {
    try {
        const suite = await Suite.findById(req.body.suiteId);
        const tenant = await Tenant.findById(suite.tenant);
        if (!suite || !tenant) {
            return res.status(400).json({ message:"Suite or tenant not found" });
        }
        const building = await Building.findById(suite.buildingId);
        if (!building.buildingOwner.includes(req.user.id) ||
            !building.propertyManager.includes(req.user.id)) 
        {
            return res.status(401).json({ message: 'User is not authorized for this action' });
        }

        suite.tenant = null;
        suite.occupied = false;
        await suite.save();

        tenant.suiteId = null;
        await tenant.save();

        res.status(200).json({
            message: `Removed ${tenant.name} from suite ${suite.suite}`
        });

    } catch(err) {
        res.status(500).json(err);
    }
}


module.exports = {
    getTenantById,
    updateTenant,
    deleteTenant,
    createTenant,
    createInviteCode,
    addUserToTenant,
    removeUserFromTenant,
    deleteInviteCode,
    getAllInvites,
    deleteInvite,
    addTenantToSuite,
    getBuildingTenants,
    removeTenantFromSuite
}