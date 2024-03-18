
const Gateway = require("../models/GatewayModel")
const Device = require("../models/DeviceModel");
const Building = require("../models/BuildingModel");
const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const LOGGER = require("../logger/logger")
/*
DT
Gateway -> Sensors

PR
Gateway -> Controller -> Sensors (here controller logs are mixed with envLogger and eventLogger)

Ambient
Gateway -> Sensors 
*/


const createGateway = async(req,res) => {
   
    try {
        // first find the building to add the gateway to
        let buildId = await Building.findById(req.body.buildingId);
        if (!buildId) { res.status(400).json("Building not found"); return; }
        
        //console.log(buildId.buildingOwner.indexOf(req.user.id))
        if (buildId.buildingOwner.indexOf(req.user.id) === -1) {
            return res.status(404).json("User is not the building owner of the buildingId");
        } else {
            // save the gateway in gateways collection
            const response = await new Gateway(req.body).save();

            // add the gateway to its respective building
            buildId.gateways.push(response._id);
            await buildId.save();

            res.status(201).json(response);
        }
    } catch(err) {
        res.status(500).json(err);
    }
}

const getGatewaysByBuildingId = async(req, res) => {
    if (!req.params.buildingId) { res.status(400).json("buildingId parameter required"); return;}
    try {
        let response;
        console.log(req.query.populateSensors === true)
        if (req.query.populateSensors) {
            response = await Building.findById(req.params.buildingId)
            .select("gateways").populate({
                path: 'gateways',			
                populate: { path: 'devices', model: 'Device'}
            }).exec();
        } else {
            response = await Building.findById(req.params.buildingId)
                .select("gateways").populate("gateways").exec();
        }
        const output = {
            gateways: response.gateways
        }
        res.status(200).json(output);
    } catch(err) {
        res.status(500).json(err);
    }
}

const createSensor = async(req,res) => {
    try {
        // check if gateway exists and if a buildingId is found
        let gateway = await Gateway.findById(req.body.gatewayId);
        if (!gateway) { res.status(400).json("Gateway could not be found") }
        if (!gateway.buildingId) { res.status(400).json({
                errrorMessage: "Gateway found but no buildingId found in object",
                gatewayObject: gateway
            })
            return;
        };

        // authentication
        const building = await Building.findById(gateway.buildingId);
        if (building.buildingOwner.includes(req.user.id)) {
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
        } else {
            res.status(401).json("User is not the owner of the given gateway")
        }

        
    } catch(err) {
        LOGGER.error("Error creating sensor");
        res.status(500).json(err);
    }
}

const deleteSensor = async(req, res) => {
    if (!req.body.sensorId) { res.status(400).json("sensorId required"); return; }
    try {
        // first find the sensor
        const sensor = await Device.findById(req.body.sensorId);
        if (!sensor) { res.status(401).json("No sensor found"); return;}
        //console.log(sensor);

        // then find the building associated with it to check if the user owns it
        const building = await Building.findById(sensor.location?.buildingId);
        if (!building.buildingOwner.includes(req.user.id)) {
            return res.status(401).json("User does not own the sensor");
        }

        //remove sensor from gateway devices array
        const gateway = await Gateway.findById(sensor.gatewayId);
        //console.log(sensor.gatewayId);
        const index = gateway ? gateway.devices.indexOf(sensor._id) : -1;
        let response;
        if (index > -1) { 
            gateway.devices.splice(index, 1);
            await gateway.save(); 

            // then delete the sensor
            response = await Device.deleteOne({ _id: req.body.sensorId });
        } else {
            // if we didn't find a device gateway
            if (req.body.force !== true) { 
                res.status(400).json("Failed to delete since either gatewayId is not present within the sensor, or the gateway associated with this sensor does not contain the sensor to be deleted. Use 'force:true' in the body to bypass this");
                return;
            } else {
                // delete if the request has "force"
                response = await Device.deleteOne({ _id: req.body.sensorId });
            }
        }
       //console.log(gateway.devices);
        res.status(200).json({
            "removedSensor": sensor,
            "modifiedGatewayDevices": gateway.devices
        })
    } catch(err) {  
        res.status(500).json(err);
    }
}

const getGateway = async(req, res) => {
    try {
        const response = await Gateway.findById(req.params.gatewayId).populate("devices").exec();
        res.status(200).json(response);
    } catch(err) {
        res.status(500).json(err);
    }
}

const getSensor = async(req, res) => {
    try {
        const response = await Device.findById(req.params.sensorId);
        res.status(200).json(response);
    } catch(err) {
        res.status(500).json(err);
    }
}

/**
 * WAIT BEFORE MODIFYING. Note that this function is used by all of the Azure functions in order to 
 * A) Get device information for a given PR log
 * 
 */
const getDevicesByBuildingId = async(req, res) => {
    if (!req.params.buildingId) { res.status(400).json("buildingId required"); return; }
    try {
        const building = await Building.findById(req.params.buildingId)
            .select("gateways").populate({
                path: 'gateways',			
                populate: { path: 'devices', model: 'Device'}
            }).exec();
        //const devices = await building.gateways.populate("devices").exec();
        res.status(200).json(building);
    } catch(err) {
        res.status(500).json(err);
    }
}

/**
 * WAIT BEFORE MODIFYING. Note that this function is used by all of the Azure functions in order to 
 * A) Get device information for a given DT log
 * 
 */
const getSensorByTargetName = async(req, res) => {
    try {
        const sensor = await Device.find({ targetName: req.body.targetName });
        res.status(200).json(sensor[0]);
    } catch (err) {
        res.status(500).json(err);
    }
}

// this should delete all associated devices with it as well
const deleteGateway = async(req, res) => {
    try {
        const gateway = await Gateway.findById(req.body.gatewayId);
        const building = await Building.findById(gateway.buildingId);
        if (String(building.buildingOwner) !== req.user.id) {
            return res.status(401).json("User is not the owner of the gateway")
        } else {
            // for each device in the gateway, delete 
            let devices = [];
            const gatewayDeviceArr = gateway.devices;
            gatewayDeviceArr.forEach(async(item) => {
                let deleted = await Device.findByIdAndDelete(item);
                devices.push(deleted);
            })

            const deletedGateway = await Gateway.findByIdAndDelete(gateway._id);
            console.log(deletedGateway);

            LOGGER.debug(`Gateway ${gateway._id} deleted`)
            res.status(200).json({
                deletedGateway: deletedGateway,
                deletedDevices: devices
            })
        }


    } catch(err) {
        LOGGER.error("Error deleting gateway")
        res.status(500).json(err);
    }
}

const updateSensor = async(req,res) => {
    try {
        // this is so that there is no accidental buildingId changing if we change location data
        if (req.body.location) {
            if (req.body.location.buildingId) {
                res.status(400).json({
                    "message": "A given field is not mutable through this endpoint",
                    "immutableFields": [
                        "location.buildingId"
                    ]
                })
                return;
            }
        }

        // first find the sensor and its building location
        const sensor = await Device.findById(req.params.sensorId);
        const building = await Building.findById(sensor.location.buildingId);
        
        // then authenticate the user
        if (building.buildingOwner.includes(req.user.id)) {
            // if there is a location change, extra steps are here to ensure other fields are not overwritten
            if (req.body.location) {
                let newAsset, newLocationData, newLocation = {};
                newAsset = req.body.location.asset ? req.body.location.asset : sensor.location.asset;
                newLocationData =  req.body.location.data ? req.body.location.data : sensor.location.data;
                newOutdoorsData = req.body.location.outdoors ? req.body.location.outdoors : sensor.location.outdoors;
                newSuiteId = req.body.location.suiteId ? req.body.location.suiteId : sensor.location.suiteId;

                newLocation = {
                    buildingId: sensor.location.buildingId,
                    suiteId: newSuiteId,
                    asset: newAsset,
                    data: newLocationData,
                    outdoors: newOutdoorsData
                }

                const { location, ...rest } = req.body;
                const updatedSensor = await Device.findOneAndUpdate({ _id: req.params.sensorId },
                    { $set: { location: newLocation, rest } },
                    { new: true }
                );
                res.status(200).json(updatedSensor);

            } else {
                // if we're not dealing with a location change
                const updatedSensor = await Device.findOneAndUpdate({ _id: req.params.sensorId },
                    { $set: { ...req.body  } },
                    { new: true }
                );
                res.status(200).json(updatedSensor);
            }
        } else {
            res.status(401).json("User is not the owner of the sensor")
        }

        
    } catch(err) {
        res.status(500).json(err);
    }
}

const updateGateway = async(req,res) => {
    if (!req.params.gatewayId) { res.status(400).json("gatewayId required"); return;}
    if (req.body.devices || req.body.buildingId) {
        res.status(400).json({
            "message": "A given field is not mutable through this endpoint",
            "immutableFields": [
                "buildingId", "devices"
            ]
        })
        return;
    }

    try {
        const gateway = await Gateway.findById(req.params.gatewayId);
        const building = await Building.findById(gateway.buildingId);
        if (String(building.buildingOwner) === req.user.id) {
            const updatedGateway = await Gateway.findOneAndUpdate(
                { _id: req.params.gatewayId },
                { $set: { ...req.body } },
                { new: true }
            );
            LOGGER.debug(`Successfully updated gateway: ${updatedGateway._id}`)
            res.status(200).json(updatedGateway);
        } else {
            res.status(404).json("User is not the owner of the gateway")
        }
        
    } catch(err) {
        LOGGER.error("Error updating gateway")
        res.status(500).json(err);
    }
}

/**
 * WAIT BEFORE MODIFYING. Note that this function is used by all of the Azure functions in order to 
 * A) Get device information for a given Vataverks log
 * 
 */
const getVataverksSensorByToken = async(req, res) => {
    try {
        if (!req.query.token || !req.query.macaddress) {
            return res.status(400).json("token and macaddress query required");
        }

        const sensor = await Device.findOne({ 
            macAddress: req.query.macaddress,
            vataverksToken: req.query.token
        });

        if (!sensor) { return res.status(400).json("No sensor found with the given token and macaddress") }

        LOGGER.debug(`Successfully found vataverks sensor: ${sensor._id}`)
        res.status(200).json(sensor);
    } catch(err) {
        LOGGER.error("Error retrieving vataverks sensor")
        res.status(500).json(err);
    }
}

const getEmporiaSensor = async(req, res) => {
    try {   
        const device = await Device.findOne({
            sensorId: req.query.sensorId,
            deviceSource: "EmporiaEnergy"
        });

        if (!device) { return res.status(400).json("No device found with the given sensorId") }
        res.status(200).json(device);
    } catch(err) {
        res.status(500).json(err);
    }
}





module.exports = {
    createGateway,
    getGatewaysByBuildingId,
    createSensor,
    deleteSensor,
    getGateway,
    getSensor,
    getDevicesByBuildingId,
    deleteGateway,
    updateSensor,
    updateGateway,
    getSensorByTargetName,
    getVataverksSensorByToken,
    getEmporiaSensor
}