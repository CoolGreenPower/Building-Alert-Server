const { Schema, model } = require("mongoose")


const UtilityBillSchema = new Schema({
    createdAt: {
        type: Date,
        default: Date.now
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    endDate: {
        type: Date,
        default: Date.now
    },
    type: {
        type: String, // gas, electric, water, other
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
        }
    },
    data: {
        type: Object
    }
}, { collection: "utilityBills" }, { timestamps: true })


const UtilityBill = model("UtilityBill", UtilityBillSchema)
module.exports = UtilityBill