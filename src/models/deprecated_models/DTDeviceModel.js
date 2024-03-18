var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var DTDeviceSchema = new Schema({
  targetName: {
    type: String
  },
  projectId: {
    type: String
  },
  deviceId: {
    type: String
  }

}, { collection: 'dt_devices' });

const DTDevice = mongoose.model('DTDevice', DTDeviceSchema)
module.exports = DTDevice