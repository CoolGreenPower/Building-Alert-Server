const router = require('express').Router();
const authenticateToken = require('../utils/authentication');
const requireAdmin = require('../utils/requireAdmin');

const path = require("path")
const express = require("express")

const adminDao = require("../dao/admin/adminDao");
const alertDao = require("../dao/admin/alertDao")
const adminBuilding = require("../dao/admin/buildingDao");
const adminTenant = require("../dao/admin/tenantDao");
const adminAsset = require("../dao/admin/assetDao");
const adminDevice = require("../dao/admin/deviceDao");
const utilityDao = require("../dao/admin/utilityDao");

/**
 * Admin routes do not share any of the daos that the other routes use.
 * Admin routes use daos within the "dao/admin" folder, and share the same name
 * as their non admin counterpart purely for convenience.
 */

// AUTHENTICATION
/**
 * @api {post} /api/admin/signin Login
 * @apiName admin_signin
 * @apiGroup Admin
 * 
 * @apiBody {String} username
 * @apiBody {String} email Username or email required
 * @apiBody {String} password
*/
router.post("/signin", adminDao.login);
router.get("/signin", adminDao.loginPage);

/**
 * @api {post} /api/admin/signout Logout  
 * @apiName admin_logout
 * @apiGroup Admin
*/
router.post("/signout", adminDao.logout);







// users
/**
 * @api {get} /api/admin/users Get all users 
 * @apiName admin_getAllUsers
 * @apiGroup Admin
 * @apiSuccess {Object[]} users List of users
*/
router.get("/users", authenticateToken, requireAdmin, adminDao.getAllUsers);

/**
 * @api {get} /api/admin/users/:id Get user by id 
 * @apiName admin_getUserById
 * @apiGroup Admin
 * 
 * @apiParam {ObjectId} id User id
 * @apiSuccess {Object} user User object
*/
router.get("/users/:id", authenticateToken, requireAdmin, adminDao.getUserById);

/**
 * @api {put} /api/admin/users/:id Update user  
 * @apiName admin_updateUser
 * @apiGroup Admin
 * 
 * @apiParam {ObjectId} id User id
 * 
 * @apiSuccess {Object} user User object
*/
router.put("/users/:id", authenticateToken, requireAdmin, adminDao.updateUser);

/**
 * @api {get} /api/admin/users/building/:buildingId Get building users
 * @apiName admin_getBuildingUsers
 * @apiGroup Admin
 * 
 * @apiParam {ObjectId} buildingId Building _id
 * 
 * @apiSuccess {Object[]} users
*/
router.get("/users/building/:buildingId", authenticateToken, requireAdmin, adminDao.getBuildingUsers)
//router.delete("/admin/users/:id", authenticateToken, requireAdmin, adminDao.deleteUser);







// buildings
/**
 * @api {post} /api/admin/buildings/create Create building  
 * @apiDescription Please use fields specified in the regular create building route.
 * @apiName admin_createBuilding
 * @apiGroup Admin
 * @apiSuccess {Object} Created building
*/
router.post("/buildings/create", authenticateToken, requireAdmin, adminBuilding.createBuilding)

/**
 * @api {get} /api/admin/buildings Get all buildings 
 * @apiName admin_getAllBuildings
 * @apiGroup Admin
*/
router.get("/buildings", authenticateToken, requireAdmin, adminBuilding.getAllBuildings);

/**
 * @api {get} /api/admin/buildings/:id Get building by id 
 * @apiName admin_getBuildingById
 * @apiGroup Admin
 * 
 * @apiParam {ObjectId} id Building id
 * @apiSuccess {Object} building Building object
*/
router.get("/buildings/:id", authenticateToken, requireAdmin, adminBuilding.getBuildingById);

/**
 * @api {put} /api/admin/buildings/:id Update building  
 * @apiName admin_updateBuilding
 * @apiGroup Admin
 * 
 * @apiParam {ObjectId} id Building id
 * 
 * @apiSuccess {Object} building Building object
*/
router.put("/buildings/:id", authenticateToken, requireAdmin, adminBuilding.updateBuilding);
router.get("/buildings/BUID/:id", authenticateToken, requireAdmin, adminBuilding.getBuildingByBUID);








// tenants / suites
/**
 * @api {post} /api/admin/tenants/create Create tenant 
 * @apiDescription Please use fields specified in the regular create tenant route.
 * @apiName admin_createTenant
 * @apiGroup Admin
 * 
 * @apiSuccess {Object} Created tenant
 * 
*/
router.post("/tenants/create", authenticateToken, requireAdmin, adminTenant.createTenant);

/**
 * @api {post} /api/admin/suites/create Create suite
 * @apiDescription Please use fields specified in the regular create suite route.
 * @apiName admin_createSuite
 * @apiGroup Admin
 * 
 * @apiSuccess {Object} Created suite
 * 
*/
router.post("/suites/create", authenticateToken, requireAdmin, adminTenant.createSuite);

/**
 * @api {get} /api/admin/tenants/building/:buildingId Get building tenants
 * @apiName admin_getBuildingTenants
 * @apiGroup Admin
 * 
 * @apiParam {ObjectId} buildingId
 * 
 * @apiSuccess {Object[]} tenants
 * 
*/
router.get("/tenants/building/:buildingId", authenticateToken, requireAdmin, adminTenant.getBuildingTenants);

/**
 * @api {get} /api/admin/suites/building/:buildingId Get building suites
 * @apiName admin_getBuildingSuites
 * @apiGroup Admin
 * 
 * @apiParam {ObjectId} buildingId
 * 
 * @apiSuccess {Object[]} suites
 * 
*/
router.get("/suites/building/:buildingId", authenticateToken, requireAdmin, adminTenant.getBuildingSuites);

/**
 * @api {get} /api/admin/tenants Get all tenants
 * @apiName admin_getAllTenants
 * @apiGroup Admin
*/
router.get("/tenants", authenticateToken, requireAdmin, adminTenant.getAllTenants);

/**
 * @api {get} /api/admin/suites Get all suites
 * @apiName admin_getAllSuites
 * @apiGroup Admin
*/
router.get("/suites", authenticateToken, requireAdmin, adminTenant.getAllSuites);

/**
 * @api {get} /api/admin/suites/:id Get suite by id
 * @apiName admin_getTenantById
 * @apiGroup Admin
 * 
 * @apiParam {ObjectId} id Suite id 
 * 
 * @apiSuccess {Object} suite
 * 
*/
router.get("/suites/:id", authenticateToken, requireAdmin, adminTenant.getSuiteById);

/**
 * @api {get} /api/admin/tenants/:id Get tenant by id
 * @apiName admin_getTenantById
 * @apiGroup Admin
 * 
 * @apiParam {ObjectId} id Tenant id
 * 
 * @apiSuccess {Object} tenant
 * 
*/
router.get("/tenants/:id", authenticateToken, requireAdmin, adminTenant.getTenantById);







// assets
/**
 * @api {get} /api/admin/assets/building/:buildingId Get building assets
 * @apiName admin_getBuildingAssets
 * @apiGroup Admin
 * 
 * @apiParam {ObjectId} buildingId 
 * 
 * @apiSuccess {Object[]} assets
*/
router.get("/assets/building/:buildingId", authenticateToken, requireAdmin, adminAsset.getAssetsByBuildingId);

/**
 * @api {get} /api/admin/assets Get all assets
 * @apiName admin_getAllAssets
 * @apiGroup Admin
 * 
*/
router.get("/assets", authenticateToken, requireAdmin, adminAsset.getAllAssets);

/**
 * @api {get} /api/admin/assets/:id Get asset by id
 * @apiName admin_getAssetById
 * @apiGroup Admin
 * 
 * @apiParam {ObjectId} id Asset id
 * 
 * @apiSuccess {Object} asset
 * 
*/
router.get("/assets/:id", authenticateToken, requireAdmin, adminAsset.getAssetById);

/**
 * @api {post} /api/admin/assets/create Create asset
 * @apiDescription Please use fields specified in the regular create asset route.
 * @apiName admin_createAsset
 * @apiGroup Admin
 * 
 * @apiSuccess {Object} asset
 * 
*/
router.post("/assets/create", authenticateToken, requireAdmin, adminAsset.createAsset);








// devices / gateways
/**
 * @api {get} /api/admin/devices/building/:buildingId Get building devices
 * @apiName admin_getBuildingDevices
 * @apiGroup Admin
 * 
 * @apiParam {ObjectId} buildingId 
 * 
*/
router.get("/devices/building/:buildingId", authenticateToken, requireAdmin, adminDevice.getDevicesByBuildingId)

/**
 * @api {get} /api/admin/devices Get all devices
 * @apiName admin_getAllDevices
 * @apiGroup Admin
*/
router.get("/devices", authenticateToken, requireAdmin, adminDevice.getAllDevices);

/**
 * @api {get} /api/admin/devices/:id Get device by id
 * @apiName admin_getDeviceById
 * @apiGroup Admin
 * 
 * @apiParam {ObjectId} id Device id
 * 
 * @apiSuccess {Object} device
 * 
*/
router.get("/devices/:id", authenticateToken, requireAdmin, adminDevice.getDeviceById);

/**
 * @api {put} /api/admin/devices/:id Update device 
 * @apiName admin_updateDevice
 * @apiGroup Admin
 * 
 * @apiParam {ObjectId} id Device id
 * 
 * @apiSuccess {Object} device
 * 
*/
router.put("/devices/:id", authenticateToken, requireAdmin, adminDevice.updateDevice);

/**
 * @api {delete} /api/admin/devices/:id Delete device 
 * @apiName admin_deleteDevice
 * @apiGroup Admin
 * 
 * @apiParam {ObjectId} id Device id
 * 
 * @apiSuccess {Object} device
 * 
*/
router.delete("/devices/:id", authenticateToken, requireAdmin, adminDevice.deleteDevice);

/**
 * @api {post} /api/admin/devices/create Create device
 * @apiDescription Please use fields specified in the regular create device route.
 * @apiName admin_createDevice
 * @apiGroup Admin
 * 
 * @apiSuccess {Object} device
 * 
*/
router.post("/devices/create", authenticateToken, requireAdmin, adminDevice.createDevice);

/**
 * @api {post} /api/admin/gateways/create Create gateway 
 * @apiName admin_createGateway
 * @apiGroup Admin
 * 
 * @apiSuccess {Object} created gateway
 * 
*/
router.post("/gateways/create", authenticateToken, requireAdmin, adminDevice.createGateway);

/**
 * @api {get} /api/admin/gateways Get all gateways
 * @apiName admin_getAllGateways
 * @apiGroup Admin
*/
router.get("/gateways", authenticateToken, requireAdmin, adminDevice.getAllGateways);

/**
 * @api {get} /api/admin/gateways/:id Get gateway by id
 * @apiName admin_getGatewayById
 * @apiGroup Admin
 * 
 * @apiParam {ObjectId} id Gateway id
 * 
 * @apiSuccess {Object} gateway
 * 
*/
router.get("/gateways/:id", authenticateToken, requireAdmin, adminDevice.getGatewayById);

/**
 * @api {get} /api/admin/gateways/building/:buildingId Get building gateways
 * @apiName admin_getBuildingGateways
 * @apiGroup Admin
 * 
 * @apiParam {ObjectId} buildingId 
 * 
*/
router.get("/gateways/building/:buildingId", authenticateToken, requireAdmin, adminDevice.getGatewaysByBuildingId);







// utility bills / other bills
/**
 * @api {get} /api/admin/utilities Get all utilities
 * @apiName admin_getAllUtilities
 * @apiGroup Admin
*/
router.get("/utilities", authenticateToken, requireAdmin, utilityDao.getAllUtilities);

/**
 * @api {get} /api/admin/utilities/:id Get utility by id
 * @apiName admin_getUtilityById
 * @apiGroup Admin
 * 
 * @apiParam {ObjectId} id Utility id
 * 
 * @apiSuccess {Object} utility
 * 
*/
router.get("/utilities/:id", authenticateToken, requireAdmin, utilityDao.getUtilityById);

/**
 * @api {get} /api/admin/utilities/building/:buildingId Get building utilities
 * @apiName admin_getBuildingUtilities
 * @apiGroup Admin
 * 
 * @apiParam {ObjectId} buildingId
*/
router.get("/utilities/building/:buildingId", authenticateToken, requireAdmin, utilityDao.getBuildingUtilities);

/**
 * @api {post} /api/admin/utilities/create Create utility
 * @apiDescription Please use fields specified in the regular create utility route.
 * @apiName admin_createUtilityBill
 * @apiGroup Admin
 * 
 * @apiSuccess {Object} utility
 * 
*/
router.post("/utilities/create", authenticateToken, requireAdmin, utilityDao.createUtilityBill);







// alerts
/**
 * @api {get} /api/admin/alerts Get all alerts 
 * @apiName admin_getAllAlerts
 * @apiGroup Admin
*/
router.get("/alerts", authenticateToken, requireAdmin, alertDao.getAllAlerts);

/**
 * @api {get} /api/admin/alerts/building/:buildingId Get building alerts
 * @apiName admin_getBuildingAlerts
 * @apiGroup Admin
 * 
 * @apiParam {ObjectId} buildingId 
 * 
*/
router.get("/alerts/building/:buildingId", authenticateToken, requireAdmin, alertDao.getBuildingAlerts);

/**
 * @api {get} /api/admin/alerts/:id Get alert by id
 * @apiName admin_getAlertById
 * @apiGroup Admin
 * 
 * @apiParam {ObjectId} id Alert id
 * 
 * @apiSuccess {Object} alert
 * 
*/
router.get("/alerts/:id", authenticateToken, requireAdmin, alertDao.getAlertById);

/**
 * @api {put} /api/admin/alerts/:id Update alert 
 * @apiName admin_updateAlert
 * @apiGroup Admin
 * 
 * @apiParam {ObjectId} id Alert id
 * 
 * @apiSuccess {Object} alert
 * 
*/
router.put("/alerts/:id", authenticateToken, requireAdmin, alertDao.updateAlert);

/**
 * @api {post} /api/admin/alerts/createrequest Create request 
 * @apiName admin_createRequest
 * @apiGroup Admin
 * 
 * @apiSuccess {Object} Created request
 * 
*/
router.post("/alerts/createrequest", authenticateToken, requireAdmin, alertDao.createRequest);

/**
 * @api {get} /api/admin/alerts/tenantalerts/:tenantId Get tenant alerts
 * @apiName admin_getTenantAlerts
 * @apiGroup Admin
 * 
 * @apiParam {ObjectId} tenantId Tenant to get alerts for
*/
router.get("/alerts/tenantalerts/:tenantId", authenticateToken, requireAdmin, alertDao.getTenantAlerts);

/**
 * @api {get} /api/admin/alerts/contractoralerts/:contractorId Get service contractor's alerts
 * @apiName admin_getServiceContractorAlerts
 * @apiGroup Admin
 * 
 * @apiParam {ObjectId} contractorId Contractor to get alerts for
 * 
*/
router.get("/alerts/contractoralerts/:contractorId", authenticateToken, requireAdmin, alertDao.getServiceContractorAlerts);

// images
// get image by name
// get images by assetId

module.exports = router;