//Model for consumptionLogger

const { Schema, model } = require('mongoose')

const EnergyLoggerSchema = new Schema({
  metadata: {
    deviceId: {
        type: Schema.Types.ObjectId,
        ref: "Device"
    },
    logType: {
        type: String
    }
  },
  AC_current: {
    type: Number
  },
  timestamp: {
    type: Schema.Types.Date
  }
}, { collection: "consumptionLogger"})

const EnergyLogger = model('EnergyLogger', EnergyLoggerSchema)
module.exports = EnergyLogger
