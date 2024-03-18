const express = require('express')
const enableWs = require("express-ws")
const bodyParser = express.json()
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config();
const cookieParser = require("cookie-parser")
const fileUpload = require("express-fileupload")
//const user = require('./src/models/userModel')
var path = require('path');
const { alertWebsocket, wsNotifyUser } = require("./src/utils/alertsWebsocket")
const authenticateToken = require("./src/utils/authentication")
const requireAdmin = require("./src/utils/requireAdmin")

const app = express()

// routes imports
//const serviceRecordRoute = require('./src/routes/serviceRecordRoute')
const authRoute = require('./src/routes/auth')
const alerts = require('./src/routes/alertRoute')
const serviceCheckAlerts = require('./src/routes/serviceCheckAlertRoute')
const buildings = require('./src/routes/buildingRoute')
const DT = require('./src/routes/DTRoute')
const PR = require('./src/routes/PRRoute')
const userRoute = require('./src/routes/userRoute')
const dataRoute = require('./src/routes/dataRoute')
const deviceRoute = require('./src/routes/deviceRoute')
const parentRoute = require("./src/routes/parentBuildingRoute")
const assetRoute = require("./src/routes/assetRoute")
const suiteRoute = require("./src/routes/suiteRoute")
const utilitiesRoute = require("./src/routes/utilitiesRoute")
const tenantRoute = require("./src/routes/tenantRoute")
const adminRoute = require("./src/routes/adminRoute")
const imageRoute = require("./src/routes/imageRoute")



mongoose.connect(`${process.env.DATABASE_URL}`, {
    useNewUrlParser: true, 
    useUnifiedTopology: true
}).then(() => {
    console.log("Connected to DB");
}).catch(err => {
    console.log(err);
});
mongoose.Promise = Promise


// websockets example, this can be used to implement real time app updates
// https://stackoverflow.com/questions/16280747/sending-message-to-a-specific-connected-users-using-websocket
// enableWs(app);

// const Alert = require('./src/models/AlertModel')
// Alert.watch().on('change', data=> { wsNotifyUser(data); })

// app.ws('/alertws', alertWebsocket);


// options
app.engine('html', require('ejs').renderFile);
app.use(bodyParser);
app.use(cors({
    origin: ['http://localhost:3000'],
    credentials: true
}));
// app.use(cors());
// app.options('*', cors());
app.use(cookieParser());

// file upload rules
// https://www.npmjs.com/package/express-fileupload
app.use(fileUpload({
    createParentPath: true,
    safeFileNames: true,
    abortOnLimit: true,
    preserveExtension: true,
    responseOnLimit: "File size limit has been reached",
    limits: { fileSize: 30000000, files: 5 } // this is 30mb with 5 files max
}))

http routes
app.use('/api/parentbuildings', parentRoute)
//app.use('/api/serviceRecord', serviceRecordRoute)
app.use('/api/auth', authRoute)
app.use('/api/alerts', alerts)
app.use('/api/serviceCheckAlerts', serviceCheckAlerts)
app.use('/api/buildings', buildings)
app.use('/api/dt', DT);
app.use('/api/pr', PR);
app.use('/api/users', userRoute);
app.use('/api/data', dataRoute);
app.use('/api/devices', deviceRoute)
app.use('/api/assets', assetRoute)
app.use('/api/suites', suiteRoute)
app.use('/api/utilities', utilitiesRoute)
app.use('/api/tenants', tenantRoute)
app.use('/api/admin', adminRoute)
app.use('/api/images', imageRoute)


// for the api documentation. Loads the index.html into '/'
app.use('/documentation',express.static(path.join(__dirname,'apidoc')));
// icon
app.use('/favicon.ico', express.static(path.join(__dirname, "favicon.ico")));
//app.get('/', (req, res) => {res.redirect('/documentation')})


// admin forms
// all of the admin forms use the admin routes
app.use('/adminlogin', express.static(path.join(__dirname, "views/admin/login")));
app.use("/adminforms", (req, res, next) => { 
        // redirect if not logged in to anything
        req.cookies.access_token ? next() : res.redirect("/adminlogin") 
    }
    ,authenticateToken, requireAdmin, express.static(path.join(__dirname, "views/admin"))
);
// this is so that you can reach /admin without getting a 404
app.get("/admin", (req, res, next) => { 
    // redirect if not logged in to anything
    req.cookies.access_token ? next() : res.redirect("/adminlogin") 
}, (req, res) => { res.sendFile(path.join(__dirname, "./adminbuild", "index.html")); });
// loads all the admin client assets
app.use(express.static(path.join(__dirname, "adminbuild")));
// react app is client routed so route all requests to index.html
app.get("/admin/*", 
(req, res, next) => { 
    // redirect if not logged in to anything
    req.cookies.access_token ? next() : res.redirect("/adminlogin") 
}, (req, res) => {
    res.sendFile(path.join(__dirname, "./adminbuild", "index.html"));
});



const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
    console.log(`listening on ` + PORT)
});




app.use(express.static(path.join(__dirname, '/../client/build')));
      
    // Handle React routing, return all requests to React app
    app.get('*', function(req, res) {
      res.sendFile(path.join(__dirname, '/../client/build', 'index.html'));
});

if (process.env.NODE_ENV != 'development') {
    // Serve any static files
    
}

