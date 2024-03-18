const haloS = require('../../lib/haloS')

// our private network key to use for all communication
const ourNetworkKey = haloS.createNetworkKey("example@example.com", "password");
var ourHaloCloudKey = haloS.createHaloCloudKey("josef.c.mueller@gmail.com", "03Sw77X&fS^m", null, "/company/paragonrobotics.com/sales");

var options = {
    type: "tcp",
    address: "paragonrobotics.com",
    key: ourHaloCloudKey,
    closeCallback: function () {
        console.log("connection closed!");
    }
};

// start up the haloS environment
haloS.initialize();

// set start time to begin reading data from
const startTime = new Date("AUG 10 2021");
// console.log("s", startTime)
// end time is now
const endTime = new Date();

const DEVICE_PATH = "/company/paragonrobotics.com/device/transform/22212/1/122"

haloS.connectToHaloCloud("tcp", "paragonrobotics.com", ourHaloCloudKey, null, function (isConnected) {

    console.log("isConnected: " + isConnected);
    
    haloS["readRecordedData"]( DEVICE_PATH+ "/machine/2", startTime, endTime, function (data, err) {

        let xData = data.xData
        xData = xData.map(time => (new Date(time)))

        let yData = data.yData
        yData = yData.map(val => val[0] - 273.15)
        
        console.log("xData", xData)
        console.log("yData", yData)
        console.log(err);

        haloS["readValue"](DEVICE_PATH + "/machine/2/value", (val, err1) => {
            console.log("val", val);
            console.log("err1", err1);
            haloS.shutdown();
        });

    });
});



// const sensor = "/company/paragonrobotics.com/device/transform/22212/1/122/machine/3"
// const sensor = "/company/paragonrobotics.com/device/transform/20102/1/649/machine/3"

// haloS.connectToHaloCloud("tcp", "paragonrobotics.com", ourHaloCloudKey,
//     ourNetworkKey, function (isConnected) {
//         if (isConnected) {
//             console.log("Connection successful!")
//             const sensor = "/company/paragonrobotics.com/device/transform/22212/1/122/machine/2"
//             haloS.readValue(sensor, (r) => {
//                 console.log("response", r)
//             })

//             // set start time to begin reading data from
//             var startTime = new Date("JUL 23 2021");
//             // end time is now
//             var endTime = new Date();

//             haloS.readRecordedData(sensor, startTime, endTime, function (dataObject) {
//                 console.log("Data:" + JSON.stringify(dataObject));
//             });
//         }
//     })