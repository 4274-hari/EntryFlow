import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerApi } from "../api/authApi";
import toast from "react-hot-toast";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "STAFF",
    department: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form };
      if (form.role !== "STAFF") {
        delete payload.department;
      }
      await registerApi(payload);
      toast.success("Registration successful! Please login.");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-sm focus:ring-2 focus:ring-maroon-600/20 focus:border-maroon-600 outline-none transition";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md">
        <div className="bg-maroon-600 rounded-t-2xl px-8 py-7 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gold-400 mb-3">
            <span className="text-maroon-800 font-extrabold text-lg">EF</span>
          </div>
          <h1 className="text-2xl font-bold text-white">EntryFlow</h1>
          <p className="text-maroon-200 text-sm mt-1">Create a new account</p>
        </div>

        <div className="bg-white rounded-b-2xl shadow-lg px-8 py-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Full Name</label>
              <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} placeholder="John Doe" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Email</label>
              <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputCls} placeholder="you@example.com" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Password</label>
              <input type="password" required minLength={6} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className={inputCls} placeholder="Min 6 characters" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Role</label>
              <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className={inputCls}>
                <option value="STAFF">Staff</option>
                <option value="ADMIN">Admin</option>
                <option value="SECURITY">Security</option>
              </select>
            </div>

            {form.role === "STAFF" && (
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">Department</label>
                <input type="text" required value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} className={inputCls} placeholder="e.g. CSE, ECE, MECH" />
              </div>
            )}

            <button type="submit" disabled={loading} className="w-full bg-maroon-600 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-maroon-700 transition disabled:opacity-50 cursor-pointer">
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-500">
              Already have an account?{" "}
              <Link to="/login" className="text-maroon-600 font-semibold hover:underline">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
