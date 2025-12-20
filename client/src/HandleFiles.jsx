import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import UploadFiles from "./UploadFiles";
import ListFiles from "./ListFiles";
import Loading from "./Loading";
import Error from "./ErrorMessage";

function HandleFiles({ token }) {
  console.count("Handle Files");
  const [files, setFiles] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const AddFile = async (e, file) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/repo/add_file`,
        formData,
        { headers: { authorization: token } }
      );
      console.log(res);
      if (res.data.status) {
        setFiles((prev) => [
          ...prev,
          { name: res.data.name, size: res.data.size },
        ]);
      } else {
        setError(res.data.message);
      }
      console.log(res);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  const downloadFile = async (filename) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/repo/download_file`,
        {
          params: { filename },
          headers: { authorization: token },
          responseType: "blob",
        }
      );
      const url = window.URL.createObjectURL(new Blob([res.data.fileRes]));
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
    setLoading(false);
  };

  const deleteFile = async (filename) => {
    setLoading(true);
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/repo/delete_file`,
        { headers: { authorization: token, data: filename } }
      );
      console.log(res);
      if (res.data.status) {
        setFiles((prev) => prev.filter((file) => file.name !== filename));
      }
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    const getFiles = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/repo/get_files`,
          { headers: { authorization: token } }
        );
        setFiles(res.data.files);
        console.log(res);
      } catch (err) {
        console.log("Error in getting files");
        console.log(err);
      }
      setLoading(false);
    };
    getFiles();
  }, []);
  return (
    <>
      <div className="upload">
        {loading ? (
          <Loading />
        ) : (
          <ListFiles
            files={files}
            deleteFile={deleteFile}
            downloadFile={downloadFile}
          />
        )}
        <UploadFiles AddFile={AddFile} loading={loading} />
      </div>
      {error && <Error error={error} setError={setError} />}
    </>
  );
}
export default HandleFiles;
