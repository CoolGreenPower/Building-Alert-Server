# BasicPro backend (DEPRECATED)
Handles server routing, requests, etc. 

## Important
#### Any commits->pushes to the `server` directory or the `githubactions` directory trigger a pipeline to push the server into the production server. You can see this process in the "actions" tab in github.

#### **It is imperative that you update the `./src/routes/types.js` for updates you make to the schemas. It helps keep our types documented. If you wish to move the types documentation to another location, ensure to document that.**

Down the line, there should be plans to integrate a test/development environment where the live website can be tested before being pushed to production. Within the pipeline, tests should be done on the code as well.

## Getting Started
1. Clone this repository
2. Navigate to the project route ./server
3. Run `npm install`
4. Create a .env file and populate it with API keys (found in our documentation) or here [EnvVars](https://coolgreenpower.sharepoint.com/:t:/g/EbIcgT3RxNtFgoxoRIX4FbsBDzkkUyiVdpLk6UXC9oVrxg?e=KVSQAQ)
5. Run `nodemon server`

## Documentation
### API Documentation
API Documentation uses [ApiDoc](https://apidocjs.com/) to easily convert inline JSDoc into a webpage for API documentation.

Base URL: http://localhost:8080 (default port: 8080)

`npx apidoc -i ./src/routes -o apidoc` in ./server to generate new documentation 

Api Documentation is located in `/server/apidoc/index.html` or on [BuildingAssure](https://buildingassure.azurewebsites.net/documentation)

### Project Documentation
Refer to [Documentation](https://docs.google.com/document/d/1GAV_lFS8iFfdCQDXb0gssoQZn3idswALXQcJYAsJ41I/edit?usp=sharing)

### Type Documentation
Refer to [Documentation](https://docs.google.com/document/d/1GAV_lFS8iFfdCQDXb0gssoQZn3idswALXQcJYAsJ41I/edit?usp=sharing)



## Current Functionality
Refer to [Documentation](https://docs.google.com/document/d/1GAV_lFS8iFfdCQDXb0gssoQZn3idswALXQcJYAsJ41I/edit?usp=sharing) under Web Server -> Current Funtionality

## TODOS

## Structure
### Routes
These are in the `./src/routes` folder

`adminRoute.js` - All admin routes

`alertRoute.js` - All alerts

`assetRoute.js` - All assets (HVAC, thermostats, etc.)

`auth.js` - Signin / signout / verification

`buildingRoute.js` - Building CRUD

`dataRoute.js` - Data from all third-party sources

`deviceRoute.js` - Gateway and sensor CRUD (gateways are groupings of sensors based on source api)

`DTRoute.js` - Deprecated

`parentBuildingRoute.js` - Parent building (building groups) CRUD

`PRRoute.js` - Deprecated

`serviceCheckAlertRoute.js` - Deprecated

`suiteRoute.js` - Suite (physical rooms) CRUD

`tenantRoute.js` - Tenant (not user, but business tenant) CRUD
- Tenants attach to a suite

`userRoute.js` - User RUD (no create, thats for `auth.js`)

`utilitiesRoute.js` - Utility bill CRUD

... more will be added when more routes are present

## Notes
- Might want to try [Mongoose Streams](https://mongoosejs.com/docs/models.html#change-streams) for providing real-time updates that occur in our DB
- For magic login links - [Magic Links](https://medium.com/@aleksandrasays/sending-magic-links-with-nodejs-765a8686996)
