

/**
 * Ensure to make the keynames are the same as the field name in the database
 */
const formFields = {
    gateway: {
        name: {
            label: "Gateway Name",
            type: "text",
        },
        location: {
            label: "Location",
            type: "text",
        },
        sourceAPI: {
            label: "Source API",
            type: "select",
            options: ["ParagonRobotics", "AmbientWeather", "DisruptiveTechnologies", "Vataverks", "EmporiaEnergy"]
        },


        // there is separate handling for devices. See addDeviceToGateway()
        // treat this as if its own object and not nested in gateway
        devices: {

            universal: {
                device: {
                    label: "Device Name",
                    type: "text",
                    required: true
                },
                loggerType: {
                    label: "Logger Type",
                    type: "select",
                    required: true,
                    options: [
                        "HVAC", 
                        "ambientWeather", 
                        "consumption",
                        "deviceStatus",
                        "environmental",
                        "event",
                    ],
                },
                location: {
                    label: "Location",
                    type: "object",
                    options: {
                        suiteId: {
                            label: "Suite Id (If part of a suite)",
                            type: "text",
                        },
                        data: {
                            label: "Location Description",
                            type: "text",
                        },
                        asset: {
                            label: "Asset Id (If attached to asset)",
                            type: "text",
                        },
                        outdoors: {
                            label: "Outdoors? (true/false)",
                            type: "select",
                            options: ["true", "false"]
                        }
                    }

                },
                deviceSource: {
                    label: "Device Source",
                    type: "select",
                    options: ["ParagonRobotics", "AmbientWeather", "DisruptiveTechnologies", "Vataverks", "EmporiaEnergy"],
                    readOnly: true
                }
            },
            // fields for each source api
            DisruptiveTechnologies: {
                device: {
                    label: "Device Name",
                    type: "text",
                    required: true
                },
                projectId: {
                    label: "DT Project Id",
                    type: "text",
                    required: true
                },
                sensorId: {
                    label: "DT Sensor Id",
                    type: "text",
                    required: true
                }
            },
            ParagonRobotics: {
                devicePath: {
                    label: "PR Device Path (/company/paragonrobotics.com/device/refresh/31/1/159)",
                    type: "text",
                    required: true
                },
                deviceModel: {
                    label: "PR Device Model (DB31, N20) Caps sensitive",
                    type: "text",
                    required: true
                },
                machines: {
                    label: "PR Machines *",
                    type: "object",
                    options: {
                        machine_1_sensorType: {
                            label: "Machine 1 Sensor Type",
                            required: true,
                            type: "select",
                            options: ["temperature", "returnAir", "supplyAir", "humidity", "usbPower", "batteryVoltage", "AC_current"]
                        },
                        machine_1_sensorPath: {
                            required: true,
                            label: "Machine 1 Sensor Path (/machine/2/value)",
                            type: "text",
                        },
                        machine_2_sensorType: {
                            label: "Machine 2 Sensor Type",
                            type: "select",
                            options: ["temperature", "returnAir", "supplyAir", "humidity", "usbPower", "batteryVoltage", "AC_current"]
                        },
                        machine_2_sensorPath: {
                            label: "Machine 2 Sensor Path",
                            type: "text",
                        },
                        machine_3_sensorType: {
                            label: "Machine 3 Sensor Type",
                            type: "select",
                            options: ["temperature", "returnAir", "supplyAir", "humidity", "usbPower", "batteryVoltage", "AC_current"]
                        },
                        machine_3_sensorPath: {
                            label: "Machine 3 Sensor Path",
                            type: "text",
                        },
                        machine_4_sensorType: {
                            label: "Machine 4 Sensor Type",
                            type: "select",
                            options: ["temperature", "returnAir", "supplyAir", "humidity", "usbPower", "batteryVoltage", "AC_current"]
                        },
                        machine_4_sensorPath: {
                            label: "Machine 4 Sensor Path",
                            type: "text",
                        },
                        machine_5_sensorType: {
                            label: "Machine 5 Sensor Type",
                            type: "select",
                            options: ["temperature", "returnAir", "supplyAir", "humidity", "usbPower", "batteryVoltage", "AC_current"]
                        },
                        machine_5_sensorPath: {
                            label: "Machine 5 Sensor Path",
                            type: "text",
                        }
                    }
                }
            },
            AmbientWeather: {
                macAddress: {
                    label: "Ambient Weather Mac Address",
                    type: "text",
                },
                ambientDeviceId: {
                    label: "Ambient Weather Device Id",
                    type: "text",
                    required: true
                }
            },
            Vataverks: {
                vataverksToken: {
                    label: "Vataverks Token (Should be the same as what is setup on the physical Vatavkers sensor)",
                    type: "text",
                    required: true
                },
                macAddress: {
                    label: "Vataverks Mac Address",
                    type: "text",
                    required: true
                },
                kFactor: {
                    label: "K Factor",
                    type: "number",
                    step: 0.0001
                },
                utilityType: {
                    label: "Utility Type",
                    type: "select",
                    options: ["electricity", "water", "gas"],
                    required: true
                }
            },
            EmporiaEnergy: {
                sensorId: {
                    label: "Emporia Energy Device Id",
                    type: "text",
                    required: true
                },
                channels: {
                    label: "Emporia Energy Channels",
                    type: "object",
                    options: {
                        // channel_1_channelNumber: {
                        // label: "Channel 1 Number",
                        // type: "number",
                        // step: 1,
                        // required: true
                        // },
                        // channel_1_name: {
                        // label: "Channel 1 Name",
                        // type: "text",
                        // },
                        // channel_1_energyDirection: {
                        // label: "Channel 1 Energy Direction",
                        // type: "text",
                        // },
                        // channel_1_type: {
                        // label: "Channel 1 Type",
                        // type: "text",
                        // },
                        // channel_1_subType: {
                        // label: "Channel 1 Sub Type",
                        // type: "text",
                        // },
                    
                        // channel_2_channel: {
                        // label: "Channel 2 Number",
                        // type: "number",
                        // step: 1,
        
                        // },
                        // channel_2_channelName: {
                        // label: "Channel 2 Name",
                        // type: "text",
                        // },
                        // channel_2_energyDirection: {
                        // label: "Channel 2 Energy Direction",
                        // type: "text",
                        // },
                        // channel_2_subType: {
                        // label: "Channel 2 Sub Type",
                        // type: "text",
                        // },
                    
                        // channel_3_channel: {
                        // label: "Channel 3 Number",
                        // type: "number",
                        // step: 1,
     
                        // },
                        // channel_3_channelName: {
                        // label: "Channel 3 Name",
                        // type: "text",
                        // },
                        // channel_3_energyDirection: {
                        // label: "Channel 3 Energy Direction",
                        // type: "text",
                        // },
                        // channel_3_subType: {
                        // label: "Channel 3 Sub Type",
                        // type: "text",
                        // },

                        // channel_4_channel: {
                        // label: "Channel 4 Number",
                        // type: "number",
                        // step: 1,
      
                        // },
                        // channel_4_channelName: {
                        // label: "Channel 4 Name",
                        // type: "text",
                        // },
                        // channel_4_energyDirection: {
                        // label: "Channel 4 Energy Direction",
                        // type: "text",
                        // },
                        // channel_4_subType: {
                        // label: "Channel 4 Sub Type",
                        // type: "text",
                        // },

                        // channel_5_channel: {
                        // label: "Channel 5 Number",
                        // type: "number",
                        // step: 1,
     
                        // },
                        // channel_5_channelName: {
                        // label: "Channel 5 Name",
                        // type: "text",
                        // },
                        // channel_5_energyDirection: {
                        // label: "Channel 5 Energy Direction",
                        // type: "text",
                        // },
                        // channel_5_subType: {
                        // label: "Channel 5 Sub Type",
                        // type: "text",
                        // },
                        
                        // channel_6_channel: {
                        // label: "Channel 6 Number",
                        // type: "number",
                        // step: 1,
       
                        // },
                        // channel_6_channelName: {
                        // label: "Channel 6 Name",
                        // type: "text",
                        // },
                        // channel_6_energyDirection: {
                        // label: "Channel 6 Energy Direction",
                        // type: "text",
                        // },
                        // channel_6_subType: {
                        // label: "Channel 6 Sub Type",
                        // type: "text",
                        // },
                        
                        // channel_7_channel: {
                        // label: "Channel 7 Number",
                        // type: "number",
                        // step: 1,
                    
                        // },
                        // channel_7_channelName: {
                        // label: "Channel 7 Name",
                        // type: "text",
                        // },
                        // channel_7_energyDirection: {
                        // label: "Channel 7 Energy Direction",
                        // type: "text",
                        // },
                        // channel_7_subType: {
                        // label: "Channel 7 Sub Type",
                        // type: "text",
                        // },
                        
                        // channel_8_channel: {
                        // label: "Channel 8 Number",
                        // type: "number",
                        // step: 1,
                   
                        // },
                        // channel_8_channelName: {
                        // label: "Channel 8 Name",
                        // type: "text",
                        // },
                        // channel_8_energyDirection: {
                        // label: "Channel 8 Energy Direction",
                        // type: "text",
                        // },
                        // channel_8_subType: {
                        // label: "Channel 8 Sub Type",
                        // type: "text",
                        // },
                        
                        // channel_9_channel: {
                        // label: "Channel 9 Number",
                        // type: "number",
                        // step: 1,
                  
                        // },
                        // channel_9_channelName: {
                        // label: "Channel 9 Name",
                        // type: "text",
                        // },
                        // channel_9_energyDirection: {
                        // label: "Channel 9 Energy Direction",
                        // type: "text",
                        // },
                        // channel_9_subType: {
                        // label: "Channel 9 Sub Type",
                        // type: "text",
                        // },
                        
                        // channel_10_channel: {
                        // label: "Channel 10 Number",
                        // type: "number",
                        // step: 1,
             
                        // },
                        // channel_10_channelName: {
                        // label: "Channel 10 Name",
                        // type: "text",
                        // },
                        // channel_10_energyDirection: {
                        // label: "Channel 10 Energy Direction",
                        // type: "text",
                        // },
                        // channel_10_subType: {
                        // label: "Channel 10 Sub Type",
                        // type: "text",
                        // },

                        // channel_11_channel: {
                        //     label: "Channel 11 Number",
                        //     type: "number",
                        //     step: 1,
                
                        // },
                        //   channel_11_channelName: {
                        //     label: "Channel 11 Name",
                        //     type: "text",
                        // },
                        //   channel_11_energyDirection: {
                        //     label: "Channel 11 Energy Direction",
                        //     type: "text",
                        // },
                        //   channel_11_subType: {
                        //     label: "Channel 11 Sub Type",
                        //     type: "text",
                        // },
                        //   channel_12_channel: {
                        //     label: "Channel 12 Number",
                        //     type: "number",
                        //     step: 1,
                  
                        // },
                        //   channel_12_channelName: {
                        //     label: "Channel 12 Name",
                        //     type: "text",
                        // },
                        //   channel_12_energyDirection: {
                        //     label: "Channel 12 Energy Direction",
                        //     type: "text",
                        // },
                        //   channel_12_subType: {
                        //     label: "Channel 12 Sub Type",
                        //     type: "text",
                        // },
                        //   channel_13_channel: {
                        //     label: "Channel 13 Number",
                        //     type: "number",
                        //     step: 1,
                  
                        // },
                        //   channel_13_channelName: {
                        //     label: "Channel 13 Name",
                        //     type: "text",
                        // },
                        //   channel_13_energyDirection: {
                        //     label: "Channel 13 Energy Direction",
                        //     type: "text",
                        // },
                        //   channel_13_subType: {
                        //     label: "Channel 13 Sub Type",
                        //     type: "text",
                        // },
                        //   channel_14_channel: {
                        //     label: "Channel 14 Number",
                        //     type: "number",
                        //     step: 1,
                  
                        // },
                        //   channel_14_channelName: {
                        //     label: "Channel 14 Name",
                        //     type: "text",
                        //   },
                        //   channel_14_energyDirection: {
                        //     label: "Channel 14 Energy Direction",
                        //     type: "text",
                        //   },
                        //   channel_14_subType: {
                        //     label: "Channel 14 Sub Type",
                        //     type: "text",
                        //   },
                        //   channel_15_channel: {
                        //     label: "Channel 15 Number",
                        //     type: "number",
                        //     step: 1,
                 
                        //   },
                        //   channel_15_channelName: {
                        //     label: "Channel 15 Name",
                        //     type: "text",
                        //   },
                        //   channel_15_energyDirection: {
                        //     label: "Channel 15 Energy Direction",
                        //     type: "text",
                        //   },
                        //   channel_15_subType: {
                        //     label: "Channel 15 Sub Type",
                        //     type: "text",
                        //   },
                        //   channel_16_channel: {
                        //     label: "Channel 16 Number",
                        //     type: "number",
                        //     step: 1,
                 
                        //   },
                        //   channel_16_channelName: {
                        //     label: "Channel 16 Name",
                        //     type: "text",
                        //   },
                        //   channel_16_energyDirection: {
                        //     label: "Channel 16 Energy Direction",
                        //     type: "text",
                        //   },
                        //   channel_16_subType: {
                        //     label: "Channel 16 Sub Type",
                        //     type: "text",
                        //   },
                        //   channel_17_channel: {
                        //     label: "Channel 17 Number",
                        //     type: "number",
                        //     step: 1,
                   
                        //   },
                        //   channel_17_channelName: {
                        //     label: "Channel 17 Name",
                        //     type: "text",
                        //   },
                        //   channel_17_energyDirection: {
                        //     label: "Channel 17 Energy Direction",
                        //     type: "text",
                        //   },
                        //   channel_17_subType: {
                        //     label: "Channel 17 Sub Type",
                        //     type: "text",
                        //   },
                        //   channel_18_channel: {
                        //     label: "Channel 18 Number",
                        //     type: "number",
                        //     step: 1,
              
                        //   },
                        //   channel_18_channelName: {
                        //     label: "Channel 18 Name",
                        //     type: "text",
                        //   },
                        //   channel_18_energyDirection: {
                        //     label: "Channel 18 Energy Direction",
                        //     type: "text",
                        //   },
                        //   channel_18_subType: {
                        //     label: "Channel 18 Sub Type",
                        //     type: "text",
                        //   },
                        //   channel_19_channel: {
                        //     label: "Channel 19 Number",
                        //     type: "number",
                        //     step: 1,
           
                        //   },
                        //   channel_19_channelName: {
                        //     label: "Channel 19 Name",
                        //     type: "text",
                        //   },
                        //   channel_19_energyDirection: {
                        //     label: "Channel 19 Energy Direction",
                        //     type: "text",
                        //   },
                        //   channel_19_subType: {
                        //     label: "Channel 19 Sub Type",
                        //     type: "text",
                        //   },
                        //   channel_20_channel: {
                        //     label: "Channel 20 Number",
                        //     type: "number",
                        //     step: 1,
              
                        //   },
                        //   channel_20_channelName: {
                        //     label: "Channel 20 Name",
                        //     type: "text",
                        //   },
                        //   channel_20_energyDirection: {
                        //     label: "Channel 20 Energy Direction",
                        //     type: "text",
                        //   },
                        //   channel_20_subType: {
                        //     label: "Channel 20 Sub Type",
                        //     type: "text",
                        //   },
                        
                    }
                }
            }

        }
    }
}

//const baseUrl = "https://buildingassure.azurewebsites.net/api";
//const baseUrl = "http://localhost:8080/api";

// set up the counts object since we want to keep track of the number of counts
var counts = {};
for (const section in formFields) {
    counts[section] = 0;
}


var deviceCounts = {};
var globalDeviceFields = {};

// the object that is inserted into and used to upload to the database
var reviewData = {};

var buildingId = null;

const editCodeReview = (codeSectionId, sectionName) => {
    let codeSection = document.getElementById(codeSectionId);
    let codeBlock = document.querySelector(`#${codeSectionId} pre`);

    let oldButton = document.querySelector(`#${codeSectionId} .edit-button`);
    let saveButton = document.createElement("button");
    saveButton.className = "edit-button";
    saveButton.innerHTML = "Save";
    codeSection.replaceChild(saveButton, oldButton);

    let editBlock = document.createElement("textarea");
    editBlock.style.width = "95%";
    editBlock.style.height = "40em";
    editBlock.value = codeBlock.innerHTML;
    
    codeSection.replaceChild(editBlock, codeBlock);

    saveButton.addEventListener("click", () => {
        // change local object
        try {
            // check if there are json parsing errors
            let error = document.querySelector(`#${codeSectionId} .error`);
            if (error) { codeSection.removeChild(error); }
            reviewData[sectionName] = JSON.parse(editBlock.value)

            // change back to old code block
            codeBlock.textContent = JSON.stringify(reviewData[sectionName], undefined, 3);
            codeSection.replaceChild(codeBlock, editBlock);
            codeSection.replaceChild(oldButton, saveButton);
        } catch(err) {
            let error = document.createElement("p");
            error.innerHTML = "Invalid JSON format";
            error.className = "error";
            error.style.color = "red";
            codeSection.appendChild(error);
        }

  
    })

}

// submit form also generates the review data and code blocks
const submitForm = (event) => {
    event.preventDefault();
    console.log("submitted form");
    reviewData = {};
    // get form data
    const form = document.getElementById("create-devices-form");
    let formData = new FormData(form);
    //console.log(formData);

    // remove the old review data from the page
    const reviewSection = document.getElementById("code-review-container");
    while (reviewSection.firstChild) {
        reviewSection.removeChild(reviewSection.lastChild);
    }

    console.log(formData);


    // get the data from the form and separate it into sections
    let data = Object.entries(formFields);

    // for each type section
    for (const section of data) {
    //for every item in the section depending on the section's name

        // create the array for the given section in the review data
        reviewData[`${section[0]}`] = [];

        // get the data for each field and insert into local reviewData
        for (i = 1; i <= counts[section[0]]; i++) {
        let entryData = {};
        let deviceArr = [];
        for (const entry of Object.entries(section[1])) {

            let fieldName = entry[0];
            let fieldData = entry[1];

            // -- Device handling -- //
            if (fieldName === "devices") {
                console.log(fieldName)
                for (j = 1; j <= deviceCounts[`${section[0]}-${i}`]; j++) {

                let deviceObj = {};
                for (const deviceField of Object.entries(globalDeviceFields[`${section[0]}-${i}`])) {
                    let deviceFieldData = deviceField[1];
  
                    // if the field is a device, then we do separate handling
                    if (deviceFieldData.type == "checkbox") {
                        let entry = formData.getAll(`${section[0]}-${i}-device-${j}-${deviceField[0]}`);
                        if (entry.length > 0) {
                            deviceObj[fieldName] = entry;
                        }
                    }
                    else if (deviceFieldData.array == true) {
        
                        let entry = formData.get(`${section[0]}-${i}-device-${j}`)
                        if (entry.trim() != "") {
                            let ids = [];
                            entry.trim().split(',').map(item => {
                                ids.push(item.trim());
                            })
                            deviceObj[deviceField[0]] = ids;
                        }
                    }
                    //this is purely for PR controller machines since they require some extra handling
                    else if (deviceFieldData.type == "object" && deviceField[0] == "machines") {
                        let machineArr = [];
                        for (k = 1; k <= Object.keys(deviceFieldData.options).length / 2; k++) {
                            let sensorType = formData.get(`${section[0]}-${i}-device-${j}-${deviceField[0]}-machine_${k}_sensorType`);
                            let sensorPath = formData.get(`${section[0]}-${i}-device-${j}-${deviceField[0]}-machine_${k}_sensorPath`);

                            if (sensorType.trim() !== "" && sensorPath.trim() !== "") {
                                let entry = {
                                    sensorType,
                                    sensorPath
                                }
                                machineArr.push(entry);
                            }
                        }
                        if (machineArr.length > 0) {
                            deviceObj[deviceField[0]] = machineArr;
                        }
                    }
                    //this is purely for Emporia machines since they require some extra handling
                    else if (deviceFieldData.type == "object" && deviceField[0] == "channels") {
                        let machineArr = [];
                        for (k = 1; k <= Object.keys(deviceFieldData.options).length / 5; k++) {
                            let channelNumber = formData.get(`${section[0]}-${i}-device-${j}-${deviceField[0]}-channel_${k}_channelNumber`);
                            let name = formData.get(`${section[0]}-${i}-device-${j}-${deviceField[0]}-channel_${k}_name`);
                            let energyDirection = formData.get(`${section[0]}-${i}-device-${j}-${deviceField[0]}-channel_${k}_energyDirection`);
                            let subType = formData.get(`${section[0]}-${i}-device-${j}-${deviceField[0]}-channel_${k}_subType`);
                            let type = formData.get(`${section[0]}-${i}-device-${j}-${deviceField[0]}-channel_${k}_type`);

                            if (channelNumber.trim() !== "" && name.trim() !== "") {
                                let entry = {
                                    channelNumber,
                                    name,
                                    energyDirection,
                                    type,
                                    subType
                                }
                                machineArr.push(entry);
                            }
                        }
                        if (machineArr.length > 0) {
                            deviceObj[deviceField[0]] = machineArr;
                        }
                    }
                    else if (deviceFieldData.type == "object") {
                        let objectData = {};
                        for (const field of Object.entries(deviceFieldData.options)) {
                            let entry = formData.get(`${section[0]}-${i}-device-${j}-${deviceField[0]}-${field[0]}`);
                            if (entry.trim() != "") {
                                if (field[1].type == "date") {
                                    objectData[field[0]] = new Date(entry.trim());
                                } else {
                                    objectData[field[0]] = entry.trim();
                                }
                            }
                        }
                        if (Object.keys(objectData).length > 0) {
                            deviceObj[deviceField[0]] = objectData;
                        }
                    }
                    else {
                        let entry = formData.get(`${section[0]}-${i}-device-${j}-${deviceField[0]}`)
                        if (!entry) { continue; }
                        if (entry.trim() != "") {
                            if (deviceFieldData.type == "date") {
                                deviceObj[deviceField[0]] = new Date(entry.trim());
                            } else {
                                deviceObj[deviceField[0]] = entry.trim();
                            }
                        }
                    }
                }
                deviceArr.push(deviceObj);
                }
            }
            // -- End Device handling -- //
            else {
                if (fieldData.type == "checkbox") {
                    let entry = formData.getAll(`${section[0]}-${i}-${fieldName}`);
                    if (entry.length > 0) {
                        entryData[fieldName] = entry;
                    }
                }
                else if (fieldData.array == true) {
    
                    let entry = formData.get(`${section[0]}-${i}-${fieldName}`)
                    if (entry.trim() != "") {
                        let ids = [];
                        entry.trim().split(',').map(item => {
                            ids.push(item.trim());
                        })
                        entryData[fieldName] = ids;
                    }
                }
                else if (fieldData.type == "object") {
                    let objectData = {};
                    for (const field of Object.entries(fieldData.options)) {
                        let entry = formData.get(`${section[0]}-${i}-${fieldName}-${field[0]}`);
                        if (entry.trim() != "") {
                            if (field[1].type == "date") {
                                objectData[field[0]] = new Date(entry.trim());
                            } else {
                                objectData[field[0]] = entry.trim();
                            }
                        }
                    }
                    if (Object.keys(objectData).length > 0) {
                        entryData[fieldName] = objectData;
                    }
                }
                else {
                    let entry = formData.get(`${section[0]}-${i}-${fieldName}`)
                    if (!entry) { continue; }
                    if (entry.trim() != "") {
                        if (fieldData.type == "date") {
                            entryData[fieldName] = new Date(entry.trim());
                        } else {
                            entryData[fieldName] = entry.trim();
                        }
                    }
                }
            }
            

        }
        reviewData[`${section[0]}`].push({
            ...entryData,
            devices: deviceArr
        });
    }
        
    }

    console.log(reviewData);

    //console.log(reviewData);
    if (reviewData.building?.length == 0) {
        alert("No building data entered!")
        return;
    }

    // create the review section

    let reviewDataEntries = Object.entries(reviewData);
    for (const section of reviewDataEntries) {
        let reviewBlock = document.createElement("div");
        reviewBlock.id=`${section[0]}-code-review-section`;
        reviewBlock.className = "code-review-section";
        reviewSection.appendChild(reviewBlock);

        let label = document.createElement("h2");
        label.innerHTML = section[0] + "s";

        // implement codeblock
        let codeBlock = document.createElement("pre");
        codeBlock.class = "code-review";
        //codeBlock.id = "code-review-" + section[0];
        codeBlock.textContent = JSON.stringify(reviewData[section[0]], undefined, 3);
        reviewBlock.appendChild(label);
        reviewBlock.appendChild(codeBlock);

        // edit button
        let editButton = document.createElement("button");
        editButton.setAttribute("type", "button");
        editButton.innerHTML = "Edit";
        editButton.className = "edit-button";
        editButton.addEventListener("click", () => editCodeReview(reviewBlock.id, section[0]));
        reviewBlock.appendChild(editButton);
    }
    

    let submitButton = document.createElement("button");
    submitButton.setAttribute("type", "button");
    submitButton.className = "submit-button database-insert-button";
    submitButton.innerHTML = "Submit to database";
    submitButton.addEventListener("click", handleDatabaseInsertion);

    reviewSection.appendChild(submitButton);
    // document.getElementById("codeReview").textContent = JSON.stringify(testData, undefined, 3);
    // document.getElementById("codeReviewInput").value = JSON.stringify(testData, undefined, 3);
}

const loadBuilding = async() => {
    try {
        const container = document.getElementById("load-building-container");
        const id = document.getElementById("building-id-input").value;

        document.querySelectorAll('#load-building-container p').forEach(b=>b.remove());

        const baseUrl = window.location.origin;
        const response = await fetch(`${baseUrl}/api/buildings/${id}`);
        if (response.status !== 200) {
            let message = document.createElement("p");
            message.innerHTML = `Building not found`;
            container.appendChild(message);
        }
        else {
            const building = await response.json();
            let message = document.createElement("p");
            message.innerHTML = `Building: ${building.name}`;
            let message2 = document.createElement("p");
            message2.innerHTML = `Address: ${building.address}`;

            buildingId = id;

            container.appendChild(message);
            container.appendChild(message2);

            createForm();
        }
    } catch(err) {
        console.log(err);
    }

}

// add a section depending on the section name
const addSectionEntry = (sectionName) => {

    let section = document.getElementById(`${sectionName}-creation-section`);
    let subcontainer = document.createElement("fieldset");

    //console.log(counts[sectionName])

    counts[sectionName] += 1;
    subcontainer.id = `${sectionName}-creation-entry-${counts[sectionName]}`;
    subcontainer.className = "creation-form-entry";
    
    section.appendChild(subcontainer);

    let subcontainerName = document.createElement("h2");
    subcontainerName.innerHTML = `${sectionName} ${counts[sectionName]}`;
    subcontainer.appendChild(subcontainerName);

    let sectionValues = Object.entries(formFields[sectionName]);
    
    // for each field in the section
    for (const field of sectionValues) {
        //console.log(field);
        let fieldName = field[0];
        let fieldData = field[1];

        if (fieldName === "devices") { continue; }
    
        let label = document.createElement("label");
        //label.setAttribute("for", fieldName);
        label.innerHTML = fieldData.required ? fieldData.label + " *" : fieldData.label;
        label.className = "building-form-label";
    
        let input;
        // ---- checkbox handling --- //
        if (fieldData.type === "checkbox") {
            subcontainer.appendChild(label);
            
            for (option of fieldData.options) {
                let subLegend = document.createElement("div");
                subLegend.style.padding = "3px";
                subcontainer.appendChild(subLegend);

                let optionLabel = document.createElement("label");
                optionLabel.innerHTML = option;

                input = document.createElement("input");
                input.setAttribute("type", fieldData.type);
                input.value = option;
                input.name = `${sectionName}-${counts[sectionName]}-${fieldName}`;

                subLegend.appendChild(input);
                subLegend.appendChild(optionLabel);
            }

        // ---- end checkbox handling --- //
        
        // ---- select handling --- //
        } else if (fieldData.type === "select") {
            subcontainer.appendChild(label);
            input = document.createElement("select");
            input.name = `${sectionName}-${counts[sectionName]}-${fieldName}`;

            let chooseLabel = document.createElement("option");
            chooseLabel.value = "";
            chooseLabel.innerHTML = "Choose an option";
            input.required = fieldData.required || false;
            input.appendChild(chooseLabel);

            subcontainer.appendChild(input);
            for (option of fieldData.options) {
                let optionElement = document.createElement("option");
                optionElement.value = option;
                optionElement.innerHTML = option;
                input.appendChild(optionElement);
            }


        // ---- end select handling --- //

        // ---- object handling --- //
        } else if (fieldData.type === "object") {
            subcontainer.appendChild(label);
            let subdiv = document.createElement("div");
            subdiv.id = `${sectionName}-${counts[sectionName]}-${fieldName}`;
            subdiv.style.paddingLeft = "5px";
            subdiv.style.display = "none";
            subcontainer.appendChild(subdiv);

            let showMoreButton = document.createElement("button");
            showMoreButton.setAttribute("type", "button");
            showMoreButton.innerHTML = "Expand";
            showMoreButton.className = "expand-button";
            showMoreButton.addEventListener("click", () => {
                subdiv.style.display = subdiv.style.display === "none" ? '' : "none";
                showMoreButton.innerHTML = showMoreButton.innerHTML === "Expand" ? "Collapse" : "Expand";
            });
            subcontainer.appendChild(showMoreButton);

            for (const option of Object.entries(fieldData.options)) {

                let sublabel = document.createElement("label");
                sublabel.innerHTML = option[1].label;

                input = document.createElement("input");
                input.name = `${sectionName}-${counts[sectionName]}-${fieldName}-${option[0]}`;
                input.required = option[1].required || false;
                input.setAttribute("type", option[1].type);
                if (option[1].type == "number") {
                    input.setAttribute("step", option[1].step || "1")
                } 
                input.style.margin = "5px";
                input.style.marginBottom = "20px";
                input.style.width = "75%";

                subdiv.appendChild(sublabel);
                subdiv.appendChild(document.createElement("br"));
                subdiv.appendChild(input);
                subdiv.appendChild(document.createElement("br"));
            }
        // ---- end object handling --- //
        } else {
                    
            input = document.createElement("input");
            input.setAttribute("type", fieldData.type);
            if (fieldData.type == "number") {
                input.setAttribute("step", fieldData.step || "1")
            } 
            input.className = "building-form-input";
            input.required = fieldData.required || false;
            input.name = `${sectionName}-${counts[sectionName]}-${fieldName}`;
            subcontainer.appendChild(label);
            subcontainer.appendChild(input);


        }

        // input.id = fieldName;
        
        subcontainer.appendChild(document.createElement("br"));
        subcontainer.appendChild(document.createElement("br"));
    
    }

    // add device counter
    deviceCounts[`${sectionName}-${counts[sectionName]}`] = 0;

    let currCount = counts[sectionName];
    let addDeviceButton = document.createElement("button");
    addDeviceButton.setAttribute("type", "button");
    addDeviceButton.innerHTML = "Add Device";
    addDeviceButton.className = "add-device-button";
    
    addDeviceButton.addEventListener("click", () => addDeviceToGateway(subcontainer.id, `${sectionName}-${currCount}`));
    subcontainer.appendChild(addDeviceButton);

    // add the remove button
    let removeButton = document.createElement("button");

    removeButton.setAttribute("type", "button");
    removeButton.innerHTML = "Remove Entry";
    removeButton.className = "remove-entry-button";
    removeButton.addEventListener("click", () => {
        let entry = document.getElementById(`${sectionName}-creation-entry-${currCount}`);

        // let i = currCount + 1;
        // //update the next entry if there is one
        // let nextEntry = document.getElementById(`${sectionName}-creation-entry-${i}`);
        // while (nextEntry) {
  
        //     nextEntry.className = `${sectionName}-creation-entry-${i-1}`
        //     console.log(nextEntry.className)

        //     let nextEntryName = nextEntry.querySelector("h3");
        //     nextEntryName.innerHTML = `${sectionName} ${i-1}`;

        //     nextEntry = document.getElementById(`${sectionName}-creation-entry-${++i}`);
        // }

        entry.remove();
        counts[sectionName] -= 1;
    });
    //subcontainer.appendChild(removeButton);
}

// gatewaySectionId is the id of the section (gateway device) that the device is being added to
// gatewayFormSection is the name of the section (gateway-1 / gateway-2)
const addDeviceToGateway = (gatewaySectionId, gatewayFormSection) => {

    let gatewaySection = document.getElementById(gatewaySectionId);

    const formData = new FormData(document.getElementById("create-devices-form"));
    console.log(formData);

    // first check if there is a source api inputted (this changes the fields to add)
    const sourceApi = formData.get(`${gatewayFormSection}-sourceAPI`);
    if (!sourceApi) { return alert("Please select a source API") }

    deviceCounts[gatewayFormSection] += 1;

    // create a subcontainer for the device
    const deviceContainer = document.createElement("div");
    deviceContainer.className = "device-container";
    deviceContainer.id = `${gatewaySectionId}-device-${deviceCounts[gatewayFormSection]}`;
    console.log(deviceContainer.id);
    gatewaySection.insertBefore(deviceContainer, gatewaySection.lastChild);
    
    // create device 1 / device 2 label
    let label = document.createElement("h3");
    label.innerHTML = `Device ${deviceCounts[gatewayFormSection]}`
    deviceContainer.appendChild(label);

    // group the fields required for this type of device
    const universalFields = formFields.gateway.devices?.universal;
    const sourceFields = formFields.gateway.devices[sourceApi];
    const allFields = {
        ...universalFields,
        ...sourceFields
    }
    globalDeviceFields[gatewayFormSection] = allFields;

    // add all fields
    for (const entry of Object.entries(allFields)) {
        let fieldName = entry[0];
        let fieldData = entry[1];

        let label = document.createElement("label");
        label.innerHTML = fieldData.required ? fieldData.label + " *" : fieldData.label;
        label.className = "building-form-label";

        let input;
        let inputName = `${gatewayFormSection}-device-${deviceCounts[gatewayFormSection]}-${fieldName}`;
        // ---- checkbox handling --- //
        if (fieldData.type === "checkbox") {
            deviceContainer.appendChild(label);
            
            for (option of fieldData.options) {
                let subLegend = document.createElement("div");
                subLegend.style.padding = "3px";
                deviceContainer.appendChild(subLegend);

                let optionLabel = document.createElement("label");
                optionLabel.innerHTML = option;

                input = document.createElement("input");
                input.setAttribute("type", fieldData.type);
                input.value = option;
                input.name = inputName;

                subLegend.appendChild(input);
                subLegend.appendChild(optionLabel);
            }

        // ---- end checkbox handling --- //
        
        // ---- select handling --- //
        } else if (fieldData.type === "select") {
            deviceContainer.appendChild(label);
            input = document.createElement("select");
            input.name = inputName;

            let chooseLabel = document.createElement("option");
            chooseLabel.value = "";
            chooseLabel.innerHTML = "Select an option";
            input.required = fieldData.required || false;
            input.appendChild(chooseLabel);

            if (fieldData.readOnly && fieldData.type === "select") {
                input.setAttribute("readOnly", true);
                chooseLabel.innerHTML = sourceApi;
                chooseLabel.value = sourceApi;
                deviceContainer.appendChild(input);
            } else {
                for (option of fieldData.options) {
                    deviceContainer.appendChild(input);
                    let optionElement = document.createElement("option");
                    optionElement.value = option;
                    optionElement.innerHTML = option;
                    input.appendChild(optionElement);
                }
            }


        // ---- end select handling --- //

        // ---- object handling --- //
        } else if (fieldData.type === "object") {
            deviceContainer.appendChild(label);
            let subdiv = document.createElement("div");
            subdiv.id = `${gatewayFormSection}-${fieldName}`;
            subdiv.style.paddingLeft = "5px";
            subdiv.style.display = "none";
            deviceContainer.appendChild(subdiv);

            let showMoreButton = document.createElement("button");
            showMoreButton.setAttribute("type", "button");
            showMoreButton.innerHTML = "Expand";
            showMoreButton.className = "expand-button";
            showMoreButton.addEventListener("click", () => {
                subdiv.style.display = subdiv.style.display === "none" ? '' : "none";
                showMoreButton.innerHTML = showMoreButton.innerHTML === "Expand" ? "Collapse" : "Expand";
            });
            deviceContainer.appendChild(showMoreButton);

            for (const option of Object.entries(fieldData.options)) {

                let sublabel = document.createElement("label");
                sublabel.innerHTML = option[1].label;

                if (option[1].type === "select") {
                    subdiv.appendChild(sublabel);
                    input = document.createElement("select");
                    input.name = `${inputName}-${option[0]}`;
        
                    let chooseLabel = document.createElement("option");
                    chooseLabel.value = "";
                    chooseLabel.innerHTML = "Select an option";
                    input.required = option[1].required || false;
                    input.appendChild(chooseLabel);
                    for (suboption of option[1].options) {
                        subdiv.appendChild(input);
                        let optionElement = document.createElement("option");
                        optionElement.value = suboption;
                        optionElement.innerHTML = suboption;
                        input.appendChild(optionElement);
                    }
                    subdiv.appendChild(sublabel);
                    subdiv.appendChild(document.createElement("br"));
                    subdiv.appendChild(input);
                    subdiv.appendChild(document.createElement("br"));
                    
                } else {
                    input = document.createElement("input");
                    input.name = `${inputName}-${option[0]}`;
                    input.required = option[1].required || false;
                    input.setAttribute("type", option[1].type);
                    if (option[1].type == "number") {
                        input.setAttribute("step", option[1].step || "1")
                    } 
                    input.style.margin = "5px";
                    input.style.marginBottom = "20px";
                    input.style.width = "75%";

                    subdiv.appendChild(sublabel);
                    subdiv.appendChild(document.createElement("br"));
                    subdiv.appendChild(input);
                    subdiv.appendChild(document.createElement("br"));
                }

                
            }
        // ---- end object handling --- //
        } else {
                    
            input = document.createElement("input");
            input.setAttribute("type", fieldData.type);
            if (fieldData.type == "number") {
                input.setAttribute("step", fieldData.step || "1")
            } 
            input.className = "building-form-input";
            input.required = fieldData.required || false;
            input.name = inputName;
            deviceContainer.appendChild(label);
            deviceContainer.appendChild(input);


        }

        // input.id = fieldName;
        
        deviceContainer.appendChild(document.createElement("br"));
        deviceContainer.appendChild(document.createElement("br"));
    }

}

// generate the form based on the fields above
const createForm = () => {
    // remove previous
    let container = document.getElementById("create-devices-form");
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }

    const sections = Object.entries(formFields);
    
    // for each section
    for (const section of sections) {
        let sectionName = section[0].toUpperCase();


        // create subcontainer
        let subcontainer = document.createElement("div");
        subcontainer.className = "device-form-section";
        subcontainer.id = `${section[0]}-creation-section`;
        container.appendChild(subcontainer);

        let sectionHeader = document.createElement("h2");
        sectionHeader.innerHTML = sectionName;
        subcontainer.appendChild(sectionHeader);


        let addEntry = document.createElement("button");
        addEntry.setAttribute("type", "button");
        addEntry.innerHTML = "Add Entry";
        addEntry.className = "add-entry-button";
        addEntry.addEventListener("click", () => addSectionEntry(section[0]))
        container.appendChild(addEntry);

    }


    let submitButton = document.createElement("button");
    submitButton.setAttribute("type", "submit");
    submitButton.className = "submit-button"
    submitButton.innerHTML = "Generate Building JSON";

    container.appendChild(submitButton);

    
}

const handleDatabaseInsertion = () => {

    const buttons = document.getElementsByClassName("database-insert-button");
    for (const button of buttons) {
        let submitter = document.createElement("button");
        submitter.setAttribute("type", "button");
        submitter.innerHTML = "Confirm submission";
        submitter.style.backgroundColor = "red";
        submitter.className = button.className;

        submitter.addEventListener("click", async() => {
            const response = await databaseInsertion(reviewData);
            if (response.ok) {
                populateResponse(response);
            } else {
                alert("Something went wrong")
            }
            submitter.replaceWith(button);
        });

        button.replaceWith(submitter);
    }
}

const databaseInsertion = async(payload) => {
    const baseUrl = window.location.origin;
    console.log(payload.gateway);
    console.log(deviceCounts);
    const insertGatewayAndDevices = async(gateways) => {
        let data = [];
        for (const gateway of gateways) {
            let { devices, ...gatewayData } = gateway;
            let response = await fetch(`${baseUrl}/api/admin/gateways/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    ...gatewayData,
                    buildingId: buildingId
                })
            })
            let gatewayResponse = await response.json();

            // for every device in the gateway
            let tempDeviceArr = [];
            for (const device of devices) {
                let deviceResponse = await fetch(`${baseUrl}/api/admin/devices/create`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        ...device,
                        gatewayId: gatewayResponse._id
                    })
                }) ;
                tempDeviceArr.push(await deviceResponse.json());
            }

            // add to the response array
            data.push({
                ...gatewayResponse,
                devices: tempDeviceArr
            })
            
        }
        return data;
    }
    
    try {
        //console.log(payload.building);
        const gateways = await insertGatewayAndDevices(payload.gateway);
 
        return {
            ok: true,
            message: "Successfully inserted into database",
            data: {
                gateway: gateways
            }
        }
    } catch(err) {
        console.log(err);
        return {
            ok: false,
            message: "error inserting into database",
            error: err
        }
    }

} 

const populateResponse = (payload) => {
    let entries = Object.entries(payload.data);
    for (const section of entries) {
        console.log(entries);
        const reviewSection = document.getElementById(`${section[0]}-code-review-section`);

        // let responseBlock = document.createElement("div");
        // responseBlock.id=`${section[0]}-code-response-section`;
        // responseBlock.className = "code-review-section";
        // reviewSection.appendChild(reviewBlock);

        let label = document.createElement("h3");
        label.innerHTML = section[0] + "s" + " Response";

        // implement codeblock
        let codeBlock = document.createElement("pre");
        codeBlock.className = "code-response";
        //codeBlock.id = "code-review-" + section[0];
        codeBlock.textContent = JSON.stringify(section[1], undefined, 3);
        reviewSection.appendChild(label);
        reviewSection.appendChild(codeBlock);
    }
    
}

const logout = async() => {
    const apiUrl = window.location.origin;
    const response = await fetch(`${apiUrl}/api/admin/signout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
    });
    if (response.ok) {
        window.location.href = `${apiUrl}/adminlogin`;
        console.log("logged out");
    } else {
        alert("Something went wrong")
    }
    
}


const buildingForm = document.getElementById("create-devices-form");
buildingForm.addEventListener("submit", submitForm);



// helper function, ignore
const addEmporiaChannelFields = () => {
    let channels = {};
for (let i = 1; i <= 20; i++) {

    channels[`channel_${i}_channelNumber`] = {
      label: `Channel ${i} Number`,
      type: "number",
      step: 1,
      required: i === 1 ? true : false,
    };
  
    channels[`channel_${i}_name`] = {
      label: `Channel ${i} Name`,
      type: "text",
    };
  
    channels[`channel_${i}_energyDirection`] = {
      label: `Channel ${i} Energy Direction`,
      type: "text",
    };
  
    channels[`channel_${i}_type`] = {
      label: `Channel ${i} Type`,
      type: "text",
    };
  
    channels[`channel_${i}_subType`] = {
      label: `Channel ${i} Sub Type`,
      type: "text",
    };

    
}
formFields.gateway.devices.EmporiaEnergy.channels.options = channels;
}

addEmporiaChannelFields();
