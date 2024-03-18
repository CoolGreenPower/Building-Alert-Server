const router = require('express').Router();
const authenticateToken = require("../utils/authentication");
const SuiteDao = require("../dao/suiteDao");



/**
 * @api {get} /api/suite/:suiteId Get suite by (ObjectId) suite id
 * @apiName suite_getSuiteById
 * @apiGroup Data
 * 
 * @apiExample Example:
 *  http://baseurl.com/api/data/environment?buildingId=647a5ed5f5dedd65049a12ca
 * 
 * 
 * @apiParam {ObjectId} suiteId
 * 
 * @apiSuccess {Object} suite
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
router.get('/:suiteId', SuiteDao.getSuiteById);

// requires building id body,
// returns createdSuite and modifiedBuildingSuites
router.post("/", authenticateToken, SuiteDao.createSuite);

router.put("/:suiteId", authenticateToken, SuiteDao.updateSuite);

router.delete("/:suiteId", authenticateToken, SuiteDao.deleteSuite);

router.get("/building/:buildingId", authenticateToken, SuiteDao.getSuitesByBuildingId);

module.exports = router;
