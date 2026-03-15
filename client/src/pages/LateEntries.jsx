import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getLateEntriesByDate } from "../api/lateEntryApi";
import toast from "react-hot-toast";

const LateEntries = () => {
  const { user } = useAuth();

  const today = new Date().toISOString().split("T")[0];

  const [date, setDate] = useState(today);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const fetchEntries = async (selectedDate) => {
    setLoading(true);

    try {
      const res = await getLateEntriesByDate(selectedDate);

      let data = res.data.data || [];

      // 🔹 Role based filtering
      if (user.role === "STAFF") {
        data = data.filter(
          (entry) => entry.department === user.department
        );
      }

      setEntries(data);
      setSearched(true);

    } catch {
      toast.error("Failed to fetch late entries");
    } finally {
      setLoading(false);
    }
  };

  // Load today's entries automatically
  useEffect(() => {
    fetchEntries(today);
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!date) return;
    fetchEntries(date);
  };

  const thCls =
    "text-left py-3 px-4 text-[11px] font-semibold uppercase tracking-wider text-maroon-200";

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-800 mb-6">Late Entries</h1>

      {/* FILTER */}

      <form onSubmit={handleSearch} className="flex gap-3 mb-6">

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-sm focus:ring-2 focus:ring-maroon-600/20 focus:border-maroon-600 outline-none transition"
        />

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 bg-maroon-600 text-white rounded-lg text-sm font-semibold hover:bg-maroon-700 transition disabled:opacity-50 cursor-pointer"
        >
          {loading ? "Loading..." : "Search"}
        </button>

      </form>

      {/* LOADER */}

      {loading && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-maroon-600"></div>
        </div>
      )}

      {/* TABLE */}

      {searched && !loading && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">

          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">

            <h2 className="text-sm font-semibold text-gray-800">
              {new Date(date).toLocaleDateString("en-IN", { dateStyle: "long" })}
            </h2>

            <span className="text-xs font-semibold text-maroon-600 bg-maroon-50 px-3 py-1 rounded-full">
              {entries.length} entries
            </span>

          </div>

          {entries.length === 0 ? (
            <div className="py-12 text-center text-gray-400 text-sm">
              No late entries found for this date
            </div>
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="bg-maroon-600">

                  <tr>
                    <th className={thCls}>#</th>
                    <th className={thCls}>Student ID</th>
                    <th className={thCls}>Department</th>
                    <th className={thCls}>Batch</th>
                    <th className={thCls}>Section</th>
                    <th className={thCls}>Recorded At</th>
                  </tr>

                </thead>

                <tbody>

                  {entries.map((entry, i) => (

                    <tr
                      key={entry._id}
                      className="border-b border-gray-50 hover:bg-gold-50/50 transition-colors"
                    >

                      <td className="py-3 px-4 text-sm text-gray-400 font-medium">
                        {i + 1}
                      </td>

                      <td className="py-3 px-4 text-sm font-mono text-maroon-600 font-medium">
                        {entry.studentId}
                      </td>

                      <td className="py-3 px-4 text-sm">
                        {entry.department}
                      </td>

                      <td className="py-3 px-4 text-sm">
                        {entry.batch}
                      </td>

                      <td className="py-3 px-4 text-sm">
                        {entry.section}
                      </td>

                      <td className="py-3 px-4 text-sm text-gray-500">
                        {new Date(entry.createdAt).toLocaleTimeString("en-IN")}
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>
          )}

        </div>
      )}
    </div>
  );
};

export default LateEntries;