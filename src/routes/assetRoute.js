const express = require("express");
const LOGGER = require('../logger/logger');
const authenticateToken = require("../utils/authentication")

const assetDao = require('../dao/assetDao');
const router = express.Router();


/**
 * @api {post} /api/assets/create Create Asset
 * @apiDescription Use to create a new asset. Requires authentication token.
 * @apiName asset_createAsset
 * @apiGroup Assets
 *
 * @apiHeader {Cookie} access_token User token in cookie stored upon sign-in
 *
 * @apiBody {String} buildingId The ID of the building where the asset will be associated.
 * @apiBody {String} assetType The type of the asset (water, gas, electric, HVAC, thermostat, other).
 * @apiBody {String} location The location of the asset.
 * 
 * @apiBody {String} name 
 *
 * @apiSuccess {Object} Asset The newly created asset.
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
	"images": [],
	"supportedSuites": [],
	"_id": "649f834bcbf7a978ac2c5b01",
	"buildingId": "6480e9b116e6088380430b97",
	"assetType": "water",
	"name": "Water pump",
	"location": "Basement",
	"__v": 0
}
 */
router.post("/create", authenticateToken, assetDao.createAsset);


/**
 * @api {put} /api/assets/:assetId Update Asset
 * @apiDescription Use to update an asset. Requires authentication token.
 * @apiName asset_updateAsset
 * @apiGroup Assets
 *
 * @apiHeader {Cookie} access_token User token in cookie stored upon sign-in
 *
 * @apiParam {String} assetId The id of the asset to update.
 *
 * @apiSuccess {Object} Asset The newly created asset.
 */
router.put("/:assetId", authenticateToken, assetDao.updateAsset);

/**
 * @api {delete} /api/assets/:assetId Delete asset
 * @apiDescription Use to delete an asset. Requires authentication token.
 * @apiName asset_deleteAsset
 * @apiGroup Assets
 *
 * @apiHeader {Cookie} access_token User token in cookie stored upon sign-in
 *
 * @apiParam {ObjectId} assetId The id of the asset to delete.
 * 
 * @apiSuccess {Object} updatedAssetList The updated list of assets present in the building
 * @apiSuccess {Object} deletedAsset The deleted asset
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
	"updatedAssetList": {
		"electricAssets": [],
		"gasAssets": [],
		"waterAssets": [],
		"HVACAssets": [],
		"thermostatAssets": []
	},
	"deletedAsset": {
		"images": [],
		"supportedSuites": [],
		"_id": "649f834bcbf7a978ac2c5b01",
		"buildingId": "6480e9b116e6088380430b97",
		"assetType": "water",
		"name": "Water pump",
		"location": "Basement",
		"__v": 0
	}
}
 */
router.delete("/:assetId", authenticateToken, assetDao.deleteAsset);


/**
 * @api {get} /api/assets/:assetId Get asset
 * @apiName asset_getAsset
 * @apiGroup Assets
 *
 * @apiParam {ObjectId} assetId The id of the asset
 */
router.get("/:assetId", assetDao.getAsset);

/**
 * @api {get} /api/assets/building/:buildingId Get a buildings assets
 * @apiDescription Use to get all the assets. Use query "grouped=true" to 
 * group the assets by type. Requires authentication token.
 * @apiName asset_getAssetsByBuildingId
 * @apiGroup Assets
 *
 * @apiHeader {Cookie} access_token User token in cookie stored upon sign-in
 *
 * @apiParam {ObjectId} buildingId
 * @apiQuery {Boolean} [grouped] If true, the assets will be grouped by type
 * 
 * @apiSuccess {Array} assets If no grouping, an array of assets associated with the building
 * @apiSuccess {Object} assetData If grouped, an object with assets separated by type
 * 
 * 
 * @apiSuccessExample Ungrouped Success-Response:
 * HTTP/1.1 200 OK
 * [
	{
		"images": [],
		"supportedSuites": [],
		"_id": "648c08fe174c3827944c4ffd",
		"name": "test asset",
		"buildingId": "648c07a594010c3228dc4842",
		"assetType": "water",
		"__v": 0
	},
	{
		"images": [],
		"supportedSuites": [],
		"_id": "648c0b777bdfd77484968902",
		"name": "test asset",
		"buildingId": "648c07a594010c3228dc4842",
		"assetType": "water",
		"__v": 0
	},
	{
		"images": [],
		"supportedSuites": [],
		"_id": "648c0b847bdfd77484968906",
		"name": "test asset",
		"buildingId": "648c07a594010c3228dc4842",
		"assetType": "water",
		"__v": 0
	},
	{
		"images": [],
		"supportedSuites": [],
		"_id": "648c0b997bdfd7748496890a",
		"name": "test asset 3",
		"buildingId": "648c07a594010c3228dc4842",
		"assetType": "HVAC",
		"__v": 0
	}
]
 *
 * @apiSuccessExample Grouped Success-Response:
 * HTTP/1.1 200 OK
 * {
	"assetData": {
		"electricAssets": [
			{
				"images": [],
				"supportedSuites": [],
				"_id": "648c08fe174c3827944c4ffd",
				"name": "test asset",
				"buildingId": "648c07a594010c3228dc4842",
				"assetType": "water",
				"__v": 0
			}
		],
		"gasAssets": [],
		"waterAssets": [
			{
				"images": [],
				"supportedSuites": [],
				"_id": "648c0b777bdfd77484968902",
				"name": "test asset",
				"buildingId": "648c07a594010c3228dc4842",
				"assetType": "water",
				"__v": 0
			}
		],
		"HVACAssets": [
			{
				"images": [],
				"supportedSuites": [],
				"_id": "648c0b997bdfd7748496890a",
				"name": "test asset 3",
				"buildingId": "648c07a594010c3228dc4842",
				"assetType": "HVAC",
				"__v": 0
			}
		],
		"thermostatAssets": []
	},
	"_id": "648c07a594010c3228dc4842"
}
 */
router.get("/building/:buildingId", assetDao.getAssetsByBuildingId);




module.exports = router;