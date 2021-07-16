import {getBlobsFromAzureStorage} from '../../lib/azure-storage-service';

export default async function handler(req, res) {
    try {
        const blobs = await getBlobsFromAzureStorage();
        res.status(200).send(blobs);
    } catch (error) {
        res.status(500).send(error);
    }
  }