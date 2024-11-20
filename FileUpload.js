import "./FileUpload.css";
import axios from "axios";
import { useState } from "react";
import React from "react";
const FileUpload = ({ contract, account }) => {
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState("No file selected");

    //1-Handle Image-to upload the image on ipfs
    //2-Retrieve File

    const handleSubmit=async(event)=>{
        event.preventDefault();
        if(file){
            try{
                const formData = new FormData();
                formData.append("file", file);

                const resFile = await axios({
                    method: "post",
                    url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
                    data: formData,
                    headers: {
                      pinata_api_key: `please get your api key for here!`,
                      pinata_secret_api_key: `please get your secret api key for here!`,
                      "Content-Type": "multipart/form-data",
                    },
                  });
                  const ImgHash = `https://gateway.pinata.cloud/ipfs/${resFile.data.IpfsHash}`;
                  //console.log(ImgHash);
                  contract.add(account,ImgHash);
                  alert("File Successfully  Uploaded");
                  setFileName("No file selected");
                  setFile(null);

            }catch(error){
                alert(error);
            }
        }

    }

    const retrieveFile=(event)=>{
        //console.log("Hi");
        const data = event.target.files[0]; //files array of files object
        //console.log(data);
        const reader = new window.FileReader();
        reader.readAsArrayBuffer(data);
        reader.onloadend = () => {
        setFile(event.target.files[0]);
        };
        //console.log(event.target.files[0].name)
        setFileName(event.target.files[0].name);
        event.preventDefault();

    }

 
  return (
    <div className="top">
      <form className="form" onSubmit={handleSubmit}>
        <label htmlFor="file-upload" className="choose">
          Choose File
        </label>
        <input
          type="file"
          id="file-upload"
          name="data"
          onChange={retrieveFile}
          disabled={!account}
        />
        <span className="textArea">File:{fileName}</span>
        <button type="submit" className="upload" disabled={!file}>
          Upload File
        </button>
      </form>
    </div>
  );
};
export default FileUpload;

