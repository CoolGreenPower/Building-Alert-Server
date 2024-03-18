const User = require('../models/UserModel')
const LOGGER = require('../logger/logger')
const Building = require('../models/BuildingModel')
const ParentBuilding = require('../models/ParentBuildingModel')
const bcrypt = require("bcryptjs")
const Invite = require('../models/InviteModel')
const Tenant = require('../models/TenantModel')
const Suite = require('../models/SuiteModel')

const FILE_NAME = 'buildingsDao.js'

const getBuildingsByUserId = async(req, res) => {
    if (!req.params.userId) { res.status(400).json("userId required")}

    try {
        if (req.user.permissions === "admin") {
            const buildings = await User.findById(req.params.userId)
            .populate('buildings');
            //console.log(buildings);
            LOGGER.debug(`Successfully got building by userId in :: ${FILE_NAME}`)
            res.status(200).json(buildings);
        } else {
            if (req.params.userId === req.user.id) {
                const buildings = await User.findById(req.user.id).select("buildings").populate("buildings");
                LOGGER.debug("Retrieved by buildings by user id");
                return res.status(200).json(buildings);
            }
            res.status(403).json("Invalid authentication");
        }
        
    } catch(err) {
        res.status(500).json(err);
    }
}

/**
 *  NOTE BEFORE MODIFYING
 *  This functions is used by all Azure functions to retrieve key information for third-party
 *  APIs to work. Please look at the Azure functions loggers to see what kind of info they require
 *  before modifying this function. 
 *
 */
const getBuildingWithoutCookie = async(req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (!user) { return res.status(404).json("User not found") }

        const isCorrect = await bcrypt.compare(req.body.password, user.password);
        if (!isCorrect) { return res.status(400).json("Wrong credentials"); }

        const building = await Building.findById(req.params.buildingId)
            .populate("gateways")
            // .populate("tenants", ["_id", "username"])
            //.populate("serviceCheckAlerts")
            .exec();

        if (building.buildingOwner.indexOf(user._id) > -1 || user.permissions === "admin") {
            //LOGGER.debug("Retrieved building by id");
            res.status(200).json(building);
        } else {
            res.status(401).json("Invalid authentication to get building")
        }
    } catch(err) {
        res.status(500).json(err)
    }
}

// const getUsersByBuildingId = (buildingId) => {
//     LOGGER.debug(`Entering getUsersByBuildingId in :: ${FILE_NAME}`)

//     return new Promise(async (resolve, reject) => {

//         const attribute = {
//             _id: 0,
//             authorizedusers: 1
//         }
        
//         await Building.findById(buildingId, attribute)
//             .populate('authorizedUsers')
//             .exec()
//             .then(res => resolve(res))
//             .catch(err => reject(err))
//     })
// }

/**
 * Create a building
 * Requires a userId in the body
 * userId used assumes that the user creating is the building owner
 */
const createBuilding = async(req, res) => {
    // implement user auth here to get user id from JWT instead of request
    // here, we would change the second value to be the decrypted userId
    //if (req.body.userId === store.userId) {}
    LOGGER.debug(`Creating building in :: ${FILE_NAME}`);
    if (!req.user) { return res.status(400).json("No user stored in cookie")}
    

    try {
        const doesBuildingExist = await Building.exists({ BUID: req.body.BUID });
        //const doesNameExist = await Building.exists({ name: req.body.name })

        // first check if building exists by BUID or name, if not, then create a new document
        if (!doesBuildingExist) {
            const userList = [req.user.id];
            const response = await new Building({...req.body, buildingOwner: userList}).save();
            const user = await User.findByIdAndUpdate(req.user.id,
                { $addToSet: { buildings : response._id}},
                { new: true });

            // const parent = await ParentBuilding.findOneAndUpdate(req.body.parentBuildingId,
            //     { $addToSet: { buildings : response._id}},
            //     { new: true });
            const output = {
                "building": response,
                "modifiedUser": user,
                //"modifiedParentBuilding": parent
            }

            LOGGER.debug(`>>>Successfully created building :: ${response._id}`)
            res.status(200).json(output);
        } else {
            res.status(400).json("Building BUID or Name Already Exists")
        }
        
    } catch(err) {
        res.status(501).json(err);
    }
    
}

const getAllBuildings = async(req,res) => {
    LOGGER.debug(`Getting all buildings in :: ${FILE_NAME}`)
    try {
        // get all the buildings but with limited information
        const buildings = await Building.find()
            .select("name _id address")
            .exec();
        
        res.status(200).json(buildings);
    } catch(err) {
        res.status(500).json(err);
    }
}

// gets buildings by _id (objectId)
const getBuildingById = async(req,res) => {
    //LOGGER.debug(`Getting building by ID :: ${FILE_NAME}`)
    if (!req.params.buildingId) { res.status(400).json("MongoDB ObjectId (buildingId) required")}
    //console.log(req.params.buildingId);

    try {
        const response = await Building.findById(req.params.buildingId)
            //.populate("assets")
            .populate("gateways")
            //.populate("tenants", ["_id", "username"])
            //.populate("serviceCheckAlerts")
            .exec();

        // only a requirement to be the building owner if u want the keys
        if (response.buildingOwner.includes(req.user.id)) {
            LOGGER.debug(`Successfully retrieved building by id with keys`)
            res.status(200).json(response);
        } else {
            const {keys, ...others} = response._doc;
        
            LOGGER.debug(`Successfully retrieved building by id`)
            res.status(200).json(others);
        }
    } catch(err) {
        res.status(500).json(err);
    }
}

// get buildings by BUID
const getBuildingByBUID = async(req,res) => {
    LOGGER.debug(`Getting building by BUID :: ${FILE_NAME}`)

    if (!req.params.buildingId) { res.status(400).json("buildingId required")}
    //console.log(req.params.buildingId);
    try {
        const response = await Building.findOne({ "BUID": req.params.buildingId })
            .populate("buildingOwner")
            //.populate("tenants", ["_id", "username"])
            .exec();

        if (req.user.id === String(response.buildingOwner)) {
            LOGGER.debug(`Successfully retrieved building by id with keys`)
            res.status(200).json(response);
        } else {
            const {keys, ...others} = response._doc;
        
            LOGGER.debug(`Successfully retrieved building by id`)
            res.status(200).json(others);
        }

        
        LOGGER.debug(`Successfully retrieved building`)
        res.status(200).json(response);
    } catch(err) {
        res.status(500).json(err);
    }
}

// update building
const updateBuilding = async(req, res) => {
    try {
        if (req.body.devices || req.body.gateways || req.body.alerts || req.body.serviceCheckAlerts || req.body.assetData) {
            return res.status(400).json({
                "message": "A given field is not mutable through this endpoint",
                "immutableFields": [
                    "devices","gateways","alerts", "serviceCheckAlerts", "assetData"
                ]
            })
        }
        const building = await Building.findById(req.params.buildingId);
        // auth
        if (building.buildingOwner.indexOf(req.user.id) === -1) {
            return res.status(401).json("User does not own building");
        }

        // if we are changing keys, extra steps to mutate the sub-object,
        // kind of the same deal as before but done differently
        if (req.body.keys) {
            
            let newKeys = {}    
            //get an array of the keys of the 'keys' object
            const returnedKeys = Object.keys(building.keys);
            returnedKeys.forEach(element => {
                newKeys[element] = req.body.keys[element] ? req.body.keys[element] : building.keys[element];
            })

            console.log(newKeys);

            const {keys, ...rest} = req.body;
            const updatedBuilding = await Building.findOneAndUpdate(
                { _id: req.params.buildingId },
                { $set: { keys: newKeys, ...rest, assetData: assetData } },
                { new: true }
            );
            res.status(200).json(updatedBuilding);

        } else {
            // if not changing keys, pretty easy update
            const updatedBuilding = await Building.findOneAndUpdate(
                { _id: req.params.buildingId },
                { $set: { ...req.body, assetData: assetData } },
                { new: true }
            );
    
            res.status(200).json(updatedBuilding);
        }
    } catch(err) {
        res.status(500).json(err);
    }
}

const inviteUserToBuilding = async(req, res) => {
    try {
        // auth
        const building = await Building.findById(req.body.buildingId);
        if (!building.buildingOwner.includes(req.user.id)) {
            return res.status(401).json({ message:"User does not own building" });
        }

        const invitedUser = await User.findOne({ 
            $or: [
                { username: req.body.username },
                { email: req.body.email }
            ]
        });
        if (!invitedUser) {
            return res.status(404).json({ message: "Invited User not found" });
        }

        if (req.body.inviteType !== "propertyManager" && 
            req.body.inviteType !== "serviceContractor") {
                return res.status(400).json({ 
                    message: "Invalid invite type" ,
                    validTypes: ["propertyManager", "serviceContractor"]
                });
            }
        const invite = new Invite({
            from: req.user.id,
            to: invitedUser._id,
            inviteType: req.body.inviteType,
            data: {
                role: req.body.inviteType,
                buildingId: req.body.buildingId
            }
        });

        const exists = await Invite.findOne({
            from: req.user.id,
            to: invitedUser._id,
            inviteType: req.body.inviteType,
            data: {
                role: req.body.inviteType,
                buildingId: req.body.buildingId
            }
        });

        if (exists) {
            return res.status(400).json({ message: "Invite already exists" });
        }

        await invite.save();
        res.status(200).json({
            message: "Invite sent",
            invite: invite
        });

    } catch(err) {
        res.status(500).json(err);
    }
}

const removeUserFromBuilding = async(req, res) => {
    try {
        const user = await User.findById(req.body.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const building = await Building.findById(req.params.buildingId);
        if (!building) {
            return res.status(404).json({ message: "Building not found" });
        }

        if (!building.buildingOwner.includes(req.user.id)) {
            return res.status(400).json({ message: "User is not the owner" });
        }
        if (building.buildingOwner.includes(user._id)) {
            return res.status(400).json({ message: "Cannot remove building owner from building" });
        }

        const updatedBuilding = await Building.findByIdAndUpdate(req.params.buildingId,
            { $pull:
                { propertyManager: user._id, serviceContractor: user._id } 
            },
            { new: true }
        );
        res.status(200).json({
            message: "User removed"
        });
    } catch(err) {
        res.status(500).json(err);
    }
}

const getBuildingUsers = async(req, res) => {
    try {
        const building = await Building.findById(req.params.buildingId);
        if (!building) {
            return res.status(404).json({ message: "Building not found" });
        }

        if (!building.buildingOwner.includes(req.user.id) &&
            !building.propertyManager.includes(req.user.id)) {
                return res.status(401).json({ message: "Invalid permissions" });
            }

        const topLevelUsers = await Building.findById(req.params.buildingId)
            .select("buildingOwner propertyManager serviceContractor -_id")
            .populate("buildingOwner", ["_id", "name", "username", "permissions"])
            .populate("propertyManager", ["_id", "name","username", "permissions"])
            .populate("serviceContractor", ["_id", "name","username", "permissions"])
            .exec();

        let tenantUsers = {};
        for (const suite of building.suites) {
            let foundSuite = await Suite.findById(suite).select("tenant").exec();
            //console.log(foundSuite);
            let tenant = await Tenant.findById(foundSuite?.tenant)
                .select("users")
                .select("name")
                .populate("users", ["_id", "name", "username", "permissions"])
                .exec();
            tenantUsers[tenant?.name] = tenant?.users;
        }
        
        res.status(200).json({
            ...topLevelUsers._doc,
            tenantUsers: tenantUsers
        });
    } catch(err) {
        res.status(500).json(err);
    }
}


const deleteInvite = async(req, res) => {
    try {
        const invite = await Invite.findById(req.params.inviteId);
        if (!invite) {
            return res.status(404).json({ message: "Invite not found" });
        }

        if (invite.to !== req.user.id) {
            return res.status(401).json({ message: "User does not own invite" });
        }

        await Invite.findByIdAndDelete(req.params.inviteId);
        res.status(200).json({ message: "Invite deleted" });
    } catch(err) {
        res.status(500).json(err);
    }
}

const getInvites = async(req, res) => {
    try {
        const building = await Building.findById(req.params.buildingId);
        if (!building.buildingOwner.includes(req.user.id)) {
            return res.status(401).json({ message: "User does not own building" });
        }

        const invites = await Invite.find({ "data.buildingId": req.params.buildingId });
        res.status(200).json(invites);
    } catch(err) {
        res.status(500).json(err);
    }
}




/*
Implement deletion later. This function should not only delete the building object, but every
document within its arrays (keys, gateways, suites, assets, etc.)
*/
// const deleteBuilding = async(req, res) => {
//     try {
//         const building = await Building.findById(req.body.buildingId);
//         if (req.body.confirm === building.name) {
//             const res = await Building.findOneAndDelete(req.body.buildingId);

//         }
//     }
// }




module.exports = {
    getBuildingsByUserId,
    getBuildingById,
    getBuildingByBUID,
    createBuilding,
    getAllBuildings,
    updateBuilding,
    getBuildingWithoutCookie,
    inviteUserToBuilding,
    deleteInvite,
    getInvites,
    getBuildingUsers,
    removeUserFromBuilding
}