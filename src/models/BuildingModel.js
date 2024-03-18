var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var BuildingSchema = new Schema({
  // id,
  alias: {
    type: String, // this is used for the data loggers which help us identify buildings in a readable manner 
    unique: true,
    //required: true
  },
  name: {
    type: String,
    required: true
  },
  BUID: {
    type: String,
    //required: true,
    //unique: true
  },
  buildingOwner: [{
    type: Schema.Types.ObjectId, // this is an array if there are multiple owners
    ref: 'User'
  }],
  propertyManager: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  serviceContractor: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],

  // address
  address: {
    type: String
  },
  city: {
    type: String
  },
  state: {
    type: String
  },
  zipcode: {
    type: String
  },

  // contact
  contactPhone: {
    type: String
  },
  contactEmail: {
    type: String
  },

  // devices (devices are stored in gateways)
  gateways: [{
    type: Schema.Types.ObjectId,
    ref: 'Gateway'
  }],

  imageLink: {
    type: String
  },
  suites: [{
    type: Schema.Types.ObjectId,
    //ref: 'Suite'
  }],

  keys: {
    dt_projectId: {
      type: String,
      default: ""
    },
    dt_secret: {
      type: String,
      default: ""
    },
    dt_email: {
      type: String,
      default: ""
    },
    dt_key_id: {
      type: String,
      default: ""
    },
    paragon_securityDomain: {
      type: String,
      default: ""
    },
    paragon_username: {
      type: String,
      default: ""
    },
    paragon_password: {
      type: String,
      default: ""
    },
    ambient_apiKey: {
      type: String,
      default: ""
    },
    ambient_applicationKey: {
      type: String,
      default: ""
    },
    vataverks_token: {
      type: String,
      default: ""
    }
  },

  assetData: {
    hasGreenButton: {
      type: Boolean,
    },
    // electric
    electricCompanyName: {
      // electric company name
      type: String
    },
    electricAccountNumber: {
      // acc number
      type: String
    },
    electricAssets: [{
      type: Schema.Types.ObjectId,
      ref: "Asset"
    }],

    // gas
    gasCompanyName: {
      type: String
    },
    gasAccountNumber: {
      type: String
    },
    gasAssets: [{
      type: Schema.Types.ObjectId,
      ref: "Asset"
    }],

    // water
    waterCompanyName: {
      type: String
    },
    waterAccountNumber: {
      type: String
    },
    waterAssets: [{
      type: Schema.Types.ObjectId,
      ref: "Asset"
    }],

    // misc
    electricLiability: {
      type: String
    },
    gasLiability: {
      type: String
    },
    waterLiability: {
      type: String
    },

    // hvac
    HVACCount: {
      type: Number
    },
    HVACShared: {
      type: Boolean
    },
    HVACAssets: [{
      type: Schema.Types.ObjectId,
      ref: "Asset"
    }],

    // thermostat
    thermostatAssets: [{
      type: Schema.Types.ObjectId,
      ref: "Asset"
    }],

    // water heater: 
    waterHeaterCount: {
      type: Number
    },
    waterHeaterAssets: [{
      type: Schema.Types.ObjectId,
      ref: "Asset"
    }],

    otherAssets: [{
      type: Schema.Types.ObjectId,
      ref: "Asset"
    }]
  },

  // alerts
  // alerts: [{
  //   type: Schema.Types.ObjectId,
  //   ref: 'Alert'
  // }],
  // serviceCheckAlerts: [{
  //   type: Schema.Types.ObjectId,
  //   ref: 'ServiceCheckAlert'
  // }],

  // options (such as turning on / off alerts)
  options: {
    generatedAlerts: {
      type: Boolean,
      default: true
    },
    userReportedAlerts: {
      type: Boolean, 
      default: true
    }
  },

  // misc info
  type: {
    type: String
  },
  buildingSqFt: {
    type: Number
  },
  floorCount: {
    type: Number
  },
  suiteCount: {
    type: Number
  },
  commonAreaCount: {
    type: Number
  },
  sharedRestroomCount: {
    type: Number
  },
  undergroundParking: {
    type: Boolean
  },
  EVCharging: {
    type: Boolean
  },
  EVChargerCount: {
    type: Number
  },
  // daysOccupied: [{
  //   type: String
  // }],
  description: {
    type: String
  }
}, { collection: 'buildings' });

const Building = mongoose.model('Building', BuildingSchema)
module.exports = Building
