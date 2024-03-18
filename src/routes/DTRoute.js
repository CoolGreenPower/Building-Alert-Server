const express = require("express");
const { authenticateToken } = require('../utils/authentication')
const LOGGER = require('../logger/logger')

const DTDao = require('../dao/DTDao');

const router = express.Router();

/**
 * 
 * 
 * 
 * DT routes are deprecated
 * 
 * 
 * 
 * 
 */

/**
 * @api {get} /api/dt Get a number of latest entries
 * @apiName DT_getAllLatest
 * @apiGroup _Deprecated
 * 
 * @apiQuery {String} projectID The project id of the building
 * @apiBody {Number} [count] The number of queries to receive. Defaults to 1
 * 
 * @apiSuccessExample Success-Response:
 * HTTP:/1.1 200 OK
 * {
	"environmentalLogger": [],
	"eventLogger": [],
	"gateway": [],
	"consumptionLogger": []
}
 */
router.get('/', DTDao.getAllLatest);


/**
 * @api {get} /api/dt/all Get all DT logs of building
 * @apiName DT_getAll
 * @apiDescription WARNING: As more datapoints are inserted, the slower this becomes and will eventually be deprecated
 * @apiGroup _Deprecated
 * 
 * @apiQuery {String} projectID The project id of the building
 * 
 * @apiSuccessExample Success-Response:
 * HTTP:/1.1 200 OK
 * {
	"environmentalLogger": [],
	"eventLogger": [],
	"gateway": [],
	"consumptionLogger": []
}
 */
router.get('/all', DTDao.getAll);


/**
 * Returns data points for given project within two dates
 * @param {string} projectID (query) - Parameter for project id
 * @param {string} pastTime (body) - Past time in ISO string format
 * @param {string} futureTime (body) - Future time in ISO string format
 */
/**
 * @api {get} /api/dt/range Request all DT logs of a project in a given time range
 * @apiName DT_getAllInRange
 * @apiGroup _Deprecated
 * 
 * @apiQuery {String} projectID The project id of the building
 * @apiBody {String} Past time in ISO string format
 * @apiBody {String} Future time in ISO string format
 * 
 * @apiSuccessExample Success-Response:
 * HTTP:/1.1 200 OK
 * {
	"environmentalLogger": [],
	"eventLogger": [],
	"gateway": [],
	"consumptionLogger": []
}
 */
router.get('/range', DTDao.getAllInRange)


module.exports = router;
