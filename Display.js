import { useState } from "react";
import "./Display.css";
import axios from "axios";

const Display = ({ contract, account }) => {
  const [data, setData] = useState([]);

  const getData = async () => {
    let dataArray;
    const otherAddress = document.querySelector(".address").value;

    try {
      if (otherAddress) {
        dataArray = await contract.display(otherAddress);
      } else {
        dataArray = await contract.display(account);
      }
    } catch (error) {
      alert("Error fetching data from the contract");
      console.error("Error fetching data:", error);
      return;
    }

    if (dataArray && dataArray.length > 0) {
      const images = dataArray.map((item, i) => ({
        url: item,
        id: i,
        name: item.split('/').pop()
      }));
      setData(images);
    } else {
      setData([]); // Clear the table
      alert("No image to display");
    }
  };

  const handleEncrypted = async (url) => {
    try {
      const response = await axios({
        method: 'GET',
        url: url,
        responseType: 'blob',
      });

      const blob = new Blob([response.data]);
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = url.split('/').pop();
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      alert("Error downloading encrypted file");
      console.error("Error downloading encrypted file:", error);
    }
  };

  const handleDownload = async (url) => {
    try {
      if (!url) {
        throw new Error('URL is undefined');
      }

      const response = await axios({
        method: 'GET',
        url: url,
        responseType: 'arraybuffer'
      });

      const contentType = response.headers['content-type'];
      const blob = new Blob([response.data], { type: contentType });
      const fileName = url.split('/').pop();

      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = fileName;
      link.click();

      console.log('File downloaded:', response.data);
    } catch (error) {
      alert("Error downloading file");
      console.error("Error downloading file:", error);
    }
  };

  const handleDelete = async (id, url) => {
    const updatedData = data.filter((item) => item.id !== id);
    setData(updatedData);

    try {
      const hash = url.split('/').pop();
      await axios({
        method: 'DELETE',
        url: `https://api.pinata.cloud/pinning/unpin/${hash}`,
        headers: {
          pinata_api_key: 'please get your api key for here!',
          pinata_secret_api_key: 'please get your secret api key for here!',
        }
      });
    } catch (error) {
      alert("Error deleting file");
      console.error("Error deleting file:", error);
    }
  };

  return (
    <>
      <input
        type="text"
        placeholder="Enter Address"
        className="address"
      ></input>
      <button className="center button" onClick={getData}>
        Get Data
      </button>
      <table className="image-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>File Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>
                <button className="display-button" onClick={() => window.open(item.url, "_blank")}>
                  Display
                </button>
                <button className="download-button" onClick={() => handleDownload(item.url)}>
                  Download
                </button>
                <button className="encrypted-button" onClick={() => handleEncrypted(item.url)}>
                  Encrypted
                </button>
                <button className="delete-button" onClick={() => handleDelete(item.id, item.url)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default Display;
