//Model for serviceContractor

const { Schema, model } = require('mongoose')

const ServiceContractorSchema = new Schema({
  contractorAccountNum: {
    type: String
  },
  emailAddress: {
    type: String
  },
  password: {
    type: String
  },
  phone: {
    type: String
  },
  name: {
    type: String
  },
  companyName: {
    type: String
  },
  businessWebsite: {
    type: String
  },
  streetAddress1: {
    type: String
  },
  streetAddress2: {
    type: String
  },
  city: {
    type: String
  },
  state: {
    type: String
  },
  zipCode: {
    type: String
  },
  notes: {
    type: String
  },
  HVAC: {
    type: Schema.Types.ObjectId,
    ref: 'HVAC'
  },
  electrical_Service: {
    type: String
  },
  plumbing_Service: {
    type: String
  },
  building_Maintenance_Service: {
    type: String
  },
  building_Renovations_Service: {
    type: String
  },
  other_Services: {
    type: String
  }
}, { collection: 'serviceContractors' })

const ServiceContractor = model('ServiceContractor', ServiceContractorSchema )
module.exports = ServiceContractor
