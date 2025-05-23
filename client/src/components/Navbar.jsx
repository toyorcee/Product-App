import ProfileMenu from "./ProfileMenu";
import MenuIcon from "@mui/icons-material/Menu";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { selectCartTotalItems } from "../slices/cartSlice";

const linkStyles = {
  color: "white",
  textDecoration: "none",
  display: "flex",
  alignItems: "center",
};

export default function Navbar({ onHamburgerClick }) {
  const cartCount = useSelector(selectCartTotalItems);

  return (
    <nav className="bg-gray-900 text-white p-4 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <button
          className="md:hidden p-0 bg-transparent border-none shadow-none"
          onClick={onHamburgerClick}
          style={{
            background: "none",
            border: "none",
            boxShadow: "none",
            padding: 0,
          }}
        >
          <MenuIcon className="text-lg text-white" />
        </button>
        <Box display="flex" alignItems="center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="w-10 h-10"
            viewBox="0 0 24 24"
            style={linkStyles}
          >
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
          </svg>
          <Box
            ml={2}
            style={{
              ...linkStyles,
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <Typography
              variant="h2"
              sx={{
                fontSize: {
                  xs: "1rem",
                  sm: "1.125rem",
                  md: "1.25rem",
                  lg: "1.5rem",
                },
                fontWeight: "bold",
              }}
            >
              Yosi's Store
            </Typography>
            <p className="text-xs italic mt-1">Your Ultimate Lifestyle Store</p>
          </Box>
        </Box>
      </div>
      <div className="flex items-center space-x-4">
        <Link to="/carts" className="relative">
          <ShoppingCartIcon className="text-2xl !text-white hover:text-blue-500 transition cursor-pointer" />
          <span className="absolute -top-2 -right-2 !bg-red-500 !text-white text-xs font-bold rounded-full px-1.5 py-0.5 min-w-[20px] text-center">
            {cartCount}
          </span>
        </Link>
        <ProfileMenu />
      </div>
    </nav>
  );
}
