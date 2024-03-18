const express = require("express");
const { authenticateToken } = require('../utils/authentication')
const LOGGER = require('../logger/logger')

const PRDao = require('../dao/PRDao');

const router = express.Router();


/**
 * 
 * 
 * 
 * PR routes are deprecated
 * 
 * 
 * 
 * 
 */


/**
 * @api {get} /api/pr Get a number of latest entries
 * @apiName PR_getAllLatest
 * @apiGroup _Deprecated
 * 
 * @apiQuery {ObjectId} Building id (BUID)
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
router.get('/', PRDao.getAllLatestByBUID);


// get entries from time A to time B

module.exports = router;
