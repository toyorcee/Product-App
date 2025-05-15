import { NavLink, useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";

export default function Sidebar({ open, onClose }) {
  const navigate = useNavigate();
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-40 md:hidden"
          onClick={onClose}
        ></div>
      )}
      <aside
        className={`z-50 fixed md:static top-0 left-0 h-screen w-64 bg-gray-900 text-white pt-4 pr-4 pl-4 transform transition-transform duration-300
        ${
          open ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:block`}
        style={{ maxWidth: 256 }}
      >
        <div className="text-2xl font-bold mb-8 flex items-center justify-between">
          <button
            className="md:hidden text-2xl p-0 m-0 bg-transparent border-none rounded-none shadow-none w-auto h-auto hover:text-red-500 focus:outline-none"
            style={{
              background: "none",
              border: "none",
              borderRadius: 0,
              boxShadow: "none",
              width: "auto",
              height: "auto",
              padding: 0,
              margin: 0,
            }}
            onClick={onClose}
            aria-label="Close sidebar"
          >
            &times;
          </button>
        </div>
        <nav className="flex flex-col h-full justify-between">
          <div>
            <ul className="space-y-4">
              <li>
                <NavLink
                  to="/"
                  end
                  className={({ isActive }) =>
                    isActive ? "text-blue-400" : "hover:text-blue-400"
                  }
                  onClick={onClose}
                >
                  Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/products"
                  className={({ isActive }) =>
                    isActive ? "text-blue-400" : "hover:text-blue-400"
                  }
                  onClick={onClose}
                >
                  Products
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/categories"
                  className={({ isActive }) =>
                    isActive ? "text-blue-400" : "hover:text-blue-400"
                  }
                  onClick={onClose}
                >
                  Categories
                </NavLink>
              </li>
            </ul>
          </div>
          <button
            className="w-full mb-32 py-2 !bg-red-600 !hover:bg-red-700 !text-white font-semibold rounded-lg transition flex items-center justify-center gap-2"
            onClick={() => {
              // TODO: Add logout logic here
              alert("Logged out!");
              onClose && onClose();
            }}
          >
            <LogoutIcon />
            <span>Logout</span>
          </button>
        </nav>
      </aside>
    </>
  );
}
