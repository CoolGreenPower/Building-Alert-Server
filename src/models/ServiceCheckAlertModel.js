var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const ServiceCheckAlertSchema = new Schema({
  buildingId: {
    type: Schema.Types.ObjectId
  },
  status: {
    type: String
  },
  shortDesc: {
    type: String
  },
  detailedDesc: {
    type: String
  },
  alertCategory: {
    type: String
  },
  dateReported: {
    type: Date
  },
  servicesNeeded: [{
    type: String
  }],
  serviceDate: {
    type: Date
  },
  serviceTime: {
    type: String
  },
  responsibleParty: {
    type: String
  },
  createdAt: {
    type: Date
  },
  updatedAt: {
    type: Date
  },
  notes: {
    type: String
  },
  alerts: {
    type: Schema.Types.ObjectId,
    ref: 'Alert'
  },
  alertStatusChange: {
    type: Schema.Types.ObjectId,
    ref: 'AlertStatusChange'
  },
  buildings: {
    type: Schema.Types.ObjectId,
    ref: 'Building'
  }
}, { collection: 'serviceCheckAlerts' });

const ServiceCheckAlert = mongoose.model('ServiceCheckAlert', ServiceCheckAlertSchema)
module.exports = ServiceCheckAlert