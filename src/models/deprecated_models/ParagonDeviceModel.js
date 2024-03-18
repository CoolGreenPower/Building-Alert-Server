var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// const MachineSchema = new Schema({
//     sensorType: {
//         type: String
//     },
//     sensorPath: {
//         type: String
//     }
// })
const ParagonDeviceSchema = new Schema({
    location: {
        type: String,
    },
    BUID: {
        type: String
    },
    deviceName: {
        type: String
    },
    devicePath: {
        type: String
    },
    machines: [{
        sensorType: {
            type: String
        },
        sensorPath: {
            type: String
        }
    }]

}, { collection: 'paragonDevices' });

const ParagonDevice = mongoose.model('ParagonDevice', ParagonDeviceSchema)
module.exports = ParagonDevice