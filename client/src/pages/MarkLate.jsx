import { useState, useEffect, useRef } from "react";
import { markLateEntry } from "../api/lateEntryApi";
import { getStudentById } from "../api/studentApi";
import toast from "react-hot-toast";
import {
  HiOutlineSearch,
  HiOutlineCheck,
  HiOutlineX,
  HiOutlineQrcode,
} from "react-icons/hi";
import { Html5Qrcode } from "html5-qrcode";

/* =========================
   STUDENT CARD
========================= */

const StudentCard = ({ student, onConfirm, onCancel, marking }) => (
  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">

    <div className="bg-maroon-600 px-5 py-3">
      <h2 className="text-sm font-bold text-white uppercase">
        Student Found
      </h2>
    </div>

    <div className="p-5 space-y-3">

      {[
        ["Student ID", <span className="font-mono text-maroon-600">{student.studentId}</span>],
        ["Name", student.name],
        ["Department", student.department],
        ["Batch", student.batch],
        ["Section", student.section],
        [
          "Total Late",
          <span className="bg-maroon-600 text-white px-2 py-1 rounded text-xs">
            {student.totalLateCount}
          </span>,
        ],
      ].map(([label, value]) => (
        <div
          key={label}
          className="flex justify-between text-sm border-b border-gray-50 pb-1"
        >
          <span className="text-gray-500">{label}</span>
          <span className="font-medium">{value}</span>
        </div>
      ))}

    </div>

    <div className="flex gap-3 p-5 pt-0">

      <button
        onClick={onCancel}
        className="flex-1 border border-gray-200 py-2.5 rounded-lg text-sm"
      >
        Cancel
      </button>

      <button
        onClick={onConfirm}
        disabled={marking}
        className="flex-1 bg-maroon-600 text-white py-2.5 rounded-lg text-sm font-semibold"
      >
        {marking ? "Marking..." : "Confirm Late"}
      </button>

    </div>
  </div>
);


/* =========================
   QR SCANNER (FULL SCREEN)
========================= */

const QrScanner = ({ onScan, onClose }) => {
  const scannerRef = useRef(null);

  useEffect(() => {

    const scanner = new Html5Qrcode("qr-reader");
    scannerRef.current = scanner;

    scanner
      .start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          scanner.stop().catch(() => {});
          onScan(decodedText);
        }
      )
      .catch(() => {
        toast.error("Camera not available");
        onClose();
      });

    return () => {
      scanner.stop().catch(() => {});
    };

  }, []);

  return (

    <div className="fixed inset-0 bg-black z-50">

      {/* Header */}

      <div className="absolute top-0 left-0 w-full flex justify-between items-center p-4 text-white">

        <h2 className="text-sm font-semibold">
          Scan Student QR
        </h2>

        <button onClick={onClose}>
          <HiOutlineX className="w-6 h-6" />
        </button>

      </div>


      {/* Camera */}

      <div id="qr-reader" className="w-full h-full"></div>


      {/* Scan Frame */}

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">

        <div className="w-64 h-64 border-4 border-white rounded-xl relative">

          <span className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-green-400"></span>
          <span className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-green-400"></span>
          <span className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-green-400"></span>
          <span className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-green-400"></span>

        </div>

      </div>


      {/* Instruction */}

      <div className="absolute bottom-16 w-full text-center text-white text-sm">
        Align QR code inside the frame
      </div>

    </div>
  );
};


/* =========================
   MAIN PAGE
========================= */

const MarkLate = () => {

  const [mode, setMode] = useState("type");
  const [studentId, setStudentId] = useState("");
  const [student, setStudent] = useState(null);

  const [loading, setLoading] = useState(false);
  const [marking, setMarking] = useState(false);
  const [scanning, setScanning] = useState(false);


  /* =====================
     Lookup student
  ===================== */

  const lookupStudent = async (id) => {

    if (!id.trim()) return;

    setLoading(true);
    setStudent(null);

    try {

      const res = await getStudentById(id.trim());

      setStudent(res.data.data);

    } catch {

      toast.error("Student not found");

    } finally {

      setLoading(false);

    }

  };


  const handleSearch = (e) => {
    e.preventDefault();
    lookupStudent(studentId);
  };


  /* =====================
     QR scan result
  ===================== */

  const handleQrScan = (data) => {

    setScanning(false);

    let id = data;

    try {

      const parsed = JSON.parse(data);

      id = parsed.studentId || parsed.id || data;

    } catch {}

    setStudentId(id);

    lookupStudent(id);

  };


  /* =====================
     Mark late
  ===================== */

  const handleMarkLate = async () => {

    setMarking(true);

    try {

      await markLateEntry({ studentId: student.studentId });

      toast.success(`${student.name} marked as late`);

      reset();

    } catch (err) {

      toast.error(err.response?.data?.message || "Failed to mark late");

    } finally {

      setMarking(false);

    }

  };


  const reset = () => {

    setStudent(null);
    setStudentId("");
    setScanning(false);

  };


  return (

    <div className="max-w-lg mx-auto mt-6 px-4">

      <h1 className="text-xl font-bold text-gray-800 mb-6">
        Mark Late Entry
      </h1>


      {/* MODE TOGGLE */}

      <div className="flex bg-gray-100 rounded-lg p-1 mb-6">

        <button
          onClick={() => { setMode("type"); reset(); }}
          className={`flex-1 py-2.5 rounded-md text-sm ${
            mode === "type"
              ? "bg-maroon-600 text-white"
              : "text-gray-500"
          }`}
        >
          <HiOutlineSearch className="inline mr-1" />
          Type
        </button>


        <button
          onClick={() => { setMode("scan"); setScanning(true); }}
          className={`flex-1 py-2.5 rounded-md text-sm ${
            mode === "scan"
              ? "bg-maroon-600 text-white"
              : "text-gray-500"
          }`}
        >
          <HiOutlineQrcode className="inline mr-1" />
          Scan
        </button>

      </div>


      {/* TYPE INPUT */}

      {mode === "type" && !student && (

        <form onSubmit={handleSearch} className="flex gap-3 mb-6">

          <input
            type="text"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            placeholder="Enter Student ID"
            className="flex-1 px-4 py-3 border rounded-lg text-sm"
          />

          <button className="px-5 bg-maroon-600 text-white rounded-lg">
            <HiOutlineSearch className="w-5 h-5" />
          </button>

        </form>

      )}


      {/* QR SCANNER */}

      {mode === "scan" && scanning && !student && (
        <QrScanner
          onScan={handleQrScan}
          onClose={() => { setScanning(false); setMode("type"); }}
        />
      )}


      {/* LOADING */}

      {loading && (

        <div className="flex justify-center py-8">
          <div className="animate-spin h-8 w-8 border-b-2 border-maroon-600 rounded-full"></div>
        </div>

      )}


      {/* STUDENT CARD */}

      {student && (

        <StudentCard
          student={student}
          onConfirm={handleMarkLate}
          onCancel={reset}
          marking={marking}
        />

      )}

    </div>

  );
};

export default MarkLate;