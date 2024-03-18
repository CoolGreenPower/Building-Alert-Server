const router = require('express').Router()
const LOGGER = require('../logger/logger')
const authenticateToken = require('../utils/authentication')
const ParentDao = require("../dao/parentBuildingDao")

// create group
router.post("/create", authenticateToken, ParentDao.createGroup)

router.put('/add', authenticateToken, ParentDao.addBuildingToGroup);

router.get("/:parentBuildingId", ParentDao.getGroup)

module.exports = router;