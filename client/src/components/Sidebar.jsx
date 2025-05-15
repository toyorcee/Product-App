import { NavLink, useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import DashboardIcon from "@mui/icons-material/Dashboard";
import CategoryIcon from "@mui/icons-material/Category";
import InventoryIcon from "@mui/icons-material/Inventory";
import StorefrontIcon from "@mui/icons-material/Storefront";
import GridViewIcon from "@mui/icons-material/GridView";
import LocalMallIcon from "@mui/icons-material/LocalMall";

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
        className={`z-50 fixed top-0 left-0 h-screen w-64 bg-gray-900 text-white pt-4 pr-4 pl-4 transform transition-transform duration-300
        ${
          open ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:block`}
        style={{ maxWidth: 256 }}
      >
        <div className="text-2xl font-bold mb-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <StorefrontIcon className="text-2xl text-blue-400" />
            <span>Yosi's Store</span>
          </div>
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
            <ul className="space-y-2">
              <li>
                <NavLink
                  to="/"
                  end
                  className={({ isActive }) =>
                    isActive
                      ? "flex items-center px-4 py-2 rounded-lg bg-white text-blue-600 font-semibold shadow"
                      : "flex items-center px-4 py-2 rounded-lg !text-white hover:bg-gray-800 hover:!text-blue-400 transition"
                  }
                  onClick={onClose}
                >
                  <GridViewIcon className="mr-2" />
                  Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/products"
                  className={({ isActive }) =>
                    isActive
                      ? "flex items-center px-4 py-2 rounded-lg bg-white text-blue-600 font-semibold shadow"
                      : "flex items-center px-4 py-2 rounded-lg !text-white hover:bg-gray-800 hover:!text-blue-400 transition"
                  }
                  onClick={onClose}
                >
                  <LocalMallIcon className="mr-2" />
                  Products
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/categories"
                  className={({ isActive }) =>
                    isActive
                      ? "flex items-center px-4 py-2 rounded-lg bg-white text-blue-600 font-semibold shadow"
                      : "flex items-center px-4 py-2 rounded-lg !text-white hover:bg-gray-800 hover:!text-blue-400 transition"
                  }
                  onClick={onClose}
                >
                  <CategoryIcon className="mr-2" />
                  Categories
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/carts"
                  className={({ isActive }) =>
                    isActive
                      ? "flex items-center px-4 py-2 rounded-lg bg-white text-blue-600 font-semibold shadow"
                      : "flex items-center px-4 py-2 rounded-lg !text-white hover:bg-gray-800 hover:!text-blue-400 transition"
                  }
                  onClick={onClose}
                >
                  <ShoppingCartIcon className="mr-2" />
                  Carts
                </NavLink>
              </li>
            </ul>
          </div>
          <button
            className="w-full mb-20 md:mb-20 py-2 !bg-red-600 !hover:bg-red-700 !text-white font-semibold rounded-lg transition flex items-center justify-center gap-2"
            onClick={() => {
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
