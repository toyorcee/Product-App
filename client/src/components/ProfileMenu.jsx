import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ProfileMenu() {
  const [open, setOpen] = useState(false);
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
            }}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
