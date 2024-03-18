//Model for alerts

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var AlertSchema = new Schema({
  deviceId: {
    type: Schema.Types.ObjectId,
    ref: "Device"
  },
  buildingId: {
    type: Schema.Types.ObjectId,
    ref: "Building"
  },
  alert_id: {
    type: String, // this should be an identifying id, or just other (i.e. H-01 or other)
    required: true
  },
  alert_desc: {
    type: String
  },
  location_desc: {
    type: String, // mainly for user created alerts, defines where the issue is occurring
  },
  description: {
    type: String,
  },
  poster: {
    type: Schema.Types.ObjectId, // the user who creates the alert (not applicable to generated alerts)
    ref: "User"
  },
  status: {
    type: String
  },
  createdAt: {
    type: Date
  },
  modifiedAt: {
    type: Date
  },
  assignedPersonnel: [{
    type: Schema.Types.ObjectId, // the user who is assigned to the alert
    ref: "User"
  }]

}, { collection: 'alerts' }, { timestamps: true } );

const Alerts = mongoose.model('Alert', AlertSchema)
module.exports = Alerts
