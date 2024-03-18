const User = require("../../models/UserModel");
const LOGGER = require("../../logger/logger");
const Building = require("../../models/BuildingModel");
const Device = require("../../models/DeviceModel");
/**
 * BUILDING CONTROL
 */
const getAllBuildings = async (req, res) => {
    try {
      if (req.query.select) {
        let selection = req.query.select.split(",");

        const buildings = await Building.find().select(selection);
        return res.status(200).json(buildings);
      }
      const buildings = await Building.find().limit(req.query.count);
      res.status(200).json(buildings);
    } catch (err) {
      res.status(500).json(err);
    }
}
  
const getBuildingById = async (req, res) => {
    try {
      const building = await Building.findById(req.params.id);
      res.status(200).json(building);
    } catch (err) {
      res.status(500).json(err);
    }
}

const getBuildingByBUID = async(req, res) => {
    try {
      const building = await Building.findOne({ BUID: req.params.BUID });
      res.status(200).json(building);
    } catch(err) {
        res.status(500).json(err);
    }
}

const updateBuilding = async(req, res) => {
    try {
      const newBuilding = await Building.findByIdAndUpdate(req.params.id, {
          $set: req.body
      }, { new: true });
      res.status(200).json(newBuilding);
    } catch(err) {
        res.status(500).json(err);
    }
}

const createBuilding = async(req, res) => {
  try {
      const doesBuildingExist = await Building.exists({ BUID: req.body.BUID });

      if (req.body.buildingOwner) {
        for (const userId of req.body.buildingOwner) {
            const user = await User.findById(userId);
            if (!user) {
                return res.status(400).json({ message: "One or more users do not exist" });
            }
        }
      }


      // first check if building exists by BUID or name, if not, then create a new document
      if (!doesBuildingExist) {
          const response = await new Building(req.body).save();

          if (req.body.buildingOwner) {
            for (const userId of req.body.buildingOwner) {
                const user = await User.findByIdAndUpdate(userId,
                  { $addToSet: { buildings : response._id}},
                  { new: true }
                );
              }
          }

          // const parent = await ParentBuilding.findOneAndUpdate(req.body.parentBuildingId,
          //     { $addToSet: { buildings : response._id}},
          //     { new: true });
          const output = {
              "building": response,
              "modifiedUsers": req.body.buildingOwner || [],
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

module.exports = {
    getAllBuildings,
    getBuildingById,
    getBuildingByBUID,
    updateBuilding,
    createBuilding
}