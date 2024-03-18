//Model for propertyManager

const { Schema, model } = require('mongoose')

const PropertyManagerSchema = new Schema({
    managerAccountNum: {
        type: String
      },
      emailAddress: {
        type: String
      },
      password: {
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
      phone: {
        type: String
      }
}, { collection: "propertyManagers" })

const PropertyManager = model('PropertyManager', PropertyManagerSchema)
module.exports = PropertyManager
