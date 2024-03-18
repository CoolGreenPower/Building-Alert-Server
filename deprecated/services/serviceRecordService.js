const { insertServiceRecord } = require('../dao/serviceRecordDao')
const LOGGER = require('../logger/logger')
const FILE_NAME = `serviceRecordService.js`

const addServiceRecord = (serviceRecord) => {
    LOGGER.debug(`Entering add service record function in ${FILE_NAME}`)
    return new Promise((resolve, reject) => {
        insertServiceRecord(serviceRecord)
            .then(res => resolve(res))
            .catch(err => reject(err))
    })
}

module.exports = { addServiceRecord }