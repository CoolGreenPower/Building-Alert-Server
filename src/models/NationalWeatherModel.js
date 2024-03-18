//Model for nationalWeather

const { Schema, model } = require('mongoose')


const NationalWeatherSchema = new Schema({
    queryTime: {
        type: Date
      },
      Type: {
        type: String
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
}, { collection: 'nationalWeather' })

const NationalWeather = model('NationalWeather', NationalWeatherSchema)
module.exports = NationalWeather
