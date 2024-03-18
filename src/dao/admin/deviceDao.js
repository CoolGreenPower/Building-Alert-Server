const Device = require("../../models/DeviceModel");
const Gateway = require("../../models/GatewayModel");
const LOGGER = require("../../logger/logger")
const Building = require("../../models/BuildingModel")
/**
 * DEVICE and GATEWAY CONTROL
 */
const getAllDevices = async (req, res) => {
    try {
      //console.log(req.query.select);
      // this is an attempt at making a dynamic query to return dynamic content
      // u can choose to use this or not use this and simply send what you deem necessary
      const devices = Device.find().limit(req.query.count);

      if (req.query.select) {
        let selection = req.query.select.split(",");

        devices.select(selection);
      }

      if (req.query.populate) {
        const population = req.query.populate;
        let populates = population?.replaceAll(",", ' ');
        if (populates.trim().length > 0) {
          devices.populate(populates);
        }

      }
      
      res.status(200).json(await devices.exec());
    } catch (err) {
      res.status(500).json(err);
    }
}
  
const getDeviceById = async (req, res) => {
    try {
      const device = await Device.findById(req.params.id);
      res.status(200).json(device);
    } catch (err) {
      res.status(500).json(err);
    }
}

const updateDevice = async(req, res) => {
  try {
    const updatedSensor = await Device.findOneAndUpdate({ _id: req.params.sensorId },
      { $set: { ...req.body  } },
      { new: true }
    );
    res.status(200).json(updatedSensor);
  } catch(err) {
      res.status(500).json(err);
  }
}

const deleteDevice = async(req, res) => {
    try {
      const deletedSensor = await Device.findByIdAndDelete(req.params.sensorId);
      res.status(200).json(deletedSensor);
    } catch(err) {
        res.status(500).json(err);
    }
}
  
const getAllGateways = async (req, res) => {
    try {
      const response = await Gateway.find().populate("buildingId", "name _id").exec();
      res.status(200).json(response);
    } catch (err) {
      res.status(500).json(err);
    }
}
  
const getGatewayById = async (req, res) => {
    try {
      const response = await Gateway.findById(req.params.id).populate("devices").exec();
      res.status(200).json(response);
    } catch (err) {
      res.status(500).json(err);
    }
}

const deleteGateway = async(req, res) => {
    try {
      const deletedGateway = await Gateway.findByIdAndDelete(req.params.gatewayId);
      res.status(200).json(deletedGateway);
    } catch(err) {
        res.status(500).json(err);
    }
}

const createGateway = async(req,res) => {
   
  try {
      // first find the building to add the gateway to
      let buildId = await Building.findById(req.body.buildingId);
      if (!buildId) { res.status(400).json("Building not found"); return; }
      
      //console.log(buildId.buildingOwner.indexOf(req.user.id))
      // save the gateway in gateways collection
      const response = await new Gateway(req.body).save();

      // add the gateway to its respective building
      buildId.gateways.push(response._id);
      await buildId.save();

      res.status(201).json(response);
  } catch(err) {
      res.status(500).json(err);
  }
}

// createSensor
const createDevice = async(req,res) => {
  try {
      // check if gateway exists and if a buildingId is found
      let gateway = await Gateway.findById(req.body.gatewayId);
      if (!gateway) { res.status(400).json("Gateway could not be found") }
      if (!gateway.buildingId) { return res.status(400).json({
              errrorMessage: "Gateway found but no buildingId found in object",
              gatewayObject: gateway
          })
          return;
      };

      // separate location from req.body
      const {location, ...requestBody} = req.body;

      // put together DT targetName if there is one;
      let targetName;
      if (req.body.projectId && req.body.sensorId) {
          targetName = `projects/${req.body.projectId}/devices/${req.body.sensorId}`;
      }

      // create the new device
      // add buildingId to location and add the rest of the location object
      const response = await new Device({
          location: {buildingId: gateway.buildingId, ...location},
          targetName: targetName,
          ...requestBody
      }).save();

      //console.log(response);

      // add to the gateway's device list
      gateway.devices.push(response._id);
      await gateway.save();

      LOGGER.debug(`Sensor ${response._id} created`)
      res.status(201).json(response);

      
  } catch(err) {
      LOGGER.error("Error creating sensor");
      res.status(500).json(err);
  }
}

const getGatewaysByBuildingId = async(req, res) => {
  if (!req.params.buildingId) { res.status(400).json("buildingId parameter required"); return;}
  try {
      let response;
      console.log(req.query.populateSensors === true)
      if (req.query.populateSensors) {
          response = await Gateway.find({buildingId: req.params.buildingId})
            .populate("devices").exec();
      } else {
          response = await Gateway.find({buildingId: req.params.buildingId})
              .populate("buildingId", "name").populate("devices", "device _id loggerType").exec();
      }

      res.status(200).json(response);
  } catch(err) {
      res.status(500).json(err);
  }
}

const getDevicesByBuildingId = async(req, res) => {
  if (!req.params.buildingId) { res.status(400).json("buildingId required"); return; }
  try {
    if (req.query.grouped == "true") {
      const building = await Building.findById(req.params.buildingId)
          .select("gateways -_id name").populate({
              path: 'gateways',			
              populate: { path: 'devices', model: 'Device'}
          }).exec();
      //const devices = await building.gateways.populate("devices").exec();
      res.status(200).json(building);
    } else {
      const devices = await Device.find({ "location.buildingId": req.params.buildingId });
      res.status(200).json(devices);
    }
      
  } catch(err) {
      res.status(500).json(err);
  }
}


module.exports = {
    getAllDevices,
    getDeviceById,
    getAllGateways,
    getGatewayById,
    updateDevice,
    deleteDevice,
    deleteGateway,
    createGateway,
    createDevice,
    getGatewaysByBuildingId,
    getDevicesByBuildingId
}