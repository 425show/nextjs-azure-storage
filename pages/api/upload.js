import {getBlobsFromAzureStorage, uploadBlob} from '../../lib/azure-storage-service';

export default async function handler(req, res) {
  var file = req.body;
  const filename = req.query.file; 
  var contentLength = req.body.length;
  
  var result = await uploadBlob(file, filename, contentLength);
  if (result.error) {
    res.status(500).send(result.error);
  }
  else {
    res.status(200).send("success");
  }
  
}