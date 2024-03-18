//Model for alertMessage

const { Schema, model } = require('mongoose')

const AlertMessageSchema = new Schema({
  timestamp: {
    type: String
  },
  alertTrackingNum: {
    type: String
  },
  headline: {
    type: String
  },
  alerts: {
    type: Schema.Types.ObjectId,
    ref: 'Alert'
  }
}, { collection: "alertMessages" })

const AlertMessage = model('AlertMessage', AlertMessageSchema )
module.exports = AlertMessage
