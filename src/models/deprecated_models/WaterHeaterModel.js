//Model for waterHeater

const { Schema, model } = require('mongoose')

const WaterHeaterSchema = new Schema({
  sourceAPI: {
    type: String
  },
  type: {
    type: String
  },
  location: {
    type: String
  },
  timestamp: {
    type: String
  },
  energySource: {
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
  warrantyPeriod: {
    type: String
  },
  warrantyexpiration: {
    type: Date
  },
  dateOfInstallation: {
    type: Date
  },
  dateOfLastService: {
    type: Date
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
  suitesSupported: [{
    type: String
  }],
  Recommended_Service_Interval: {
    type: Number
  },
  Temperature_Setting: {
    type: Number
  }
}, { collection: 'waterHeaters' })

const WaterHeater = model('WaterHeater', WaterHeaterSchema)
module.exports =  WaterHeater
