//Model for environmentalLogger

const { Schema, model } = require('mongoose')

const EnvironmentalLoggerSchema = new Schema({
    timestamp: {
      type: Schema.Types.Date
    },
    metadata: {
      deviceId: {
          type: Schema.Types.ObjectId,
          ref: "Device"
      },
      logType: {
          type: String
      }
    },
    temperature: {
      type: Number
    },
    humidity: {
      type: Number
    },
    co2: {
      type: Number
    },
    pressure: {
      type: Number
    },

}, { collection: "environmentalLogger"})

const EnvironmentalLogger = model('EnvironmentalLogger', EnvironmentalLoggerSchema)
module.exports =  EnvironmentalLogger
