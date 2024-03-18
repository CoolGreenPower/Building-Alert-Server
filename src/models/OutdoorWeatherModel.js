//Model for environmentalLogger

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AmbientWeatherSchema = new Schema({
    metadata: {
        deviceId: {
            type: Schema.Types.ObjectId,
            ref: "Device"
        },
        buildingId: {
            type: Schema.Types.ObjectId,
            ref: "Building"
        },
        logType: {
            type: String
        }
    },
    timestamp: {
        type: Schema.Types.Date
    },
    tempf: {
        type: Number
    },
    humidity: {
        type: Number
    },
    windspeedmph: {
        type: Number
    },
    windgustmph: {
        type: Number
    },
    uv: {
        type: Number
    },
    solarradiation: {
        type: Number
    },
    dailyrainin: {
        type: Number
    },
    feelsLike: {
        type: Number
    },
    dewPoint: {
        type: Number
    }
}, { collection: "ambientWeather"})

const AmbientWeather = mongoose.model('AmbientWeather', AmbientWeatherSchema)
module.exports =  AmbientWeather
