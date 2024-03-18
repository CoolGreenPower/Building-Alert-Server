//Model for User
var mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String,
  },
  password: {
    type: String,
    required: true
  },
  permissions: {
    type: String,
    required: true
  },
  parentBuildings: [{
    type: Schema.Types.ObjectId,
    ref: 'ParentBuilding'
  }],
  buildings: [{
    type: Schema.Types.ObjectId, // the buildings that the user owns
    ref: 'Building'
  }],
  tenants:[{
    type: Schema.Types.ObjectId, // this is the tenants that the user is a member of
    ref: "Tenant"
  }],
  // receivedInvites: [{
  //   type: Schema.Types.ObjectId,
  //   ref: "Invite"
  // }],
  // sentInvites: [{
  //   type: Schema.Types.ObjectId,
  //   ref: "Invite"
  // }],
  // should add field for options / preferences
  verified: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    default: Date.now,
    expires: 600 // 10 minutes
  }
}, { collection: 'users' }, { timestamps: true });

const User = mongoose.model('User', UserSchema)
module.exports = User
