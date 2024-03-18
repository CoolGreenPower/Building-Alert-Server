const LOGGER = require('../logger/logger')
const ServiceRecord = require('../models/ServiceRecordModel')

const createServiceRecord = async(req, res) => {
    try {
        // assign the user to the service record
    } catch(err) {
        res.status(500).json(err);
    }
}

module.exports = { createServiceRecord }