const mongoose = require('mongoose');
const dummy = require('mongoose-dummy');
var Schema = mongoose.Schema;
const dummyRecordsCount = 3; // number of dummy records you want to write into each collection

mongoose.connect("mongodb+srv://CGP:CoolGreenPower@cluster0.mm76vej.mongodb.net/CGP", {useNewUrlParser: true, useUnifiedTopology: true});

var alerts = new Schema({
  site: {
    type: String
  },
  alertID: {
    type: String
  },
  createdAt: {
    type: Date
  },
  updatedAt: {
    type: Date
  },
  dateReported: {
    type: Date
  },
  buildingId: {
    type: Schema.Types.ObjectId
  },
  shortDesc: {
    type: String
  },
  detailedDesc: {
    type: String
  },
  alertColor: {
    type: String
  },
  alertCategory: {
    type: String
  },
  alertSource: {
    type: String
  },
  severity: {
    type: String
  },
  impact: {
    type: String
  },
  status: {
    type: String
  },
  responsibleParty: {
    type: String
  },
  data: [{
    type: String
  }],
  notes: {
    type: String
  },
  priority: {
    type: Number
  },
  image: {
    type: String
  },
  userGeneratedAlert: {
    description: {
      type: String
    }
  },
  servicesNeeded: [{
    type: String
  }],
  serviceDate: {
    type: Date
  },
  serviceTime: {
    type: String
  },
  alertStatusChange: {
    type: Schema.Types.ObjectId,
    ref: 'alertStatusChange'
  },
  alertMessage: {
    type: Schema.Types.ObjectId,
    ref: 'alertMessage'
  }
},{ collection: 'alerts' });

var buildings = new Schema({
  type: {
    type: String
  },
  name: {
    type: String
  },
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
  buildingUBID: {
    type: String
  },
  totalSquareFootage: {
    type: Number
  },
  numberOfFloors: {
    type: Number
  },
  numberOfSuites: {
    type: Number
  },
  numberOfCommonRestrooms: {
    type: Number
  },
  numberOfCommonAreas: {
    type: Number
  },
  undergroundParking: {
    type: Boolean
  },
  EVChargingOffered: {
    type: Boolean
  },
  notes: {
    type: String
  },
  phone: {
    type: String
  },
  imageLink: {
    type: String
  },
  permissions: {
    type: String
  },
  longitude: {
    type: String
  },
  latitude: {
    type: String
  },
  buildingOwner: {
    type: Schema.Types.ObjectId,
    ref: 'buildingOwner'
  },
  propertyManager: {
    type: Schema.Types.ObjectId,
    ref: 'propertyManager'
  },
  suites: [{
    type: Schema.Types.ObjectId,
    ref: 'suites'
  }],
  gateway: [{
    type: Schema.Types.ObjectId,
    ref: 'gateway'
  }],
  HVAC: [{
    type: Schema.Types.ObjectId,
    ref: 'HVAC'
  }],
  controller: [{
    type: Schema.Types.ObjectId,
    ref: 'controller'
  }],
  num_Janitorial_areas_with_plumbing: {
    type: Number
  },
  num_EV_charging_stations: {
    type: Number
  },
  num_HVAC_systems: {
    type: Number
  },
  dedicated_or_shared: {
    type: String
  },
  num_hot_water_heaters: {
    type: Number
  },
  eventLogger: [{
    type: Schema.Types.ObjectId,
    ref: 'eventLogger'
  }],
  consumptionLogger: [{
    type: Schema.Types.ObjectId,
    ref: 'consumptionLogger'
  }],
  environmentalLogger: [{
    type: Schema.Types.ObjectId,
    ref: 'environmentalLogger'
  }],
  HVACLogger: [{
    type: Schema.Types.ObjectId,
    ref: 'HVACLogger'
  }],
  alerts: [{
    type: Schema.Types.ObjectId,
    ref: 'alerts'
  }],
  users: [{
    type: Schema.Types.ObjectId,
    ref: 'users'
  }],
  serviceCheckAlerts: [{
    type: Schema.Types.ObjectId,
    ref: 'serviceCheckAlerts'
  }]
},{ collection: 'buildings' });

var serviceCheck = new Schema({
  serviceCategory: {
    type: String
  },
  serviceProvider: {
    type: String
  },
  serviceTechnician: {
    type: String
  },
  siteName: {
    type: String
  },
  responsibleParty: {
    type: String
  },
  deviceName: {
    type: String
  },
  serviceName: [{
    type: String
  }],
  lastServiceDate: {
    type: Date
  },
  serviceCheckAlerts: [{
    type: Schema.Types.ObjectId,
    ref: 'serviceCheckAlerts'
  }],
  serviceContractor: {
    type: Schema.Types.ObjectId,
    ref: 'serviceContractor'
  }
},{ collection: 'serviceCheck' });

var users = new Schema({
  username: {
    type: String
  },
  userCategory: {
    type: String
  },
  password: {
    type: String
  },
  permissions: {
    type: String
  },
  propertyManager: {
    type: Schema.Types.ObjectId,
    ref: 'propertyManager'
  },
  tenant: {
    type: Schema.Types.ObjectId,
    ref: 'tenant'
  },
  buildingOwner: {
    type: Schema.Types.ObjectId,
    ref: 'buildingOwner'
  },
  serviceContractor: {
    type: Schema.Types.ObjectId,
    ref: 'serviceContractor'
  },
  alertMessage: {
    type: Schema.Types.ObjectId,
    ref: 'alertMessage'
  },
  urgent_notifications_via: {
    type: String
  },
  urgent_notifications_frequency: {
    type: String
  },
  urgent_notifications_via: {
    type: String
  },
  urgent_notifications_frequency: {
    type: String
  },
  utilityAccounts: {
    type: Schema.Types.ObjectId,
    ref: 'utilityAccounts'
  },
  serviceCheck: {
    type: Schema.Types.ObjectId,
    ref: 'serviceCheck'
  },
  sites: [{
    type: Schema.Types.ObjectId,
    ref: 'parentbuildings'
  }]
},{ collection: 'users' });

var alertStatusChange = new Schema({
  timestamp: {
    type: String
  },
  alertTrackingNum: {
    type: String
  },
  alertStatus: {
    type: String
  },
  alerts: {
    type: Schema.Types.ObjectId,
    ref: 'alerts'
  }
},{ collection: 'alertStatusChange' });

var alertMessage = new Schema({
  timestamp: {
    type: String
  },
  alertTrackingNum: {
    type: String
  },
  headline: {
    type: String
  },
  alerts: {
    type: Schema.Types.ObjectId,
    ref: 'alerts'
  }
},{ collection: 'alertMessage' });

var outdoorAQI = new Schema({
  queryTime: {
    type: Date
  },
  AQI: {
    type: Number
  },
  data: {},
  alertStatusChange: {
    type: Schema.Types.ObjectId,
    ref: 'alertStatusChange'
  },
  alerts: {
    type: Schema.Types.ObjectId,
    ref: 'alerts'
  },
  buildings: {
    type: Schema.Types.ObjectId,
    ref: 'buildings'
  }
},{ collection: 'outdoorAQI' });

var nationalWeather = new Schema({
  queryTime: {
    type: Date
  },
  Type: {
    type: String
  },
  data: {},
  alertStatusChange: {
    type: Schema.Types.ObjectId,
    ref: 'alertStatusChange'
  },
  alerts: {
    type: Schema.Types.ObjectId,
    ref: 'alerts'
  },
  buildings: {
    type: Schema.Types.ObjectId,
    ref: 'buildings'
  }
},{ collection: 'nationalWeather' });

var buildingOwner = new Schema({
  ownerAccountNum: {
    type: String
  },
  emailAddress: {
    type: String
  },
  password: {
    type: String
  },
  name: {
    type: String
  },
  companyName: {
    type: String
  },
  phone: {
    type: String
  },
  businessWebsite: {
    type: String
  },
  streetAddress1: {
    type: String
  },
  streetAddress2: {
    type: String
  },
  city: {
    type: String
  },
  state: {
    type: String
  },
  zipCode: {
    type: String
  },
  notes: {
    type: String
  },
  buildings: [{
    type: Schema.Types.ObjectId,
    ref: 'buildings'
  }]
},{ collection: 'buildingOwner' });

var propertyManager = new Schema({
  managerAccountNum: {
    type: String
  },
  emailAddress: {
    type: String
  },
  password: {
    type: String
  },
  name: {
    type: String
  },
  companyName: {
    type: String
  },
  businessWebsite: {
    type: String
  },
  streetAddress1: {
    type: String
  },
  streetAddress2: {
    type: String
  },
  city: {
    type: String
  },
  state: {
    type: String
  },
  zipCode: {
    type: String
  },
  notes: {
    type: String
  },
  phone: {
    type: String
  }
},{ collection: 'propertyManager' });

var suites = new Schema({
  status: {
    type: String
  },
  suiteNumber: {
    type: Number
  },
  leaseType: {
    type: String
  },
  leaseStartDate: {
    type: Date
  },
  leaseEndDate: {
    type: Date
  },
  totalSquareFootageLeased: {
    type: Number
  },
  electricUtilityAccountResponsibility: {
    type: String
  },
  heatingUtilityAccountResponsibility: {
    type: String
  },
  waterAndSewageUtilityAccountResponsibility: {
    type: String
  },
  InternetUtilityAccountResponsibility: {
    type: String
  },
  notes: {
    type: String
  },
  tenant: {
    type: Schema.Types.ObjectId,
    ref: 'tenant'
  }
},{ collection: 'suites' });

var utilityMeter = new Schema({
  sourceAPI: {
    type: String
  },
  utilityType: {
    type: String
  },
  gas_pulseCount: {
    type: Number
  },
  water_pulseCount: {
    type: Number
  },
  timestamp: {
    type: String
  },
  serialNumber: {
    type: String
  },
  model: {
    type: String
  },
  sensorID: {
    type: String
  },
  portNumber: {
    type: Number
  },
  location: {
    type: String
  },
  controllerRequired: {
    type: Boolean
  },
  manufacturer: {
    type: String
  },
  modelNumber: {
    type: String
  },
  name: {
    type: String
  },
  brand: {
    type: String
  },
  photos: {
    type: String
  },
  controllerID: {
    type: String
  },
  notes: {
    type: String
  },
  ft3PerPulse: {
    type: Number
  },
  K_factor: {
    type: Number
  },
  suitesSupported: [{
    type: String
  }],
  utility_company_name: {
    type: String
  },
  utility_company_accountNum: {
    type: String
  },
  electricity_peak_hour_start: {
    type: Date
  },
  electricity_peak_hour_end: {
    type: Date
  },
  water_volume_tier1_limit: {
    type: Number
  },
  water_volume_tier2_limit: {
    type: Number
  },
  water_volume_tier3_limit: {
    type: Number
  },
  serviceContractor: {
    type: Schema.Types.ObjectId,
    ref: 'serviceContractor'
  },
  alertStatusChange: {
    type: Schema.Types.ObjectId,
    ref: 'alertStatusChange'
  },
  daysOfWeek: [{
    type: String
  }],
  timeFrom: {
    type: String
  },
  timeTo: {
    type: String
  }
},{ collection: 'utilityMeter' });

var serviceContractor = new Schema({
  contractorAccountNum: {
    type: String
  },
  emailAddress: {
    type: String
  },
  password: {
    type: String
  },
  phone: {
    type: String
  },
  name: {
    type: String
  },
  companyName: {
    type: String
  },
  businessWebsite: {
    type: String
  },
  streetAddress1: {
    type: String
  },
  streetAddress2: {
    type: String
  },
  city: {
    type: String
  },
  state: {
    type: String
  },
  zipCode: {
    type: String
  },
  notes: {
    type: String
  },
  HVAC: {
    type: Schema.Types.ObjectId,
    ref: 'HVAC'
  },
  electrical_Service: {
    type: String
  },
  plumbing_Service: {
    type: String
  },
  building_Maintenance_Service: {
    type: String
  },
  building_Renovations_Service: {
    type: String
  },
  other_Services: {
    type: String
  }
},{ collection: 'serviceContractor' });

var tenant = new Schema({
  tenantAccountNum: {
    type: String
  },
  emailAddress: {
    type: String
  },
  password: {
    type: String
  },
  phone: {
    type: String
  },
  businessName: {
    type: String
  },
  typeOfBusiness: {
    type: String
  },
  numberOfYearsInBusiness: {
    type: String
  },
  businessOwnerName: {
    type: String
  },
  businessOwnerMobilePhone: {
    type: String
  },
  businessOwnerWebsite: {
    type: String
  },
  billingContactName: {
    type: String
  },
  StreetAddress1: {
    type: String
  },
  StreetAddress2: {
    type: String
  },
  city: {
    type: String
  },
  state: {
    type: String
  },
  zipCode: {
    type: String
  },
  notes: {
    type: String
  }
},{ collection: 'tenant' });

var gateway = new Schema({
  sourceAPI: {
    type: String
  },
  loggerType: {
    type: String
  },
  networkStatus_rssi: {
    type: Number
  },
  networkStatus_signalStrength: {
    type: Number
  },
  targetName: {
    type: String
  },
  timestamp: {
    type: String
  },
  networkConnection: {
    type: String
  },
  model: {
    type: String
  },
  sensorID: {
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
  controller: [{
    type: Schema.Types.ObjectId,
    ref: 'controller'
  }],
  serviceContractor: {
    type: Schema.Types.ObjectId,
    ref: 'serviceContractor'
  },
  alertStatusChange: {
    type: Schema.Types.ObjectId,
    ref: 'alertStatusChange'
  },
  eventLogger: [{
    type: Schema.Types.ObjectId,
    ref: 'eventLogger'
  }],
  HVACLogger: [{
    type: Schema.Types.ObjectId,
    ref: 'HVACLogger'
  }],
  consumptionLogger: [{
    type: Schema.Types.ObjectId,
    ref: 'consumptionLogger'
  }],
  environmentalLogger: [{
    type: Schema.Types.ObjectId,
    ref: 'environmentalLogger'
  }]
},{ collection: 'gateway' });

var HVAC = new Schema({
  location: {
    type: String
  },
  type: {
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
  warrantyPeriod: {
    type: String
  },
  dateOfInstallation: {
    type: Date
  },
  dateOfLastService: {
    type: Date
  },
  photos: {
    type: String
  },
  notes: {
    type: String
  },
  thermostat: [{
    type: Schema.Types.ObjectId,
    ref: 'thermostat'
  }],
  serviceContractor: {
    type: Schema.Types.ObjectId,
    ref: 'serviceContractor'
  },
  alertStatusChange: {
    type: Schema.Types.ObjectId,
    ref: 'alertStatusChange'
  },
  HVACLogger: {
    type: Schema.Types.ObjectId,
    ref: 'HVACLogger'
  },
  suiteNumbersSupported: [{
    type: String
  }],
  warranty_expiration_date: {
    type: Date
  },
  is_service_contract: {
    type: Boolean
  },
  Recommended_Service_Interval: {
    type: Number
  }
},{ collection: 'HVAC' });

var controller = new Schema({
  sourceAPI: {
    type: String
  },
  controllerType: {
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
    ref: 'serviceContractor'
  },
  alertStatusChange: {
    type: Schema.Types.ObjectId,
    ref: 'alertStatusChange'
  },
  eventLogger: [{
    type: Schema.Types.ObjectId,
    ref: 'eventLogger'
  }],
  environmentalLogger: [{
    type: Schema.Types.ObjectId,
    ref: 'environmentalLogger'
  }],
  consumptionLogger: [{
    type: Schema.Types.ObjectId,
    ref: 'consumptionLogger'
  }],
  HVACLogger: [{
    type: Schema.Types.ObjectId,
    ref: 'HVACLogger'
  }]
},{ collection: 'controller' });

var eventLogger = new Schema({
  sourceAPI: {
    type: String
  },
  eventType: {
    type: String
  },
  USB_power: {
    type: Number
  },
  touch: {
    type: String
  },
  objectPresent: {
    type: String
  },
  waterPresent: {
    type: String
  },
  targetName: {
    type: String
  },
  timestamp: {
    type: String
  },
  serviceContractor: {
    type: Schema.Types.ObjectId,
    ref: 'serviceContractor'
  },
  modelNumber: {
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
  serialNumber: {
    type: String
  },
  photos: {
    type: String
  },
  notes: {
    type: String
  },
  name: {
    type: String
  },
  alertStatusChange: {
    type: Schema.Types.ObjectId,
    ref: 'alertStatusChange'
  },
  controller: {
    type: Schema.Types.ObjectId,
    ref: 'controller'
  },
  gateway: {
    type: Schema.Types.ObjectId,
    ref: 'gateway'
  },
  suites: {
    type: Schema.Types.ObjectId,
    ref: 'suites'
  },
  buildings: {
    type: Schema.Types.ObjectId,
    ref: 'buildings'
  }
},{ collection: 'eventLogger' });

var thermostat = new Schema({
  sourceAPI: {
    type: String
  },
  type: {
    type: String
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
  dayOftheWeek: {
    type: String
  },
  normalDayOccupiedTempSetting: {
    type: String
  },
  normalDayOccupiedFanSetting: {
    type: String
  },
  normalDayOccupiedStartTime: {
    type: String
  },
  normalDayOccupiedStopTime: {
    type: String
  },
  normalDayNotOccupiedTempSetting: {
    type: String
  },
  normalDayNotOccupiedFanSetting: {
    type: String
  },
  offNormalDayTempSetting: {
    type: String
  },
  offNormalDayFanSetting: {
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
    ref: 'serviceContractor'
  },
  alertStatusChange: {
    type: Schema.Types.ObjectId,
    ref: 'alertStatusChange'
  },
  batteriesLastChanged: {
    type: Date
  },
  Recommended_Service_Interval: {
    type: Number
  },
  data: {},
  timestamp: {
    type: String
  }
},{ collection: 'thermostat' });

var utilityAccounts = new Schema({
  ElectricCoName: {
    type: String
  },
  ElectricCoAccountNumber: {
    type: String
  },
  ElectricMeterPhotos: {
    type: String
  },
  FuelCoName: {
    type: String
  },
  FuelCoAccountNumber: {
    type: String
  },
  FuelMeterPhotos: {
    type: String
  },
  WaterCoName: {
    type: String
  },
  WaterCoAccountNumber: {
    type: String
  },
  WaterMeterPhotos: {
    type: String
  }
},{ collection: 'utilityAccounts' });

var waterHeater = new Schema({
  sourceAPI: {
    type: String
  },
  type: {
    type: String
  },
  location: {
    type: String
  },
  timestamp: {
    type: String
  },
  energySource: {
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
  warrantyPeriod: {
    type: String
  },
  warrantyexpiration: {
    type: Date
  },
  dateOfInstallation: {
    type: Date
  },
  dateOfLastService: {
    type: Date
  },
  photos: {
    type: String
  },
  notes: {
    type: String
  },
  serviceContractor: {
    type: Schema.Types.ObjectId,
    ref: 'serviceContractor'
  },
  alertStatusChange: {
    type: Schema.Types.ObjectId,
    ref: 'alertStatusChange'
  },
  suitesSupported: [{
    type: String
  }],
  Recommended_Service_Interval: {
    type: Number
  },
  Temperature_Setting: {
    type: Number
  }
},{ collection: 'waterHeater' });

var environmentalLogger = new Schema({
  sourceAPI: {
    type: String
  },
  loggerType: {
    type: String
  },
  targetName: {
    type: String
  },
  dailyRainfall: {
    type: Number
  },
  humidity: {
    type: Number
  },
  outdoorTemp: {
    type: Number
  },
  solarRadiation: {
    type: Number
  },
  uvIndex: {
    type: Number
  },
  windspeed: {
    type: Number
  },
  temperature: {
    type: Number
  },
  relativeHumidity: {
    type: Number
  },
  CO2: {
    type: Number
  },
  pressure: {
    type: Number
  },
  timestamp: {
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
  sensorID: {
    type: String
  },
  location: {
    type: String
  },
  name: {
    type: String
  },
  photos: {
    type: String
  },
  serviceContractor: {
    type: Schema.Types.ObjectId,
    ref: 'serviceContractor'
  },
  gateway: {
    type: Schema.Types.ObjectId,
    ref: 'gateway'
  },
  controller: {
    type: Schema.Types.ObjectId,
    ref: 'controller'
  },
  suites: {
    type: Schema.Types.ObjectId,
    ref: 'suites'
  },
  alertStatusChange: {
    type: Schema.Types.ObjectId,
    ref: 'alertStatusChange'
  },
  buildings: {
    type: Schema.Types.ObjectId,
    ref: 'buildings'
  },
  VOC: {
    type: Number
  },
  PM1: {
    type: Number
  },
  PM25: {
    type: Number
  },
  AQI: {
    type: Number
  },
  Wind_mph_direction: {
    type: String
  }
},{ collection: 'environmentalLogger' });

var HVACLogger = new Schema({
  sourceAPI: {
    type: String
  },
  loggerType: {
    type: String
  },
  temperature: {
    type: Number
  },
  humidity: {
    type: Number
  },
  returnAirTemp: {
    type: Number
  },
  supplyAirTemp: {
    type: Number
  },
  AC_UNIT: {
    type: Number
  },
  timestamp: {
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
  sensorID: {
    type: String
  },
  location: {
    type: String
  },
  name: {
    type: String
  },
  photos: {
    type: String
  },
  portNumber: {
    type: Number
  },
  serviceContractor: {
    type: Schema.Types.ObjectId,
    ref: 'serviceContractor'
  },
  gateway: {
    type: Schema.Types.ObjectId,
    ref: 'gateway'
  },
  controller: {
    type: Schema.Types.ObjectId,
    ref: 'controller'
  },
  alertStatusChange: {
    type: Schema.Types.ObjectId,
    ref: 'alertStatusChange'
  },
  suites: {
    type: Schema.Types.ObjectId,
    ref: 'suites'
  },
  HVAC: {
    type: Schema.Types.ObjectId,
    ref: 'HVAC'
  },
  utilityMeter: {
    type: Schema.Types.ObjectId,
    ref: 'utilityMeter'
  },
  waterHeater: {
    type: Schema.Types.ObjectId,
    ref: 'waterHeater'
  },
  buildings: {
    type: Schema.Types.ObjectId,
    ref: 'buildings'
  },
  fan_energy_reading: {
    type: Number
  },
  compressor1_energy_reading: {
    type: Number
  },
  compressor2_energy_reading: {
    type: Number
  },
  compressor3_energy_reading: {
    type: Number
  },
  compressor4_energy_reading: {
    type: Number
  }
},{ collection: 'HVACLogger' });

var consumptionLogger = new Schema({
  sourceAPI: {
    type: String
  },
  loggerType: {
    type: String
  },
  battery_percentage: {
    type: Number
  },
  battery_voltage: {
    type: Number
  },
  targetName: {
    type: String
  },
  timestamp: {
    type: String
  },
  sensorID: {
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
  location: {
    type: String
  },
  name: {
    type: String
  },
  photos: {
    type: String
  },
  portNumber: {
    type: Number
  },
  K_factor: {
    type: Number
  },
  kwh_reading: {
    type: Number
  },
  cuft_per_pulse: {
    type: Number
  },
  pulse_reading: {
    type: Number
  },
  photos: {
    type: String
  },
  suites: {
    type: Schema.Types.ObjectId,
    ref: 'suites'
  },
  HVAC: {
    type: Schema.Types.ObjectId,
    ref: 'HVAC'
  },
  utilityMeter: {
    type: Schema.Types.ObjectId,
    ref: 'utilityMeter'
  },
  controller: {
    type: Schema.Types.ObjectId,
    ref: 'controller'
  },
  gateway: {
    type: Schema.Types.ObjectId,
    ref: 'gateway'
  },
  waterHeater: {
    type: Schema.Types.ObjectId,
    ref: 'waterHeater'
  },
  serviceContractor: {
    type: Schema.Types.ObjectId,
    ref: 'serviceContractor'
  },
  alertStatusChange: {
    type: Schema.Types.ObjectId,
    ref: 'alertStatusChange'
  },
  buildings: {
    type: Schema.Types.ObjectId,
    ref: 'buildings'
  }
},{ collection: 'consumptionLogger' });

var parentbuildings = new Schema({
  name: {
    type: String
  },
  owner: {
    type: String
  },
  address: {
    type: String
  },
  phone: {
    type: String
  },
  imageLink: {
    type: String
  },
  buildings: [{
    type: Schema.Types.ObjectId,
    ref: 'buildings'
  }]
},{ collection: 'parentbuildings' });

var serviceCheckAlerts = new Schema({
  buildingId: {
    type: Schema.Types.ObjectId
  },
  status: {
    type: String
  },
  shortDesc: {
    type: String
  },
  detailedDesc: {
    type: String
  },
  alertCategory: {
    type: String
  },
  dateReported: {
    type: Date
  },
  servicesNeeded: [{
    type: String
  }],
  serviceDate: {
    type: Date
  },
  serviceTime: {
    type: String
  },
  responsibleParty: {
    type: String
  },
  createdAt: {
    type: Date
  },
  updatedAt: {
    type: Date
  },
  notes: {
    type: String
  },
  alerts: {
    type: Schema.Types.ObjectId,
    ref: 'alerts'
  },
  alertStatusChange: {
    type: Schema.Types.ObjectId,
    ref: 'alertStatusChange'
  },
  buildings: {
    type: Schema.Types.ObjectId,
    ref: 'buildings'
  }
},{ collection: 'serviceCheckAlerts' });

const newAlertModel = mongoose.model('alerts', alerts)
for (let i = 0; i < dummyRecordsCount; i++) {
  var data = dummy(newAlertModel, {
    returnDate: true
  })
  var Object = new newAlertModel(data)
  Object.save(function(err){
    if(err) console.log(err); 
  });
  console.log("writing alerts record "+i);
}

const newAlertMessageModel = mongoose.model('alertMessage', alertMessage)
for (let i = 0; i < dummyRecordsCount; i++) {
  var data = dummy(newAlertMessageModel, {
    returnDate: true
  })
  var Object = new newAlertMessageModel(data)
  Object.save(function(err){
    if(err) console.log(err); 
  });
  console.log("writing alertMessage record "+i);
}

const newAlertStatusChangeModel = mongoose.model('alertStatusChange', alertStatusChange)
for (let i = 0; i < dummyRecordsCount; i++) {
  var data = dummy(newAlertStatusChangeModel, {
    returnDate: true
  })
  var Object = new newAlertStatusChangeModel(data)
  Object.save(function(err){
    if(err) console.log(err); 
  });
  console.log("writing alertStatusChange record "+i);
}

// const newEventLoggerModel = mongoose.model('eventLogger', eventLogger)
// for (let i = 0; i < dummyRecordsCount; i++) {
//   var data = dummy(newEventLoggerModel, {
//     returnDate: true
//   })
//   var Object = new newEventLoggerModel(data)
//   Object.save(function(err){
//     if(err) console.log(err); 
//   });
//   console.log("writing eventLogger record "+i);
// }

// const newConsumptionLoggerModel = mongoose.model('consumptionLogger', consumptionLogger)
// for (let i = 0; i < dummyRecordsCount; i++) {
//   var data = dummy(newConsumptionLoggerModel, {
//     returnDate: true
//   })
//   var Object = new newConsumptionLoggerModel(data)
//   Object.save(function(err){
//     if(err) console.log(err); 
//   });
//   console.log("writing consumptionLogger record "+i);
// }

const newOutdoorAQIModel = mongoose.model('outdoorAQI', outdoorAQI)
for (let i = 0; i < dummyRecordsCount; i++) {
  var data = dummy(newOutdoorAQIModel, {
    returnDate: true
  })
  var Object = new newOutdoorAQIModel(data)
  Object.save(function(err){
    if(err) console.log(err); 
  });
  console.log("writing outdoorAQI record "+i);
}

const newNationalWeatherModel = mongoose.model('nationalWeather', nationalWeather)
for (let i = 0; i < dummyRecordsCount; i++) {
  var data = dummy(newNationalWeatherModel, {
    returnDate: true
  })
  var Object = new newNationalWeatherModel(data)
  Object.save(function(err){
    if(err) console.log(err); 
  });
  console.log("writing nationalWeather record "+i);
}

// const newServiceCheckModel = mongoose.model('serviceCheck', serviceCheck)
// for (let i = 0; i < dummyRecordsCount; i++) {
//   var data = dummy(newServiceCheckModel, {
//     returnDate: true
//   })
//   var Object = new newServiceCheckModel(data)
//   Object.save(function(err){
//     if(err) console.log(err); 
//   });
//   console.log("writing serviceCheck record "+i);
// }

// const newServiceCheckAlertsModel = mongoose.model('serviceCheckAlerts', serviceCheckAlerts)
// for (let i = 0; i < dummyRecordsCount; i++) {
//   var data = dummy(newServiceCheckAlertsModel, {
//     returnDate: true
//   })
//   var Object = new newServiceCheckAlertsModel(data)
//   Object.save(function(err){
//     if(err) console.log(err); 
//   });
//   console.log("writing serviceCheckAlerts record "+i);
// }

// const HAVCLoggerModel = mongoose.model('HVACLogger', HVACLogger)
// for (let i = 0; i < dummyRecordsCount; i++) {
//   var data = dummy(HAVCLoggerModel, {
//     returnDate: true
//   })
//   var Object = new HAVCLoggerModel(data)
//   Object.save(function(err){
//     if(err) console.log(err); 
//   });
//   console.log("writing HVACLogger record "+i);
// }

// const environmentalModel = mongoose.model('environmentalLogger', environmentalLogger)
// for (let i = 0; i < dummyRecordsCount; i++) {
//   var data = dummy(environmentalModel, {
//     returnDate: true
//   })
//   var Object = new environmentalModel(data)
//   Object.save(function(err){
//     if(err) console.log(err); 
//   });
//   console.log("writing environmentalLogger record "+i);
// }

// const buildingModel = mongoose.model('buildings', buildings)
// for (let i = 0; i < dummyRecordsCount; i++) {
//   var data = dummy(buildingModel, {
//     returnDate: true
//   })
//   var Object = new buildingModel(data)
//   Object.save(function(err){
//     if(err) console.log(err); 
//   });
//   console.log("writing buildings record "+i);
// }

// const parentBuildingModel = mongoose.model('parentbuildings', parentbuildings)
// for (let i = 0; i < dummyRecordsCount; i++) {
//   var data = dummy(parentBuildingModel, {
//     returnDate: true
//   })
//   var Object = new parentBuildingModel(data)
//   Object.save(function(err){
//     if(err) console.log(err); 
//   });
//   console.log("writing parentbuildings record "+i);
// }

const utilityAccountsModel = mongoose.model('utilityAccounts', utilityAccounts)
for (let i = 0; i < dummyRecordsCount; i++) {
  var data = dummy(utilityAccountsModel, {
    returnDate: true
  })
  var Object = new utilityAccountsModel(data)
  Object.save(function(err){
    if(err) console.log(err); 
  });
  console.log("writing utilityAccounts record "+i);
}

const buildingOwnerModel = mongoose.model('buildingOwner', buildingOwner)
for (let i = 0; i < dummyRecordsCount; i++) {
  var data = dummy(buildingOwnerModel, {
    returnDate: true
  })
  var Object = new buildingOwnerModel(data)
  Object.save(function(err){
    if(err) console.log(err); 
  });
  console.log("writing buildingOwner record "+i);
}

// const gatewayModel = mongoose.model('gateway', gateway)
// for (let i = 0; i < dummyRecordsCount; i++) {
//   var data = dummy(gatewayModel, {
//     returnDate: true
//   })
//   var Object = new gatewayModel(data)
//   Object.save(function(err){
//     if(err) console.log(err); 
//   });
//   console.log("writing gateway record "+i);
// }

// const userModel = mongoose.model('users', users)
// for (let i = 0; i < dummyRecordsCount; i++) {
//   var data = dummy(userModel, {
//     returnDate: true
//   })
//   var Object = new userModel(data)
//   Object.save(function(err){
//     if(err) console.log(err); 
//   });
//   console.log("writing users record "+i);
// }

const propertyManagerModel = mongoose.model('propertyManager', propertyManager)
for (let i = 0; i < dummyRecordsCount; i++) {
  var data = dummy(propertyManagerModel, {
    returnDate: true
  })
  var Object = new propertyManagerModel(data)
  Object.save(function(err){
    if(err) console.log(err); 
  });
  console.log("writing propertyManager record "+i);
}

const suitesModel = mongoose.model('suites', suites)
for (let i = 0; i < dummyRecordsCount; i++) {
  var data = dummy(suitesModel, {
    returnDate: true
  })
  var Object = new suitesModel(data)
  Object.save(function(err){
    if(err) console.log(err); 
  });
  console.log("writing suites record "+i);
}

// const utilityMeterModel = mongoose.model('utilityMeter', utilityMeter)
// for (let i = 0; i < dummyRecordsCount; i++) {
//   var data = dummy(utilityMeterModel, {
//     returnDate: true
//   })
//   var Object = new utilityMeterModel(data)
//   Object.save(function(err){
//     if(err) console.log(err); 
//   });
//   console.log("writing utilityMeter record "+i);
// }

const WaterHeaterModel = mongoose.model('waterHeater', waterHeater)
for (let i = 0; i < dummyRecordsCount; i++) {
  var data = dummy(WaterHeaterModel, {
    returnDate: true
  })
  var Object = new WaterHeaterModel(data)
  Object.save(function(err){
    if(err) console.log(err); 
  });
  console.log("writing waterHeater record "+i);
}

const HVACModel = mongoose.model('HVAC', HVAC)
for (let i = 0; i < dummyRecordsCount; i++) {
  var data = dummy(HVACModel, {
    returnDate: true
  })
  var Object = new HVACModel(data)
  Object.save(function(err){
    if(err) console.log(err); 
  });
  console.log("writing HVAC record "+i);
}

const tenantModel = mongoose.model('tenant', tenant)
for (let i = 0; i < dummyRecordsCount; i++) {
  var data = dummy(tenantModel, {
    returnDate: true
  })
  var Object = new tenantModel(data)
  Object.save(function(err){
    if(err) console.log(err); 
  });
  console.log("writing tenant record "+i);
}

const serviceContractorModel = mongoose.model('serviceContractor', serviceContractor)
for (let i = 0; i < dummyRecordsCount; i++) {
  var data = dummy(serviceContractorModel, {
    returnDate: true
  })
  var Object = new serviceContractorModel(data)
  Object.save(function(err){
    if(err) console.log(err); 
  });
  console.log("writing serviceContractor record "+i);
}

const controllerModel = mongoose.model('controller', controller)
for (let i = 0; i < dummyRecordsCount; i++) {
  var data = dummy(controllerModel, {
    returnDate: true
  })
  var Object = new controllerModel(data)
  Object.save(function(err){
    if(err) console.log(err); 
  });
  console.log("writing controller record "+i);
}

const thermoStatModel = mongoose.model('thermostat', thermostat)
for (let i = 0; i < dummyRecordsCount; i++) {
  var data = dummy(thermoStatModel, {
    returnDate: true
  })
  var Object = new thermoStatModel(data)
  Object.save(function(err){
    if(err) console.log(err); 
  });
  console.log("writing thermostat record "+i);
}

console.log("\nAll writes finished, press ctrl+c to exit this program.\n");


