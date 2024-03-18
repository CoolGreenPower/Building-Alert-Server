const User = require("../../models/UserModel");
const LOGGER = require("../../logger/logger");
const Building = require("../../models/BuildingModel");
const Device = require("../../models/DeviceModel");
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken");
const Tenant = require("../../models/TenantModel");
/**
 * USER CONTROL
 */
const getAllUsers = async (req, res) => {
  try {   
    if (req.query.select) {
        let selection = req.query.select.split(",");

        const users = await User.find().select(selection);
        return res.status(200).json(users);
    }
    const users = await User.find().limit(req.query.count);
    LOGGER.debug("Retrieved all users")
    res.status(200).json(users);
  } catch(err) {
      LOGGER.error("Error retrieving all users")
      res.status(500).json(err);
  }
}
  
const getUserById = async (req, res) => {
  try {
    const query = User.findById(req.params.id);

    if (req.query.populate === "true") {
        query.populate("buildings");
    }

    const user = await query.exec();
    LOGGER.debug("Retrieved user")

    res.status(200).json(user);
  } catch(err) {
      LOGGER.error("Error retrieving user")
      res.status(500).json(err);
  }
}

const updateUser = async(req, res) => {
    try {
      // forbid certain fields from being updated
      // if you can figure out a better way to do this, please do
      if (req.body.buildings || req.body.tenants || 
          req.body.verified) {
          return res.status(400).json("Invalid update to immutable field")
      }

      const updatedUser = await User.findByIdAndUpdate(req.params.id, 
          { $set: req.body }, 
          { new: true });
      res.status(200).json(updatedUser);
    } catch(err) {
        res.status(500).json(err);
    }
}

// pretty expensive operation
const getBuildingUsers = async(req, res) => {
    try {
        // find the tenants with the buildingId (since tenant users )
        const tenants = await Tenant.find({ buildingId: req.params.buildingId }).select("users").populate("users", "_id name email username permissions");
        const tenantUsers = tenants.map(tenant => tenant.users).flat();

        // find top level users
        const users = await User.find({ buildings: { $in: [req.params.buildingId]  } }).select("_id name email username permissions");

        // get the ids of the top level users
        const topUserIds = users.map(user => String(user._id));
        //console.log(topUserIds);
        // filter the tenant users to remove the top level users (since top level users are also part of tenant user lists)
        const filteredTenants = tenantUsers.filter(tenantUser => {
            return !topUserIds.includes(String(tenantUser._id))
        })

        res.status(200).json([...users, ...filteredTenants]);
    } catch(err) {
        res.status(500).json(err);
    }
}

const getTopBuildingUsers = async(req, res) => {
    try {
        const users = await User.find({ buildings: { $in: [req.params.buildingId]  } }).select("_id name username permissions");
        res.status(200).json(users);
    } catch(err) {
        res.status(500).json(err);
    }
}

const login = async(req, res) => {
    try {
      const user = await User.findOne({ 
        $or: [{ username: req.body.username }, { email: req.body.email }] 
      });
      //console.log(user);
      if (!user) { return res.status(404).json("User not found"); }
      if (user.permissions != "admin") {
          return res.status(401).json("User is not an admin");
      }

      const isCorrect = await bcrypt.compare(req.body.password, user.password);
      if (!isCorrect) { return res.status(400).json("Wrong credentials"); }


      const token = jwt.sign(
          {id: user._id, permissions: user.permissions}, 
          process.env.SECRET,
          { expiresIn: Math.floor(Date.now() / 1000) + 60 * 60 * 24 } // 24 hours
      );

      LOGGER.debug(`Signing in user: ${user.username} `)
      res.cookie("access_token", token, {
          httpOnly: true, // this should always be here
          sameSite:"strict", // remove this if its causing issues
          secure: true, // and this,
          maxAge: 1000 * 60 * 60 * 24
      }).status(302).redirect("/admin")
    } catch(err) {
        res.status(500).json(err);
    }
}
const loginPage = async(req, res) => {
    try {
        res.redirect("/adminlogin");
    } catch(err) {
 
        res.status(500).json(err);
    }
}
const logout = async(req, res) => {
    try {
        res.clearCookie("access_token", {
            httpOnly: true, // this should always be here
            sameSite:"strict", // remove this if its causing issues
            secure: true, // and this,
            maxAge: 1000 * 60 * 60 * 24
        }).status(200).json("Logged out")
    } catch(err) {
        res.status(500).json(err);
    }
}

  



  


  
module.exports = {
    getAllUsers,
    getUserById,
    updateUser,
    getBuildingUsers,
    getTopBuildingUsers,
    login,
    loginPage,
    logout
}