import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Dialog from "@mui/material/Dialog";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Divider } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";

export default function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const [logoutDialog, setLogoutDialog] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const handleLogout = () => {
    setLogoutDialog(false);
    setOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <img
        src="https://randomuser.me/api/portraits/men/32.jpg"
        alt="Profile"
        className="w-10 h-10 rounded-full cursor-pointer border-2 border-blue-400"
        onClick={() => setOpen((v) => !v)}
      />
      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded shadow-lg z-50">
          <button
            className="block w-full text-left px-4 py-2 hover:bg-gray-100 !text-blue-700"
            onClick={() => {
              setOpen(false);
              navigate("/profile");
            }}
          >
            View Profile
          </button>
          <button
            className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
            onClick={() => {
              setOpen(false);
              setLogoutDialog(true);
            }}
          >
            Logout
          </button>
        </div>
      )}

      <Dialog
        open={logoutDialog}
        onClose={() => setLogoutDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            background: "none",
            boxShadow: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "visible",
            maxHeight: "100vh",
          },
        }}
        BackdropProps={{
          style: {
            background: "rgba(30, 41, 59, 0.35)",
            backdropFilter: "blur(2px)",
          },
        }}
      >
        <Box
          sx={{
            background: "#f0f6ff",
            borderRadius: 3,
            border: "1.5px solid #e3edfa",
            p: { xs: 3, sm: 4 },
            boxShadow: 4,
            maxWidth: 400,
            mx: "auto",
            my: 2,
            minWidth: { xs: 0, sm: 340 },
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            overflow: "visible",
            position: "relative",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Box
              sx={{
                width: 48,
                height: 48,
                background:
                  "linear-gradient(135deg, #dc2626 60%, #ef4444 100%)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 1,
              }}
            >
              <LogoutIcon sx={{ color: "white", fontSize: 28 }} />
            </Box>
            <Typography
              variant="h5"
              fontWeight={700}
              color="error.main"
              align="center"
              sx={{ mb: 0.5, letterSpacing: 0.5 }}
            >
              Confirm Logout
            </Typography>
            <Divider
              sx={{
                width: 60,
                height: 3,
                bgcolor: "error.main",
                borderRadius: 2,
                mt: 1,
                mb: 0.5,
              }}
            />
          </Box>
          <Box sx={{ width: "100%" }}>
            <Typography
              variant="body1"
              color="text.secondary"
              align="center"
              sx={{ mb: 3 }}
            >
              Are you sure you want to logout from your account?
            </Typography>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => setLogoutDialog(false)}
                sx={{
                  borderColor: "#2563eb",
                  color: "#2563eb",
                  "&:hover": {
                    borderColor: "#1e40af",
                    backgroundColor: "rgba(37, 99, 235, 0.04)",
                  },
                }}
              >
                Cancel
              </Button>
              <Button
                fullWidth
                variant="contained"
                onClick={handleLogout}
                sx={{
                  backgroundColor: "#dc2626",
                  "&:hover": {
                    backgroundColor: "#b91c1c",
                  },
                }}
              >
                Logout
              </Button>
            </Box>
          </Box>
        </Box>
      </Dialog>
    </div>
  );
}
