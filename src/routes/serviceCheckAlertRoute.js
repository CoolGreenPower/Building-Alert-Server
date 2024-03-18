const router = require('express').Router()
const LOGGER = require('../logger/logger')
const authenticateToken = require('../utils/authentication')
const serviceCheckAlertDao = require('../dao/serviceCheckAlertDao')

const FILE_NAME = "serviceCheckAlertRoute"

/**
 * 
 * Deprecated. Update to match current DB schema
 * Alerts are all grouped together
 * 
 */

//fetch alert
router.get('/:id', authenticateToken, async (req, res) => {
    LOGGER.debug(`Entering get serviceCheckAlertById route after token authentication :: ${FILE_NAME}`)

    await serviceCheckAlertDao.getServiceCheckAlertbyAlertId(req.params.id)
        .then(result => res.status(200).send(result))
        .catch(err => console.log(err))
})

/**
 * update status of alert by id
 */
router.post('/updateAlert', authenticateToken, async (req, res) => {
    LOGGER.debug(`Entering updateAlert after token authentication`)

    await serviceCheckAlertDao.updateServices(req.body)
        .then(result => res.status(200).send(result))
        .catch(err => console.log(err))
})

//route to return servicecheckalerts belonging to a user's buildings
/**
 * Accepts userId
 * Returns servicecheckalerts belonging to the buildings associated with this userId
 */
router.post('/buildings', authenticateToken, async (req, res) => {
    LOGGER.debug(`Entering post service check alert route after token authentication :: ${FILE_NAME}`)

    const query = { userId: req.body.userId }

    //fetch alerts belonging to this userId
    await serviceCheckAlertDao.findServiceCheckAlertsByBuildingsByUserId(query)
        .then((r) => { res.status(200).send(r) })
        .catch(e => res.status(400).send(e))

})

//route to update Services Selected and also, status of the alert
router.post('/updateServices', authenticateToken, async (req, res) => {
    await serviceCheckAlertDao.updateServices(req.body)
        .then(r => res.status(200).send(r))
        .catch(err => res.status(400).send(err))
})

/**
 * Route to schedule service
 * 
 * Accepts alertId, serviceDate, serviceTime, responsibleParty
 * Returns acknowledgement
 */
router.post('/scheduleService', authenticateToken, async (req, res) => {
    await serviceCheckAlertDao.scheduleService(req.body)
        .then(r => res.status(200).send(r))
        .catch(err => res.status(400).send(err))
})

/**
 * Route to resolve service
 */
router.post('/resolve', async (req, res) => {
    await serviceCheckAlertDao.resolveService(req.body)
        .then(r => res.status(200).send(r))
        .catch(err => res.status(400).send(err))
})


module.exports = router