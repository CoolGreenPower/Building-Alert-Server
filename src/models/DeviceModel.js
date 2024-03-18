const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const DeviceSchema = new Schema({
    // for all devices
    device: {
        type: String, // user defined name
        required: true
    },
    DUID: {
        type: String,
        //required: true
    },
    loggerType: {
        type: String,
        required: true
    },
    gatewayId: {
        type: Schema.Types.ObjectId,
        ref: "Gateway",
        required: true
    },
    location: {
        buildingId: {
            type: Schema.Types.ObjectId,
            ref: "Building",
            required: true
        },
        suiteId: {
            type: Schema.Types.ObjectId,
            ref: "Suite"
        },
        data: {
            type: String
        },
        asset: {
            type: Schema.Types.ObjectId,
            ref: "Asset"
        },
        outdoors: {
            type: Boolean,
            default: false
        }
    },
    deviceSource: {
        type: String, // will be either 'DisruptiveTechnologies' 'ParagonRobotics' or 'AmbientWeather',
        required: true
    },
    gatewayId: {
        type: Schema.Types.ObjectId,
        ref: "Gateway"
    },

    // for dt devices
    targetName: {
        type: String
    },
    projectId: {
        type: String
    },
    sensorId: {
        type: String
    },

    // for PR devices
    devicePath: {
        type: String // the url path for the api
    },
    deviceModel: {
        type: String // this is the DB## / N## models that should be universally the same
    },
    machines: [{
        sensorType: {
            type: String
        },
        sensorPath: {
            type: String
        },
        _id: false,
    }],

    // for ambient weather devices
    macAddress: {
        type: String
    },
    ambientDeviceId: {
        type: String
    },

    //vataverks devices
    kFactor: {
        type: Number
    },
    vataverksToken: {
        type: String
    },
    utilityType: {
        type: String // gas, electric, water
    },
    // macaddress is also used, but already defined

    // emporia
    channels: [{
        channelNumber: {
            type: String
        },
        type: {
            type: String
        },
        name: {
            type: String
        },
        energyDirection: {
            type: String
        },
        subType: {
            type: String
        }
    }],


}, { collection: 'devices' });

const Device = mongoose.model('Device', DeviceSchema)
module.exports = Device