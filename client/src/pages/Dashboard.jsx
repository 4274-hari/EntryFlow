import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getAdminDashboard, getStaffDashboard } from "../api/analyticsApi";
import toast from "react-hot-toast";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from "recharts";

import {
  HiOutlineUsers,
  HiOutlineClock,
  HiOutlineCalendar
} from "react-icons/hi";

const colors = ["#7f1d1d", "#fbbf24", "#dc2626", "#f59e0b"];

const StatCard = ({ title, value, icon: Icon }) => (
  <div className="bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-4 shadow-sm">
    <div className="w-11 h-11 flex items-center justify-center rounded-lg bg-maroon-50 text-maroon-600">
      <Icon className="w-5 h-5" />
    </div>

    <div>
      <p className="text-xs text-gray-500 uppercase">{title}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();

  const [data, setData] = useState(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const api =
        user.role === "ADMIN"
          ? getAdminDashboard
          : getStaffDashboard;

      const res = await api();

      setData(res.data.data);
    } catch {
      toast.error("Failed to load dashboard");
    }
  };

  if (!data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-maroon-600"></div>
      </div>
    );
  }

  /* =========================
     Convert Backend Data
  ========================= */

  const departmentTotals = data.departmentBreakdown.map((dept) => ({
    department: dept.department,
    total: dept.batches.reduce((sum, b) => sum + b.totalLate, 0)
  }));

  const batchData = data.departmentBreakdown.flatMap((dept) =>
    dept.batches.map((b) => ({
      name: `${dept.department}-${b.batch}`,
      totalLate: b.totalLate
    }))
  );

  return (
    <div className="space-y-8">

      {/* HEADER */}

      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          {user.role === "ADMIN" ? "Admin" : "Staff"} Dashboard
        </h1>
        <p className="text-sm text-gray-500">
          Overview of late entry statistics
        </p>
      </div>

      {/* STAT CARDS */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <StatCard
          title="Total Students"
          value={data.totalStudents}
          icon={HiOutlineUsers}
        />

        <StatCard
          title="Late Today"
          value={data.totalLateToday}
          icon={HiOutlineClock}
        />

        <StatCard
          title="Late This Month"
          value={data.totalLateThisMonth}
          icon={HiOutlineCalendar}
        />

      </div>

      {/* CHART SECTION */}

      <div className="grid md:grid-cols-2 gap-6">

        {/* DEPARTMENT BAR CHART */}

        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">

          <h2 className="text-sm font-semibold text-gray-700 mb-4">
            Department Late Distribution
          </h2>

          <ResponsiveContainer width="100%" height={280}>

            <BarChart data={departmentTotals}>

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="department" />

              <YAxis />

              <Tooltip />

              <Bar dataKey="total" fill="#7f1d1d" />

            </BarChart>

          </ResponsiveContainer>

        </div>

        {/* BATCH PIE CHART */}

        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">

          <h2 className="text-sm font-semibold text-gray-700 mb-4">
            Batch Distribution
          </h2>

          <ResponsiveContainer width="100%" height={280}>

            <PieChart>

              <Pie
                data={batchData}
                dataKey="totalLate"
                nameKey="name"
                outerRadius={100}
                label
              >
                {batchData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={colors[index % colors.length]}
                  />
                ))}
              </Pie>

              <Tooltip />

            </PieChart>

          </ResponsiveContainer>

        </div>

      </div>

      {/* TOP LATE STUDENTS */}

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">

        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-700">
            Top Late Students
          </h2>
        </div>

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-gray-50">

              <tr className="text-xs text-gray-500 uppercase">

                <th className="text-left px-6 py-3">#</th>
                <th className="text-left px-6 py-3">Student ID</th>
                <th className="text-left px-6 py-3">Name</th>
                <th className="text-left px-6 py-3">Department</th>
                <th className="text-left px-6 py-3">Late Count</th>

              </tr>

            </thead>

            <tbody>

              {data.topLate.map((s, i) => (

                <tr
                  key={s.studentId}
                  className="border-t hover:bg-gray-50"
                >

                  <td className="px-6 py-3 text-sm text-gray-500">
                    {i + 1}
                  </td>

                  <td className="px-6 py-3 font-mono text-sm text-maroon-600">
                    {s.studentId}
                  </td>

                  <td className="px-6 py-3 text-sm">
                    {s.name}
                  </td>

                  <td className="px-6 py-3 text-sm">
                    {s.department}
                  </td>

                  <td className="px-6 py-3">

                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-maroon-600 text-white">
                      {s.totalLateCount}
                    </span>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
};

export default Dashboard;