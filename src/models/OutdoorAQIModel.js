//Model for outdoorAQI

const { Schema, model } = require('mongoose')

const OutdoorAQISchema = new Schema({
    queryTime: {
        type: Date
      },
      AQI: {
        type: Number
      },
      data: {},
      alertStatusChange: {
        type: Schema.Types.ObjectId,
        ref: 'AlertStatusChange'
      },
      alerts: {
        type: Schema.Types.ObjectId,
        ref: 'Alert'
      },
      buildings: {
        type: Schema.Types.ObjectId,
        ref: 'Building'
      }
}, { collection: 'outdoorAQI'} )

const OutdoorAQI = model('OutdoorAQI', OutdoorAQISchema)
module.exports = OutdoorAQI
