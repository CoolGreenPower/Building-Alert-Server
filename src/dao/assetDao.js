
const Building = require("../models/BuildingModel");
const Asset = require("../models/AssetModel")
const { assetTypes } = require("../constants")

const LOGGER = require("../logger/logger")

const createAsset = async(req, res) => {
    if (!req.body.buildingId || !req.user.id) {
        return res.status(404).json("No building id or logged in user");
    }
    try {
        const building = await Building.findById(req.body.buildingId);
        if (!building) { return res.status(400).json("Building not found"); }
        if (building.buildingOwner.indexOf(req.user.id) === -1) {
            return res.status(401).json("Invalid user authentication");
        }
        else {
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

            //console.log(newAsset);
            //console.log(building.assetData.waterAssets)
            await newAsset.save(); // we don't do parallel here in case the asset isn't saved yet
            await building.save();


            LOGGER.debug("Created new asset")
            res.status(200).json(newAsset);
        }
    } catch(err) {
        LOGGER.error("Error creating asset")
        res.status(500).json(err);
    }
}

const getAsset = async(req, res) => {
    try {
        const asset = await Asset.findById(req.params.assetId);
        LOGGER.debug(`Retrieved asset: ${asset._id}`)
        res.status(200).json(asset);
    } catch(err) {
        LOGGER.error("Error retrieving asset")
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

const updateAsset = async(req, res) => {
    try {
        if (!req.user.id) {
            return res.status(404).json("No user logged in")
        }
        if (req.body.buildingId || req.body.images) {
            return res.status(401).json("Unauthorized buildingId change or images change. If you are trying to change images, please use image routes instead.")
        }
        const asset = await Asset.findById(req.params.assetId);
        const building = await Building.findById(asset.buildingId);
        if (building.buildingOwner.indexOf(req.user.id) === -1 
            && req.user.permissions !== "admin") {
            return res.status(401).json("Invalid user authentication");
        }
        else {
            const updatedData = {
                ...req.body,
                HVACSettings: {
                    ...asset.HVACSettings,
                    ...req.body.HVACSettings
                },
                thermostatSettings: {
                    ...asset.thermostatSettings,
                    ...req.body.thermostatSettings
                }
            }


            const updated = await Asset.findByIdAndUpdate(req.params.assetId, updatedData, {new:true});

            LOGGER.debug(`Updated asset: ${updated._id}`)
            res.status(200).json(updated);
        }
    } catch(err) {
        LOGGER.error("Error updating asset")
        res.status(500).json(err);
    }
}


const deleteAsset = async(req, res) => {
    try {
        const asset = await Asset.findById(req.params.assetId);
        const building = await Building.findById(asset.buildingId);

        if (building.buildingOwner.indexOf(req.user.id) === -1 &&
            req.user.permissions !== "admin") {
                return res.status(401).json("Invalid user authentication");
        }

        building.assetData[`${asset.assetType}Assets`].pull(asset._id);
        
        const newBuilding = await building.save();
        const removed = await Asset.findByIdAndDelete(req.params.assetId);

        res.status(200).json({
            "updatedAssetList": newBuilding.assetData,
            "deletedAsset": removed
        });
    } catch(err) {
        res.status(500).json(err);
    }
}

module.exports =  {
    createAsset,
    getAsset,
    getAssetsByBuildingId,
    updateAsset,
    deleteAsset

}