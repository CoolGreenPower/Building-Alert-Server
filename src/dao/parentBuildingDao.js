const User = require('../models/UserModel')
const LOGGER = require('../logger/logger')
const Building = require('../models/BuildingModel')
const ParentBuilding = require('../models/ParentBuildingModel')
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;


const createGroup = async(req, res) => {
    if (!req.user) { return res.status(403).json("No stored user")}
    try {
        const group = new ParentBuilding({ ...req.body, owner: req.user.id });

        const updatedUser = await User.findByIdAndUpdate(req.user.id, 
            { $addToSet: { parentBuildings: group._id }},
            { new: true});

        await group.save();

        LOGGER.debug("Created a group")
        res.status(200).json(group);
    } catch(err) {
        res.status(500).json(err);
    }
}

const addBuildingToGroup = async(req, res) => {
    if (!req.body.buildingId || !req.body.parentBuildingId) {
        return res.status(400).json("buildingId and parentBuildingId (group id) required")
    }
    try {
        const group = await ParentBuilding.findById(req.body.parentBuildingId);
        if (!group) { return res.status(400).json("Could not find given target parent building") }

        const building = await Building.findById(req.body.buildingId);
        if (!building) { return res.status(400).json("Could not find building") }

        // user auth
        if (building.buildingOwner.indexOf(req.user.id) > -1 && 
            String(group.owner) === req.user.id) {

            const updatedGroup = await ParentBuilding.findByIdAndUpdate(req.body.parentBuildingId,
                { $addToSet: { buildings: req.body.buildingId } },
                { new: true });
            
            LOGGER.debug("Added building to new group")
            res.status(200).json(updatedGroup)
        } else {
            res.status(403).json("Invalid authentication")
        }
    } catch(err) {
        res.status(500).json(err);
    }
}

const getGroup = async(req, res) => {
    // we can add populations by query later. For now its ignored
    let populations;
    if (req.query.populate) { populations = req.query.populate.split(","); }
    try {
        if (populations) {
            console.log("THING")
        } else {
            const parents = await ParentBuilding.findById(req.params.parentBuildingId)
                .populate("buildings");
            res.status(200).json(parents);
        }
        LOGGER.debug("Retrieved group")
    } catch(err) {
        res.status(500).json(err);
    }

}




module.exports = {
    createGroup,
    getGroup,
    addBuildingToGroup
}
