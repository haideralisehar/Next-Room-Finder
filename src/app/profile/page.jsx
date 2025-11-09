"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Header from "../components/Header";
import "../bookingPage/mybooking.css";
import "../profile/profile.css";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState({
    fullName: "",
    userName: "",
    email: "",
    roleName: "",
    agencyName: "",
    companyPhone: "",
    profileImage: "https://thumbs.dreamstime.com/b/gmail-logo-google-product-icon-logotype-editorial-vector-illustration-vinnitsa-ukraine-october-199405574.jpg",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    const userId = Cookies.get("userId");
    if (!userId) {
      router.push("/authentication/login");
      return;
    }

    async function fetchProfile() {
      try {
        const res = await fetch("/api/profile");
        const data = await res.json();

        if (!res.ok || !data.user) {
          setError(data.error || "Failed to load profile");
        }

        setUser({
          fullName: data.user.fullName || "",
          userName: data.user.userName || "",
          email: data.user.email || "",
          roleName: data.user.roleName || "",
          agencyName: data.user.agencyName || "",
          companyPhone: data.user.companyPhone || "",
          // profileImage: data.user.profileImage || "",
        });
      } catch (err) {
        console.error("Profile fetch error:", err);
        setError("Failed to load profile details.");
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async () => {
    try {
      // setLoading(true);
      setSuccess(null);
      setError(null);

      const formData = new FormData();
      formData.append("fullName", user.fullName);
      formData.append("userName", user.userName);
      formData.append("email", user.email);
      formData.append("agencyName", user.agencyName);
      formData.append("companyPhone", user.companyPhone);
      if (selectedFile) formData.append("profileImage", selectedFile);

      const res = await fetch("/api/updateProfile", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Profile update failed");

      setSuccess("Profile updated successfully!");
    } catch (err) {
      console.error("Update failed:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="rprt">My Account</div>

      {/* ✅ Loading Overlay */}
      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <p className="loading-text">Loading your profile...</p>
        </div>
      )}

      {!loading && (
        <div className="profile-container">
          {error && <p className="error-text">{error}</p>}
          {success && <p className="success-text">{success}</p>}

          <form className="profile-grid">
            {/* Left column */}
            <div className="profile-column">
              <div className="profile-avatar-section">
                <div className="avatar-wrapper">
                  <img
                    src={"https://thumbs.dreamstime.com/b/gmail-logo-google-product-icon-logotype-editorial-vector-illustration-vinnitsa-ukraine-october-199405574.jpg"}
                    alt=""
                    className="avatar-img"
                  />
                  <label htmlFor="profile-upload" className="edit-icon">
                    ✎
                  </label>
                  <input
                    id="profile-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                  />
                </div>
              </div>

              <label>Full Name</label>
              <input
                type="text"
                name="fullName"
                value={user.fullName}
                onChange={handleChange}
                className="profile-input"
              />

              <label>Username</label>
              <input
                type="text"
                name="userName"
                value={user.userName}
                disabled
                className="profile-input"
              />
            </div>

            {/* Right column */}
            <div className="profile-column">
              <label>Agency Name</label>
              <input
                type="text"
                name="agencyName"
                value={user.agencyName}
                onChange={handleChange}
                className="profile-input"
              />

              <label>Company Phone</label>
              <input
                type="text"
                name="companyPhone"
                value={user.companyPhone}
                onChange={handleChange}
                className="profile-input"
              />

              <label>Role Name</label>
              <input
                type="text"
                name="roleName"
                value={user.roleName}
                disabled
                className="profile-input"
              />

              <label>Email</label>
              <input
                type="email"
                name="email"
                value={user.email}
                onChange={handleChange}
                className="profile-input"
              />

              <button
                type="button"
                onClick={handleUpdate}
                disabled={loading}
                className="update-btn"
              >
                {loading ? "Updating..." : "Update Profile"}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
