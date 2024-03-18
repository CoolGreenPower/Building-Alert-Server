//Model for Controller

const { Schema, model } = require('mongoose')

/**
 * 
 * Deprecated. Controllers are now part of the devices
 * 
 * 
 */

const ControllerSchema = new Schema({
    sourceAPI: {
        type: String
      },
      ControllerType: {
        type: String
      },
      networkConnection: {
        type: String
      },
      Model: {
        type: String
      },
      sensorID: {
        type: String
      },
      timestamp: {
        type: String
      },
      portNumber: {
        type: Number
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
      eventLogger: [{
        type: Schema.Types.ObjectId,
        ref: 'EventLogger'
      }],
      environmentalLogger: [{
        type: Schema.Types.ObjectId,
        ref: 'EnvironmentalLogger'
      }],
      consumptionLogger: [{
        type: Schema.Types.ObjectId,
        ref: 'ConsumptionLogger'
      }],
      HVACLogger: [{
        type: Schema.Types.ObjectId,
        ref: 'HVACLogger'
      }]
}, { collection: 'controllers' })

const Controller = model('Controller', ControllerSchema)
module.exports = Controller
