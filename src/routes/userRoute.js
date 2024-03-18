const router = require('express').Router()
const LOGGER = require('../logger/logger')
const authenticateToken = require('../utils/authentication')
const requireAdmin = require('../utils/requireAdmin')
const UserDao = require('../dao/userDao')

const FILE_NAME = 'userRoute.js'

// user creation is within the auth.js route

// update user

/**
 * @api {put} /api/users/:id Update user by (ObjectId) user id 
 * @apiDescription Update the user's info. Does not allow you to update certain fields such as buildings, tenants, or verified status.
 * 
 * @apiName user_updateUser
 * @apiGroup Users
 * 
 * @apiParam {ObjectId} id User's _id
 * @apiHeader {Cookie} access_token User token in cookie stored upon sign-in
 * 
 * @apiSuccess {Object} updatedUser
*/
router.put("/:id", authenticateToken, UserDao.updateUser);

// delete
router.delete("/:id", authenticateToken, UserDao.deleteUser);

// requires admin privileges
router.get("/", authenticateToken, requireAdmin, UserDao.getAll);

// requires :id, query param populate=true is optional
/**
 * @api {get} /api/users/:id Get user by (ObjectId) user id 
 * @apiDescription Get the user's info. User requesting must be the same as the requested user.
 * @apiName user_getUserById
 * @apiGroup Users
 * 
 * @apiParam {ObjectId} id User's _id
 * @apiHeader {Cookie} access_token User token in cookie stored upon sign-in
 * 
 * @apiSuccess {Object} user
 * 
 * @apiSuccessExample Success-Response:
 * HTTP:/1.1 200 OK
 * {
	"_id": "6488d8b16f3521635cc095d9",
	"parentBuildings": [
		"648907e88e27da64c00837e4"
	],
	"buildings": [
		"6493cf8ceac3626ff8d39b38",
		"6480e9b116e6088380430b97"
	],
	"username": "testuser",
	"permissions": "owner",
	"password": "$2a$10$1MC6/ihWUpiMQh9mzPHWvuxiuKZBsCW2q65McaZy.MYeBLb.a/DgK",
	"__v": 0,
	"email": "testuser@gmailer.comm",
	"name": "tester",
	"verified": true,
	"tenants": [
		"649cd6ff98c1b782f47fcf93"
	],
	"createdAt": "2023-07-12T02:27:06.983Z"
}
*/
router.get("/:id", authenticateToken, UserDao.getUserById);

/**
 * @api {get} /api/users/invites/getall Get all invites for signed in user 
 * @apiDescription Get the invites that a user has received, whether it be to
 * join a tenant or a building. Automatically gets the invites of whoever is signed in.
 * @apiName user_getInvites
 * @apiGroup Users
 *
 * @apiHeader {Cookie} access_token User token in cookie stored upon sign-in
 * 
 * @apiSuccess {Array} sentInvites
 * @apiSuccess {Array} receivedInvites
 * 
 * @apiSuccessExample Success-Response:
 * HTTP:/1.1 200 OK
 * {
	"sentInvites": [
		{
			"data": {
				"role": "tenant",
				"tenantId": "649cd6ff98c1b782f47fcf93"
			},
			"_id": "64a77c9060345775e072b45e",
			"from": "6488d8b16f3521635cc095d9",
			"to": "64a5f01690a39b80f848a55d",
			"inviteType": "tenant",
			"createdAt": "2023-07-07T02:46:40.140Z",
			"__v": 0
		}
	],
	"receivedInvites": []
}
*/
router.get("/invites/getall", authenticateToken, UserDao.getInvites);

// this should use query to accept=true or accept=false for an invite
/**
 * @api {get} /api/users/invites/:inviteId Handle an invite 
 * @apiDescription Accept or decline an invite. The recipient's role must match the role
 * specified within the invite. 
 * 
 * Accepting the invite adds the user to the tenant/building's respective user list and adds the building/tenant's _id to the user's building or tenatn array.
 * 
 * Declining the invite simply deletes the invite.
 * @apiName user_handleInvite
 * @apiGroup Users
 * 
 * @apiParam {ObjectId} inviteId Invite's _id
 * @apiQuery {Boolean} accept Should be "true" or "false" depending on accepting or declining 
 * @apiHeader {Cookie} access_token User token in cookie stored upon sign-in
 * 
 * 
*/
router.put("/invites/:inviteId", authenticateToken, UserDao.handleInvite);

/**
 * @api {get} /api/users/invites/:inviteId Delete an sent invite 
 * @apiDescription Only meant for sent invites. This deletes an invite that a user has sent.
 * @apiName user_deleteInvite
 * @apiGroup Users
 * 
 * @apiParam {ObjectId} inviteId
 * @apiHeader {Cookie} access_token User token in cookie stored upon sign-in
*/
router.delete("/invites/:inviteId", authenticateToken, UserDao.deleteInvite);

// this is for joining tenants only, adding other building owners/property managers is by invite only
/**
 * @api {get} /api/users/invites/join Join a tenant by invite code 
 * @apiDescription Join tenant by their respective invite code. Invites code can change or be removed.
 * @apiName user_joinByCode
 * @apiGroup Users
 * 
 * @apiBody {String} code The invite code 
 * 
*/
router.post("/invites/join", authenticateToken, UserDao.joinByCode);

/**
 * @api {put} /api/users/building/leave/:buildingId Leave a building  
 * @apiDescription Leave a building. To be used only for property managers,service contractors,
 * and building owners if there is more than one owner.
 * @apiName user_leaveBuilding
 * @apiGroup Users
 * 
 * @apiParam {ObjectId} buildingId The building to leave 
 * @apiHeader {Cookie} access_token User token in cookie stored upon sign-in
 * 
*/
router.put("/building/leave/:buildingId", authenticateToken, UserDao.leaveBuilding);

/**
 * @api {get} /api/users/building/joined/:userId Get all buildings that a user has joined 
 * @apiDescription View the buildings that the user is a part of. Applies to property managers, service contractors, and building owners.
 * @apiName user_getUsersBuildings
 * @apiGroup Users
 * 
 * @apiParam {ObjectId} userId The user's _id
 * @apiHeader {Cookie} access_token User token in cookie stored upon sign-in
 * 
 * @apiSuccessExample Success-Response:
 * HTTP:/1.1 200 OK
*/
router.get("/building/joined/:userId", authenticateToken, UserDao.getUsersBuildings);

/**
 * @api {put} /api/users/tenant/leave/:tenantId Leave a tenant  
 * @apiDescription Leave a tenant. Only to be used for tenant users
 * @apiName user_leaveTenant
 * @apiGroup Users
 * 
 * @apiParam {ObjectId} tenantId The tenant to leave
 * @apiHeader {Cookie} access_token User token in cookie stored upon sign-in
*/
router.put("/tenant/leave/:tenantId", authenticateToken, UserDao.leaveTenant);

/**
 * @api {get} /api/users/tenant/joined/:userId Get all tenants that a user has joined 
 * @apiDescription Only to be used for tenant users
 * @apiName user_getUsersTenants
 * @apiGroup Users
 * 
 * @apiParam {ObjectId} userId The user's _id 
 * @apiHeader {Cookie} access_token User token in cookie stored upon sign-in
 * 
 * @apiSuccessExample Success-Response:
 * HTTP:/1.1 200 OK
*/
router.get("/tenant/joined/:userId", authenticateToken, UserDao.getUsersTenants);

//route to return user
// router.get('/users', authenticateToken, (req, res) => {
//     LOGGER.debug(`Entering post alert route after token authentication :: ${FILE_NAME}`)
//     res.status(200).send("DATA FROM BACKEND")
// })

// /**
//  * Create a user
//  * @body - 
//  */
// router.post('/create', userDao.createUser);

module.exports = router
