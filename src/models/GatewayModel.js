//Model for gateway

const { Schema, model } = require('mongoose')

const GatewaySchema = new Schema({
      GUID: {
        type: String,
        //required: true
      },
      location: {
        type: String
      },
      name: {
        type: String
      },
      // loggerType:  {
      //   type: String
      // },
      sourceAPI: {
        type: String,
        required: true
      },
      buildingId: {
        type: Schema.Types.ObjectId,
        ref: "Building",
        required: true
      },
      devices: [{
        type: Schema.Types.ObjectId,
        ref: "Device"
      }],
      // devices: {
      //   dtDevices: [{
      //     type: Schema.Types.ObjectId,
      //     ref: 'Device'
      //   }],
      //   paragonDevices: [{
      //     type: Schema.Types.ObjectId,
      //     ref: 'Device'
      //   }],
      //   ambientDevices: [{
      //     type: Schema.Types.ObjectId,
      //     ref: 'Device'
      //   }]
      // },
      // networkStatus_rssi: {
      //   type: Number
      // },
      // networkStatus_signalStrength: {
      //   type: Number
      // },
      // targetName: {
      //   type: String
      // },
      // projectID: {
      //   type: String
      // },
      // timestamp: {
      //   type: Schema.Types.Date
      // },
      // networkConnection: {
      //   type: String
      // },
      // model: {
      //   type: String
      // },
      // sensorID: {
      //   type: String
      // },
      // portNumber: {
      //   type: Number
      // },
      // location: {
      //   type: String
      // },
      // manufacturer: {
      //   type: String
      // },
      // modelNumber: {
      //   type: String
      // },
      // serialNumber: {
      //   type: String
      // },
      // name: {
      //   type: String
      // },
      // photos: {
      //   type: String
      // },
      // notes: {
      //   type: String
      // },
      // controller: [{
      //   type: Schema.Types.ObjectId,
      //   ref: 'Controller'
      // }],
      // serviceContractor: {
      //   type: Schema.Types.ObjectId,
      //   ref: 'ServiceContractor'
      // },
      // alertStatusChange: {
      //   type: Schema.Types.ObjectId,
      //   ref: 'AlertStatusChange'
      // },
      // eventLogger: [{
      //   type: Schema.Types.ObjectId,
      //   ref: 'EventLogger'
      // }],
      // HVACLogger: [{
      //   type: Schema.Types.ObjectId,
      //   ref: 'HVACLogger'
      // }],
      // consumptionLogger: [{
      //   type: Schema.Types.ObjectId,
      //   ref: 'ConsumptionLogger'
      // }],
      // environmentalLogger: [{
      //   type: Schema.Types.ObjectId,
      //   ref: 'EnvironmentalLogger'
      // }]
}, { collection: "gateways" })

const Gateway = model('Gateway', GatewaySchema )
module.exports = Gateway
