//Model for thermostat

const { Schema, model } = require('mongoose')

const ThermostatSchema = new Schema({
    sourceAPI: {
        type: String
      },
      type: {
        type: String
      },
      location: {
        type: String
      },
      manufacturer: {
        type: String
      },
      modelNumber: {
        type: String
      },
      serialNumber: {
        type: String
      },
      name: {
        type: String
      },
      dayOftheWeek: {
        type: String
      },
      normalDayOccupiedTempSetting: {
        type: String
      },
      normalDayOccupiedFanSetting: {
        type: String
      },
      normalDayOccupiedStartTime: {
        type: String
      },
      normalDayOccupiedStopTime: {
        type: String
      },
      normalDayNotOccupiedTempSetting: {
        type: String
      },
      normalDayNotOccupiedFanSetting: {
        type: String
      },
      offNormalDayTempSetting: {
        type: String
      },
      offNormalDayFanSetting: {
        type: String
      },
      photos: {
        type: String
      },
      notes: {
        type: String
      },
      serviceContractor: {
        type: Schema.Types.ObjectId,
        ref: 'ServiceContractor'
      },
      alertStatusChange: {
        type: Schema.Types.ObjectId,
        ref: 'AlertStatusChange'
      },
      batteriesLastChanged: {
        type: Date
      },
      Recommended_Service_Interval: {
        type: Number
      },
      data: {},
      timestamp: {
        type: String
      }
}, { collection: 'thermostats' })

const Thermostat = model('Thermostat', ThermostatSchema)
module.exports = Thermostat
