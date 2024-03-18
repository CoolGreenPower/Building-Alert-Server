
const path = require("path");
const Building = require("../models/BuildingModel");
const Asset = require("../models/AssetModel");
const { BlobServiceClient } = require("@azure/storage-blob");
const { v1: uuidv1 } = require('uuid');
const fs = require("fs")

// client to connect to the blob storage
const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING);

// helper function
const checkForContainer = async(blobName) => {
    let containerExists = false;
    for await (const container of blobServiceClient.listContainers()) {
        if (container.name === blobName) {
            containerExists = true;
            break;
        }
    }
    return containerExists;
}

const uploadImage = async(containerName, blobName, image) => {
    try {
        let uploadPath = path.resolve(`${__dirname}/../../static/tmp/${blobName}`);
        const upload = await image.mv(uploadPath);
    
        // check if the azure container (each building has its own container) exists
    
        // const containerExists = await checkForContainer(containerName);
        const containerClient = blobServiceClient.getContainerClient(containerName);
        // if (!containerExists) {
        //     await containerClient.create();
        // }
    
        //create blob (the image)
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);
        console.log(
            `\nUploading to Azure storage as blob\n\tname: ${blobName}\n\tURL: ${blockBlobClient.url}`
        );

        const options = { blobHTTPHeaders: { blobContentType: image.mimetype } };
        const uploadBlobResponse = await blockBlobClient.uploadFile(uploadPath, options);
    
        // finally delete the file from the server file system
        let file = fs.unlink(uploadPath, err => {
            if (err) {
                return res.status(500).json(err);
            }
        });

        return {
            "success": true,
            "message": "Image uploaded successfully",
            "data": uploadBlobResponse
        }
    } catch(err) {
        return {
            "success": false,
            "message": "Image upload failed",
            "data": err
        }
    }
}

const deleteImage = async(containerName, blobName) => {

    try {
        const containerClient = blobServiceClient.getContainerClient(containerName);
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);
        const deleteBlobResponse = await blockBlobClient.deleteIfExists();
        return {
            "success": true,
            "message": "Image deleted successfully",
            "data": deleteBlobResponse
        }
    } catch(err) {
        return {
            "success": false,
            "message": "Image delete failed",
            "data": err
        }
    }
    
}

const uploadAssetImage = async(req, res) => {
    try {
        // we use these to get the assetId, the building alias, and set these into the blobname
        // as well as check for auth
        const asset = await Asset.findById(req.body.assetId);
        const building = await Building.findById(asset.buildingId);

        if ( !asset || !building) { return res.status(400).json("Building or Asset not found"); }
        if (!building.buildingOwner?.includes(req.user.id) &&
            !building.propertyManager?.incdlues(req.user.id)) {
             return res.status(403).json({ message: "User is not the building owner or property manager" }); 
        }

        if (asset.images.length > 5) {
            return res.status(403).json({ message: "Asset surpassed image limit. Max 5" });
        }

        // upload to temp folder on file system
        let sampleFile = req.files.image;
        const extName = path.extname(sampleFile.name);
        const blobName = `asset_${asset._id}_${uuidv1()}${extName}`;

        const uploadResponse = await uploadImage("assetimages", blobName, sampleFile);
            
        // update the asset image array to include the url of the image
        asset.images.push(`https://buildingalertsstorage.blob.core.windows.net/assetimages/${blobName}`);
        await asset.save();

        //console.log(uploadResponse);

        res.status(200).json({
            "success": uploadResponse.success,
            "message": uploadResponse.message,
            "url": `https://buildingalertsstorage.blob.core.windows.net/assetimages/${blobName}`
        });
    } catch(err) {
        res.status(500).json(err);
    }
}

const getAssetImage = async(req, res) => {
    try {
        const asset = await Asset.findById(req.params.assetId);
        const building = await Building.findById(asset.buildingId);

        if (!asset || !building) { return res.status(400).json("Building or Asset not found"); }

        if (!building.buildingOwner?.includes(req.user.id) && !building.propertyManager?.includes(req.user.id)) {
            return res.status(403).json({ message: "User is not the building owner or property manager" });
        }
        //console.log(building.alias);
        
        res.status(200).json(asset.images)
    } catch(err) {
        res.status(500).json(err);
    }
}


const deleteAssetImage = async(req, res) => {
    try {
        // extract assetId from image url
        const blobName = req.body.blobname;
        const assetId = blobName.split('_')[1];

        const asset = await Asset.findById(assetId);
        const building = await Building.findById(asset.buildingId);
        
        if (!building.buildingOwner.includes(req.user.id) && !building.propertyManager.includes(req.user.id)) {
            return res.status(403).json({ message: "User is not the building owner or property manager" });
        }

        // first remove the image from the asset list
        asset.images.pull(`https://buildingalertsstorage.blob.core.windows.net/assetimages/${blobName}`);
        await asset.save();

        // then call local delete function
        const deleteResponse = await deleteImage("assetimages", blobName);
        

        res.status(200).json({
            "success": deleteResponse.success,
            "message": deleteResponse.message
        });

        // const blobs = containerClient.listBlobsFlat();
        // for await (const blob of blobs) {
        //     let assetId = blob.name.split("_")[1];
        //     if (assetId === req.params.assetId) {

        //     }
        // }
    } catch(err) {
        console.log(err);
        res.status(500).json(err);
    }
}


module.exports = {
    uploadAssetImage,
    getAssetImage,
    deleteAssetImage
}