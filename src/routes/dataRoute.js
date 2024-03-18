const express = require("express");
const { authenticateToken } = require('../utils/authentication')
const LOGGER = require('../logger/logger')

const dataDao = require('../dao/dataDao');

const router = express.Router();

// requires building id query
// optional count in body
// returns latest entries with first value being the latest

/**
 * @api {get} /api/data/consumption Get latest consumption logs by (ObjectId) building id
 * @apiName data_getConsumption
 * @apiGroup Data
 * 
 * @apiExample Example:
 *  http://baseurl.com/api/data/consumption?buildingId=647a5ed5f5dedd65049a12ca
 * 
 * @apiQuery {ObjectId} buildingId
 * @apiBody {Number} [count]
 * 
 * @apiSuccess {Array} Array
 * 
 * @apiSuccessExample Success-Response:
 * HTTP:/1.1 200 OK
 * [
	{
		"_id": "647e7d7491c65148db253826",
		"AC_current": 1.61,
		"sourceAPI": "Paragon Robotics",
		"location": "Building Assure Chandler Arizona",
		"timestamp": "2023-06-06T00:27:31.214Z",
		"buildingId": "647a5ed5f5dedd65049a12ca",
		"deviceModel": "DB1",
		"deviceName": "AC Unit CT Clamp"
	}
]
*/
router.get('/consumption', dataDao.getConsumptionData)


/**
 * @api {get} /api/data/environment Get latest environment logs by (ObjectId) building id
 * @apiName data_getEnvironment
 * @apiGroup Data
 * 
 * @apiExample Example:
 *  http://baseurl.com/api/data/environment?buildingId=647a5ed5f5dedd65049a12ca
 * 
 * @apiQuery {ObjectId} buildingId
 * @apiBody {Number} [count]
 * 
 * @apiSuccess {Array} Array
 * 
 * @apiSuccessExample Success-Response:
 * HTTP:/1.1 200 OK
 * [
	{
		"_id": "647a7dd79b9abc88030b94bb",
		"sourceAPI": "Disruptive Technologies",
		"targetName": "projects/cbatk6b9ub8ophfojf9g/devices/emuchsf8ut02mekb4p41rgg",
		"timestamp": "2023-06-02T23:40:07.525993Z",
		"projectID": "cbatk6b9ub8ophfojf9g",
		"loggerType": "humidityAndTemperature",
		"temperature": 27,
		"relativeHumidity": 31
	}
]
*/
router.get('/environment', dataDao.getEnvironmentalData)


/**
 * @api {get} /api/data/event Get latest event logs by (ObjectId) building id
 * @apiName data_getEvent
 * @apiGroup Data
 * 
 * @apiExample Example:
 *  http://baseurl.com/api/data/event?buildingId=647a5ed5f5dedd65049a12ca
 * 
 * @apiQuery {ObjectId} buildingId
 * @apiBody {Number} [count]
 * 
 * @apiSuccess {Array} Array
 * 
 * @apiSuccessExample Success-Response:
 * HTTP:/1.1 200 OK
 * [
	{
		"_id": "647e808b0f6921bcca661396",
		"sourceAPI": "Disruptive Technologies",
		"targetName": "projects/cbatk6b9ub8ophfojf9g/devices/emuchsfbq502mekb4p41u7g",
		"timestamp": "2023-06-06T00:40:42.997067Z",
		"projectID": "cbatk6b9ub8ophfojf9g",
		"eventType": "touch",
		"touch": "true"
	}
]
*/
router.get('/event', dataDao.getEventData)


/**
 * @api {get} /api/data/gateway Get latest gateway logs by (ObjectId) building id
 * @apiName data_getGateway
 * @apiGroup Data
 * 
 * @apiExample Example:
 *  http://baseurl.com/api/data/gateway?buildingId=647a5ed5f5dedd65049a12ca
 * 
 * @apiQuery {ObjectId} buildingId
 * @apiBody {Number} [count]
 * 
 * @apiSuccess {Array} Array
 * 
 * @apiSuccessExample Success-Response:
 * HTTP:/1.1 200 OK
 * [
	{
		"_id": "647e808ba946d1a6ab2d0925",
		"sourceAPI": "Disruptive Technologies",
		"targetName": "projects/cbatk6b9ub8ophfojf9g/devices/emuchsfbq502mekb4p41u7g",
		"timestamp": "2023-06-06T00:40:42.997067Z",
		"projectID": "cbatk6b9ub8ophfojf9g",
		"loggerType": "networkStatus",
		"networkStatus_rssi": -50,
		"networkStatus_signalStrength": 100
	}
]
*/
router.get('/gateway', dataDao.getGatewayData)


/**
 * @api {get} /api/data/utility Get latest utility logs by (ObjectId) building id
 * @apiName data_getUtility
 * @apiGroup Data
 * 
 * @apiExample Example:
 *  http://baseurl.com/api/data/utility?buildingId=647a5ed5f5dedd65049a12ca
 * 
 * @apiQuery {ObjectId} buildingId
 * @apiBody {Number} count
 * 
 * @apiSuccess {Array} Array
 * 
 * @apiSuccessExample Success-Response:
 * HTTP:/1.1 200 OK
 * [
	{
		"suitesSupported": [],
		"daysOfWeek": [],
		"_id": "647e7d7b538c0f23dbdae614",
		"gas_pulseCount": 0.32,
		"water_pulseCount": 1,
		"sourceAPI": "Paragon Robotics",
		"location": "Building Assure Chandler Arizona",
		"timestamp": "2023-06-06T00:27:37.865Z",
		"buildingId": "647a5ed5f5dedd65049a12ca",
		"deviceModel": "DB14",
		"deviceName": "BApbc Lab Controller Utilities"
	}
]
*/
router.get('/utility', dataDao.getUtilityData)

router.get('/utility/:id', dataDao.getUtilityById)


/**
 * @api {get} /api/data/hvac Get latest outdoor weather logs by (ObjectId) building id
 * @apiName data_getWeather
 * @apiGroup Data
 * 
 * @apiExample Example: 
 *  http://baseurl.com/api/data/hvac?buildingId=647a5ed5f5dedd65049a12ca
 * 
 * 
 * @apiQuery {ObjectId} buildingId
 * 
 * @apiSuccess {Array} Array
 * @apiBody {Number} count
 * 
 * @apiSuccessExample Success-Response:
 * HTTP:/1.1 200 OK
 * [
	{
		"_id": "647e7d7791c65148db2538d6",
		"temperature": 83.73,
		"humidity": 32.05,
		"usbPower": 1,
		"batteryVoltage": 5.07,
		"sourceAPI": "Paragon Robotics",
		"location": "Building Assure Chandler Arizona",
		"timestamp": "2023-06-06T00:27:34.466Z",
		"buildingId": "647a5ed5f5dedd65049a12ca",
		"deviceModel": "N20",
		"deviceName": "BApbc Lab Controller"
	},
	{
		"_id": "647e7d723f38819d39a42b23",
		"temperature": 103.5,
		"humidity": 3.88,
		"batteryVoltage": 4.7,
		"usbPower": 1,
		"sourceAPI": "Paragon Robotics",
		"location": "Building Assure Chandler Arizona",
		"timestamp": "2023-06-06T00:27:28.691Z",
		"buildingId": "647a5ed5f5dedd65049a12ca",
		"deviceModel": "N20",
		"deviceName": "Outdoor AC Unit"
	},
	{
		"_id": "647e7d6d3f38819d39a429a4",
		"returnAirTemp": 92.05,
		"supplyAirTemp": 89.8,
		"sourceAPI": "Paragon Robotics",
		"location": "Building Assure Chandler Arizona",
		"timestamp": "2023-06-06T00:27:23.778Z",
		"buildingId": "647a5ed5f5dedd65049a12ca",
		"deviceModel": "DB31",
		"deviceName": "HVAC Temp Probes"
	},
	{
		"_id": "647e7d6a3f38819d39a4287d",
		"temperature": 106.76,
		"humidity": 7.7,
		"batteryVoltage": 4.23,
		"usbPower": 1,
		"sourceAPI": "Paragon Robotics",
		"location": "Building Assure Chandler Arizona",
		"timestamp": "2023-06-06T00:27:20.692Z",
		"buildingId": "647a5ed5f5dedd65049a12ca",
		"deviceModel": "N20",
		"deviceName": "Attic HVAC Unit"
	},
]
*/
router.get('/hvac', dataDao.getHVACData)


router.get('/ambient', dataDao.getOutdoorData);

router.get('/vataverks', dataDao.receiveVataverksData);

module.exports = router



