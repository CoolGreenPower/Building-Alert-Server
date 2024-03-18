var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const ServiceCheckSchema = new Schema({
  serviceCategory: {
    type: String
  },
  serviceProvider: {
    type: String
  },
  serviceTechnician: {
    type: String
  },
  siteName: {
    type: String
  },
  responsibleParty: {
    type: String
  },
  deviceName: {
    type: String
  },
  serviceName: [{
    type: String
  }],
  lastServiceDate: {
    type: Date
  },
  serviceCheckAlerts: [{
    type: Schema.Types.ObjectId,
    ref: 'ServiceCheckAlert'
  }],
  serviceContractor: {
    type: Schema.Types.ObjectId,
    ref: 'ServiceContractor'
  }
}, { collection: 'serviceChecks' });

const ServiceCheck = mongoose.model('ServiceCheck', ServiceCheckSchema)
module.exports = ServiceCheck
