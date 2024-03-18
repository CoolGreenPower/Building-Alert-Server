const User = require('../models/UserModel')
const LOGGER = require('../logger/logger')
const Building = require('../models/BuildingModel')
const ConsumptionLogger = require('../models/EnergyLoggerModel')
const EnvironmentalLogger = require('../models/EnvironmentalLoggerModel')
const EventLogger = require('../models/EventLoggerModel')
const Gateway = require('../models/GatewayModel')
const UtilityMeter = require('../models/UtilityMeterModel')
const HVACLogger = require('../models/HVACLoggerModel')
const OutdoorWeather = require('../models/OutdoorWeatherModel')

const FILE_NAME = 'dataDao.js'

// Note: ConsumptionLoggerModel was renamed to EnergyLoggerModel, but names may not reflect that in code

// requires building id
// optional count
const getConsumptionData = async(req, res) => {
    if (!req.query.buildingId) { res.status(400).json("buildingId Required"); return;}
    const count = req.body.count ? req.body.count : 1;
    try {
        const data = await ConsumptionLogger.find({buildingId: req.query.buildingId})
            .sort({_id:-1}).limit(count).exec();

        res.status(200).json(data);
    } catch(err) {
        res.status(500).json(err);
    }
} 


const getEnvironmentalData = async(req, res) => {
    if (!req.query.buildingId) { res.status(400).json("buildingId Required");return; }
    const count = req.body.count ? req.body.count : 1;
    try {
        // must sort by _id or timestamp
        const data = await EnvironmentalLogger.find({buildingId: req.query.buildingId})
            .sort({_id:-1}).limit(count).exec();

        res.status(200).json(data);
    } catch(err) {
        res.status(500).json(err);
    }
} 

const getEventData = async(req, res) => {
    if (!req.query.buildingId) { res.status(400).json("buildingId Required"); return;}
    const count = req.body.count ? req.body.count : 1;
    try {
        const data = await EventLogger.find({buildingId: req.query.buildingId})
            .sort({_id:-1}).limit(count).exec();

        res.status(200).json(data);
    } catch(err) {
        res.status(500).json(err);
    }
} 

const getGatewayData = async(req, res) => {
    if (!req.query.buildingId) { res.status(400).json("buildingId Required"); return;}
    const count = req.body.count ? req.body.count : 1;
    try {
        const data = await Gateway.find({buildingId: req.query.buildingId})
            .sort({_id:-1}).limit(count).exec();

        res.status(200).json(data);
    } catch(err) {
        res.status(500).json(err);
    }
} 

const getUtilityData = async(req, res) => {
    if (!req.query.buildingId) { res.status(400).json("buildingId Required"); return;}
    const count = req.body.count ? req.body.count : 1;
    try {
        const data = await UtilityMeter.find({buildingId: req.query.buildingId})
            .sort({_id:-1}).limit(count).exec();

        res.status(200).json(data);
    } catch(err) {
        res.status(500).json(err);
    }
} 

const getUtilityById = async(req, res) => {
    if (!req.params.id) { return res.status(400).json("id Required"); }
    try {
        const data = await UtilityMeter.findById(req.params.id);
        res.status(200).json(data);
    } catch(err) {
        res.status(500).json(err);
    }
}

const getHVACData = async(req, res) => {
    if (!req.query.buildingId) { res.status(400).json("buildingId Required"); return;}
    const count = req.body.count ? req.body.count : 1;
    try {
        const data = await HVACLogger.find({buildingId: req.query.buildingId})
            .sort({_id:-1}).limit(count).exec();

        res.status(200).json(data);
    } catch(err) {
        res.status(500).json(err);
    }
} 

const getOutdoorData = async(req, res) => {
    if (!req.query.buildingId) { res.status(400).json("buildingId Required"); return;}
    const count = req.body.count ? req.body.count : 1;
    try {
        const data = await OutdoorWeather.find({buildingId: req.query.buildingId})
            .sort({_id:-1}).limit(count).exec();

        res.status(200).json(data);
    } catch(err) {
        res.status(500).json(err);
    }
}

const receiveVataverksData = async(req, res) => {
    try {
        const queries = req.query; // object of queries
        if (queries.Token === process.env.VATAVERKS_TOKEN) {
            // still need to implement getting the device id via the token and mac address
            const data = {
                timestamp: new Date(),
                //macAddress: queries.MacAddress,
                volume: queries.Volume
            }

            const meter =  new UtilityMeter(data);
            await meter.save();

            res.status(200).json(meter);
        } else {
            res.status(401).json("Invalid token");
        }
    } catch(err) {
        res.status(500).json(err);
    }


}


module.exports = {
    getConsumptionData,
    getEnvironmentalData,
    getEventData,
    getGatewayData,
    getUtilityData,
    getHVACData,
    getOutdoorData,
    receiveVataverksData,
    getUtilityById
}