import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  HiOutlineHome,
  HiOutlineUsers,
  HiOutlineClipboardList,
  HiOutlineUpload,
  HiOutlineClock,
  HiOutlineLogout,
} from "react-icons/hi";

const navItems = {
  ADMIN: [
    { to: "/dashboard", label: "Dashboard", icon: HiOutlineHome },
    { to: "/students", label: "Students", icon: HiOutlineUsers },
    { to: "/upload", label: "Upload Students", icon: HiOutlineUpload },
    { to: "/late-entries", label: "Late Entries", icon: HiOutlineClipboardList },
  ],
  STAFF: [
    { to: "/dashboard", label: "Dashboard", icon: HiOutlineHome },
    { to: "/students", label: "Students", icon: HiOutlineUsers },
    { to: "/late-entries", label: "Late Entries", icon: HiOutlineClipboardList },
  ],
  SECURITY: [
    { to: "/mark-late", label: "Mark Late Entry", icon: HiOutlineClock },
  ],
};

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const items = navItems[user?.role] || [];
  const initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-maroon-600 flex flex-col shadow-xl">
        {/* Brand */}
        <div className="px-6 py-5 border-b border-maroon-700">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gold-400 flex items-center justify-center">
              <span className="text-maroon-800 font-extrabold text-sm">EF</span>
            </div>
            <div>
              <h1 className="text-base font-bold text-white tracking-wide">EntryFlow</h1>
              <p className="text-[11px] text-maroon-200 font-medium uppercase tracking-widest">
                {user?.role}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-150 ${
                  isActive
                    ? "bg-gold-400 text-maroon-800 shadow-sm"
                    : "text-maroon-100 hover:bg-maroon-700/60 hover:text-white"
                }`
              }
            >
              <item.icon className="w-[18px] h-[18px]" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* User footer */}
        <div className="px-3 py-4 border-t border-maroon-700">
          <div className="flex items-center gap-3 px-3 py-2 mb-1">
            <div className="w-8 h-8 rounded-full bg-gold-400 flex items-center justify-center shrink-0">
              <span className="text-maroon-800 text-xs font-bold">{initials}</span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.name}</p>
              <p className="text-[11px] text-maroon-200 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-[13px] font-medium text-maroon-200 hover:bg-maroon-700/60 hover:text-white transition-all duration-150 cursor-pointer"
          >
            <HiOutlineLogout className="w-[18px] h-[18px]" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-gray-50">
        <div className="p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
