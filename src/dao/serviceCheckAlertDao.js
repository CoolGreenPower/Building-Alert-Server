const LOGGER = require('../logger/logger')
const Alert = require('../models/ServiceCheckAlertModel')
const User = require('../models/UserModel')

const FILE_NAME = 'serviceCheckAlertDao.js'

const findServiceCheckAlertsByBuildingsByUserId = async ({ userId }) => {
    LOGGER.debug(`Entering findServiceCheckAlertsByBuildingsByUserId in :: ${FILE_NAME}`)

    return new Promise(async (resolve, reject) => {
        const attribute = {
            _id: 0,
            alerts: 1
        }

        await User.findById(userId, attribute)
            //populate buildings first, and then alerts
            .populate({
                path: 'sites',
                model: 'ParentBuilding',
                populate: {
                    path: 'buildings',
                    model: 'Building',
                    populate: {
                        path: 'serviceCheckAlerts',
                        model: 'serviceCheckAlerts'
                    }
                }
            })
            .exec()
            .then(res => resolve(res.sites))
            .catch(err => reject(err))
    })
}

//find service check alert by alertId
const getServiceCheckAlertbyAlertId = (alertId) => {
    LOGGER.debug(`Entering getServiceCheckAlertbyAlertId in :: ${FILE_NAME}`)

    return new Promise(async (resolve, reject) => {

        await Alert.findById(alertId)
            .exec()
            .then(res => resolve(res))
            .catch(err => reject(err))
    })
}

//update status, and serviceNeeded field
const updateServices = async (query) => {
    LOGGER.debug(`Entering updateServices in :: ${FILE_NAME}`)

    return new Promise((resolve, reject) => {
        Alert.findByIdAndUpdate(query.alertId, {
            "responsibleParty": query.responsibleParty,
            "status": query.status,
            "updatedAt": query.updatedAt
        })
            .then(res => {
                resolve(res)
            })
            .catch(err => {
                reject(err)
            })
    })
}

//update status
const updateStatus = async (query) => {
    LOGGER.debug(`Entering updateStatus in :: ${FILE_NAME}`)

    return new Promise((resolve, reject) => {
        Alert.findByIdAndUpdate(query.alertId, {
            "status": query.status,
            "updatedAt": query.updatedAt,
            "responsibleParty": query.responsibleParty
        })
            .then(res => {
                resolve(res)
            })
            .catch(err => {
                reject(err)
            })
    })
}

//schedule service
const scheduleService = async query => {
    LOGGER.debug(`Entering schedule service in :: ${FILE_NAME}`)
    return new Promise((resolve, reject) => {
        Alert.findByIdAndUpdate(query.alertId, {
            "serviceDate": query.serviceDate,
            "serviceTime": query.serviceTime,
            "responsibleParty": query.responsibleParty,
            "status": query.status,
            "updatedAt": query.updatedAt
        })
            .then(res => {
                resolve(res)
            })
            .catch(err => {
                reject(err)
            })
    })
}

//resolve service
const resolveService = async query => {
    LOGGER.debug(`Entering resolve service in :: ${FILE_NAME}`)
    return new Promise((resolve, reject) => {
        Alert.findByIdAndUpdate(query.alertId, {
            "responsibleParty": query.responsibleParty,
            "updatedAt": query.updatedAt,
            "status": query.status,
            "notes": query.notes
        })
            .then(res => {
                resolve(res)
            })
            .catch(err => {
                reject(err)
            })
    })
}

module.exports = {
    findServiceCheckAlertsByBuildingsByUserId,
    updateServices,
    scheduleService,
    getServiceCheckAlertbyAlertId,
    resolveService,
    updateStatus
}