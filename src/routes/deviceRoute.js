const express = require("express");
const LOGGER = require('../logger/logger');
const authenticateToken = require("../utils/authentication")

const deviceDao = require('../dao/deviceDao');
const router = express.Router();


/**
 * Device routes should include both gateways and sensors
 * Gateways are created first and sensors bind to the gateway
 * - if ever gateways are changed/moved around, u simply need to change the gateway location
 */


// creating the gateway
// requires a building id
/**
 * @api {post} /api/devices/gateway Create a gateway
 * @apiDescription A gateway serves as the central location for every type of sensor (DT, PR, or Ambient).
 * These virtual gateways are not the same as the physical gateways and are purely for device centralization.
 * Requires a token.
 * @apiName device_createGateway
 * @apiGroup Devices
 * 
 * @apiHeader {Cookie} access_token Token stored in cookie upon signin
 * @apiBody {ObjectId} buildingId - The building to add this gateway to
 * 
 * @apiSuccessExample Success-Response:
 * HTTP:/1.1 201 Created
 * {
	"devices": [],
	"_id": "64827fc29a9c8e5390291339",
	"buildingId": "6480e9b116e6088380430b97",
	"sourceAPI": "DisruptiveTechnologies",
	"location": "Building Assure Suite",
	"__v": 0
}
*/
router.post("/gateway", authenticateToken, deviceDao.createGateway);

/**
 * @api {put} /api/devices/gateway/:gatewayId Update a gateway
 * @apiDescription There are immutable fields that will raise an error if attempted to
 * change within the request body.
 * @apiName device_updateGateway
 * @apiGroup Devices
 * 
 * @apiParam {ObjectId} gatewayId
 * 
 * @apiSuccessExample Success-Response:
 * HTTP:/1.1 200 OK
 * {
	"devices": [],
	"_id": "64827fc29a9c8e5390291339",
	"buildingId": "6480e9b116e6088380430b97",
	"sourceAPI": "DisruptiveTechnologies",
	"location": "Building Assure Suite",
	"__v": 0
}
*/
router.put("/gateway/:gatewayId", authenticateToken, deviceDao.updateGateway);

/**
 * @api {get} /api/devices/gateway/:gatewayId Get gateway data and all of its sensors
 * @apiName device_getGateway
 * @apiGroup Devices
 * 
 * @apiParam {ObjectId} gatewayId
 * 
 * @apiSuccessExample Success-Response:
 * HTTP:/1.1 200 OK
 * {
	"devices": [],
	"_id": "64827fc29a9c8e5390291339",
	"buildingId": "6480e9b116e6088380430b97",
	"sourceAPI": "DisruptiveTechnologies",
	"location": "Building Assure Suite",
	"__v": 0
}
*/
router.get("/gateway/:gatewayId", deviceDao.getGateway);


/**
 * @api {delete} /api/devices/gateway Delete a gateway
 * @apiDescription Deleting a gateway also deletes all of the sensors associated with it as well.
 * If making changes to the gateway, consider using the update method instead.
 * @apiName device_getGateway
 * @apiGroup Devices
 * 
 * @apiBody {ObjectId} gatewayId
 * 
 * @apiSuccessExample Success-Response:
 * HTTP:/1.1 200 OK
 * {
	"devices": [],
	"_id": "64827fc29a9c8e5390291339",
	"buildingId": "6480e9b116e6088380430b97",
	"sourceAPI": "DisruptiveTechnologies",
	"location": "Building Assure Suite",
	"__v": 0
}
*/
router.delete("/gateway", authenticateToken, deviceDao.deleteGateway);


/**
 * @api {get} /api/devices/building/:buildingId/gateways Get gateways by building id
 * @apiName device_getGatewaysByBuilding
 * @apiGroup Devices
 * 
 * @apiParam {ObjectId} buildingId
 * 
 * @apiSuccessExample Success-Response:
 * HTTP:/1.1 200 OK
 * {
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
	]
}
*/
router.get("/building/:buildingId/gateways", deviceDao.getGatewaysByBuildingId);


/**
 * @api {get} /api/devices/building/:buildingId/sensors Get sensors by building id
 * @apiName device_getSensorsByBuilding
 * @apiGroup Devices
 * 
 * @apiParam {ObjectId} buildingId
 * 
 * @apiSuccess {Array} gateways The gateways associated with the building id
 * @apiSuccess {ObjectId} _id The building id
 * 
 * @apiSuccessExample Success-Response:
 * HTTP:/1.1 200 OK
 * {
	"gateways": [
		{
			"devices": [
				{
					"location": {
						"buildingId": "6480e9b116e6088380430b97",
						"data": "BApbc Lab Utilities"
					},
					"_id": "6481392883726809448c020c",
					"gatewayId": "6480ea6fa5096e0dc8ec1bda",
					"loggerType": "utility",
					"DUID": "D-000000007",
					"deviceSource": "ParagonRobotics",
					"device": "BApbc Lab Utility Sensors",
					"deviceModel": "DB14",
					"devicePath": "/company/paragonrobotics.com/device/transform/20102/1/842",
					"machines": [
						{
							"sensorType": "gasMeter",
							"sensorPath": "/machine/3/value"
						},
						{
							"sensorType": "waterMeter",
							"sensorPath": "/machine/13/value"
						}
					],
					"__v": 0
				}
			],
			"_id": "6480ea6fa5096e0dc8ec1bda",
			"buildingId": "6480e9b116e6088380430b97",
			"sourceAPI": "ParagonRobotics",
			"location": "BAPBC Office 2",
			"__v": 25
		},
		{
			"devices": [
				{
					"location": {
						"buildingId": "6480e9b116e6088380430b97",
						"data": "Front Door"
					},
					"_id": "6483903cf8155471dc7ed358",
					"gatewayId": "64827fc29a9c8e5390291339",
					"loggerType": "event",
					"DUID": "D-000000008",
					"deviceSource": "DisruptiveTechnologies",
					"projectId": "cbatk6b9ub8ophfojf9g",
					"sensorId": "c08nbffqbveg00fer07g",
					"machines": [],
					"__v": 0,
					"targetName": "projects/cbatk6b9ub8ophfojf9g/devices/c08nbffqbveg00fer07g"
				}
			],
			"_id": "64827fc29a9c8e5390291339",
			"buildingId": "6480e9b116e6088380430b97",
			"sourceAPI": "DisruptiveTechnologies",
			"location": "Building Assure Suite",
			"__v": 19
		}
	],
	"_id": "6480e9b116e6088380430b97"
}
*/
router.get("/building/:buildingId/sensors", deviceDao.getDevicesByBuildingId);

//router.get("/building/:buildingId")


/**
 * @api {post} /api/devices/sensor Create a sensor
 * @apiDescription Must be creating under a building gateway context. Meaning that the gateway must
 * be created first, and the created sensor must bind to a gateway created.
 * 
 * loggerType must should conform to one of the log types (consumptionLogger, environmentalLogger, etc.)
 * 
 * DT devices have different required fields as compared to Paragon and Ambient weather
 * devices. Make sure to check the example bodies to get these fields.
 * 
 * Requires a token.
 * 
 * 
 * @apiName device_createSensor
 * @apiGroup Devices
 * 
 * @apiHeader {Cookie} access_token Token stored in cookie upon signin
 * @apiBody {ObjectId} gatewayId
 * @apiBody {String} loggerType A standardized value that should be one of the logger types.
 * [consumptionLogger, environmentalLogger, eventLogger, gatewayLogger, utilityMeter, ambientWeather, HVACLogger]
 * 
 * @apiExample {json} Paragon Device
 * {
	"gatewayId": "64827fc29a9c8e5390291339",
	"loggerType": "utilityLogger",
	"location": {
		"data": "BApbc Lab Utilities"
	},
	"deviceSource": "ParagonRobotics",
	"device": "BApbc Lab Utility Sensors",
	"deviceModel": "DB14",
	"devicePath": "/company/paragonrobotics.com/device/transform/20102/1/842",
	"machines": [
    {
      "sensorType": "gasMeter",
      "sensorPath": "/machine/3/value"
    },
    {
      "sensorType": "waterMeter",
      "sensorPath": "/machine/13/value"
    }
]
}
 * 
 * @apiExample {json} DT Device:
 * {
	"gatewayId": "64827fc29a9c8e5390291339",
	"loggerType": "eventLogger",
	"location": {
		"data": "Water Sensor"
        // buildingId is not mutable via this route
	},
	"deviceSource": "DisruptiveTechnologies",
	"projectId": "cbatk6b9ub8ophfojf9g",
	"sensorId": "bv91hic2ven000chahvg"
}
 * 
 * @apiSuccessExample Success-Response:
 * HTTP:/1.1 200 OK
 * {
	"_id": "6483d46c1fcfd54aac8358de",
	"location": {
		"buildingId": "6480e9b116e6088380430b97",
		"data": "Water Sensor"
	},
	"targetName": "projects/cbatk6b9ub8ophfojf9g/devices/bv91hic2ven000chahvg",
	"gatewayId": "64827fc29a9c8e5390291339",
	"loggerType": "eventLogger",
	"DUID": "D-000000017",
	"deviceSource": "DisruptiveTechnologies",
	"projectId": "cbatk6b9ub8ophfojf9g",
	"sensorId": "bv91hic2ven000chahvg",
	"machines": [],
	"__v": 0
}
*/
router.post("/sensor",authenticateToken, deviceDao.createSensor);


/**
 * @api {put} /api/devices/sensor/:sensorId
 * @apiDescription Certain fields are immutable and will return an error response when mutation is attempted.
 * Token is required
 * @apiName device_updateSensor
 * @apiGroup Devices
 * 
 * @apiHeader {Cookie} access_token Token stored in cookie upon signin
 * @apiParam {ObjectId} sensorId
 * 
 * @apiSuccessExample Success-Response:
 * HTTP:/1.1 200 OK
 * {
	"location": {
		"buildingId": "6480e9b116e6088380430b97",
		"data": "Emulated"
	},
	"_id": "6483943e13ee8643641fc61c",
	"gatewayId": "64827fc29a9c8e5390291339",
	"loggerType": "eventLogger",
	"DUID": "D-000000000",
	"deviceSource": "DisruptiveTechnologies",
	"projectId": "cbatk6b9ub8ophfojf9g",
	"sensorId": "emuchsfbq502mekb4p41u7g",
	"machines": [],
	"__v": 0,
	"targetName": "projects/cbatk6b9ub8ophfojf9g/devices/emuchsfbq502mekb4p41u7g"
}
*/
router.put("/sensor/:sensorId", authenticateToken, deviceDao.updateSensor);


/**
 * @api {delete} /api/devices/sensor
 * @apiDescription Requires a token
 * @apiName device_deleteSensor
 * @apiGroup Devices
 * 
 * @apiHeader {Cookie} access_token Token stored in cookie upon signin
 * @apiBody {ObjectId} sensorId
 * 
 * @apiSuccess {Object} removedSensor The sensor that was deleted
 * @apiSuccess {Object} modifiedGatewayDevices The updated gateway that the deleted device was
 * a child of
 * 
 * @apiSuccessExample Success-Response:
 * HTTP:/1.1 200 OK
 * {
	"removedSensor": {
		"location": {
			"buildingId": "6480e9b116e6088380430b97",
			"data": "BApbc Lab Utilities"
		},
		"_id": "64839ff9b3d18620a0630769",
		"gatewayId": "64827fc29a9c8e5390291339",
		"loggerType": "utility",
		"DUID": "D-000000007",
		"deviceSource": "ParagonRobotics",
		"device": "BApbc Lab Utility Sensors",
		"deviceModel": "DB14",
		"devicePath": "/company/paragonrobotics.com/device/transform/20102/1/842",
		"machines": [
			{
				"sensorType": "gasMeter",
				"sensorPath": "/machine/3/value"
			},
			{
				"sensorType": "waterMeter",
				"sensorPath": "/machine/13/value"
			}
		],
		"__v": 0
	},
	"modifiedGatewayDevices": [
		"6483903cf8155471dc7ed358"
    ]
}
*/
router.delete("/sensor", authenticateToken, deviceDao.deleteSensor)


/**
 * @api {get} /api/devices/sensor
 * @apiName device_getSensor
 * @apiGroup Devices
 * 
 * @apiBody {ObjectId} sensorId
 * 
 * @apiSuccessExample Success-Response:
 * HTTP:/1.1 200 OK
 * {
	"location": {
		"buildingId": "6480e9b116e6088380430b97",
		"data": "Office Motion Detector"
	},
	"_id": "6483938713ee8643641fc60c",
	"gatewayId": "64827fc29a9c8e5390291339",
	"loggerType": "eventLogger",
	"DUID": "D-000000014",
	"deviceSource": "DisruptiveTechnologies",
	"projectId": "cbatk6b9ub8ophfojf9g",
	"sensorId": "ceuhka0jrpfg00amr1eg",
	"machines": [],
	"__v": 0,
	"targetName": "projects/cbatk6b9ub8ophfojf9g/devices/ceuhka0jrpfg00amr1eg"
}
*/
router.get("/sensor/:sensorId", deviceDao.getSensor);


/**
 * @api {get} /api/devices/dt/sensor
 * @apiDescription Exclusive to DT devices. They all have a targetName which includes the 
 * projectId and deviceId put into a url string.
 * 
 * @apiName device_getSensorByTargetName
 * @apiGroup Devices
 * 
 * @apiBody {String} targetName
 * 
 * @apiSuccessExample Success-Response:
 * HTTP:/1.1 200 OK
 * {
	"location": {
		"buildingId": "6480e9b116e6088380430b97",
		"data": "Water Sensor"
	},
	"_id": "6483d46c1fcfd54aac8358de",
	"targetName": "projects/cbatk6b9ub8ophfojf9g/devices/bv91hic2ven000chahvg",
	"gatewayId": "64827fc29a9c8e5390291339",
	"loggerType": "eventLogger",
	"DUID": "D-000000017",
	"deviceSource": "DisruptiveTechnologies",
	"projectId": "cbatk6b9ub8ophfojf9g",
	"sensorId": "bv91hic2ven000chahvg",
	"machines": [],
	"__v": 0
}
*/
router.get("/dt/sensor/", deviceDao.getSensorByTargetName)

// requires two query parameters: token and macaddress
router.get("/va/sensor", deviceDao.getVataverksSensorByToken)

router.get("/ee/sensor", deviceDao.getEmporiaSensor);


module.exports = router;


