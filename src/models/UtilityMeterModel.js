var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * Deprecated. Utility meter is now consumptionLogger
 */

const UtilityMeterSchema = new Schema({
  metadata: {
    deviceId: {
        type: Schema.Types.ObjectId,
        ref: "Device"
    },
    logType: {
        type: String
    }
  },
  timestamp: {
    type: Schema.Types.Date
  },
  gasVolume: {
    type: Number
  },
  waterVolume: {
    type: Number
  }
}, { collection: "utilityMeter" });

const UtilityMeter = mongoose.model('UtilityMeter', UtilityMeterSchema)
module.exports = UtilityMeter
