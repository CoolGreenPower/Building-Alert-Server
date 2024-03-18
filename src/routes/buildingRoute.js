const router = require('express').Router()
const authenticateToken = require('../utils/authentication')
const LOGGER = require('../logger/logger')
const buildingsDao = require('../dao/buildingDao')
const mongoose = require('mongoose')

const FILE_NAME = __filename.slice(__dirname.length + 1);

/**
 * @api {get} /api/buildings/user/:userId Gets buildings by (ObjectId) user id
 * @apiDescription Use to get general info of a building. Token is required for vital information
 * such as access keys.
 * @apiName building_getBuildingsByUserId
 * @apiGroup Buildings
 * 
 * @apiParam {ObjectId} userId
 * @apiHeader {Cookie} access_token User token in cookie stored upon sign-in
 * 
 * 
 * @apiSuccess {Array} buildings
 * @apiSuccess {ObjectId} _id
 * @apiSuccess {String} username
 * 
 * @apiSuccessExample Success-Response:
 * HTTP:/1.1 200 OK
 * {
    "buildings": [
		{
			"devices": {
				"dtDevices": [],
				"paragonDevices": [],
				"ambientDevices": []
			},
			"buildingOwner": [
				{
					"parentBuildings": [],
					"buildings": [],
					"_id": "64792aec3f5e915ba05f110a",
					"username": "John",
					"__v": 0
				}
			],
			"suites": [],
			"HVAC": [],
			"controller": [],
			"alerts": [],
			"tenants": [],
			"serviceCheckAlerts": [],
			"_id": "647a5ed5f5dedd65049a12ca",
			"dt_devices": [],
			"paragon_devices": [],
			"users": [],
			"BUID": "33.318620,-111.888956",
			"name": "Building Assure Chandler Arizona 241 2",
			"address": "2730 West Shannon Court, Chandler, AZ 85224",
			"__v": 0,
			"dt_projectId": "cbatk6b9ub8ophfojf9g"
        }
    ],
	"_id": "64792aec3f5e915ba05f110a",
	"username": "John",
}
*/
router.get('/user/:userId', authenticateToken, buildingsDao.getBuildingsByUserId)


/**
 * @api {get} /api/buildings Get all buildings 
 * @apiDescription Get all the buildings in the database. Returns only the building's name and address.
 * @apiName building_getAllBuildings
 * @apiGroup Buildings
 * 
 * @apiSuccess {Array} buildings
 * 
*/
router.get('/', authenticateToken, buildingsDao.getAllBuildings);

/**
 * @api {get} /api/buildings/user/BUID/:buildingId Get user by BUID
 * @apiDescription Use to get general info of a building. Token is required for personal information
 * such as access keys.
 * @apiName building_getBuildingByBUID
 * @apiGroup Buildings
 * 
 * @apiParam {String} buildingId
 * @apiHeader {Cookie} access_token User token in cookie stored upon sign-in
 * 
 * 
 * @apiSuccess {Object} building
 * 
 * @apiSuccessExample Success-Response:
 * HTTP:/1.1 200 OK
 * {
	"keys": {
		"dt_projectId": "",
		"dt_secret": "",
		"dt_email": "",
		"dt_key_id": "",
		"paragon_securityDomain": "",
		"paragon_username": "",
		"paragon_password": "",
		"ambient_apiKey": "",
		"ambient_applicationKey": ""
	},
	"gateways": [
		{
			"devices": [],
			"_id": "6480ea6fa5096e0dc8ec1bda",
			"buildingId": "6480e9b116e6088380430b97",
			"sourceAPI": "ParagonRobotics",
			"location": "BAPBC Office 2",
			"__v": 25
		},
		{
			"devices": [],
			"_id": "64827fc29a9c8e5390291339",
			"buildingId": "6480e9b116e6088380430b97",
			"sourceAPI": "DisruptiveTechnologies",
			"location": "Building Assure Suite",
			"__v": 19
		}
	],
	"buildingOwner": [
		"647e922795eb3b76f44cde1e"
	],
	"suites": [],
	"HVAC": [],
	"alerts": [],
	"tenants": [],
	"serviceCheckAlerts": [],
	"_id": "6480e9b116e6088380430b97",
	"BUID": "33.318620,-111.888959",
	"name": "TEST BUILDING FROM BUILDING ASSURE",
	"address": "2730 West Shannon Court, Chandler, AZ 85224",
	"__v": 2
}
 */
router.get('/BUID/:buildingId', authenticateToken, buildingsDao.getBuildingByBUID);



/**
 * @api {get} /api/buildings/:buildingId Get building by id
 * @apiName building_getBuildingById
 * @apiGroup Buildings
 * 
 * @apiDescription Please note that even though building documents have their respective data, 
 * that data is not returned in this request. Please refer to 'data' group for building data.
 * Token is required for personal info such as access keys.
 * 
 * @apiParam {ObjectId} buildingId
 * @apiHeader {Cookie} access_token User token in cookie stored upon sign-in
 * 
 * 
 * @apiSuccess {Object} building
 * 
 * @apiSuccessExample Success-Response:
 * HTTP:/1.1 200 OK
 * {
	"keys": {
		"dt_projectId": "",
		"dt_secret": "",
		"dt_email": "",
		"dt_key_id": "",
		"paragon_securityDomain": "",
		"paragon_username": "",
		"paragon_password": "",
		"ambient_apiKey": "",
		"ambient_applicationKey": ""
	},
	"gateways": [
		{
			"devices": [],
			"_id": "6480ea6fa5096e0dc8ec1bda",
			"buildingId": "6480e9b116e6088380430b97",
			"sourceAPI": "ParagonRobotics",
			"location": "BAPBC Office 2",
			"__v": 25
		},
		{
			"devices": [],
			"_id": "64827fc29a9c8e5390291339",
			"buildingId": "6480e9b116e6088380430b97",
			"sourceAPI": "DisruptiveTechnologies",
			"location": "Building Assure Suite",
			"__v": 19
		}
	],
	"buildingOwner": [
		"647e922795eb3b76f44cde1e"
	],
	"suites": [],
	"HVAC": [],
	"alerts": [],
	"tenants": [],
	"serviceCheckAlerts": [],
	"_id": "6480e9b116e6088380430b97",
	"BUID": "33.318620,-111.888959",
	"name": "TEST BUILDING FROM BUILDING ASSURE",
	"address": "2730 West Shannon Court, Chandler, AZ 85224",
	"__v": 2
}
 */
router.get('/:buildingId', authenticateToken, buildingsDao.getBuildingById)

/**
 * @api {get} /api/buildings/allusers/:buildingId Get all users in a building 
 * @apiDescription Get all users
 * @apiName building_getBuildingUsers
 * @apiGroup Buildings
 * 
 * @apiParam {ObjectId} buildingId
 * @apiHeader {Cookie} access_token User token in cookie stored upon sign-in
 * 
 * @apiSuccess {Array} buildingOwner Building owners
 * @apiSuccess {Array} propertyManager Property managers 
 * @apiSuccess {Array} serviceContractor Service contractors
 * @apiSuccess {Object} tenantUsers Tenant users grouped by the tenant they reside in 
 * 
 * @apiSuccessExample Success-Response:
 * HTTP:/1.1 200 OK
 * {
	"buildingOwner": [
		{
			"_id": "6488d8b16f3521635cc095d9",
			"username": "testuser",
			"permissions": "owner",
			"name": "tester"
		}
	],
	"propertyManager": [
		{
			"_id": "64c03ea0b5892a8eddb7450d",
			"name": "servicecontractor",
			"username": "servicer",
			"permissions": "serviceContractor"
		}
	],
	"serviceContractor": [],
	"tenantUsers": {
		"An Office Business 2": [
			{
				"_id": "6488d8b16f3521635cc095d9",
				"username": "testuser",
				"permissions": "owner",
				"name": "tester"
			},
			{
				"_id": "64adb7d6a09bdf0669b9a18a",
				"name": "wef",
				"username": "somerandomuser",
				"permissions": "owner"
			}
		]
	}
}
*/
router.get("/allusers/:buildingId", authenticateToken, buildingsDao.getBuildingUsers)

/**
 * @api {put} /api/buildings/removeuser/:buildingId Remove user from building 
 * @apiDescription Remove user from building. Only applies to property managers and service contractors.
 * Removing tenant users should be done via the tenant route. Token is required.
 * @apiName building_removeUserFromBuilding
 * @apiGroup Buildings
 * 
 * @apiParam {ObjectId} buildingId The building to remove from
 * @apiBody {ObjectId} userId The user to remove
 * @apiHeader {Cookie} access_token User token in cookie stored upon sign-in
*/
router.put("/removeuser/:buildingId", authenticateToken, buildingsDao.removeUserFromBuilding)

/**
 * @api {post} /api/buildings/create Create a building
 * @apiName building_create
 * @apiGroup Buildings
 * @apiDescription Devices should not be added in this request body. Instead they should be added
 * via the device routes. Token required
 * 
 * @apiHeader {Cookie} access_token User token in cookie stored upon sign-in
 * 
 * @apiBody {ObjectId} userId - The ObjectId of the user creating the building and is inferred as the building owner. 
 * @apiBody {ObjectId} parentBuildingId
 * @apiBody {String} [type]
 * @apiBody {String} name
 * @apiBody {String} [address]
 * @apiBody {String} [city]
 * @apiBody {String} [state]
 * @apiBody {String} [zipcode]
 * @apiBody {String} BUID - The Building ID (Separate from MongoDB ObjectId)
 * @apiBody {Number} [totalSquareFootage]
 * @apiBody {Number} [numberOfFloors]
 * @apiBody {Number} [numberOfSuites]
 * @apiBody {String} [phone]
 * @apiBody {String} [imageLink]
 * @apiBody {String} [longitude]
 * @apiBody {String} [latitute]
 * 
 * @apiExample {json} Example body:
 * {
	"BUID": "33.318620,-111.888957",
	"name": "Building Assure Chandler Arizona 241 2",
	"address": "2730 West Shannon Court, Chandler, AZ 85224",
	"userId": "64792aec3f5e915ba05f110a"	
}
 * 
 * @apiSuccess {Object} building
 * @apiSuccess {Object} modifiedUser
 * @apiSuccess {Object} modifiedParentBuilding 
 * 
 * @apiSuccessExample Success-Response:
 * HTTP:/1.1 200 OK
 * {
	"building": {
		"keys": {
			"dt_projectId": "",
			"dt_secret": "",
			"dt_email": "",
			"paragon_securityDomain": "",
			"paragon_username": "",
			"paragon_password": "",
			"ambient_apiKey": "",
			"ambient_applicationKey": ""
		},
		"gateways": [],
		"buildingOwner": [
			"647e922795eb3b76f44cde1e"
		],
		"suites": [],
		"HVAC": [],
		"alerts": [],
		"tenants": [],
		"serviceCheckAlerts": [],
		"_id": "6480e9b116e6088380430b97",
		"BUID": "33.318620,-111.888959",
		"name": "Building Assure Chandler Arizona",
		"address": "2730 West Shannon Court, Chandler, AZ 85224",
		"__v": 0
	},
	"modifiedUser": {
		"parentBuildings": [],
		"buildings": [
			"6480e9b116e6088380430b97"
		],
		"_id": "647e922795eb3b76f44cde1e",
		"username": "johnsomething",
		"password": "hashedpassword",
		"permissions": "owner",
		"__v": 0
	},
	"modifiedParentBuilding": null
}
*/
router.post('/create', authenticateToken, buildingsDao.createBuilding);


// --- invites ---
/**
 * @api {post} /api/buildings/invite Invite a user to a building 
 * @apiDescription For service contractor and property manager invites only.
 * @apiName building_inviteUserToBuilding
 * @apiGroup Buildings
 * 
 * @apiBody {ObjectId} buildingId
 * @apiBody {String} [username] Username of user to invite. If this is not provided, then email must be provided.
 * @apiBody {String} [email] Email of user to invite. If this is not provided, then username must be provided.
 * @apiBody {String} inviteType Either 'serviceContractor' or 'propertyManager'
 * @apiHeader {Cookie} access_token User token in cookie stored upon sign-in
 * 
 * 
 * @apiSuccessExample Success-Response:
 * HTTP:/1.1 200 OK
 * {
	"message": "Invite sent",
	"invite": {
		"from": "6488d8b16f3521635cc095d9",
		"to": "64c03ea0b5892a8eddb7450d",
		"inviteType": "serviceContractor",
		"data": {
			"role": "serviceContractor",
			"buildingId": "6480e9b116e6088380430b97"
		},
		"_id": "64c044ac9e840aa40d32e6cb",
		"createdAt": "2023-07-25T21:54:52.410Z",
		"__v": 0
	}
}
*/
router.post("/invite", authenticateToken, buildingsDao.inviteUserToBuilding);

/**
 * @api {delete} /api/buildings/invite/:inviteId Delete an invite for a building  
 * @apiDescription Delete a sent invite. 
 * @apiName building_deleteInvite
 * @apiGroup Buildings
 * 
 * @apiParam {ObjectId} inviteId
 * @apiHeader {Cookie} access_token User token in cookie stored upon sign-in
*/
router.delete("/invite/:inviteId", authenticateToken, buildingsDao.deleteInvite);

/**
 * @api {get} /api/buildings/invites/all Get all invites for a building 
 * @apiDescription Get all the invites that are sent to join for the given building.
 * @apiName building_getInvites
 * @apiGroup Buildings
 * 
 * @apiHeader {Cookie} access_token User token in cookie stored upon sign-in
 * 
 * @apiSuccessExample Success-Response:
 * HTTP:/1.1 200 OK
 * [
	{
		"data": {
			"role": "serviceContractor",
			"buildingId": "6480e9b116e6088380430b97"
		},
		"_id": "64c05f76fe31af5865453916",
		"from": "6488d8b16f3521635cc095d9",
		"to": "64c03ea0b5892a8eddb7450d",
		"inviteType": "serviceContractor",
		"createdAt": "2023-07-25T23:49:10.360Z",
		"__v": 0
	}
]
*/
router.get("/invites/all/:buildingId", authenticateToken, buildingsDao.getInvites)
// --- end invites ---

/**
 * @api {put} /api/building/:buildingId Update a building
 * @apiName building_update
 * @apiGroup Buildings
 * @apiDescription Devices should not be added in this request body. Instead they should be added
 * via the device routes. Requires token
 * 
 * 
 * @apiExample {json} Example body:
 * {
	"BUID": "33.318620,-111.888957",
	"name": "Building Assure Chandler Arizona 241 2",
	"address": "2730 West Shannon Court, Chandler, AZ 85224",
	"userId": "64792aec3f5e915ba05f110a"	
}
 * 
 * @apiSuccess {Object} modifiedBuilding
 * 
 * @apiParam {ObjectId} buildingId
 * @apiHeader {Cookie} access_token User token in cookie stored upon sign-in
 * 
 * @apiSuccessExample Success-Response:
 * HTTP:/1.1 200 OK
 * {
	"keys": {
		"dt_projectId": "cbatk6b9ub8ophfojf9g",
		"dt_secret": "679176aa035743d285197480f302075a",
		"dt_email": "cd7l71i57e60009ft1v0@cbatk6b9ub8ophfojf9g.serviceaccount.d21s.com",
		"dt_key_id": "cd7mt2257e60009ft200",
		"paragon_securityDomain": "",
		"paragon_username": "",
		"paragon_password": "",
		"ambient_apiKey": "",
		"ambient_applicationKey": ""
	},
	"gateways": [
		"6480ea6fa5096e0dc8ec1bda",
		"64827fc29a9c8e5390291339"
	],
	"buildingOwner": [
		"647e922795eb3b76f44cde1e"
	],
	"suites": [],
	"HVAC": [],
	"alerts": [],
	"tenants": [],
	"serviceCheckAlerts": [],
	"_id": "6480e9b116e6088380430b97",
	"BUID": "33.318620,-111.888959",
	"name": "TEST BUILDING FROM BUILDING ASSURE",
	"address": "2730 West Shannon Court, Chandler, AZ 85224",
	"__v": 2
}
*/
router.put('/:buildingId',authenticateToken, buildingsDao.updateBuilding);

// only supposed to be used for server
// azure functions relies on this route (basically all of them).
// So if changes are made to this, ensure to reflect that change on functions
router.get("/nocookie/:buildingId", buildingsDao.getBuildingWithoutCookie)



module.exports = router