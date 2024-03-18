var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const ParentBuildingSchema = new Schema({
  name: {
    type: String
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User"
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
    ref: 'Building'
  }]
}, { collection: 'parentBuildings'} );

const ParentBuilding = mongoose.model('ParentBuilding', ParentBuildingSchema)
module.exports = ParentBuilding
