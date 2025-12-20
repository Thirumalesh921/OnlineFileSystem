import { useRef } from "react";
import { BiSolidCloudUpload } from "react-icons/bi";
import { useState } from "react";
function UploadFiles({ AddFile, loading }) {
  console.count("Upload Files");
  const [file, setFile] = useState(null);
  const fileRef = useRef(null);
  return (
    <>
      <form
        className="upload-form"
        onSubmit={(e) => {
          AddFile(e, file);
          setFile(null);
          fileRef.current.value = null;
        }}
      >
        <input
          type="file"
          ref={fileRef}
          onChange={(e) => {
            setFile(e.target.files[0]);
          }}
          id="upload"
        />
        <label className="label" htmlFor="upload">
          <BiSolidCloudUpload />
        </label>

        <span className="file-name">{file ? file.name : "Choose a file"}</span>
        <input
          type="submit"
          disabled={loading || file == null}
          value={"Add file"}
        />
      </form>
    </>
  );
}
export default UploadFiles;
