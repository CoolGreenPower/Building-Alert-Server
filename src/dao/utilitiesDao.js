const UtilityBill = require("../models/UtilityBillModel");
const LOGGER = require("../logger/logger");
const Building = require("../models/BuildingModel");


const getById = async(req, res) => {
    try {
        const bill = await UtilityBill.findById(req.params.id);
        const building = await Building.findById(bill.location.buildingId);

        if (building.buildingOwner.indexOf(req.user.id) > -1 ||
            building.propertyManager.indexOf(req.user.id) > -1 || 
            req.user.permissions === "admin") {

            LOGGER.debug("Retrieved utility bill")
            res.status(200).json(bill);
        } else {
            res.status(403).json("You are not authorized to view this document");
        }
    
    } catch(err) {
        LOGGER.error("Error retrieving utility bill")
        res.status(500).json(err);
    }
}

const getHistorical = async(req, res) => {
    try {
        const building = await Building.findById(req.params.buildingId);
        if (building.buildingOwner.indexOf(req.user.id) === -1 && req.user.permissions !== "admin") {
            return res.status(403).json("You are not authorized");
        }

        let query = { "location.buildingId": req.params.buildingId };
        if (req.query.startDate && req.query.endDate) {
            query.startDate = {
                $gte: req.query.startDate,
                $lte: req.query.endDate
            }
        }
        if (req.query.type) {
            query.type = req.query.type;
        }
        console.log(query);

        // start date and end date handling may not be needed as the frontend
        // can retrieve everything and work with filtering it themselves
        const bills = await UtilityBill.find(query);
        res.status(200).json(bills);
    } catch(err) {
        LOGGER.error("Error getting historical utility bill")
        res.status(500).json(err);
    }
}

const createBill = async(req, res) => {
    try {
        const building = await Building.findById(req.body.buildingId);
        if (!building) { return res.status(400).json("Building not found") }

        // auth
        if (building.buildingOwner.indexOf(req.user.id) === -1 && req.user.permissions !== "admin") {
            return res.status(403).json("User is not authorized for this building");
        }

        const newBill = new UtilityBill({
            createdAt: new Date(),
            data: req.body.data,
            startDate: req.body.startDate ? req.body.startDate : null,
            endDate: req.body.endDate ? req.body.endDate : null,
            type: req.body.type || "other",
            location: {
                buildingId: req.body.buildingId
            }
        });

        await newBill.save();
        LOGGER.debug("Created new utility bill")
        res.status(200).json(newBill);
    } catch(err) {
        LOGGER.error("Error creating utility bill")
        res.status(500).json(err);
    }
}

const updateBill = async(req, res) => {
    try {
        const building = await Building.findById(req.params.buildingId);
        if (building.buildingOwner.indexOf(req.user.id) === -1 && req.user.permissions !== "admin") {
            return res.status(403).json("User is not authorized for this building");
        }

        // separate handling for location data
        if (req.body.location) {
            const currentBill = await UtilityBill.findById(req.params.id);
            const updatedBill = await UtilityBill.findByIdAndUpdate(req.params.id, {
                ...req.body,
                location: {
                    buildingId: currentBill.location.buildingId,
                    suiteId: req.body.location.suiteId ? req.body.location.suiteId : currentBill.location.suiteId
                }
            }, { new: true });

            LOGGER.debug("Updated utility bill")
            res.status(200).json(updatedBill);
        }
        else {
            const updatedBill = await UtilityBill.findByIdAndUpdate(req.params.id, 
                { ...req.body },
                { new: true }
            );
            LOGGER.debug("Updated utility bill")
            res.status(200).json(updatedBill);
        }

    } catch(err) {
        LOGGER.error("Error updating utility bill")
        res.status(500).json(err);
    }
}

const deleteBill = async(req, res) => {
    try {
        const building = await Building.findById(req.params.buildingId);
        if (building.buildingOwner.indexOf(req.user.id) === -1 && req.user.permissions !== "admin") {
            return res.status(403).json("User is not authorized for this building");
        }

        const deletedBill = await UtilityBill.findByIdAndDelete(req.params.id);
        LOGGER.debug("Deleted utility bill");
        res.status(200).json(deletedBill);
    } catch(err) {
        LOGGER.error("Error deleting utility bill")
        res.status(500).json(err);
    }
}


module.exports = {
    getById,
    getHistorical,
    createBill,
    updateBill,
    deleteBill
}