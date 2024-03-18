/**
 * Purely for api documentation. Otherwise ignore
 */

/**
 * @api {get} /notaroute Alert Type
 * @apiName types_Alert
 * @apiGroup 1_Types
 * @apiSuccessExample Alert
 * {
  deviceId: {
    type: Schema.Types.ObjectId,
    ref: "Device"
  },
  buildingId: {
    type: Schema.Types.ObjectId,
    ref: "Building"
  },
  alert_id: {
    type: String, // this should be an identifying id, or just other (i.e. H-01 or other)
    required: true
  },
  alert_desc: {
    type: String
  },
  location_desc: {
    type: String, // mainly for user created alerts, defines where the issue is occurring
  },
  description: {
    type: String,
  },
  poster: {
    type: Schema.Types.ObjectId, // the user who creates the alert (not applicable to generated alerts)
    ref: "User"
  },
  status: {
    type: String
  },
  createdAt: {
    type: Date
  },
  modifiedAt: {
    type: Date
  },
  assignedPersonnel: [{
    type: Schema.Types.ObjectId, // the user who is assigned to the alert
    ref: "User"
  }]

}
 */


/**
 * @api {get} /notaroute Asset Type
 * @apiName types_Asset
 * @apiGroup 1_Types
 * @apiSuccessExample Asset
 * {
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
    supports: [{
        // single or multiple suites or entire building
        type: String
    }],
    supportedSuites: [{
        // type: Schema.Types.ObjectId,
        // ref: "Suite"
        type: String
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


}
 */

/**
 * @api {get} /notaroute Building Type
 * @apiName types_Building
 * @apiGroup 1_Types
 * @apiSuccessExample Building
 * {
  // id,
  alias: {
    type: String, // this is used for the data loggers which help us identify buildings in a readable manner 
    unique: true,
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
  },

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

  description: {
    type: String
  }
}
*/

/**
 * @api {get} /notaroute Controller Type
 * @apiName types_Controller
 * @apiGroup 1_Types
 * @apiSuccessExample Controller
 * {
    sourceAPI: {
        type: String
      },
      ControllerType: {
        type: String
      },
      networkConnection: {
        type: String
      },
      Model: {
        type: String
      },
      sensorID: {
        type: String
      },
      timestamp: {
        type: String
      },
      portNumber: {
        type: Number
      },
      location: {
        type: String
      },
      manufacturer: {
        type: String
      },
      modelNumber: {
        type: String
      },
      serialNumber: {
        type: String
      },
      name: {
        type: String
      },
      photos: {
        type: String
      },
      notes: {
        type: String
      },
      serviceContractor: {
        type: Schema.Types.ObjectId,
        ref: 'ServiceContractor'
      },
      alertStatusChange: {
        type: Schema.Types.ObjectId,
        ref: 'AlertStatusChange'
      },
      eventLogger: [{
        type: Schema.Types.ObjectId,
        ref: 'EventLogger'
      }],
      environmentalLogger: [{
        type: Schema.Types.ObjectId,
        ref: 'EnvironmentalLogger'
      }],
      consumptionLogger: [{
        type: Schema.Types.ObjectId,
        ref: 'ConsumptionLogger'
      }],
      HVACLogger: [{
        type: Schema.Types.ObjectId,
        ref: 'HVACLogger'
      }]
}
*/

/**
 * @api {get} /notaroute Device Type
 * @apiName types_Device
 * @apiGroup 1_Types
 * @apiSuccessExample Device
 * {
    // for all devices
    device: {
        type: String // user defined name
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
    vataverksToken: {
        type: String
    },
    utilityType: {
        type: String // gas, electric, water
    }
    // macaddress is also used, but already defined
    
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
}
*/

/**
 * @api {get} /notaroute Controller Type
 * @apiName types_Controller
 * @apiGroup 1_Types
 * @apiSuccessExample Controller
 * {
    sourceAPI: {
        type: String
      },
      ControllerType: {
        type: String
      },
      networkConnection: {
        type: String
      },
      Model: {
        type: String
      },
      sensorID: {
        type: String
      },
      timestamp: {
        type: String
      },
      portNumber: {
        type: Number
      },
      location: {
        type: String
      },
      manufacturer: {
        type: String
      },
      modelNumber: {
        type: String
      },
      serialNumber: {
        type: String
      },
      name: {
        type: String
      },
      photos: {
        type: String
      },
      notes: {
        type: String
      },
      serviceContractor: {
        type: Schema.Types.ObjectId,
        ref: 'ServiceContractor'
      },
      alertStatusChange: {
        type: Schema.Types.ObjectId,
        ref: 'AlertStatusChange'
      },
      eventLogger: [{
        type: Schema.Types.ObjectId,
        ref: 'EventLogger'
      }],
      environmentalLogger: [{
        type: Schema.Types.ObjectId,
        ref: 'EnvironmentalLogger'
      }],
      consumptionLogger: [{
        type: Schema.Types.ObjectId,
        ref: 'ConsumptionLogger'
      }],
      HVACLogger: [{
        type: Schema.Types.ObjectId,
        ref: 'HVACLogger'
      }]
}
*/

/**
 * @api {get} /notaroute Gateway Type
 * @apiName types_Gateway
 * @apiGroup 1_Types
 * @apiSuccessExample Gateway
 * {
    GUID: {
      type: String,
      //required: true
    },
    location: {
      type: String
    },
    name: {
      type: String
    },
    sourceAPI: {
      type: String,
      required: true
    },
    buildingId: {
      type: Schema.Types.ObjectId,
      ref: "Building",
      required: true
    },
    devices: [{
      type: Schema.Types.ObjectId,
      ref: "Device"
    }],
}
*/

/**
 * @api {get} /notaroute Invite Type
 * @apiName types_Invite
 * @apiGroup 1_Types
 * @apiSuccessExample Invite
 * {
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
}
*/

/**
 * @api {get} /notaroute ParentBuilding Type
 * @apiName types_ParentBuilding
 * @apiGroup 1_Types
 * @apiSuccessExample ParentBuilding
 * {
  name: {
    type: String
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  buildings: [{
    type: Schema.Types.ObjectId,
    ref: 'Building'
  }]
}
*/

/**
 * @api {get} /notaroute Suite Type
 * @apiName types_Suite
 * @apiGroup 1_Types
 * @apiSuccessExample Suite
 * {
  tenant: {
    type: Schema.Types.ObjectId,
    ref: "Tenant"
  },
  suite: {
    type: String // the location
  },
  occupied: {
    type: Boolean
  },
  squareFootage: {
    type: Number
  },
  buildingId: {
    type: Schema.Types.ObjectId,
    ref: "Building"
  }
}
*/

/**
 * @api {get} /notaroute Tenant Type
 * @apiName types_Tenant
 * @apiGroup 1_Types
 * @apiSuccessExample Tenant
 * {
  TUID: {
    type: String
  },
  name: {
    type: String
  },
  buildingId: {
    type: Schema.Types.ObjectId,
    ref: "Building",
    required: true
  },
  suiteId: {
    type: Schema.Types.ObjectId,
    ref: "Suite",
    required: true
  },
  businessType: {
    type: String
  },
  description: {
    type: String
  },
  typeOfLease: {
    type: String // N, NN, or NNN
  },
  leaseEndDate: {
    type: Date
  },
  users: [{
    type: Schema.Types.ObjectId,
    ref: "User"
  }],
  inviteCode: {
    type: String
  }

}
*/

/**
 * @api {get} /notaroute User Type
 * @apiName types_User
 * @apiGroup 1_Types
 * @apiSuccessExample User
 * {
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
    expires: 3600
  }
}
*/

/**
 * @api {get} /notaroute Utility Bill Type
 * @apiName types_UtilityBill
 * @apiGroup 1_Types
 * @apiSuccessExample UtilityBill
 * {
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
        type: String, // gas, electric, water, misc
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
}
 * 
*/

