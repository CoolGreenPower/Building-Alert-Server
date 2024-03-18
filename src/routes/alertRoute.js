const router = require('express').Router()
const LOGGER = require('../logger/logger')
const authenticateToken = require('../utils/authentication')
const alertDao = require('../dao/alertDao')
//const alertService = require('../services/alertService')
const mongoose = require('mongoose')

const FILE_NAME = 'alertRoute.js'

//fetch alert
/**
 * @api {get} /api/alerts/:alertId Get alert by alertId 
 * @apiDescription Get alert by _id. The deviceId field is populated with the device object.
 * @apiName alert_getAlertById
 * @apiGroup Alerts
 * 
 * @apiParam {ObjectId} alertId Alert's _id 
 * @apiHeader {Cookie} access_token User token in cookie stored upon sign-in
 * 
 * @apiSuccess alert Alert object
 * 
 * @apiSuccessExample Success-Response:
 * HTTP:/1.1 200 OK
 * 
 * {
	"assignedPersonnel": [],
	"_id": "64ac5039a288824ddfe69e29",
	"alert_id": "H-01",
	"alert_desc": "Acceptable Air Quality",
	"status": "New",
	"deviceId": {
		"location": {
			"buildingId": "6480e9b116e6088380430b97",
			"suiteId": "649bac511f0ba91aa42aaccd",
			"asset": null,
			"data": "Master bedroom",
			"outdoors": null
		},
		"_id": "64839172f8155471dc7ed360",
		"gatewayId": "64827fc29a9c8e5390291339",
		"loggerType": "co2",
		"DUID": "D-000000011",
		"deviceSource": "DisruptiveTechnologies",
		"projectId": "cbatk6b9ub8ophfojf9g",
		"sensorId": "c9j6g0nck92000emtukg",
		"machines": [],
		"__v": 0,
		"targetName": "projects/cbatk6b9ub8ophfojf9g/devices/c9j6g0nck92000emtukg"
	},
	"buildingId": "6480e9b116e6088380430b97"
}
*/
router.get("/:alertId", authenticateToken, alertDao.getAlertById);

// get alerts by building
/**
 * @api {get} /api/alerts/buildingalerts/:buildingId Get alerts by buildingId 
 * @apiDescription Get alerts by building id.
 * @apiName alert_getAlertsByBuildingId
 * @apiGroup Alerts
 * 
 * @apiParam {ObjectId} buildingId Building's _id 
 * @apiHeader {Cookie} access_token User token in cookie stored upon sign-in
 * @apiQuery {Boolean} [device] If true, populates the deviceId field with the device object 
 * 
 * @apiSuccess {Array} alerts Array of alert objects
 * 
 * @apiSuccessExample Success-Response:
 * HTTP:/1.1 200 OK
 * [
	{
		"assignedPersonnel": [],
		"_id": "64a717e693ad9a6f12748582",
		"alert_id": "H-01",
		"alert_desc": "Acceptable Air Quality",
		"status": "Active",
		"deviceId": "64839172f8155471dc7ed360",
		"buildingId": "64b9fa8962c45e883a08e380"
	}
]
*/
router.get("/buildingalerts/:buildingId", authenticateToken, alertDao.getBuildingAlerts);

/**
 * @api {get} /api/alerts/tenantalerts/:tenantId Get alerts by tenantId 
 * @apiDescription Get a specific tenant's alerts. This only gives alerts where the device is denoted
 * in it's location to be in that tenant's suite. So this will not give you alerts based on whether or not the device
 * supports multiple suites or the entire building.
 * @apiName alert_getTenantAlerts
 * @apiGroup Alerts
 * 
 * @apiParam {ObjectId} tenantId Tenant's _id
 * @apiHeader {Cookie} access_token User token in cookie stored upon sign-in
 * 
*/
router.get("/tenantalerts/:tenantId", authenticateToken, alertDao.getTenantAlerts);

/**
 * @api {get} /api/alerts/servicecontractoralerts/:contractorId Get alerts by contractorId 
 * @apiDescription Retrives the alerts that are assigned to a specific service contractor.
 * @apiName alert_getServiceContractorAlerts
 * @apiGroup Alerts
 * 
 * @apiParam {ObjectId} contractorId Service contractor's _id 
 * @apiHeader {Cookie} access_token User token in cookie stored upon sign-in
 * 
*/
router.get("/contractoralerts/:contractorId", authenticateToken, alertDao.getServiceContractorAlerts);

// requires tenantId, userid, and more info such as location
// if location matches a suite, then attach it,
// attaching a deviceId is optional but recommended
/**
 * @api {post} /api/alerts/createrequest Create user request 
 * @apiDescription Creates user requests. Requests are created by any individual as long as the building
 * is accepting requests. This setting can be found within the building's settings object.
 *  
 * @apiName alert_createRequest 
 * @apiGroup Alerts
 *  
 * @apiBody {ObjectId} buildingId Required to create a request
 * @apiBody {String} [description]
 * @apiBody {String} [locationDescription]
 * @apiBody {Cookie} [access_token] Stores user if there is a logged in user, if not, then null
 * 
 * @apiSuccess {Object} request Created Request
 * 
 * @apiSuccessExample Success-Response:
 * HTTP:/1.1 200 OK
 * {
	"buildingId": "64b9fa8962c45e883a08e380",
	"alert_id": "REQUEST",
	"alert_desc": "Roof is leaking",
	"location_desc": "Roof of building 2",
	"poster": "64adb7d6a09bdf0669b9a18a",
	"status": "New",
	"createdAt": "2023-07-21T21:17:55.990Z",
	"assignedPersonnel": [],
	"_id": "64baf603d5b2a620cfa7a2bc",
	"__v": 0
}
*/
router.post("/createrequest", authenticateToken, alertDao.createRequest);

/**
 * @api {put} /api/alerts/:alertId Update alert 
 * @apiDescription Update an alert's information. User must be building owner or property manager
 * @apiName alert_updateAlert 
 * @apiGroup Alerts
 * 
 * @apiParam {ObjectId} alertId Alert's _id 
 * @apiHeader {Cookie} access_token User token in cookie stored upon sign-in
 * 
 * @apiSuccess {Object} alert Updated alert
 * 
*/
router.put("/:alertId", authenticateToken, alertDao.updateAlert);


//route to update Services Selected and also, status of the alert
router.post('/updateServices', authenticateToken, async (req, res) => {
    await alertDao.updateServices(req.body)
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
    await alertDao.scheduleService(req.body)
    .then(r => res.status(200).send(r))
    .catch(err => res.status(400).send(err))
    
})

/**
 * Route to start/assign service
 * 
 * Accepts alertId, updatedAt, status, responsibleParty
 * Returns acknowledgement
 */
 router.post('/startService', authenticateToken, async (req, res) => {
    await alertDao.startService(req.body)
    .then(r => res.status(200).send(r))
    .catch(err => res.status(400).send(err))
    
})


//route to return alerts beloging to a user's buildings
/**
 * Accepts userId
 * Returns alerts belonging to the buildings associated with this userId
 */
 router.post('/', async (req, res) => {
    LOGGER.debug(`Entering post alert route after token authentication :: ${FILE_NAME}`)

    const query = { userId: req.body.userId }

    // //fetch alerts belonging to this userId
    // await alertService.findAlertsByBuildingsByUserId(query)
    // .then((r) => {res.status(200).send(r)})
    // .catch(e => res.status(400).send(e))
    
})

/**
 * Route to return all resolved alerts
 * 
 * request body contains userId
 */
 router.post('/resolvedAlerts', authenticateToken, async (req, res) => {
    
    LOGGER.debug(`Entering post resolvedAlerts route after token authentication :: ${FILE_NAME}`)
    const query = { userId: req.body.userId }

    //fetch alerts belonging to this userId
    await alertDao.fetchResolvedAlerts(query)
    .then((r) => {res.status(200).send(r)})
    .catch(e => res.status(400).send(e))
})


//route to return alerts beloging to a user's buildings
/**
 * Accepts userId
 * Returns alerts belonging to the buildings associated with this userId
 */
router.post('/buildings', async (req, res) => {
    LOGGER.debug(`Entering post alert route after token authentication :: ${FILE_NAME}`)

    const query = { userId: req.body.userId }

    //fetch alerts belonging to this userId
    console.log('userid = ' + query['userId']);

    // await alertService.findAlertsByBuildingsByUserId(query)
    // .then((r) => {res.status(200).send(r)})
    // .catch(e => res.status(400).send(e))
    
})

/**
 * Route to resolve alert
 */
 router.post('/resolve', async(req, res) => {
    await alertDao.resolveAlert(req.body)
    .then(r => res.status(200).send(r))
    .catch(err => res.status(400).send(err))
})

/**
 * Route to fetch alerts by alertId, alert category and specific dates
 */
router.post('/conditionalAlerts', async (req, res) => {
    LOGGER.debug(`Entering post conditionalAlerts route after token authentication :: ${FILE_NAME}`)

    const query = req.body
    await alertDao.findAlertsByConditions(query)
    .then((r) => {res.status(200).send(r)})
    .catch(e => res.status(400).send(e))

})

//route to return alerts filtered with alertCategory
router.post('/category', authenticateToken, (req, res) => {
    LOGGER.debug(`Entering post category alert route after token authentication :: ${FILE_NAME}`)
    
    sites = []

    const query = {
        _id: mongoose.Types.ObjectId(req.body.userId)
    }

    // alertService.findAlerts(query)
    // .then(result => {
    //     res.status(200).send(result)
    // })
    // .catch(err => {
    //     res.status(401).send(err)
    // })
})

module.exports = router