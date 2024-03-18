const Tenant = require('../../models/TenantModel');
const Suite = require("../../models/SuiteModel");
const User = require("../../models/UserModel")
const crypto = require("crypto")

const LOGGER = require('../../logger/logger');
const Building = require('../../models/BuildingModel');
const Invite = require('../../models/InviteModel');


/**
 * includes both tenant and suite routing
 */

const createTenant = async (req, res) => {
    try {
        if (!req.body.suiteId) {
            return res.status(400).json({ message: 'Missing suiteId' });
        }
        const tempSuite = await Suite.findById(req.body.suiteId);
        if (!tempSuite) {
            return res.status(400).json({ message: 'Suite not found' });
        }

        // checking if building owner or admin

        // don't add another tenant if suite is already occupied
        // if (tempSuite.occupied) {
        //     return res.status(400).json({ message: 'Suite is occupied' });
        // }

        // create tenant and modify the suite
        const tenant = new Tenant({ 
            ...req.body,
            users: req.body.users || [],
            buildingId: tempSuite.buildingId
        });
        const suite = Suite.findByIdAndUpdate(req.body.suiteId, {   
                tenant: tenant._id,
                occupied: true 
            }, 
            { new: true }
        );
        
        const returnedTenant = await tenant.save();
        const returnedSuite = await suite.exec();

        LOGGER.debug("Created tenant");
        res.status(201).json({
            tenant: returnedTenant,
            modifiedSuite: returnedSuite
        });

    } catch(err) {
        LOGGER.error("Error creating tenant")
        res.status(500).json(err);
    }
    

}

const createSuite = async(req, res) => {
    try {
        if (!req.body.buildingId) { return res.status(401).json("buildingId required"); }
        let building = await Building.findById(req.body.buildingId);

        if (!building) { return res.status(400).json("Building not found"); } 

        const suite = new Suite({ ...req.body });
        building.suites.push(suite._id);

        // parallel promise wait
        const [ createdSuite, modifiedBuilding ] = await Promise.all([suite.save(), building.save()])
        res.status(200).json({
            createdSuite: createdSuite,
            modifiedBuildingSuites: modifiedBuilding.suites
        });
    } catch(err) {
        res.status(500).json(err);
    }

}

const getBuildingSuites = async(req, res) => {
    try {
        const suites = await Suite.find({ buildingId: req.params.buildingId }).populate("tenant", "name _id");
        res.status(200).json(suites);
    } catch(err) {
        res.status(500).json(err);
    }
}

const getBuildingTenants = async(req, res) => {
    try {
        const tenants = await Tenant.find({ buildingId: req.params.buildingId }).populate("suiteId");
        res.status(200).json(tenants);
    } catch(err) {
        res.status(500).json(err);
    }
}

const getAllSuites = async(req, res) => {
    try {
        const suites = await Suite.find().populate("tenant", "name _id").populate("buildingId", "name _id");
        res.status(200).json(suites);
    } catch(err) {
        res.status(500).json(err);
    }
}

const getAllTenants = async(req, res) => {
    try {
        const tenants = await Tenant.find().populate("suiteId").populate("buildingId", "name _id");
        res.status(200).json(tenants);
    } catch(err) {
        res.status(500).json(err);
    }
}

const getSuiteById = async(req, res) => {
    try {
        const suite = await Suite.findById(req.params.id);
        res.status(200).json(suite);
    } catch(err) {
        res.status(500).json(err);
    }
}

const getTenantById = async(req, res) => {
    try {
        const tenant = await Tenant.findById(req.params.id);
        res.status(200).json(tenant);
    } catch(err) {
        res.status(500).json(err);
    }
}




module.exports = {
    createTenant,
    createSuite,
    getBuildingSuites,
    getBuildingTenants,
    getAllSuites,
    getAllTenants,
    getSuiteById,
    getTenantById
}
