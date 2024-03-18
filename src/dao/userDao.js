const User = require('../models/UserModel')
const LOGGER = require('../logger/logger')
const Building = require('../models/BuildingModel')
const Invite = require('../models/InviteModel')
const mongoose = require('mongoose')
const Tenant = require('../models/TenantModel')

const FILE_NAME = 'userDao.js'

// user creation is within the auth.js route
// we get the req.user from the authentication middleware
// use the req.user to verify identity

const updateUser = async(req,res) => {
    if (req.params.id === req.user.id || req.user.permissions === "admin") {
        try {
            // forbid certain fields from being updated
            // if you can figure out a better way to do this, please do
            if (req.body.buildings || req.body.tenants || 
                req.body.verified) {
                return res.status(400).json("Invalid update to immutable field")
            }

            const updatedUser = await User.findByIdAndUpdate(req.params.id, 
                { $set: req.body }, 
                { new: true });
            res.status(200).json(updatedUser);
        } catch(err) {
            res.status(500).json(err);
        }
    } else {
        return res.status(403).json("Invalid authentication")
    }
}

const deleteUser = async(req,res) => {
    try {

    } catch(err) {
        res.status(500).json(err);
    }
}

const getAll = async(req, res) => {
    try {   
        const users = await User.find();
        LOGGER.debug("Retrieved all users")
        res.status(200).json(users);
    } catch(err) {
        LOGGER.error("Error retrieving all users")
        res.status(500).json(err);
    }
}

const getUserById = async(req, res) => {
    try {
        if (req.params.id !== req.user.id && req.user.permissions !== "admin") {
            return res.status(403).json("Invalid authentication")
        }

        const query = User.findById(req.params.id);

        if (req.query.populate === "true") {
            query.populate("buildings");
        }

        const user = await query.exec();
        LOGGER.debug("Retrieved user")

        res.status(200).json(user);
    } catch(err) {
        LOGGER.error("Error retrieving user")
        res.status(500).json(err);
    }
}

// ------------------- INVITES ------------------- //
const getInvites = async(req, res) => {
    try {
        if (!req.user.id) {
            return res.status(404).json({message:"No user logged in"});
        }
        const sentInvites = await Invite.find({ from: req.user.id });
        const receivedInvites  = await Invite.find({ to: req.user.id });
        res.status(200).json({
            sentInvites: sentInvites,
            receivedInvites: receivedInvites
        });
    } catch(err) {
        res.status(500).json(err);
    }
}


const handleInvite = async(req, res) => {
try {
    // find the invite
    const invite = await Invite.findById(req.params.inviteId);
    if (!invite) { return res.status(404).json("Invite not found"); }
    // check if logged in user is the recipient of the invite
    if (!String(invite.to) === req.user.id) {
        return res.status(403).json("User is not the recipient of this invite")
    }



    // if we accept the invite, add the user to the tenant
    // this is kind of hellish, but it works
    if (req.query.accept === "true" && req.user.permissions === invite.data.role) {
        // if its a tenant invite, add tenant to user's tenants list and add user to tenant's user list
        if (invite.inviteType === "tenant") {
            const updatedTenant = await Tenant.findByIdAndUpdate(invite.data.tenantId, {
                $addToSet: { users: req.user.id }
            });
            // add the tenant id to the user's tenant list
            const updatedUser = await User.findByIdAndUpdate(req.user.id, {
                $addToSet: { tenants: invite.data.tenantId }
            })
            const deletedInvite = await Invite.findByIdAndDelete(req.params.inviteId);
            res.status(200).json({
                message: "Invite accepted",
            })
        }

        // if its a building invite for say buildingOwner or propertyManager roles
        else if (invite.inviteType === "propertyManager") {
            const addedUser = await User.findByIdAndUpdate(req.user.id, {
                $addToSet: { buildings: invite.data?.buildingId }
            });
            const updatedBuilding = await Building.findByIdAndUpdate(invite.data.buildingId, {
                $addToSet: { propertyManager: req.user.id }
            });
            // add the user to all of the tenants
            const updatedTenants = await Tenant.updateMany({ buildingId: invite.data.buildingId }, {
                $addToSet: { users: req.user.id }
            });
            const deletedInvite = await Invite.findByIdAndDelete(req.params.inviteId);
            res.status(200).json({
                message: "Invite accepted",
            })
        }
        else if (invite.inviteType === "serviceContractor") {
            const addedUser = await User.findByIdAndUpdate(req.user.id, {
                $addToSet: { buildings: invite.data?.buildingId }
            });
            const updatedBuilding = await Building.findByIdAndUpdate(invite.data.buildingId, {
                $addToSet: { serviceContractor: req.user.id }
            });
            // add the user to all of the tenants
            const updatedTenants = await Tenant.updateMany({ buildingId: invite.data.buildingId }, {
                $addToSet: { users: req.user.id }
            });
            const deletedInvite = await Invite.findByIdAndDelete(req.params.inviteId);
            res.status(200).json({
                message: "Invite accepted",
            })
        }
        else {
            res.status(400).json({
                message: "Invalid invite",
            })
        }
    } else if (req.query.accept === "false" && req.user.permissions === invite.data.role) {
        // if we decline, then remove the invite from the invite collection
        const deleted = await Invite.findByIdAndDelete(req.params.inviteId);
        res.status(200).json("Invite declined");
    } else {
        res.status(400).json("Invalid role. It's possible that you are trying to invite a user for a role that their account does not support or an invite action was not specified.");
    }

} catch(err) {
    res.status(500).json(err);
}
}

const deleteInvite = async(req, res) => {
    try {
        const invite = await Invite.findById(req.params.inviteId);
        if (!invite) { return res.status(400).json("Invite not found"); }

        const user = await User.findById(req.user.id);
        // auth
        if (String(invite.from) !== req.user.id && user.permissions !== "admin") {
            return res.status(403).json({ message:"User is not the sender of the invite" });
        }

        // setup removal from both users invitations as well as the invite database
        const deletedInvite = await Invite.findByIdAndDelete(req.params.inviteId);

        res.status(200).json({
            message: "Invite deleted"
        })
    } catch(err) {
        res.status(500).json(err);
    }
}

const joinByCode = async(req, res) => {
    try {
        if (req.body.code === null || req.body.code === undefined) {
            return res.status(400).json({ message:"Invalid invite code" });
        }
        const tenant = await Tenant.findOne({ inviteCode: req.body.code });
        if (!tenant) { return res.status(404).json("Tenant not found"); }

        const updatedUser = User.findByIdAndUpdate(req.user.id, {
            $addToSet: { tenants: tenant._id }
        }, { new: true });
        const updatedTenant = Tenant.findOneAndUpdate({ inviteCode: req.body.code }, {
            $addToSet: { users: req.user.id }
        }, { new: true });

        await Promise.all([updatedUser.exec(), updatedTenant.exec()]);
        res.status(200).json("User added to tenant")
    } catch(err) {
        res.status(500).json(err);
    }
}



// ------------------ END INVITES ------------------ //

// -- leaving / joining buildings or tenants -- //
const leaveBuilding = async(req, res) => {
    try {   
        const building = await Building.findById(req.params.buildingId);
        if (!building) { return res.status(404).json({ message:"Building not found" }); }

        if (building.buildingOwner.includes(req.user.id) && building.buildingOwner.length === 1) {
            return res.status(403).json({ message:"Building owner cannot leave building" });
        }

        if (!building.propertyManager.includes(req.user.id) &&
            !building.serviceContractor.includes(req.user.id)) {
            return res.status(403).json({ message:"User is not a part of the building. If a tenant user is leaving, use the leave tenant route." });
            }

        // remove the user from the building and then all of the tenants
        const updatedBuilding = await Building.findByIdAndUpdate(req.params.buildingId, {
            $pull: { propertyManager: req.user.id, serviceContractor: req.user.id }
        });
        const updatedTenants = await Tenant.updateMany({ buildingId: req.params.buildingId }, {
            $pull: { users: req.user.id }
        });
        const updatedUser = await User.findByIdAndUpdate(req.user.id, {
            $pull: { buildings: req.params.buildingId }
        });

        res.status(200).json({ message: "User left" })

    } catch(err) {
        res.status(500).json(err);
    }
}

const leaveTenant = async(req, res) => {
    try {
        const tenant = await Tenant.findById(req.params.tenantId);
        if (req.user.permissions !== "tenant") {
            return res.status(403).json({ message:"User is not a tenant" });
        }

        if (!tenant.users.includes(req.user.id)) {
            return res.status(403).json({ message:"User is not a part of the tenant" });
        }

        // remove the user from the tenant
        const updatedTenant = await Tenant.findByIdAndUpdate(req.params.tenantId, {
            $pull: { users: req.user.id }
        });
        const updatedUser = await User.findByIdAndUpdate(req.user.id, {
            $pull: { tenants: req.params.tenantId }
        });
    } catch(err) {
        res.status(500).json(err);
    }
}
// -- end block -- //

const getUsersTenants = async(req, res) => {
    if (!req.params.userId) { res.status(400).json("userId required")}

    try {
        if (req.params.userId === req.user.id) {
            const tenants = await User.findById(req.user.id).select("tenants").populate("tenants");
            LOGGER.debug("Retrieved by buildings by user id");
            return res.status(200).json(tenants);
        }
        res.status(403).json("Invalid authentication");
    } catch(err) {
        res.status(500).json(err);
    }
}

const getUsersBuildings = async(req, res) => {
    try {
        if (req.params.userId === req.user.id) {
            const buildings = await User.findById(req.user.id).select("buildings").populate("buildings");
            LOGGER.debug("Retrieved by buildings by user id");
            return res.status(200).json(buildings);
        }
        res.status(403).json("Invalid authentication");
    } catch(err) {
        res.status(500).json(err);
    }
}

module.exports = {
    updateUser,
    deleteUser,
    getAll,
    getUserById,
    getInvites,
    deleteInvite,
    handleInvite,
    joinByCode,
    leaveBuilding,
    leaveTenant,
    getUsersTenants,
    getUsersBuildings
}

// const = async(req,res) => {
//     try {

//     } catch(err) {
//         res.status(500).json(err);
//     }
// }

// const update = async(req,res) => {
//     try {

//     } catch(err) {
//         res.status(500).json(err);
//     }
// }

// const createUser = async(req,res) => {
//     try {
//         const user = await new User({...req.body}).save();
        
//         res.status(200).json(user);
//     } catch(err) {
//         res.status(500).json(err);
//     }
// }


// module.exports = {
//     createUser
// }
