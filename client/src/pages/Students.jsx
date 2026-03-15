import { useState, useEffect } from "react";
import { getAllStudents } from "../api/studentApi";
import toast from "react-hot-toast";

const Students = () => {

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    search: "",
    department: "",
    batch: "",
    section: ""
  });

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await getAllStudents();
        setStudents(res.data.data?.data || res.data.data || []);
      } catch {
        toast.error("Failed to load students");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  /* ======================
     Unique dropdown values
  ====================== */

  const departments = [...new Set(students.map(s => s.department))];

  const batches = [...new Set(students.map(s => s.batch))];

  const sections = [...new Set(students.map(s => s.section))];

  /* ======================
     Filtering Logic
  ====================== */

  const filtered = students.filter((s) => {

    const matchesSearch =
      s.studentId?.toLowerCase().includes(filters.search.toLowerCase()) ||
      s.name?.toLowerCase().includes(filters.search.toLowerCase());

    const matchesDepartment =
      !filters.department || s.department === filters.department;

    const matchesBatch =
      !filters.batch || s.batch === Number(filters.batch);

    const matchesSection =
      !filters.section || s.section === filters.section;

    return matchesSearch && matchesDepartment && matchesBatch && matchesSection;
  });

  const thCls =
    "text-left py-3 px-4 text-[11px] font-semibold uppercase tracking-wider text-maroon-200";

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-maroon-600"></div>
      </div>
    );
  }

  return (
    <div>

      {/* HEADER */}

      <div className="flex items-center justify-between mb-6">

        <h1 className="text-xl font-bold text-gray-800">
          Students
        </h1>

        <span className="text-xs font-semibold text-maroon-600 bg-maroon-50 px-3 py-1 rounded-full">
          {filtered.length} students
        </span>

      </div>


      {/* FILTER SECTION */}

      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 grid md:grid-cols-4 gap-4">

        {/* SEARCH */}

        <input
          type="text"
          placeholder="Search ID or Name..."
          value={filters.search}
          onChange={(e) =>
            setFilters({ ...filters, search: e.target.value })
          }
          className="px-4 py-2 border border-gray-200 rounded-lg text-sm"
        />

        {/* DEPARTMENT */}

        <select
          value={filters.department}
          onChange={(e) =>
            setFilters({ ...filters, department: e.target.value })
          }
          className="px-4 py-2 border border-gray-200 rounded-lg text-sm"
        >
          <option value="">All Departments</option>

          {departments.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}

        </select>


        {/* BATCH */}

        <select
          value={filters.batch}
          onChange={(e) =>
            setFilters({
              ...filters,
              batch: e.target.value ? Number(e.target.value) : ""
            })
          }
          className="px-4 py-2 border border-gray-200 rounded-lg text-sm"
        >
          <option value="">All Batches</option>

          {batches.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}

        </select>


        {/* SECTION */}

        <select
          value={filters.section}
          onChange={(e) =>
            setFilters({ ...filters, section: e.target.value })
          }
          className="px-4 py-2 border border-gray-200 rounded-lg text-sm"
        >
          <option value="">All Sections</option>

          {sections.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}

        </select>

      </div>


      {/* STUDENTS TABLE */}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-maroon-600">

              <tr>

                <th className={thCls}>Student ID</th>
                <th className={thCls}>Name</th>
                <th className={thCls}>Department</th>
                <th className={thCls}>Batch</th>
                <th className={thCls}>Section</th>
                <th className={thCls}>Late Count</th>

              </tr>

            </thead>

            <tbody>

              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-12 text-gray-400 text-sm"
                  >
                    No students found
                  </td>
                </tr>
              ) : (
                filtered.map((s) => (
                  <tr
                    key={s._id || s.studentId}
                    className="border-b border-gray-50 hover:bg-gold-50/50 transition-colors"
                  >

                    <td className="py-3 px-4 text-sm font-mono text-maroon-600 font-medium">
                      {s.studentId}
                    </td>

                    <td className="py-3 px-4 text-sm">
                      {s.name}
                    </td>

                    <td className="py-3 px-4 text-sm">
                      {s.department}
                    </td>

                    <td className="py-3 px-4 text-sm">
                      {s.batch}
                    </td>

                    <td className="py-3 px-4 text-sm">
                      {s.section}
                    </td>

                    <td className="py-3 px-4">

                      <span
                        className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${
                          s.totalLateCount > 0
                            ? "bg-maroon-600 text-white"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {s.totalLateCount}
                      </span>

                    </td>

                  </tr>
                ))
              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
};

export default Students;