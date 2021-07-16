import { ChainedTokenCredential, AzureCliCredential, ManagedIdentityCredential } from '@azure/identity'
import { BlobServiceClient } from '@azure/storage-blob'

const storageName = process.env.STORAGE_ACCOUNT_NAME;
const containerName = process.env.STORAGE_CONTAINER_NAME;
const storageConnectionString = `https://${storageName}.blob.core.windows.net`;

const credentials = new ChainedTokenCredential(new AzureCliCredential(), new ManagedIdentityCredential());

export async function getBlobsFromAzureStorage() {
    const blobService = new BlobServiceClient(storageConnectionString, credentials);
    const containerClient = blobService.getContainerClient(containerName);

    let blobs = containerClient.listBlobsFlat();

    let blobdata = [];
    for await (const blob of blobs) {
        const blobItem = {
            name : blob.name,
            contentLength: blob.properties.contentLength,
            contentType: blob.properties.contentType,
            lastModified: blob.properties.lastModified.getUTCDate(),
            etag: blob.properties.etag
        }
        blobdata.push(blobItem);
    }

    return blobdata;
}

export async function uploadBlob(file, fileName, length) {
    try{
        const blobService = new BlobServiceClient(storageConnectionString, credentials);
        const containerClient = blobService.getContainerClient(containerName);
        const blobClient = containerClient.getBlockBlobClient(fileName);
        const blob = await blobClient.upload(file, length);

        return blob;
    }
    catch(error){
        console.error(error);
        return error;
    }
}