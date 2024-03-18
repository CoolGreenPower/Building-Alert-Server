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

var DATA = {};

// the script should first fetch the data, then populate the building listings separately

const search = (searchGroup, query) => {
    let regex = new RegExp(query, "i");

    let items = DATA[searchGroup];

    let foundItems = [];
    items.forEach(item => {
        //console.log(item.name.search(regex))
        item.name.search(regex) !== -1 ? foundItems.push(item) : null;
    })

    return foundItems;
}

const viewBuilding = (buildingId) => {
    console.log(DATA.buildingData?.find(building => building._id == buildingId));

    const details = document.getElementById("body-listing-details");
    details.innerHTML = "";

    const building = DATA.buildingData?.find(building => building._id == buildingId);
    let codeBlock = document.createElement("pre");
    codeBlock.innerHTML = JSON.stringify(building, null, 3);
    details.appendChild(codeBlock);


}

const populateBuildingListing = (data) => {
    let buildings = data || null;
    if (buildings == null) {
        buildings = DATA.buildingData;
    }
    const listingContainer = document.getElementById("body-listing-list");
    listingContainer.innerHTML = "";

    const buildingListing = document.createElement("table");
    buildingListing.className = "item-list";

    let header = document.createElement("tr");
    header.innerHTML = 
    `
    <th>Name</th>
    <th>Address</th>
    <th>_id</th>
    `
    buildingListing.appendChild(header);

    //buildingListing.innerHTML = "";
    buildings.forEach(building => {
        let stringData = JSON.stringify(building);
        buildingListing.innerHTML += 
    `<tr class="listing-element">
        <td class="listing-name">${building.name}</td>
        <td class="listing-description">${building.address}, ${building.city}, ${building.state} ${building.zip}</td>
        <td class="listing-description">${building._id}</td>
        <td><button id="button-${building._id}" class="listing-button listing-button-id">Quick View</button></td>
        <td><a href="/admin/buildingview?id=${building._id}"><button class="listing-button">Page</button></a></td>
    </tr>`

    });

    listingContainer.appendChild(buildingListing);

    let buttons = document.querySelectorAll("#body-listing-list .listing-button-id");
    buttons.forEach(button => {
        button.addEventListener("click", () => {
            let id = button.id.split("-")[1];
            viewBuilding(id);
        })
    });

    let searchButton = document.getElementById("search-button");

    searchButton.addEventListener("click", triggerSearch = () => {
        let buildings = search("buildingData", document.getElementById("search-input").value);
        populateBuildingListing(buildings);
        searchButton.removeEventListener("click", triggerSearch);
    })
}

const populateSuiteListing = async() => {
    const apiUrl = window.location.origin;
    const response = await fetch(`${apiUrl}/api/admin/suites`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
    });
    if (response.ok) {
        const listingContainer = document.getElementById("body-listing-container");
        listingContainer.innerHTML = "";

        const suites = await response.json();

        const suiteListing = document.createElement("ul");
        suiteListing.className = "item-list";

        //buildingListing.innerHTML = "";
        suites.forEach(suite => {
            suiteListing.innerHTML += `<li><a href="/api/admin/suites/${suite._id}"><button class="listing-button">${suite.name}</button></a></li>`
        });

        listingContainer.appendChild(suiteListing);
    } else {
        alert("Something went wrong");
    }
}

const populateAssetListing = async() => {
    const apiUrl = window.location.origin;
    const response = await fetch(`${apiUrl}/api/admin/assets`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
    });
    if (response.ok) {
        
        const listingContainer = document.getElementById("body-listing-list");
        const assets = await response.json();

        listingContainer.innerHTML = "";

        const assetListing = document.createElement("ul");
        assetListing.className = "item-list";

        //buildingListing.innerHTML = "";
        assets.forEach(asset => {
            assetListing.innerHTML += 
            `
            <li class="listing-element">
                <h3 class="listing-name">${asset.name}</h3>
                <p class="listing-description">${asset._id}</p>
                <p class="listing-description">${asset.assetType}</p>
                <a href="/api/admin/assets/${asset._id}"><button class="listing-button">${asset.name}</button></a>
            </li>
            `
        });

        listingContainer.appendChild(assetListing);
    } else {
        alert("Something went wrong");
    }
}

const populateUserListing = (data) => {

}

// called on page load to load all the data
const fetchData = async() => {
    try {
        const apiUrl = window.location.origin;
        const fetchBuilding = async() => {
            const apiUrl = window.location.origin;
            const response = await fetch(`${apiUrl}/api/admin/buildings`, {
                method: "GET",
                headers: {
                "Content-Type": "application/json"
                }
            });
            if (response.ok) {
    
                const buildings = await response.json();
                DATA["buildingData"] = buildings;
    
            } else {
                alert("Something went wrong");
            }
        }

        const fetchAssets = async() => {
            const response = await fetch(`${apiUrl}/api/admin/assets`, {
                method: "GET",
                headers: {
                  "Content-Type": "application/json"
                }
            });
            if (response.ok) {
                
                const listingContainer = document.getElementById("body-listing-list");
                const assets = await response.json();
                DATA["assetData"] = assets;
            } else {
                alert("Something went wrong");
            }
        }

        const fetchSuites = async() => {
            const response = await fetch(`${apiUrl}/api/admin/suites`, {
                method: "GET",
                headers: {
                  "Content-Type": "application/json"
                }
            });
            if (response.ok) {
                const listingContainer = document.getElementById("body-listing-container");
                listingContainer.innerHTML = "";
        
                const suites = await response.json();
        
                DATA["suiteData"] = suites;
            } else {
                alert("Something went wrong");
            }
        }

        const fetchUsers = async() => {
            const response = await fetch(`${apiUrl}/api/admin/users`, {
                method: "GET",
                headers: {
                  "Content-Type": "application/json"
                }
            });
            if (response.ok) {
                const users = await response.json();
        
                DATA["userData"] = users;
            } else {
                alert("Something went wrong");
            }
        }

        await Promise.all([fetchBuilding(), fetchAssets(), fetchUsers()]); 
        
        return {
            ok: true
        }
    } catch(err) {
        console.log(err);
        return {
            ok: false,
            error: err
        }
    }
    
}

fetchData().then(res => {
    if (res.ok) {
        populateBuildingListing(DATA["buildingData"]);
    }
});

