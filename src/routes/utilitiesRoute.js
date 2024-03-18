const router = require('express').Router()
const authenticateToken = require('../utils/authentication')
const utilitiesDao = require('../dao/utilitiesDao')


// requires authentication
/**
 * @api {get} /api/utilities/:id Get a utility bill
 * @apiName utilities_getBill
 * @apiGroup Utilities
 * @apiDescription Requires auth cookie
 * 
 * @apiSuccess {Object} Bill
 * 
 * @apiParam {ObjectId} id The utility id 
 * @apiHeader {Cookie} access_token User token in cookie stored upon sign-in
 * 
 * @apiSuccessExample Success-Response:
 * HTTP:/1.1 200 OK
 * {
	"location": {
		"buildingId": "6480e9b116e6088380430b97"
	},
	"_id": "649ca50b6049b92e8059611e",
	"startDate": "2023-04-12T21:20:00.000Z",
	"endDate": "2023-05-12T21:20:00.000Z",
	"type": "gas",
	"data": {
		"field1": "Whatfever",
		"field2": "Yes"
	},
	"createdAt": "2023-06-28T21:24:27.403Z",
	"__v": 0
}
 * 
*/
router.get("/:id", authenticateToken, utilitiesDao.getById);

/**
 * @api {get} /api/utilities/building/:buildingId Get all utility bills for a building 
 * @apiDescription Get historical utility bills for a building
 * @apiName utilities_getHistorical
 * @apiGroup Utilities
 * 
 * @apiParam {ObjectId} buildingId
 * @apiQuery {ISODate} [startDate] Filter start date, there must be an end date if start date is provided  
 * @apiQuery {ISODate} [endDate] Filter end date, there must be a start date if end date is provided
 * @apiQuery {String} [type] Filter by utility type (i.e. gas, water, electricity, misc)
 * @apiHeader {Cookie} access_token User token in cookie stored upon sign-in
 * 
 * @apiSuccessExample Success-Response:
 * HTTP:/1.1 200 OK
 * [
	{
		"location": {
			"buildingId": "6480e9b116e6088380430b97"
		},
		"_id": "649ca5256049b92e80596121",
		"startDate": "2023-05-13T21:20:00.000Z",
		"endDate": "2023-06-13T21:20:00.000Z",
		"type": "water",
		"data": {
			"field1": "Whatfever",
			"field2": "Yes"
		},
		"createdAt": "2023-06-28T21:24:53.067Z",
		"__v": 0
	},
	{
		"location": {
			"buildingId": "6480e9b116e6088380430b97"
		},
		"_id": "649ca63d8e3e2f6498f2212b",
		"createdAt": "2023-06-28T21:29:33.929Z",
		"startDate": "2023-05-13T21:20:00.000Z",
		"endDate": "2023-06-13T21:20:00.000Z",
		"type": "water",
		"data": {
			"field1": "Whatfever",
			"field2": "Yes"
		},
		"__v": 0
	}
]
*/
router.get("/historical/:buildingId", authenticateToken, utilitiesDao.getHistorical);

// requires building id in body
/**
 * @api {post} /api/utilities Create a utility bill  
 * @apiDescription Create bill
 * @apiName utility_createBill
 * @apiGroup Utilities
 * 
 * @apiBody {ObjectId} buildingId The building id
 * @apiBody {ISODate} [startDate] The start date of the bill
 * @apiBody {ISODate} [endDate] The end date of the bill 
 * @apiBody {String} [type] The type of utility (i.e. gas, water, electricity, misc)
 * @apiBody {Object} [data] The data for the bill. Can be any fields
 * @apiHeader {Cookie} access_token User token in cookie stored upon sign-in
 * 
 * @apiSuccessExample Success-Response:
 * HTTP:/1.1 200 OK
 * {
	"_id": "649ca6738e3e2f6498f2212e",
	"createdAt": "2023-06-28T21:30:27.676Z",
	"type": "gas",
	"data": {
		"field1": "Whatfever",
		"field2": "Yes"
	},
	"startDate": null,
	"endDate": null,
	"location": {
		"buildingId": "6480e9b116e6088380430b97"
	},
	"__v": 0
}
*/
router.post("/", authenticateToken, utilitiesDao.createBill);

/**
 * @api {put} /api/utilities/:id Update a utility bill  
 * @apiDescription Update utility bill
 * @apiName utility_updateBill
 * @apiGroup Utilities
 * 
 * @apiParam {ObjectId} id The utility id 
 * @apiHeader {Cookie} access_token User token in cookie stored upon sign-in
 * 
*/
router.put("/:id", authenticateToken, utilitiesDao.updateBill);

/**
 * @api {delete} /api/utilities/:id Delete a utility bill  
 * @apiDescription Delete utility bill
 * @apiName utility_deleteBill
 * @apiGroup Utilities
 * 
 * @apiParam {ObjectId} id The utility id 
 * @apiHeader {Cookie} access_token User token in cookie stored upon sign-in
 * 
 * @apiSuccess {Object} Deleted bill
*/
router.delete("/:id", authenticateToken, utilitiesDao.deleteBill);


module.exports = router;