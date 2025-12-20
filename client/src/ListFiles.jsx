import { MdDownload } from "react-icons/md";
import { RiDeleteBin5Line } from "react-icons/ri";
function ListFiles({ files, deleteFile, downloadFile }) {
  console.count("List files");
  console.log(files, !files);
  return (
    <>
      {files.length == 0 ? (
        <p className="message">No files uploaded yet</p>
      ) : (
        <>
          <table className="files">
            <tbody>
              {files.map((file, index) => (
                <tr key={index}>
                  <td>{file.name}</td>
                  <td>{(file.size / (1024 * 1024)).toFixed(2)}MB</td>
                  <td>
                    <MdDownload
                      className="icon"
                      onClick={() => {
                        downloadFile(file.name);
                      }}
                    />
                  </td>
                  <td>
                    <RiDeleteBin5Line
                      className="icon"
                      onClick={() => {
                        deleteFile(file.name);
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </>
  );
}
export default ListFiles;
