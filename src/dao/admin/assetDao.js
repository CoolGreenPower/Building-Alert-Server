const { assetTypes } = require("../../constants");
const Building = require("../../models/BuildingModel");
const Asset = require("../../models/AssetModel");
const LOGGER = require('../../logger/logger');

/**
 * ASSET CONTROL
 */
const getAllAssets = async (req, res) => {
    try {
        if (req.query.select) {
            let selection = req.query.select.split(",");
    
            const assets = await Asset.find().populate("buildingId", ["name", "_id"]).select(selection).exec();
            return res.status(200).json(assets);
          }
        const assets = await Asset.find().populate("buildingId", ["name", "_id"]).exec();
        res.status(200).json(assets);
    } catch (err) {
      res.status(500).json(err);
    }
}
  
const getAssetById = async (req, res) => {
    try {
      // Your logic for getting an asset by ID
        const asset = await Asset.findById(req.params.id);
        res.status(200).json(asset);
    } catch (err) {
      res.status(500).json(err);
    }
}

const createAsset = async(req, res) => {
    try {
        const building = await Building.findById(req.body.buildingId);
        if (!building) { return res.status(400).json("Building not found"); }

        //const assetTypes = ["water","gas", "electric", "HVAC", "thermostat", "misc"];
        const newAsset = new Asset(req.body);
        
        let foundOne = false;
        assetTypes.forEach(type => {
            if (req.body.assetType === type) {
                building.assetData[`${type}Assets`].push(newAsset._id);
                foundOne = true;
            }
        });
        if (!foundOne) {
            return res.status(401).json("Please specify a correct asset type (water, gas, electric, HVAC, thermostat, misc)");
        }


        await newAsset.save(); // we don't do parallel here in case the asset isn't saved yet
        await building.save();


        LOGGER.debug("Created new asset")
        res.status(200).json(newAsset);

    } catch(err) {
        LOGGER.error("Error creating asset")
        res.status(500).json(err);
    }
}

const getAssetsByBuildingId = async(req, res) => {
    try {
        console.log(req.query);
        if (req.query.grouped === "true") {
            console.log("Group");
            const assets = await Building.findById(req.params.buildingId)
                .select("assetData").populate({
                    path: "assetData",
                    populate: [
                        { path: "electricAssets", model: "Asset"},
                        { path: "gasAssets", model: "Asset"},
                        { path: "waterAssets", model: "Asset"},
                        { path: "HVACAssets", model: "Asset"},
                        { path: "thermostatAssets", model: "Asset"}
                    ]   // add more populates if more asset types are added
                }).exec();     
            res.status(200).json(assets);
        } else {
            const assets = await Asset.find({ buildingId: req.params.buildingId });
            LOGGER.debug("Retrieved assets by building id")
            res.status(200).json(assets);
        }
    } catch(err) {
        LOGGER.error("Error retrieving assets by building id")
        res.status(500).json(err);
    }
}



module.exports = {
    getAllAssets,
    getAssetById,
    createAsset,
    getAssetsByBuildingId
}