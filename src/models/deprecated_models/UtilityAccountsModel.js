//Model for utilityAccounts

const { Schema, model } = require('mongoose')

const UtilityAccountSchema = new Schema({
  ElectricCoName: {
    type: String
  },
  ElectricCoAccountNumber: {
    type: String
  },
  ElectricMeterPhotos: {
    type: String
  },
  FuelCoName: {
    type: String
  },
  FuelCoAccountNumber: {
    type: String
  },
  FuelMeterPhotos: {
    type: String
  },
  WaterCoName: {
    type: String
  },
  WaterCoAccountNumber: {
    type: String
  },
  WaterMeterPhotos: {
    type: String
  }
}, { collection: 'utilityAccounts' })

const UtilityAccount = model('UtilityAccounts', UtilityAccountSchema)
module.exports = UtilityAccount
