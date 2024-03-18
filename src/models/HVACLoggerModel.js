//Model for HVACLogger

const { Schema, model } = require('mongoose')

const HVACLoggerSchema = new Schema({
  metadata: {
    deviceId: {
        type: Schema.Types.ObjectId,
        ref: "Device"
    },
    logType: {
        type: String
    }
  },
  timestamp: {
    type: Schema.Types.Date
  },
  supplyAirTemp: {
    type: Number
  },
  returnAirTemp: {
    type: Number
  },
  // following may be added in the future
  // temperature: {
  //   type: Number
  // },
  // humidity: {
  //   type: Number
  // }
}, { collection: "HVACLogger" })

const HVACLogger = model('HVACLogger', HVACLoggerSchema)
module.exports =  HVACLogger