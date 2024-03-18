const LOGGER = require('../logger/logger')
const environmentalLogger = require('../models/EnvironmentalLoggerModel')
const eventLogger = require('../models/EventLoggerModel');
const HVACLogger = require('../models/HVACLoggerModel')
const consumptionLogger = require('../models/EnergyLoggerModel')
const utilityLogger = require('../models/UtilityMeterModel')
const mongoose = require('mongoose')

/*
Data goes to
1) HVACLogger
2) consumptionLogger
3) utilityMeter
4) eventLogger
*/

/**
 * Gets latest N entries from PR. Please note that in each log type, you will get count number of
 * logType/eventType entries instead of simply count number of data points.
 * @param {string} projectID (query)
 * @param {number} count (body) - (optional) Number of data points to receive. Defaults to 1
 */
const getAllLatestByBUID = async(req, res) => {
    if (!req.query.buildingId) { res.status(400).json("Building ID Required"); return;}
    let count = req.body.count ? req.body.count : 1;

    try {
        /*
        TODO HERE: Need to add a call to read the number of utilityMeter, HVACLogs, consumptionLogs to add by reading
        the Building's Device list and counting the number of each
        */
        const hvacCount = 6;
        const utilCount = 1;
        const consCount = 3;

        const HVACLog = await HVACLogger.find({ BUID: req.query.buildingId }).limit(hvacCount*count).sort({$natural:-1}); 
        //let eventLog = await eventLogger.find({ BUID: req.query.buildingID }).limit(3*count).sort({$natural:-1});
        const utilLog = await utilityLogger.find({ BUID: req.query.buildingId }).limit(consCount*count).sort({$natural:-1});
        const consumptionLog= await consumptionLogger.find({ BUID: req.query.buildingId }).limit(utilCount*count).sort({$natural:-1});

        const output = {
            HVACLogger: HVACLog,
            consumptionLogger: consumptionLog,
            utilityMeter: utilLog,
            //eventLogger: eventLog,             
        };
        res.status(200).json(output);
    } catch(err) {
        res.status(500).json(err);
    }
}


const getAll = async(req, res) => {
    if (!req.query.projectID) { res.status(400).json("Project ID Required")}

    try {
        let envLog = await environmentalLogger.find({ projectID: req.query.projectID });
        let eventLog = await eventLogger.find({ projectID: req.query.projectID });
        let gateLog = await gateway.find({ projectID: req.query.projectID });
        let consumptionLog= await consumptionLogger.find({ projectID: req.query.projectID });
        
        let output = {
            environmentalLogger: envLog,
            eventLogger: eventLog,
            gateway: gateLog,
            consumptionLogger: consumptionLog
        };
        
        console.log(output);
        //const latestEnvLog = await environmentalLogger.find({ projectID: req.body.projectID }).limit(1).sort({$natural:-1});
        res.status(200).json(output);
    } catch (err) {
        console.log(err)
        res.status(500).json(err);
    }
}


module.exports = {
    getAllLatestByBUID,
    getAll
}