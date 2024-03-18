// form fields to put on the pag
/**
 * High-level overview of the code
 * 
 * The code is written to populate a single form with the fields provided
 * in formFields. The formFields object defines type(buildilng/asset/etc)->fields->field data
 * So every building has a name, alias, etc. And "name" has the Name label and is a
 * text field. The fields are used to create inputs for a singular form. 
 * This form has unique ids for each input (i.e. building-1-name, asset-1-field)
 * These values get parsed from the form into the reviewData object and the count is kept track
 * with the counts object. When the user submits the form, the formFields is looped through n number
 * of times (n being the count of the building, asset, suite) and checks every field of that type.
 * For example, if we are looping through buildings, we might find building-i-<field> and then
 * building-i-<field2>. This populates the reviewData object which is then displayed into a codeblock
 * for the user to view in JSON format. Once the user is satisfied, they can submit the form.
 * 
 * On submit, the reviewData object is sent to the server and the server parses it and inserts it into the database.
 * The order goes, building->assets->suites->tenants for insertion. The servers response
 * then populates where the JSON data was originally.
 * 
 * Look through and you can see that the code supports every single textbox field
 * (text, number, email, etc) as well as checkboxes and select dropdowns.
 * There's also a type (object) which allows you to nest fields into another field.
 * As of now there is no support for select/option inputs for object types but it can be added.
 * 
 * Notes: The code is not perfect and can be improved for scalability. There's lots of 
 * redundancy which can be abstracted especially for form creation so look at that to start.
 */

/**
 * Ensure to make the keynames are the same as the field name in the database
 */
const formFields = {
    building: {
        name: {
            label: "Name",
            type: "text",
            required: true
        },
        alias: {
            label: "Alias (bapbc, hartc, tropicana, etc.)",
            type: "text",
            required: true
        },
        address: {
            label: "Address",
            type: "text",
        },
        city: {
            label: "City",
            type: "text",
        },
        state: {
            label: "State",
            type: "text",
        },
        zipcode: {
            label: "Zipcode",
            type: "text",
        },
        type: {
            label: "Building Type",
            type: "select",
            options: ["Healthcare", "Hotel", "Industrial", "Multi-Use", "Office Building", "Restaurant", "Retail", "Warehouse", "Other"],
            // you can add and implement an extra array if you need to separate the option name from the value assigned to it
            // options: [["Office", "office"], ["Retail", "retail"], ["Industrial", "industrial"], ["Multi-Family", "multi-family"], ["Other", "other
        },
        description: {
            label: "Description (if other type, please specify)",
            type: "text",
        },
        buildingOwner: {
            label: "Building Owner(s) _ids - Separate by commas",
            type: "text",
            array: true
        },
        propertyManager: {
            label: "Property Manager(s) - Separate by commas",
            type: "text",
            array: true
        },
        BUID: {
            label: "Universal Building ID (UBID) (33.318620,-111.888958) - Saved in DB as BUID",
            type: "text",
            required: true
        },
        buildingSqFt: {
            label: "Building Square Footage",
            type: "number",
        },
        floorCount: {
            label: "Floor Count",
            type: "number",
        },
        suiteCount: {
            label: "Suite Count",
            type: "number",
        },
        commonAreaCount: {
            label: "Indoor Common Area Count",
            type: "number",
        },
        sharedRestroomCount: {
            label: "Shared Restroom and Janitorial Area Count",
            type: "number",
        },
        undergroundParking: {
            label: "Underground Parking",
            type: "select",
            options: ["true", "false"]
        },
        EVCharging: {
            label: "EV Charging",
            type: "select",
            options: ["true", "false"]
        },
        EVChargerCount: {
            label: "EV Charger Count",
            type: "number",
        },
        assetData: {
            // types in sub objects don't work
            label: "Asset Data",
            type: "object",
            options: {
                "hasGreenButton": {
                    label: "Has Green Button Data? (true/false)",
                    type: "text"
                },
                "electricCompanyName": {
                    label: "Electric Company Name",
                    type: "text"
                }, 
                "electricAccountNumber":{
                    label: "Electric Account Number",
                    type: "text"
                },
                "gasCompanyName":{
                    label: "Gas Company Name",
                    type: "text"
                }, 
                "gasAccountNumber":{
                    label: "Gas Account Number",
                    type: "text"
                }, 
                "waterCompanyName":
                {
                    label: "Water Company Name",
                    type: "text"
                }, 
                "waterAccountNumber": {
                    label: "Water Account Number",
                    type: "text"
                }, 
                "electricLiability": {
                    label: "Electric Liability (tenant/landlord/other)",
                    type: "text"
                }, 
                "gasLiability": {
                    label: "Gas Liability (tenant/landlord/other)",
                    type: "text"
                }, 
                "waterLiability": {
                    label: "Water Liability (tenant/landlord/other)",
                    type: "text"
                }, 
                "HVACCount": {
                    label: "HVAC Count",
                    type: "number"
                }, 
                "HVACShared": {
                    label: "HVAC Shared? (true/false)",
                    type: "select",
                    options: ["true", "false"]
                }, 
                "waterHeaterCount": {
                    label: "Water Heater Count",
                    type: "number"
                },

            }
        }
    },

    asset: {
        assetType: {
            label: "Asset Type",
            type: "select",
            options: ["electricity", "gas", "water", "HVAC", "thermostat", "other"], 
            required: true
        },
        name: {
            label: "Asset Name", 
            type: "text",
            required: true
        },
        manufacturer: {
            label: "Manufacturer",
            type: "text"
        },
        make: {
            label: "Make",
            type: "text"
        },
        modelNumber: {
            label: "Model Number",
            type: "text"
        },
        serialNumber: {
            label: "Serial Number",
            type: "text"
        },
        location: {
            label: "Location",
            type: "text"
        },
        energySource: {
            label: "Energy Source (Primarily for Water heaters)",
            type: "select",
            options: ["Boiler", "Electric", "Propane", "Gas", "Other"]
        },

        HVACtype: {
            label: "Type (Primarily for HVAC)",
            type: "select",
            options: ["Packaged RTU", "Rooftop RTU", "Split System-Ducted", "Mini-Split System-Ductless", "VAV", "VAF", "Other"]
        },
        supportedSuites: {
            label: "Suites Supported (Separated by commas)",
            type: "text",
            array: true
        },
        supports: {
            label: "Supports",
            type: "select",
            options: ["Dedicated to a suite", "Shared by multiple suites", "A combination of both", "One system for the building"]
        },
        dateInstalled: {
            label: "Date Installed",
            type: "date"
        },
        warrantyExpiration: {
            label: "Warranty Expiration",
            type: "date"
        },
        lastService: {
            label: "Last Service",
            type: "date"
        },
        serviceContract: {
            label: "Service Contract",
            type: "select",
            options: ["true", "false"],
        },
        occupiedDays: {
            label: "Occupied/Utilized Days",
            type: "checkbox",
            options: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
        },
        HVACSettings: {
            label: "HVAC Settings",
            type: "object",
            options: {
                compressorCount: {
                    label: "Compressor Count",
                    type: "number"
                },
                comp1PH: { // compressor
                    label: "Compressor 1 PH",
                    type: "number",
                    step: 0.05
                },
                comp1RLA: {
                    label: "Compressor 1 RLA",
                    type: "number",
                    step: 0.05
                },
                comp1LRA: {
                    label: "Compressor 1 RLA",
                    type: "number",
                    step: 0.05
                },
                comp2PH: {
                    label: "Compressor 2 PH",
                    type: "number",
                    step: 0.05
                },
                comp2RLA: {
                    label: "Compressor 2 RLA",
                    type: "number",
                    step: 0.05
                },
                comp2LRA: {
                    label: "Compressor 2 LRA",
                    type: "number",
                    step: 0.05
                },
                comp3PH: {
                    label: "Compressor 3 PH",
                    type: "number",
                    step: 0.05
                },
                comp3RLA: {
                    label: "Compressor 3 RLA",
                    type: "number",
                    step: 0.05
                },
                comp3LRA: {
                    label: "Compressor 3 LRA",
                    type: "number",
                    step: 0.05
                },
                fanPH: {
                    label: "Fan PH",
                    type: "number",
                    step: 0.05
                },
                fanFLA: {
                    label: "Fan FLA",
                    type: "number",
                    step: 0.05
                },
                fanHP: {
                    label: "Fan HP",
                    type: "number",
                    step: 0.05 
                },
            }
        },
        thermostatSettings: {
            label: "Thermostat Settings",
            type: "object",
            options: {
                occupiedHeat: {
                    label: "Occupied Heat",
                    type: "number",
                },
                unoccupiedHeat: {
                    label: "Unoccupied Heat",
                    type: "number",
                },
                occupiedCooling: {
                    label: "Occupied Cooling",
                    type: "number",
                },
                unoccupiedCooling: {
                    label: "Unoccupied Cooling",
                    type: "number",
                },
                weekdayOccupiedStartTime: {
                    label: "Weekday Occupied Start Time",
                    type: "time"
                },
                weekdayUnoccupiedStartTime: {
                    label: "Weekday Unoccupied Start Time",
                    type: "time"
                },
                weekendOccupiedStartTime: {
                    label: "Weekend Occupied Start Time",
                    type: "time"
                },
                weekendUnoccupiedStartTime: {
                    label: "Weekend Unoccupied Start Time",
                    type: "time"
                },
                fanSetting: {
                    label: "Fan Setting (auto, on, off, etc.)",
                    type: "select",
                    options: ["auto", "on", "off", "other"]
                },
                hasBatteries: {
                    label: "Has Batteries? (true/false)",
                    type: "select",
                    options: ["true", "false"]
                },
                batteriesLastChanged: {
                    label: "Batteries Last Changed",
                    type: "date"
                }
            }
        },
        waterHeaterSettings: {
            label: "Water Heater Settings",
            type: "object",
            options: {
                waterTemperature: {
                    label: "Water Temperature",
                    type: "number",
                    step: 0.5
                }
            }
        }


    },

    suite: {
        suite: {
            label: "Suite Number / Location",
            type: "text"
        },
        squareFootage: {
            label: "Square Footage",
            type: "number"
        },
        occupied: {
            label: "Occupied?",
            type: "select",
            options: ["true", "false"]
        },
        
        tenant: {
            label: "Tenant Info",
            type: "object",
            options: {
                user: {
                    label: "User (Building owner id should be included here)",
                    type: "text",
                },
                name: {
                    label: "Tenant Name",
                    type: "text"
                },
                businessType: {
                    label: "Business Type",
                    type: "text"
                },
                description: {
                    label: "Description",
                    type: "text"
                },
                typeOfLease: {
                    label: "Type of Lease (Gross or Full-Service / Modified Gross / Net Lease (N, NN, NNN) / Percentage Lease / Other)",
                    type: "select",
                    options: ["Gross or Full-Service", "Modified Gross", "Net Lease (N, NN, NNN)", "Percentage Lease", "Other"]
                },
                typeOfLeaseDesc: {
                    label: "Type of Lease Description (If other)",
                    type: "text"
                },
                leaseEndDate: {
                    label: "Lease End Date",
                    type: "date"
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

// the object that is inserted into and used to upload to the database
var reviewData = {};



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

    // get form data
    const form = document.getElementById("createBuildingForm");
    let formData = new FormData(form);
    //console.log(formData);

    // remove the old review data from the page
    const reviewSection = document.getElementById("code-review-container");
    while (reviewSection.firstChild) {
        reviewSection.removeChild(reviewSection.lastChild);
    }

    // const heading = document.createElement("h2");
    // heading.innerHTML = "Review Data";
    // heading.style.textAlign = "center";
    // reviewSection.appendChild(heading);


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
        for (const entry of Object.entries(section[1])) {

            let fieldName = entry[0];
            let fieldData = entry[1];

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
                if (entry.trim() != "") {
                    if (fieldData.type == "date") {
                        entryData[fieldName] = new Date(entry.trim());
                    } else {
                        entryData[fieldName] = entry.trim();
                    }
                }
            }

        }
        reviewData[`${section[0]}`].push(entryData);;
    }
        
    }

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

// add a section depending on the section name
const addSectionEntry = (sectionName) => {
    if (sectionName === "building" && counts["building"] >= 1) {
        return;
    }
    let section = document.getElementById(`${sectionName}-creation-section`);
    let subcontainer = document.createElement("fieldset");

    //console.log(counts[sectionName])

    counts[sectionName] += 1;
    subcontainer.id = `${sectionName}-creation-entry-${counts[sectionName]}`;
    subcontainer.className = "creation-form-entry";
    
    section.appendChild(subcontainer);

    let subcontainerName = document.createElement("h3");
    subcontainerName.innerHTML = `${sectionName} ${counts[sectionName]}`;
    subcontainer.appendChild(subcontainerName);

    let sectionValues = Object.entries(formFields[sectionName]);
    
    // for each field in the section
    for (const field of sectionValues) {
        //console.log(field);
        let fieldName = field[0];
        let fieldData = field[1];
    
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
            // subcontainer.appendChild(label);
            // let subdiv = document.createElement("div");
            // subdiv.id = `${sectionName}-${counts[sectionName]}-${fieldName}`;
            // subdiv.style.paddingLeft = "5px";
            // subdiv.style.display = "none";
            // subcontainer.appendChild(subdiv);

            // let showMoreButton = document.createElement("button");
            // showMoreButton.setAttribute("type", "button");
            // showMoreButton.innerHTML = "Expand";
            // showMoreButton.className = "expand-button";
            // showMoreButton.addEventListener("click", () => {
            //     subdiv.style.display = subdiv.style.display === "none" ? '' : "none";
            //     showMoreButton.innerHTML = showMoreButton.innerHTML === "Expand" ? "Collapse" : "Expand";
            // });
            // subcontainer.appendChild(showMoreButton);

            // for (const option of Object.entries(fieldData.options)) {

            //     let sublabel = document.createElement("label");
            //     sublabel.innerHTML = option[1].label;

            //     input = document.createElement("input");
            //     input.name = `${sectionName}-${counts[sectionName]}-${fieldName}-${option[0]}`;
            //     input.required = option[1].required || false;
            //     input.setAttribute("type", option[1].type);
            //     if (option[1].type == "number") {
            //         input.setAttribute("step", option[1].step || "1")
            //     } 
            //     input.style.margin = "5px";
            //     input.style.marginBottom = "20px";
            //     input.style.width = "75%";

            //     subdiv.appendChild(sublabel);
            //     subdiv.appendChild(document.createElement("br"));
            //     subdiv.appendChild(input);
            //     subdiv.appendChild(document.createElement("br"));
            // }
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

                if (option[1].type === "select") {
                    subdiv.appendChild(sublabel);
                    input = document.createElement("select");
                    input.name = `${sectionName}-${counts[sectionName]}-${fieldName}-${option[0]}`;
        
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

    // add the remove button
    let removeButton = document.createElement("button");
    let currCount = counts[sectionName];
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

// generate the form based on the fields above
const createForm = () => {
    // remove previous
    let container = document.getElementById("createBuildingForm");
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }

    const sections = Object.entries(formFields);
    
    // for each section
    for (const section of sections) {
        let sectionName = section[0].toUpperCase();


        // create subcontainer
        let subcontainer = document.createElement("div");
        subcontainer.className = "building-form-section";
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

    document.getElementById("create-form-button").style.display = "none";

    
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

    const insertBuilding = async(buildings) => {
        let buildingData = [];
        for (const building of buildings) {
            let response = await fetch(`${baseUrl}/api/admin/buildings/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(building)
            })
            buildingData.push(await response.json());
            
        }
        return buildingData;
    }
    
    const insertAsset = async(assets, buildingId) => {
        let assetData = [];
        for (const asset of assets) {
            let body = {
                ...asset,
                buildingId: buildingId
            }
            let response = await fetch(`${baseUrl}/api/admin/assets/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            })
            console.log(response);
            assetData.push(await response.json());

        }
        return assetData;
    }
    
    // inserts the suite, and subsequently the tenant
    const insertSuite = async(suites, buildingId) => {
        let suiteData = [];
        for (const suite of suites) {
            // add the physical suite
            let { tenant, ...rest } = suite;
            let response = await fetch(`${baseUrl}/api/admin/suites/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    ...rest,
                    buildingId: buildingId
                })
            })

            // attach the tenant to the suite, if there is one
            let suiteResponse = await response.json();

            if (!suite.tenant) {
                suiteData.push(suiteResponse);
                continue;
            }
            let tenantResponse = await fetch(`${baseUrl}/api/admin/tenants/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    ...tenant,
                    users: [suite.tenant?.user] || [],
                    suiteId: suiteResponse.createdSuite?._id
                })
            })

            let tenantData = await tenantResponse.json();
            let pushData = {
                ...suiteResponse,
                ...tenantData
            }
            suiteData.push(pushData);
            console.log("IM INSERTED SUITE")
            //console.log(`Inserted ${suite.name}`)
        }
        return suiteData;
    }


    try {
        //console.log(payload.building);
        const buildings = await insertBuilding(payload.building);
        // insert asset and suite
        const [assets, suites] = await Promise.all([
            insertAsset(payload.asset, buildings[0].building?._id),
            insertSuite(payload.suite, buildings[0].building?._id)
        ]);
 
        return {
            ok: true,
            message: "Successfully inserted into database",
            data: {
                building: buildings,
                asset: assets || null,
                suite: suites || null
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


const buildingForm = document.getElementById("createBuildingForm");
buildingForm.addEventListener("submit", submitForm);

createForm();




