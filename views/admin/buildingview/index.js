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

var buildingData = {};

const populateListing = () => {
    let data = {
        name: buildingData.name,
        alias: buildingData.alias,
        address: buildingData.address,
        city: buildingData.city,
        state: buildingData.state,
        zip: buildingData.zip,
        _id: buildingData._id,
        BUID: buildingData.BUID,
        buildingOwner: buildingData.buildingOwner,
        propertyManager: buildingData.propertyManager,
        contactPhone: buildingData.contactPhone,
        contactEmail: buildingData.contactEmail,
        keys: buildingData.keys,
        assetData: buildingData.assetData,
        options: buildingData.options,
        type: buildingData.type,
        buildingSqFt: buildingData.buildingSqFt,
        floorCount: buildingData.floorCount,
        suiteCount: buildingData.suiteCount,
        commonAreaCount: buildingData.commonAreaCount,
        sharedRestroomCount: buildingData.sharedRestroomCount,
        undergroundParking: buildingData.undergroundParking,
        EVCharging: buildingData.EVCharging,
        EVChargerCount: buildingData.EVChargerCount,
        description: buildingData.description,
    }

    const entries = Object.entries(data);

    const form = document.createElement("form");
    form.id = "body-listing-details_form";
    for (const entry of entries) {
        const [key, value] = entry;
        let input = document.createElement("input");
        const label = document.createElement("label");

        label.innerHTML = key;
        form.appendChild(label);
        form.appendChild(document.createElement("br"))

        if (key == "keys" || key === "assetData" || key === "options") {
            input = document.createElement("textarea");
            input.style.width = "80%";
            input.style.height = "200px";
            input.type = "textarea";
            input.className = "form-input"
            input.name = key;
            input.value = JSON.stringify(value, null, 3);
        } else {
            input.type = "text";
            input.className = "form-input"
            input.name = key;
            input.value = value || "";
        }
        form.appendChild(input);
        form.appendChild(document.createElement("br"))
        form.appendChild(document.createElement("br"))
    }

    const details = document.getElementById("listing-details");
    details.innerHTML = "";
    const heading = document.createElement("h2");
    heading.innerHTML = "Building Details";

    details.appendChild(heading);
    details.appendChild(form);

}


const loadDetails = async() => {
    const loadBuilding = async() => {
        const params = new URLSearchParams(window.location.search);
    
        const buildingId = params.get("id");
        console.log(buildingId);
    
        const response = await fetch(`/api/admin/buildings/${buildingId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });
    
        if (response.ok) {
            buildingData = await response.json();
            return {
                ok: true
            }
        }
        else {
            alert("Something went wrong retrieving the building data");
            return {
                ok: false
            }
        }
    }

    loadBuilding().then((res) => {
        populateListing();
    });

}



loadDetails();