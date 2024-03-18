
const Alert = require('../../models/AlertModel')
const Building = require("../../models/BuildingModel")
const Tenant = require('../../models/TenantModel')
const Suite = require('../../models/SuiteModel')



const getAllAlerts = async(req, res) => {
    try {
        const alerts = await Alert.find().limit(req.query.count)
            .populate("deviceId", ["_id", "device", "loggerType", "deviceSource"])
            .populate("buildingId", ["_id", "name"])
            .exec();
        res.status(200).json(alerts);
    } catch(err) {
        res.status(500).json(err);
    }
}

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
        const alerts = await Alert.find({ buildingId: req.params.buildingId }).populate("deviceId");
        res.status(200).json(alerts);
       
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

        const alert = new Alert(input);
        const savedAlert = await alert.save();
        res.status(200).json(savedAlert);

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



module.exports = {
    getAllAlerts,
    getAlertById,
    getBuildingAlerts,
    getTenantAlerts,
    createRequest,
    updateAlert,
    getServiceContractorAlerts
}