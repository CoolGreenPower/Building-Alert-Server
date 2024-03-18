const { Schema, model } = require('mongoose')

const InviteSchema = new Schema({
    from: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    to: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    inviteType: {
      type: String,
      required: true
    },
    data: {
        role: {
            type: String,
            required: true
        },
        tenantId: {
            type: Schema.Types.ObjectId,
            ref: "Tenant"
        },
        buildingId: {
            type: Schema.Types.ObjectId,
            ref: "Building"
        }
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
}, { collection: "invites" }, { timestamps: true });

const Invite = model('Invite', InviteSchema );
module.exports = Invite;