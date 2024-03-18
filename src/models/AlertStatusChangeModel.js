//Model for alertStatusChange

const { Schema, model } = require('mongoose')

const AlertStatusChangeSchema = new Schema({
  timestamp: {
    type: String
  },
  alertTrackingNum: {
    type: String
  },
  alertStatus: {
    type: String
  },
  alerts: {
    type: Schema.Types.ObjectId,
    ref: 'Alert'
  }
}, { collection: 'alertStatusChanges' })

const AlertStatusChange = model('AlertStatusChange', AlertStatusChangeSchema)
module.exports = AlertStatusChange
