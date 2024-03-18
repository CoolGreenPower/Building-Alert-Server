const LOGGER = require('../logger/logger')
const Alert = require('../models/AlertModel')
const User = require('../models/UserModel')
const Building = require("../models/BuildingModel")
const mongoose = require('mongoose')
const Tenant = require('../models/TenantModel')
const Suite = require('../models/SuiteModel')

const FILE_NAME = 'alertDao.js'


//find alert by alertId
const getAlertById = async(req, res) => {
    try {
        const alert = await Alert.findById(req.params.alertId);
        if (!alert) { return res.status(401).json({message:"Alert does not exist"}); }

        //if its a user generated alert, populate extra
        if (alert.poster != null && alert.alert_id === "REQUEST") {
       
            await alert.populate("poster");
            res.status(200).json(alert);
        } else {
            await alert.populate("deviceId")
            res.status(200).json(alert);
        }
    
    } catch(err) {
        console.log(err);
        res.status(500).json(err);
    }
}

const getBuildingAlerts = async(req, res) => {
    try {
        // first get the alerts
        const building = await Building.findById(req.params.buildingId);
        if (!building) { return res.status(401).json({message:"Building does not exist"}); }

        if (!building.buildingOwner.includes(req.user.id) && 
            !building.propertyManager.includes(req.user.id)) {
            return res.status(401).json({ message:"User does not own or manage the building"});
        }

   
        if (req.query.device === "true") {
            const alerts = await Alert.find({ buildingId: building._id }).populate("deviceId").exec();
            res.status(200).json(alerts);
        } else {
            const alerts = await Alert.find({ buildingId: building._id });
            res.status(200).json(alerts);
        }
       
        // can eventually add filtering based on the query and the alert type
    } catch(err) {
        res.status(500).json(err);
    }
}

const updateAlert = async(req, res) => {
    try {
        // input validation
        if (req.body.buildingId) {
            return res.status(400).json({ message: "Cannot update buildingId" });
        }
        const alertStatuses = ["New", "Assigned", "Investigating", "Service Needed", "Service Scheduled", "Service Started", "Resolved"];
        if (req.body.status && !alertStatuses.includes(req.body.status)) {
            return res.status(400).json({ message: "Invalid status. Please use one of the statuses listed", alertStatuses: alertStatuses });
        }

        const alert = await Alert.findById(req.params.alertId);
        if (!alert) { return res.status(401).json({message:"Alert does not exist"}); }

        const building = await Building.findById(alert.buildingId);

        if (!building.buildingOwner?.includes(req.user.id) &&
            !building.propertyManager?.includes(req.user.id) &&
            !alert.assignedPersonnel?.includes(req.user.id)) {

            return res.status(401).json({ message:"User is not authorized to perform this action" });
        }

        const newAlert = await Alert.findByIdAndUpdate(req.params.alertId, req.body, { new: true });
        res.status(200).json(newAlert);
    } catch(err) {
        res.status(500).json(err);
    }
}



const getTenantAlerts = async(req, res) => {
    try {
        // first get the tenant
        const tenant = await Tenant.findById(req.params.tenantId);
        if (!tenant) { return res.status(401).json({message:"Tenant does not exist"}); }

        // alerts are actually attached to the suite so get the suite
        const suite = await Suite.findById(tenant.suiteId);
        if (!suite) { return res.status(401).json({message:"Suite does not exist"}); }

        // find the building that the tenant is attached to and the alerts with that building
        const building = await Building.findById(suite.buildingId);
        const alerts = await Alert.find({ buildingId: building._id }).populate("deviceId").exec();

        const filteredAlerts = alerts.filter(alert => 
            String(alert?.deviceId?.location?.suiteId) === String(suite._id) || 
            alert?.deviceId?.deviceSource === "AmbientWeather"
        );
        res.status(200).json(filteredAlerts);


    } catch(err) {
        res.status(500).json(err);
    }
}

// this is unsafe and needs some sort of input validation and guarding against
// repeated requests
const createRequest = async(req, res) => {
    try {
        // first find the tenant to add the alert to
        //const tenant = await Tenant.findById(req.body.tenantId);
        const building = await Building.findById(req.body.buildingId);
        if (!building) {
            return res.status(401).json({ message: "Building does not exist" });
        }

        //const alerts = await Alert.find({ buildingId: building._id, posterEmail: req.user.email });

        // then check if they belong within the tenant, buildingowners and prop managers
        // are included in tenant user lists
        // if (!tenant.users.includes(req.user.userId) && req.user.permissions !== "admin") {
        //     return res.status(401).json("User does not belong to tenant");
        // }

        const input = {
            alert_id: "REQUEST",
            alert_desc: req.body.description || "",
            location_desc: req.body.locationDescription || "",
            poster: req.user.id || null, // attach user or if not, its a guest
           // posterEmail: req.user.email,
            buildingId: building._id,
            deviceId: req.body.deviceId,
            status: "New",
            createdAt: new Date(),
        }

        /**
         * If the user creating the alert is a building owner or property manager,
         * then allow them to create the alert regardless of whether the building
         * is accepting user reported alerts or not
         */
        if (building.buildingOwner.includes(req.user.id) || 
            building.propertyManager.includes(req.user.id) ||
            req.user.permissions === "admin") {

            const alert = new Alert(input);
            const savedAlert = await alert.save();
            res.status(200).json(savedAlert);

        } else if (building.options?.userReportedAlerts === true) {
            const alert = new Alert(input);
            const savedAlert = await alert.save();
            res.status(200).json(savedAlert);
        } else {
            res.status(401).json("Building is currently not accepting tenant reported alerts");
        }  
    } catch(err) {
        res.status(500).json(err);
    }
}

const getServiceContractorAlerts = async(req, res) => {
    try {
        if (req.user.id !== req.params.contractorId) {
            return res.status(401).json({ message: "User is not the assigned contractor for this alert" });
        }
        const alerts = await Alert.find({ assignedPersonnel: { $in: req.params.contractorId } });
        res.status(200).json(alerts);
    } catch(err) {
        res.status(500).json(err);
    }
}



//find only resolved alerts by buildings by parent buildings
const fetchResolvedAlerts = async ({ userId }) => {
    LOGGER.debug(`Entering fetchResolvedAlerts in :: ${FILE_NAME}`)

    return new Promise(async (resolve, reject) => {
        const attribute = {
            _id: 0,
            alerts: 1
        }
    
        await User.findById(userId, attribute)
            //populate buildings first, and then alerts
            .populate({
                path: 'sites',
                model: 'ParentBuilding',
                populate: {
                    path: 'buildings',
                    model: 'Building',
                    populate: {
                        path: 'alerts',
                        model: 'Alert'
                    }
                }
            })
            .exec()
            .then(res => resolve(res.sites))
            .catch(err => reject(err))
    })

}

//fetch alerts by alertId, alert category and specific dates
const findAlertsByConditions = async (query) => {
    LOGGER.debug(`Entering findAlertsByConditions in :: ${FILE_NAME}`)

    return new Promise(async (resolve, reject) => {
        await Alert.find({
            buildingId: mongoose.Types.ObjectId(query.buildingId),
            alertCategory: query.alertCategory,
            severity: query.severity.toLowerCase(),
            createdAt: {
                $gte: new Date(query.fromDate),
                $lte: new Date(query.toDate)
            }

        })
            .exec()
            .then(res => resolve(res))
            .catch(err => reject(err))
    })
}

//here
const findAlertsByBuildingsByUserId = async ({ userId }) => {
    LOGGER.debug(`Entering findAlertsByUserId in :: ${FILE_NAME}`)

    return new Promise(async (resolve, reject) => {
        const attribute = {
            _id: 0,
            alerts: 1
        }
        // finds user by id -> populates user.sites -> populates user.sites.parentbuildings (buildings)
        var result = await User.find({'_id': userId})
            .populate({
                path: 'sites',
                model: 'parentbuildings',
                populate: {
                    path: 'buildings',
                    model: 'buildings',
                    populate: {
                        path: 'alerts',
                        model: 'alerts'
                    }
                }
            })
            .exec()
            resolve(result[0]['sites']);
            // .then(res => resolve(result))
            // .catch(err => reject(err))
    })
}

const findAlertsByUserId = async ({ userId }) => {
    LOGGER.debug(`Entering findAlertsByUserId in :: ${FILE_NAME}`)


    return new Promise(async (resolve, reject) => {
        const attribute = {
            _id: 0,
            alerts: 1
        }

        const User = await User.findById(userId, attribute)
            //populate buildings first, and then alerts
            .populate({
                path: 'sites',
                model: 'buildings',
                populate: {
                    path: 'alerts',
                    model: 'alerts'
                }
            })
            .exec()
            .then(res => resolve(res.sites))
            .catch(err => reject(err))
    })

}

//resolve alert
const resolveAlert = async query => {
    LOGGER.debug(`Entering resolve alert in :: ${FILE_NAME}`)
    return new Promise((resolve, reject) => {
        Alert.findByIdAndUpdate(query.alertId, {
            "responsibleParty": query.responsibleParty,
            "updatedAt": query.updatedAt,
            "status": query.status,
            "notes": query.notes
        })
            .then(res => {
                resolve(res)
            })
            .catch(err => {
                reject(err)
            })
    })
}

//update status, and serviceNeeded field
const updateServices = async (query) => {
    LOGGER.debug(`Entering updateServices in :: ${FILE_NAME}`)

    return new Promise((resolve, reject) => {
        Alert.findByIdAndUpdate(query.alertId, {
            "servicesNeeded": query.servicesNeeded,
            "status": query.status
        })
            .then(res => {
                resolve(res)
            })
            .catch(err => {
                reject(err)
            })
    })
}

//schedule service
const scheduleService = async query => {
    LOGGER.debug(`Entering schedule service in :: ${FILE_NAME}`)
    return new Promise((resolve, reject) => {
        Alert.findByIdAndUpdate(query.alertId, {
            "serviceDate": query.serviceDate,
            "serviceTime": query.serviceTime,
            "status": query.status,
            "responsibleParty": query.responsibleParty,
            "updatedAt": query.updatedAt
        })
            .then(res => {
                resolve(res)
            })
            .catch(err => {
                reject(err)
            })
    })
}

//start service or change to 'Assigned'
const startService = async query => {
    LOGGER.debug(`Entering start service in :: ${FILE_NAME}`)

    return new Promise((resolve, reject) => {
        Alert.findByIdAndUpdate(query.alertId, {
            "responsibleParty": query.responsibleParty,
            "updatedAt": query.updatedAt,
            "status": query.status,
            "priority": query.priority
        })
            .then(res => {
                resolve(res)
            })
            .catch(err => {
                reject(err)
            })
    })
}

const findAlertsBySiteName = (sites) => {
    LOGGER.debug(`Entering findAlertsBySiteName in :: ${FILE_NAME}`)

    return new Promise(async (resolve, reject) => {
        const tquery = {
            $or: []
        }

        for (let i = 0; i < sites.length; i++) {
            tquery.$or.push({
                "site": sites[i]
            })
        }

        await Alert.find(tquery)
            .exec()
            .then(res => {
                for (let i = 0; i < res.length; i++) {
                    alerts.push(res[i]._doc)
                }
                resolve(alerts)
            })
            .catch(err => reject(err))
    })
}

const findAlerts = (query) => {
    LOGGER.debug(`Entering findAlertsBySiteName in :: ${FILE_NAME}`)
    alerts = []

    return new Promise(async (resolve, reject) => {

        await Alert.find(query)
            .exec()
            .then(res => {
                // console.log(res)
                for (let i = 0; i < res.length; i++) {
                    alerts.push(res[i]._doc)
                }
                resolve(alerts)
            })
            .catch(err => reject(err))
    })
}

const findSites = (query) => {
    LOGGER.debug(`Entering findSites in :: ${FILE_NAME}`)

    return new Promise(async (resolve, reject) => {

        const attribute = {
            sites: 1,
            _id: 0
        }

        await User.findById(query, attribute)
            .exec()
            .then(res => {
                console.log(res)
                resolve(res)
            })
            .catch(err => reject(err))

    })
}

module.exports = {
    findAlerts,
    findSites,
    findAlertsBySiteName,
    findAlertsByUserId,
    updateServices,
    scheduleService,
    getAlertById,
    startService,
    findAlertsByBuildingsByUserId,
    fetchResolvedAlerts,
    findAlertsByConditions,
    resolveAlert,
    getBuildingAlerts,
    getTenantAlerts,
    createRequest,
    updateAlert,
    getServiceContractorAlerts
}