const Building = require("../../models/BuildingModel");
const Utility = require("../../models/UtilityBillModel");

/**
 * UTILITY BILL CONTROL
 */
const getAllUtilities = async (req, res) => {
    try {
      const utilities = await Utility.find().populate("location.buildingId", "name _id");
      res.status(200).json(utilities);
    } catch (err) {
      res.status(500).json(err);
    }
}

const getUtilityById = async(req, res) => {
    try {
      const utility = await Utility.findById(req.params.id);
      res.status(200).json(utility);
    } catch(err) {
        res.status(500).json(err);
    }
}

const getBuildingUtilities = async(req, res) => {
    try {
      const utilities = await Utility.find({ "location.buildingId": req.params.buildingId });
      res.status(200).json(utilities);
    } catch(err) {
        res.status(500).json(err);
    }
}

const createUtilityBill = async(req, res) => {
  try {
      const building = await Building.findById(req.body.buildingId);
      if (!building) { return res.status(400).json("Building not found") }

      const newBill = new Utility({
          createdAt: new Date(),
          data: req.body.data,
          startDate: req.body.startDate,
          endDate: req.body.endDate,
          type: req.body.type || "other",
          location: {
            ...req.body.location,
            buildingId: req.body.buildingId,
          }
      });

      await newBill.save();
      res.status(200).json(newBill);
  } catch(err) {
      res.status(500).json(err);
  }
}


module.exports = {
    createUtilityBill,
    getAllUtilities,
    getUtilityById,
    getBuildingUtilities
}