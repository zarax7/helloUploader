import axios from "axios";
import React, { useState, useEffect } from "react";
import ProgressBar from "../ProgressBar/ProgressBar";
import UploaderMessage from "../UploaderMessage/UploaderMessage";
import "./Uploader.css";
import Dropzone, { useDropzone } from "react-dropzone";

export default function Uploader() {
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState("");
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/png, image/jpeg, application/pdf",
    onDrop: (acceptedFiles) => {
      console.log("this is Accepted files", acceptedFiles);
      acceptedFiles.File.map((el) => {
        if (
          el.type === "image/png" ||
          el.type === "image/jpeg" ||
          el.type === "application/pdf"
        ) {
          setFiles(
            acceptedFiles.map((file) =>
              Object.assign(file, {
                preview: URL.createObjectURL(file),
              })
            )
          );
        } else {
          setMessage("Sorry! only PNG, JPEG, PDF are accepted");
        }
      });
    },
  });
  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks
    files.forEach((file) => URL.revokeObjectURL(file.preview));
  }, [files]);

  const handleSubmit = async (data) => {
    data.preventDefault();
    try {
      if (files.length == 0) {
        setMessage("Please select a file.");
      } else {
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
          formData.append("file", files[i]);
        }
        let jwt = localStorage.getItem("token");
        const result = await axios.post("/api/files", formData, {
          headers: {
            "Content-Type": "multipart/form.data",
            Authorization: "Bearer " + jwt,
          },
          onUploadProgress: (progressEvent) => {
            setUploadPercentage(
              parseInt(
                Math.round((progressEvent.loaded * 100) / progressEvent.total)
              )
            );
          },
        });
        setMessage("File(s) successfully uploaded.");
      }
    } catch (err) {
      console.log(err);
      setMessage("Error while uploading");
    }
  };
  const allFiles = files && files.map((file) => <p>{file.name}</p>);

  return (
    <div className="Wrapper">
      {message ? <UploaderMessage uploadMsg={message} /> : null}
      <div className="Upload">
        <form>
          <div {...getRootProps({ className: "dropzone" })}>
            <input
              accept={"image/png, application/pdf, image/jpeg"}
              {...getInputProps("image/png, application/pdf, image/jpeg")}
            />
            <p>Drag 'n' drop some files here, or click to select files </p>
          </div>
          <h3>{allFiles}</h3>
          {/* <input
            type="file"
            accept="image/png, application/pdf, image/jpeg"
            multiple
            onChange={(e) => setFiles(e.target.files)}
          ></input> */}
          <ProgressBar percentage={uploadPercentage} />
          <button
            className="Upload-button"
            onClick={handleSubmit}
            type="submit"
          >
            Upload
          </button>
        </form>
      </div>

      {/* <div style={{ color: "red", marginTop: "5px" }}>{message}</div> */}
    </div>
  );
}
