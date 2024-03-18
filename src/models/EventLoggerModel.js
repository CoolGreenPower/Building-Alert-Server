//Model for EventLogger

const { Schema, model } = require('mongoose')

const EventLoggerSchema = new Schema({
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
  USB_power: {
    type: Number
  },
  batteryVoltage: {
    type: Number
  },
  touch: {
    type: Boolean
  },
  open: {
    type: Boolean
  },
  objectPresent: {
    type: String
  },
  waterPresent: {
    type: String
  }

}, { collection: 'eventLogger' })

const EventLogger = model('EventLogger', EventLoggerSchema )
module.exports = EventLogger
