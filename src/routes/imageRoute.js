const router = require("express").Router();
const authenticateToken = require("../utils/authentication");
const imageDao = require("../dao/imageDao");

// requires multipart/form-data (image - file upload, assetId - string)
/**
 * @api {post} /api/images/asset Upload asset image 
 * @apiDescription Upload a new image for an asset. Requires multipart/form-data (image - file upload, assetId - string)
 * @apiName image_uploadAssetImage
 * @apiGroup Images
 * 
 * @apiBody {ObjectId} assetId Asset's _id
 * @apiBody {File} image Image file 
 * @apiHeader {Cookie} access_token User token in cookie stored upon sign-in
 * 
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
	"success": true,
	"message": "Image uploaded successfully",
	"url": "https://buildingalertsstorage.blob.core.windows.net/assetimages/asset_64b9fa8a62c45e883a08e385_78047bf0-2818-11ee-8056-fd0f0f597ed2.JPG"
}
 * 
*/
router.post("/asset", authenticateToken, imageDao.uploadAssetImage);

/**
 * @api {get} /api/images/asset/:assetId Get asset image 
 * @apiDescription Get asset images by assetId
 * @apiName image_getAssetImage
 * @apiGroup Images
 * 
 * @apiParam {ObjectId} assetId Asset's _id 
 * @apiHeader {Cookie} access_token User token in cookie stored upon sign-in
 * 
 * @apiSuccess {Array} images Array of image urls
 * 
*/
router.get("/asset/:assetId", authenticateToken, imageDao.getAssetImage);

/**
 * @api {delete} /api/images/asset Delete asset image  
 * @apiDescription Delete an asset's image
 * @apiName image_deleteAssetImage
 * @apiGroup Images
 * 
 * @apiBody {String} blobname The blobname of the image to delete (i.e. asset_64b9fa8a62c45e883a08e385_78047bf0-2818-11ee-8056-fd0f0f597ed2.JPG) 
 * @apiHeader {Cookie} access_token User token in cookie stored upon sign-in
 * 
*/
router.delete("/asset", authenticateToken, imageDao.deleteAssetImage);

module.exports = router;