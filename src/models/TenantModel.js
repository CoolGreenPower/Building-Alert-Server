//Model for tenant

const { Schema, model } = require('mongoose')

/**
 * NOTE: Referring to "tenant" means the business that occupies a suite. 
 * When referring to the people in the suite, they are simply just the users and not "tenants"
 */


const TenantSchema = new Schema({
  TUID: {
    type: String
  },
  name: {
    type: String
  },
  buildingId: {
    type: Schema.Types.ObjectId,
    ref: "Building",
    required: true
  },
  suiteId: {
    type: Schema.Types.ObjectId,
    ref: "Suite",
    required: true
  },
  businessType: {
    type: String
  },
  description: {
    type: String
  },
  typeOfLease: {
    type: String // N, NN, or NNN
  },
  typeOfLeaseDesc: {
    type: String
  },
  leaseEndDate: {
    type: Date
  },
  users: [{
    type: Schema.Types.ObjectId,
    ref: "User"
  }],
  inviteCode: {
    type: String
  }



}, { collection: 'tenants' })

const Tenant = model('Tenant', TenantSchema )
module.exports = Tenant
