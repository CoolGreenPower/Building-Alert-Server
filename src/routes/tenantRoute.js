const router = require('express').Router()
const TenantDao = require("../dao/tenantDao");
const authenticateToken = require("../utils/authentication");

/**
 * NOTE: Referring to "tenant" means the business that occupies a suite. 
 * When referring to the people in the suite, they are simply just the users and not "tenants"
 * 
 * This route collection incorporates both tenant and suites as they are closely related
 */



// get a tenant
/**
 * @api {get} /api/tenants/:tenantId Get tenant by id
 * @apiDescription Retrieves tenant info and is filtered depending on the user's permissions.
 * The request must come from a user that is part of the tenant (whether the building owner or a tenant user)
 * @apiName tenant_getTenantById
 * @apiGroup Tenants
 * 
 * @apiParam {ObjectId} tenantId The tenant id
 * 
 * @apiSuccess {Object} Tenant info
 * 
 * @apiSuccessExample Owner Success-Response:
 * HTTP:/1.1 200 OK
 * {
	"users": [
		{
			"username": "testuser",
			"name": "tester",
			"role": "owner"
		},
		{
			"username": "testingemail",
			"name": "emailtest",
			"role": "tenant"
		}
	],
	"_id": "649cd6ff98c1b782f47fcf93",
	"suiteId": "649bac511f0ba91aa42aaccd",
	"name": "An Office Business",
	"buildingId": "6480e9b116e6088380430b97",
	"__v": 0,
	"inviteCode": null
}
 * 
@apiSuccessExample Tenant Success-Response:
    * HTTP:/1.1 200 OK
{
	"name": "An Office Business",
	"users": [
		{
			"username": "testuser",
			"name": "tester",
			"role": "owner"
		},
		{
			"username": "testingemail",
			"name": "emailtest",
			"role": "tenant"
		}
	]
}
 * 
*/
router.get('/:tenantId', authenticateToken, TenantDao.getTenantById);

/**
 * @api {get} /api/tenants/building/:buildingId Get tenants by building id 
 * @apiDescription Get all tenants of a building. Only available to building owners or property managers.
 * @apiName tenant_getBuildingTenants
 * @apiGroup Tenants
 * 
 * @apiParam {ObjectId} buildingId The building id 
 * @apiHeader {Cookie} access_token User token in cookie stored upon sign-in
 * 
 * @apiSuccessExample Success-Response:
 * HTTP:/1.1 200 OK
 * [
	{
		"_id": "649cd6ff98c1b782f47fcf93",
		"users": [
			"6488d8b16f3521635cc095d9",
			"64adb7d6a09bdf0669b9a18a"
		],
		"suiteId": "649bac511f0ba91aa42aaccd",
		"name": "An Office Business 2",
		"buildingId": "6480e9b116e6088380430b97",
		"__v": 0,
		"inviteCode": "c7e21420"
	},
	{
		"_id": "64c3559a3f4049836553161d",
		"name": "An Office Business 20",
		"buildingId": "6480e9b116e6088380430b97",
		"suiteId": "64c354cabcd8699ea34ca78c",
		"users": [
			"6488d8b16f3521635cc095d9",
			"64ac6e8636f91b0050ccc363",
			"6488d8b16f3521635cc095d9"
		],
		"__v": 0
	}
]
*/
router.get("/building/:buildingId", authenticateToken, TenantDao.getBuildingTenants);

/**
 * @api {post} /api/tenants Create a tenant
 * @apiName tenant_createTenant
 * @apiGroup Tenants
 * @apiDescription Requires user to be the owner of the suite that the tenant is being added to
 * 
 * @apiSuccess {Object} tenant
 * @apiSuccess {Object} modifiedSuite
 * 
 * @apiBody {ObjectId} suiteId The physical suite to add the tenant to
 * @apiHeader {Cookie} access_token User token in cookie stored upon sign-in
 * 
 * @apiExample {json} Example body:
 * {
	"suiteId": "649bac511f0ba91aa42aaccd",
	"name": "An Office Business"
}
 * 
*/
router.post("/", authenticateToken, TenantDao.createTenant);

/**
 * @api {post} /api/tenants/invite/code Create an invite code for a tenant
 * @apiName tenant_createInviteCode
 * @apiGroup Tenants
 * @apiDescription Requires user to be the owner of the suite that the tenant is being added to
 * 
 * @apiSuccess {String} message
 * @apiSuccess {String} inviteCode
 * 
 * @apiBody {ObjectId} tenantId The tenant to create the invite code for
 * @apiHeader {Cookie} access_token User token in cookie stored upon sign-in
 * 
 * @apiSuccessExample Success-Response:
 * HTTP:/1.1 200 OK
 * {
	"message": "Created invite code for An Office Business",
	"inviteCode": "85b365da"
}
 * 
*/
router.post("/invite/code", authenticateToken, TenantDao.createInviteCode);

/**
 * @api {delete} /api/tenants/invite/code Delete an invite code for a tenant
 * @apiName tenant_createInviteCode
 * @apiGroup Tenants
 * @apiDescription Requires user to be the owner of the suite that the tenant is 
 * of the tenant that the user is being added to.
 * 
 * @apiSuccess {String} message
 * @apiSuccess {String} inviteCode (null)
 * 
 * @apiBody {ObjectId} tenantId The tenant to create the invite code for
 * @apiHeader {Cookie} access_token User token in cookie stored upon sign-in
 * 
 * @apiSuccessExample Success-Response:
 * HTTP:/1.1 200 OK
 * {
	"message": "Deleted invite code for An Office Business",
	"inviteCode": null
}
 * 
*/
router.delete("/invite/code", authenticateToken, TenantDao.deleteInviteCode);

// requires building owner or property manager, also added user email / username
/**
 * @api {put} /api/tenants/invite/adduser/:tenantId Directly invite user to tenant
 * @apiName tenant_addUserToTenant
 * @apiGroup Tenants
 * @apiDescription Creates an invite in the other user's account. The other user must
 * be registered.
 * 
 * Requires user to be the owner or property manager 
 * of the tenant that the user is being added to
 * 
 * 
 * @apiParam {ObjectId} tenantId The tenant to create the invite code for
 * @apiBody {String} [email] Optional if username is provided
 * @apiBody {String} [username] Optional if email is provided
 * @apiHeader {Cookie} access_token User token in cookie stored upon sign-in
 * 
 * 
*/
router.put("/invite/adduser/:tenantId", authenticateToken, TenantDao.addUserToTenant);

// requires building owner or property manager, also removed user email / username,
// also optional, role
/**
 * @api {put} /api/tenants/invite/removeuser/:tenantId Remove user from tenant
 * @apiName tenant_removeUserFromTenant
 * @apiGroup Tenants
 * @apiDescription Requires user to be the owner of the suite that the tenant is 
 * of the tenant that the user is being removed from.
 * 
 * @apiParam {ObjectId} tenantId The tenant to create the invite code for
 * @apiBody {ObjectId} userId The user to remove from the tenant
 * @apiHeader {Cookie} access_token User token in cookie stored upon sign-in
 * 
 * 
*/
router.put("/invite/removeuser/:tenantId", authenticateToken, TenantDao.removeUserFromTenant)

/**
 * @api {get} /api/tenants/invite/:tenantId Get all invites that a tenant has
 * @apiDescription Requires user to be the owner of the tenant. 
 * @apiName tenant_getAllTenantsInvites
 * @apiGroup Tenants
 * 
 * @apiParam {ObjectId} tenantId The tenant id
 * 
 * @apiSuccess {Object} Tenant info
 * 
*/
router.get("/invite/:tenantId", authenticateToken, TenantDao.getAllInvites);

/**
 * @api {delete} /api/tenants/invite/delete/:inviteId Delete an invite for a tenant
 * @apiName tenant_deleteInvite
 * @apiGroup Tenants
 * @apiDescription Requires user to be the owner of the suite that the tenant is 
 * of the tenant that the user is being added to.
 * 
 * @apiSuccess {String} message
 * @apiSuccess {String} deletedInvite
 * 
 * @apiParam {ObjectId} inviteId The inviteId of the tenant to delete
 * @apiHeader {Cookie} access_token User token in cookie stored upon sign-in
 * 
 * @apiSuccessExample Success-Response:
 * HTTP:/1.1 200 OK
 * {
	"message": "Invite deleted",
	"deletedInvite": {
		"data": {
			"role": "tenant",
			"tenantId": "649cd6ff98c1b782f47fcf93"
		},
		"_id": "64a77b33e615945ed874b2b2",
		"from": "6488d8b16f3521635cc095d9",
		"to": "64a5f01690a39b80f848a55d",
		"inviteType": "tenant",
		"createdAt": "2023-07-07T02:40:51.637Z",
		"__v": 0
	}
}
 * 
*/
router.delete("/invite/delete/:inviteId", authenticateToken, TenantDao.deleteInvite);

// requires building owner or property manager
/**
 * @api {put} /api/tenant/:tenantId Update a tenant
 * @apiName tenant_updateTenant
 * @apiGroup Tenants
 * @apiDescription Requires user to be the building owner. Certain fields are immutable through
 * this endpoint such as "users", "inviteCode", "buildingId", "suiteId".
 * 
 * @apiSuccess {ObjectId} Updated tenant
 * 
 * @apiParam {ObjectId} tenantId The tenant to create the invite code for
 * @apiHeader {Cookie} access_token User token in cookie stored upon sign-in
 * 
 * @apiSuccessExample Success-Response:
 * HTTP:/1.1 200 OK
 * {
	"users": [
		"6488d8b16f3521635cc095d9",
		"6489431aac181032d8f4e3bd"
	],
	"_id": "649cd6ff98c1b782f47fcf93",
	"suiteId": "649bac511f0ba91aa42aaccd",
	"name": "An Office Business 2",
	"buildingId": "6480e9b116e6088380430b97",
	"__v": 0,
	"inviteCode": null
}
*/
router.put("/:tenantId", authenticateToken, TenantDao.updateTenant);

// requires building owner
/**
 * @api {delete} /api/tenant/:tenantId Delete a tenant
 * @apiName tenant_deleteTenant
 * @apiGroup Tenants
 * @apiDescription Requires user to be the building owner. 
 * 
 * @apiSuccess {ObjectId} deletedTenant
 * @apiSuccess {ObjectId} modifiedSuite
 * 
 * @apiParam {ObjectId} tenantId The tenant to delete
 * @apiHeader {Cookie} access_token User token in cookie stored upon sign-in
 * 
*/
router.delete("/:tenantId", authenticateToken, TenantDao.deleteTenant);

/**
 * @api {post} /api/tenants/suite/addtenant Add tenant to suite 
 * @apiDescription Add a tenant to a suite.
 * @apiName tenant_addTenantToSuite
 * @apiGroup Tenants
 * 
 * @apiBody {ObjectId} tenantId The tenant to add to the suite
 * @apiBody {ObjectId} suiteId The suite to add the tenant to  
 * @apiHeader {Cookie} access_token User token in cookie stored upon sign-in
 * 
 * @apiSuccessExample Success-Response:
 * HTTP:/1.1 200 OK
*/
router.post("/suite/addtenant", authenticateToken, TenantDao.addTenantToSuite);

/**
 * @api {delete} /api/tenants/suite/removetenant Remove tenant from suite 
 * @apiDescription Remove tenant from suite
 * @apiName tenant_removeTenantFromSuite
 * @apiGroup Tenants
 * 
 * @apiBody {ObjectId} suiteId The suite to remove the tenant from
 * @apiHeader {Cookie} access_token User token in cookie stored upon sign-in
*/
router.delete("/suite/removetenant", authenticateToken, TenantDao.removeTenantFromSuite)

module.exports = router;



