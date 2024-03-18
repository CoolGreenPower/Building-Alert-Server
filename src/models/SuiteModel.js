//Model for suites

const { Schema, model } = require('mongoose')

/*
This model with its current state is intended to be a physical suite. This does not include
any specific info abuot the tenant that resides within it
*/

const SuiteSchema = new Schema({
  tenant: {
    type: Schema.Types.ObjectId,
    ref: "Tenant"
  },
  suite: {
    type: String // the location
  },
  occupied: {
    type: Boolean
  },
  squareFootage: {
    type: Number
  },
  buildingId: {
    type: Schema.Types.ObjectId,
    ref: "Building"
  }
}, { collection: 'suites' })

const Suite = model('Suite', SuiteSchema)
module.exports = Suite