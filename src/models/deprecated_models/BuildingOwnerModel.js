//Model for buildingOwner

const { Schema, model } = require('mongoose')

const BuildingOwnerSchema = new Schema({
    ownerAccountNum: {
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
      phone: {
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
      buildings: [{
        type: Schema.Types.ObjectId,
        ref: 'Building'
      }]
}, { collection: "buildingOwners" })

const BuildingOwner = model('BuildingOwner', BuildingOwnerSchema)
module.exports = BuildingOwner
