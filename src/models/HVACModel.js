//Model for HVAC

const { Schema, model } = require('mongoose')

/**
 * 
 * 
 * 
 * 
 * Deprecated. All HVAC units are now in assets
 * 
 * 
 * 
 * 
 */

const HVACSchema = new Schema({
  location: {
    type: String
  },
  sensors: {
    type: Schema.Types.ObjectId,
    ref: "Device"
  },
  type: {
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
  thermostat: [{
    type: Schema.Types.ObjectId,
    ref: 'Thermostat'
  }],
  serviceContractor: {
    type: Schema.Types.ObjectId,
    ref: 'ServiceContractor'
  },
  alertStatusChange: {
    type: Schema.Types.ObjectId,
    ref: 'AlertStatusChange'
  },
  HVACLogger: {
    type: Schema.Types.ObjectId,
    ref: 'HVACLogger'
  },
  suiteNumbersSupported: [{
    type: String
  }],
  warranty_expiration_date: {
    type: Date
  },
  is_service_contract: {
    type: Boolean
  },
  Recommended_Service_Interval: {
    type: Number
  }
}, { collection: 'HVACs' })

const HVAC = model('HVAC', HVACSchema )
module.exports = HVAC