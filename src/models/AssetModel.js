const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AssetSchema = new Schema({
    AUID: {
        // self defined asset id
        type: String
    },
    buildingId: {
        // the building the asset is attached to
        type: Schema.Types.ObjectId,
        ref: "Building",
        required: true
    },
    name: {
        // user defined name
        type: String,
        required: true
    },
    assetType: {
        // is it water, gas, etc.
        type: String,
        required: true
    },
    images: [{
        // this should be a link to an image source
        type: String
    }],
    manufacturer: {
        type: String
    },
    make: {
        type: String
    },
    modelNumber: {
        type: String
    },
    serialNumber: {
        type: String
    },
    location: {
        type: String
    },
    HVACtype: {
        // this is more for HVAC units
        // ex: type: Packaged RTU
        type: String
    },
    supports: {
        // single or multiple suites or entire building
        type: String
    },
    supportedSuites: [{
        // type: Schema.Types.ObjectId,
        // ref: "Suite"
        type: Schema.Types.ObjectId,
        ref:"Suite"
    }],
    warrantyExpiration: {
        type: Date
    },
    lastService: {
        type: Date
    },
    serviceContract: {
        type: Boolean
    },
    
    HVACSettings: {
        compressorCount: {
            type: Number
        },
        comp1PH: { // compressor
            type: Number
        },
        comp1RLA: {
            type: Number
        },
        comp1LRA: {
            type: Number
        },
        comp2PH: {
            type: Number
        },
        comp2RLA: {
            type: Number
        },
        comp2LRA: {
            type: Number
        },
        comp3PH: {
            type: Number
        },
        comp3RLA: {
            type: Number
        },
        comp3LRA: {
            type: Number
        },
        fanPH: {
            type: Number
        },
        fanFLA: {
            type: Number
        },
        fanHP: {
            type: Number
        },
    },

    thermostatSettings: {
        occupiedHeat: {
            type: Number
        },
        unoccupiedHeat: {
            type: Number
        },
        occupiedCooling: {
            type: Number
        },
        unoccupiedCooling: {
            type: Number
        },

        weekdayOccupiedStartTime: {
            type: String
        },
        weekdayUnoccupiedStartTime: {
            type: String
        },
        weekendOccupiedStartTime: {
            type: String
        },
        weekendUnoccupiedStartTime: {
            type: String
        },

        fanSetting: {
            type: String
        },
        hasBatteries: {
            type: Boolean
        },
        batteriesLastChanged: {
            type: Date
        }
    },

    waterHeaterSettings: {
        // mainly used for water heater
        waterTemperature: {
            type: Number
        }
    },
    energySource: {
        // mainly used for water heater
        type: String
    },
    dateInstalled: {
        type: Date
    },
    occupiedDays: [{
        type: String // for thermostat but can be used for others as well
    }],
    energySource: {
        type: String
    }


}, { collection: "assets" });

const Asset = mongoose.model("Asset", AssetSchema);
module.exports = Asset;