const Building = require("../models/BuildingModel")
const Suite = require("../models/SuiteModel")
const Tenant = require("../models/TenantModel")


const getSuiteById = async(req, res) => {
    try {
        const suite = await Suite.findById(req.params.suiteId)
        res.status(200).json(suite)
    } catch(err) {
        res.status(500).json(err)
    }
}

const createSuite = async(req, res) => {
    try {
        if (!req.body.buildingId) { return res.status(401).json("buildingId required"); }
        let building = await Building.findById(req.body.buildingId);

        if (!building) { return res.status(400).json("Building not found"); } 
        if (building.buildingOwner.indexOf(req.user.id) === -1) { 
            return res.status(401).json("User is not the owner of the building"); 
        }
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

const updateSuite = async(req, res) => {
    try {
        const suite = await Suite.findById(req.params.suiteId);
        if (!suite) { return res.status(400).json("Suite not found"); }

        const building = await Building.findById(suite.buildingId);

        if (building.buildingOwner.indexOf(req.user.id) === -1) { 
            return res.status(401).json("User is not the owner of the suite"); 
        }

        const updatedSuite = await Suite.findByIdAndUpdate(req.params.suiteId, 
            { $set: req.body }, 
            { new: true }
        );
        res.status(200).json(updatedSuite);
    } catch(err) {
        res.status(500).json(err);
    }

}

const deleteSuite = async(req, res) => {
    try {
        
        const suite = await Suite.findById(req.params.suiteId);
        const building = await Building.findById(suite.buildingId);
        if (!suite) { return res.status(400).json("Suite not found"); }
        
        if (building.buildingOwner.indexOf(req.user.id) === -1) { 
            return res.status(401).json("User is not the owner of the building"); 
        }

        const suiteDeletion = Suite.findByIdAndDelete(req.params.suiteId);
        const buildingChange = Building.findByIdAndUpdate(suite.buildingId, 
            { $pull: { suites: suite._id } }, 
            { new: true }
        );
 
        const [deletedSuite, changedBuilding] = await Promise.all([suiteDeletion, buildingChange]);

        res.status(200).json({
            message: "Suite deleted successfully",
            deletedSuite,
            changedBuildingSuites: changedBuilding.suites
        });
    } catch(err) {
        res.status(500).json(err);
    }


}

const getSuitesByBuildingId = async(req, res) => {
    try {
        const suites = await Suite.find({ buildingId: req.params.buildingId })
            .populate("tenant", "name").exec();
        res.status(200).json(suites);
    } catch(err) {
        res.status(500).json(err);
    }
}



module.exports = {
    getSuiteById,
    createSuite,
    updateSuite,
    deleteSuite,
    getSuitesByBuildingId
}