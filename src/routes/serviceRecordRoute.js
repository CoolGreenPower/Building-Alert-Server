const router = require('express').Router()
const LOGGER = require('../logger/logger')
//const { addServiceRecord } = require('../services/serviceRecordService')

const FILE_NAME = 'serviceRecordRoute.js'

/**
 * 
 * Deprecated. Update to match current DB schema
 * Alerts now act as "service records" as they hold assigned personnel and status
 * 
 */


// Route to add Service Record to the database
router.post(`/`, (req, res) => {
    LOGGER.debug(`Entering service record route in ${FILE_NAME}`)
    addServiceRecord(req.body)
    .then(result => res.send(result))
    .catch()
})

module.exports = router