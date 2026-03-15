import { useState, useRef } from "react";
import { uploadStudentsExcel } from "../api/studentApi";
import toast from "react-hot-toast";
import { HiOutlineUpload, HiOutlineDocumentText } from "react-icons/hi";

const UploadStudents = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const inputRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please select an Excel file");
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const res = await uploadStudentsExcel(file);
      setResult(res.data);
      toast.success("Upload successful!");
      setFile(null);
      if (inputRef.current) inputRef.current.value = "";
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-8">
      <h1 className="text-xl font-bold text-gray-800 mb-6">Upload Students</h1>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="bg-maroon-600 px-6 py-4">
          <p className="text-sm text-maroon-100">Upload an Excel file (.xlsx) with these columns:</p>
          <div className="flex flex-wrap gap-2 mt-2">
            {["Student ID", "Student Name", "Programme", "Batch", "Sec"].map((col) => (
              <span key={col} className="px-2.5 py-1 bg-gold-400 text-maroon-800 rounded-md text-xs font-bold">
                {col}
              </span>
            ))}
          </div>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div
              className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center cursor-pointer hover:border-maroon-300 hover:bg-maroon-50/30 transition"
              onClick={() => inputRef.current?.click()}
            >
              {file ? (
                <div className="flex items-center justify-center gap-2 text-maroon-600">
                  <HiOutlineDocumentText className="w-6 h-6" />
                  <span className="font-semibold text-sm">{file.name}</span>
                </div>
              ) : (
                <div>
                  <HiOutlineUpload className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">Click to select Excel file</p>
                </div>
              )}
              <input
                ref={inputRef}
                type="file"
                accept=".xlsx,.xls"
                onChange={(e) => setFile(e.target.files[0])}
                className="hidden"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !file}
              className="w-full bg-maroon-600 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-maroon-700 transition disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Uploading..." : "Upload File"}
            </button>
          </form>

          {result && (
            <div className="mt-5 p-4 bg-gold-50 rounded-lg border border-gold-200">
              <h3 className="text-sm font-bold text-maroon-700 mb-2">Upload Result</h3>
              <div className="space-y-1 text-sm text-gray-700">
                <p>Processed: <strong>{result.totalProcessed}</strong></p>
                <p>Inserted: <strong className="text-green-700">{result.insertedCount}</strong></p>
                {result.duplicateCount > 0 && (
                  <p>Duplicates skipped: <strong className="text-maroon-600">{result.duplicateCount}</strong></p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadStudents;
