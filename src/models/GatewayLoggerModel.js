//Model for gateway

const { Schema, model } = require('mongoose')

const GatewayLoggerSchema = new Schema({
      networkStatus_rssi: {
        type: Number
      },
      networkStatus_signalStrength: {
        type: Number
      },
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
      }

}, { collection: "gatewayLogger" })

const GatewayLogger = model('GatewayLogger', GatewayLoggerSchema )
module.exports = GatewayLogger
