import {useState} from 'react';


export default function Upload({initialBlobs}) {
  const [blobs, setData] = useState(initialBlobs);

  const uploadFile = async (e) => {
    const file = e.target.files[0];
    const filename = encodeURIComponent(file.name);
    
    const options = {
      method: 'POST',
      body: file
    }

    var result = await fetch(`/api/upload?file=${filename}`, options);
    console.log(result); 

    await refreshBlobs();
  };

  async function refreshBlobs(){
    return setData(await getBlobData());
  }

  return (
    <>
      <p>Upload a .png or .jpg image (max 1MB).</p>
      <input
        onChange={uploadFile}
        type="file"
        accept="image/png, image/jpeg"
      />
      <p/>
      <p>
      <table className="table-auto">
        <thead>
          <tr>
            <th>Name</th>
            <th>Content Length</th>
            <th>Content Type</th>
            <th>Last Modified</th>
            <th>eTag</th>
          </tr>
        </thead>
        <tbody>
            {blobs.map(({ name, contentLength, contentType,lastModified,etag }) => (
              <tr key={etag} className="bg-blue-200">
                <td>{name}</td>
                <td>{contentLength}</td>
                <td>{contentType}</td>
                <td>{lastModified}</td>
                <td>{etag}</td>
              </tr>
            ))}
        </tbody>  
      </table>
      </p>
    </>
  );
}

export async function getServerSideProps() {
  // Fetch data from external API
  const initialBlobs = await getBlobData();
  // Pass data to the page via props
  return { props: { initialBlobs } }
}

export async function getBlobData(){
  const response = await fetch(`http://localhost:3000/api/retrieve`);
  return await response.json();
}
