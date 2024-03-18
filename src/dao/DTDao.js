const LOGGER = require('../logger/logger')
const environmentalLogger = require('../models/EnvironmentalLoggerModel')
const eventLogger = require('../models/EventLoggerModel');
const gateway = require('../models/GatewayModel');
const consumptionLogger = require('../models/EnergyLoggerModel')
const mongoose = require('mongoose')
/*
Data goes to
1) environmentalLogger
2) eventLogger
3) gateway
4) consumptionLogger
*/

/**
 * Gets latest N entries from DT 
 * @param {string} projectID (query)
 * @param {number} count (body) - (optional) Number of data points to receive. Defaults to 1
 */
const getAllLatest = async(req,res) => {
    // require a project id
    // todo: implement auth here
    if (!req.query.projectID) { res.status(400).json("Project ID Required"); return;}
    
    let count = req.body.count ? req.body.count : 1;
    // let latestEnvironment = [];
    // let latestEvent = [];
    // let latestGateway = [];
    // let latestConsumption = [];
    try {
        // note: might want to change the sort according to time stamp instead of $natural
        let envLog = await environmentalLogger.find({ projectID: req.query.projectID }).limit(count).sort({$natural:-1}); 
        let eventLog = await eventLogger.find({ projectID: req.query.projectID }).limit(count).sort({$natural:-1});
        let gateLog = await gateway.find({ projectID: req.query.projectID }).limit(count).sort({$natural:-1});
        let consumptionLog= await consumptionLogger.find({ projectID: req.query.projectID }).limit(count).sort({$natural:-1});
        
        //console.log(eventLog);
        // for (let i = 0; i < count; i++) {
        //     if (envLog[i] != null) { latestEnvironment.push(envLog[i]); }
        //     if (eventLog[i] != null) {latestEvent.push(eventLog[i]);}
        //     if (gateLog[i] != null) {latestGateway.push(gateLog[i]);}
        //     if (consumptionLog[i] != null) {latestConsumption.push(consumptionLog[i]);}
        // }
        let output = {
            environmentalLogger: envLog,
            eventLogger: eventLog,
            gateway: gateLog,
            consumptionLogger: consumptionLog
        };
        
        //console.log(test);

        //console.log(output);
        //const latestEnvLog = await environmentalLogger.find({ projectID: req.body.projectID }).limit(1).sort({$natural:-1});
        res.status(200).json(output);
    } catch (err) {
        console.log(err)
        res.status(500).json(err);
    }
}

/**
 * Returns all logs of a project. WARNING: As projects escalate in data points, this method will become expensive and become deprecated. 
 * Recommend using @see {getAllInRange} method instead.
 * @param {*} req 
 * @param {*} res 
 */
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

/**
 * Returns data points for given project within two dates
 * @param {string} projectID (query) - Parameter for project id
 * @param {string} pastTime (body) - Past time in ISO string format
 * @param {*} futureTime (body) - Future time in ISO string format
 */
const getAllInRange = async(req, res) => {
    if (!req.query.projectID) { res.status(400).json("Project ID Required")}

    try {
        let envLog = await environmentalLogger.find({ 
                projectID: req.query.projectID,
                timestamp: { $gte:req.body.pastTime, $lte: req.body.futureTime }
            });
        //let envLog = await environmentalLogger.find({ projectID: req.body.projectID });
        let eventLog = await eventLogger.find({ projectID: req.body.projectID });
        let gateLog = await gateway.find({ projectID: req.body.projectID });
        let consumptionLog= await consumptionLogger.find({ projectID: req.body.projectID });
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
    getAllLatest,
    getAll,
    getAllInRange
}