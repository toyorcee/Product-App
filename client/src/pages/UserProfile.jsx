import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserByIdAsync, updateUserAsync } from "../slices/userSlice";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import EmailIcon from "@mui/icons-material/Email";
import EditIcon from "@mui/icons-material/Edit";
import LogoutIcon from "@mui/icons-material/Logout";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { toast } from "react-toastify";
import Divider from "@mui/material/Divider";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

function UserProfileSkeleton() {
  return (
    <div className="flex flex-col md:flex-row h-full w-full bg-white rounded-lg shadow-lg overflow-hidden animate-pulse">
      <div className="md:w-1/3 w-full bg-blue-50 flex flex-col items-center justify-start py-12 px-6">
        <div className="w-28 h-28 rounded-full border-4 border-blue-200 mb-4 bg-gray-200" />
        <div className="h-6 w-32 bg-gray-200 rounded mb-2" />
        <div className="h-4 w-40 bg-gray-200 rounded mb-2" />
      </div>
      <div className="flex-1 flex flex-col justify-start py-12 px-8">
        <div className="h-8 w-48 bg-gray-200 rounded mb-6" />
        <div className="mb-8 space-y-4">
          <div className="h-4 w-40 bg-gray-200 rounded" />
          <div className="h-4 w-32 bg-gray-200 rounded" />
          <div className="h-4 w-24 bg-gray-200 rounded" />
          <div className="h-4 w-28 bg-gray-200 rounded" />
          <div className="h-4 w-36 bg-gray-200 rounded" />
        </div>
        <div className="flex gap-4">
          <div className="h-10 w-32 bg-gray-200 rounded" />
          <div className="h-10 w-32 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
}

export default function UserProfile() {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.user);
  const [editOpen, setEditOpen] = useState(false);
  const [logoutDialog, setLogoutDialog] = useState(false);
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "error",
  });
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    dispatch(fetchUserByIdAsync(6));
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setForm({
        username: user.username || "",
        email: user.email || "",
        password: "",
      });
    }
  }, [user]);

  const handleEditOpen = () => setEditOpen(true);
  const handleEditClose = () => setEditOpen(false);

  const handleFormChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const res = await dispatch(
        updateUserAsync({ id: user.id, ...form })
      ).unwrap();
      const mergedUser = { ...user, ...res };
      if (!mergedUser.name)
        mergedUser.name = user.name || { firstname: "", lastname: "" };
      if (!mergedUser.address) mergedUser.address = user.address || {};
      dispatch({ type: "user/fetchById/fulfilled", payload: mergedUser });
      toast.success("Profile updated successfully!");
      setEditOpen(false);
    } catch (err) {
      setSnackbar({
        open: true,
        message: err?.message || "Update failed",
        severity: "error",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleLogout = () => {
    setLogoutDialog(false);
    // Add your logout logic here
  };

  if (loading && !user) return <UserProfileSkeleton />;

  return (
    <div className="flex flex-col md:flex-row h-full w-full bg-white rounded-lg shadow-lg overflow-hidden p-4">
      <div className="md:w-1/3 w-full bg-blue-50 flex flex-col items-center justify-center py-12 px-6">
        <img
          src={user?.image || "https://randomuser.me/api/portraits/men/32.jpg"}
          alt="Profile"
          className="w-28 h-28 rounded-full border-4 border-blue-400 mb-4"
        />
        <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <AccountCircleIcon className="text-blue-500" />{" "}
          {user && user.name
            ? `${user.name.firstname} ${user.name.lastname}`
            : "..."}
        </h3>
        <p className="text-gray-600 mb-2 flex items-center gap-2">
          <EmailIcon className="text-gray-400" /> {user?.email || "..."}
        </p>
      </div>
      <div className="flex-1 flex flex-col justify-start overflow-y-auto lg:overflow-y-visible h-full py-12 px-8 md:px-16 lg:px-24">
        <h2 className="text-2xl font-bold mb-6">Account Details</h2>
        <div className="mb-4">
          <div className="mb-2">
            <span className="block text-gray-500 text-sm mb-1">Full Name</span>
            <span className="block text-lg font-semibold text-gray-800">
              {user ? `${user.name.firstname} ${user.name.lastname}` : "..."}
            </span>
          </div>
          <div className="mb-2">
            <span className="block text-gray-500 text-sm mb-1">Email</span>
            <span className="block text-lg font-semibold text-gray-800">
              {user?.email || "..."}
            </span>
          </div>
          <div className="mb-2">
            <span className="block text-gray-500 text-sm mb-1">Username</span>
            <span className="block text-lg font-semibold text-gray-800">
              {user?.username || "..."}
            </span>
          </div>
          <div className="mb-2">
            <span className="block text-gray-500 text-sm mb-1">Phone</span>
            <span className="block text-lg font-semibold text-gray-800">
              {user?.phone || "..."}
            </span>
          </div>
          <div className="mb-2">
            <span className="block text-gray-500 text-sm mb-1">Address</span>
            <span className="block text-lg font-semibold text-gray-800">
              {user
                ? `${user.address.number} ${user.address.street}, ${user.address.city}`
                : "..."}
            </span>
          </div>
        </div>
        <div className="flex gap-4 pr-4 md:pr-12 mt-6 pt-2">
          <button
            className="flex items-center gap-2 px-4 py-2 text-sm md:px-6 md:py-3 md:text-base !bg-blue-600 !hover:bg-blue-700 !text-white font-semibold rounded transition"
            onClick={handleEditOpen}
          >
            <EditIcon /> Edit Profile
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2 text-sm md:px-6 md:py-3 md:text-base bg-red-50 hover:bg-red-100 text-red-700 font-semibold rounded transition"
            onClick={() => setLogoutDialog(true)}
          >
            <LogoutIcon /> Logout
          </button>
        </div>
        <Dialog
          open={editOpen}
          onClose={handleEditClose}
          PaperProps={{
            sx: {
              borderRadius: 3,
              boxShadow: 8,
              minWidth: { xs: 320, sm: 400 },
              p: 0,
            },
          }}
        >
          <DialogTitle
            sx={{ fontWeight: 700, fontSize: 22, pb: 1, pt: 2, px: 3 }}
          >
            Edit Profile
          </DialogTitle>
          <Divider />
          <form onSubmit={handleEditSubmit}>
            <DialogContent
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                py: 3,
                px: 3,
              }}
            >
              <TextField
                label="Username"
                name="username"
                value={form.username}
                onChange={handleFormChange}
                fullWidth
                required
                autoFocus
              />
              <TextField
                label="Email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleFormChange}
                fullWidth
                required
              />
              <TextField
                label="Password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleFormChange}
                fullWidth
                required
              />
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2, pt: 0 }}>
              <Button onClick={handleEditClose} disabled={updating}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={updating}
                startIcon={updating ? <CircularProgress size={20} /> : null}
              >
                {updating ? "Saving..." : "Save"}
              </Button>
            </DialogActions>
          </form>
        </Dialog>
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
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <MuiAlert elevation={6} variant="filled" severity={snackbar.severity}>
            {snackbar.message}
          </MuiAlert>
        </Snackbar>
      </div>
    </div>
  );
}
