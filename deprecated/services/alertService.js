const LOGGER = require('../logger/logger')
const FILE_NAME = 'alertService.js'
const alertDao = require('../dao/alertDao')

const findAlerts = (query) => {
    LOGGER.debug(`Entering findAlerts function of ${FILE_NAME}`)
    return new Promise(async (resolve, reject) => {
        await alertDao.findSites(query)
        .then(async res => {
            await alertDao.findAlertsBySiteName(res._doc.sites)
            .then(r => resolve(r))
        })
        .catch(err => reject(err))
    })
}

/**
 * Function to return alerts associated with a particular userId
 * Input: userId
 * Returns: alerts
 */
const findAlertsByUserId = async query => {
    LOGGER.debug(`Entering findAlertsByUserId function of ${FILE_NAME}`)

    return new Promise(async (resolve, reject) => {
        await alertDao.findAlertsByUserId(query)
        .then(r => resolve(r))
        .catch(err => reject(err))
    })
}

const findAlertsByBuildingsByUserId = async query => {
    LOGGER.debug(`Entering findAlertsByBuildingsByUserId function of ${FILE_NAME}`)

    return new Promise(async (resolve, reject) => {
        await alertDao.findAlertsByBuildingsByUserId(query)
        .then(r => resolve(r))
        .catch(err => reject(err))
    })
}
module.exports = {
    findAlerts,
    findAlertsByUserId,
    findAlertsByBuildingsByUserId
}