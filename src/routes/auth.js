const router = require('express').Router()
const AuthDao = require("../dao/auth");
//const { check, validationResult } = require('express-validator')
//const User = require('../models/UserModel')
//const jwt = require('jsonwebtoken')
//const { VAR_SECRET } = require('../modules/ApplicationPropertiesSingleton')
//const bcrypt = require('bcryptjs')


/**
 * @api {post} /api/auth/signup Signup
 * @apiDescription This function does not make any changes to the database until their email is verified
 * via an email verification email. If you need to resend the email verification email, use the /api/auth/verifyemail/resend?email=<email> route.
 * @apiName auth_signup
 * @apiGroup Auth
 * 
 * @apiBody {String} username
 * @apiBody {String} name
 * @apiBody {String} email
 * @apiBody {String} password
 * @apiBody {String} permissions The permissions of the user (owner, tenant, etc.)
 * 
 * @apiSuccess {Object} Created user
 * 
 * @apiSuccessExample Success-Response:
 * HTTP:/1.1 200 OK
 * "Email verification sent"
 * 
 * @apiSuccessExample Email verified response:
 * {
 * "message":"User successfuly created",
 * "user":{
 *  "parentBuildings":[],
 *  "buildings":[],
 *  "_id":"6492351d347c1c00557ec3c0",
 *  "name":"derek2",
 *  "username":"somerandomusername11123",
 *  "permissions":"owner",
 *  "email":"email@email.com",
 *  "password":"$2a$10$kIiCRpSUXZDAmGpkegcaguhLOx98x9k9kmToRYVyfnrKBIl25l94i","__v":0}
}
*/
router.post("/signup", AuthDao.signup)

/**
 * @api {post} /api/auth/signin Signin
 * @apiName auth_signin
 * @apiGroup Auth
 * 
 * @apiBody {String} username Can be the username or email
 * @apiBody {String} password
 * 
 * @apiSuccess {Object} user The signed in user 
 * 
 * @apiSuccessExample Email verified response:
 * {
	"parentBuildings": [],
	"buildings": [],
	"_id": "6488d8b16f3521635cc095d9",
	"username": "testuser",
	"permissions": "owner",
	"__v": 0
}
*/
router.post("/signin", AuthDao.signin);


// auth
// this is for email verification only, do not call this route
router.get("/verifyemail", AuthDao.verifyEmail);

// requires email in query
/**
 * @api {get} /api/auth/verifyemail/resend Resend verification email 
 * @apiDescription Resend the email verification email to an existing, unverified user
 * @apiName auth_resentVerificationLink
 * @apiGroup Auth
 * 
 * @apiQuery {String} email Email 
 * 
*/
router.get("/verifyemail/resend", AuthDao.resendVerificationLink);

// -- forgot password --
// requires email in body
router.post("/forgotpassword", AuthDao.forgotPassword);
router.get("/forgotpassword", AuthDao.redirectToReset);
router.post("/forgotpassword/reset", AuthDao.resetPassword);
// -- end forgot password --


// this is for invite links, do not call this route
//router.get("/invite/:token", AuthDao.inviteUser);
/**
 * @api {get} /api/auth/signout Signout 
 * @apiDescription Signout the current user (clears the cookie)
 * @apiName auth_signout
 * @apiGroup Auth
 * 
 * @apiHeader {Cookie} access_token User token in cookie stored upon sign-in
*/
router.post("/signout", AuthDao.signout);



module.exports = router