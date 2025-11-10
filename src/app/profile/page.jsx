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
    firstName: "",
    lastName: "",
    userName: "",
    email: "",
    roleName: "",
    agencyName: "",
    companyPhone: "",
    profileImage: "",
    timezone: "",
  });
  const [loading, setLoading] = useState(true);
  const [loadings, setLoadings] = useState(false);
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
          firstName: data.user.firstName || "",
          lastName: data.user.lastName || "",
          userName: data.user.userName || "",
          email: data.user.email || "",
          roleName: data.user.roleName || "",
          agencyName: data.user.agencyName || "",
          companyPhone: data.user.companyPhone || "",
          timezone: data.user.timezone || "",

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
      
      setLoadings(true);
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
      setLoadings(false);
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
      {loadings && (
  <div className="update-overlay">
    <div className="update-box">
      <div className="spinner"></div>
      <p className="loading-text">Updating...</p>
    </div>
  </div>
)}

 {!loading ? (
  user && user.email ? (
    <div className="profile-container">
      {error && <p className="error-text">{error}</p>}
      {success && <p className="success-text">{success}</p>}

      <form className="profile-grid">
        {/* Left column */}
        <div className="profile-column">
          <h2 style={{ fontWeight: "bold" }}>Personal Information</h2>
          <div className="profile-avatar-section">
            <div className="avatar-wrapper">
              <img
                src={
                  preview ||
                  "https://thumbs.dreamstime.com/b/gmail-logo-google-product-icon-logotype-editorial-vector-illustration-vinnitsa-ukraine-october-199405574.jpg"
                }
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
                disabled={loadings}
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
            disabled={loadings}
            className="profile-input"
          />

          <label>First Name</label>
          <input
            type="text"
            name="firstName"
            value={user.firstName}
            onChange={handleChange}
            disabled={loadings}
            className="profile-input"
          />

          <label>Last Name</label>
          <input
            type="text"
            name="lastName"
            value={user.lastName}
            onChange={handleChange}
            disabled={loadings}
            className="profile-input"
          />
        </div>

        {/* Middle Section */}
        <div className="middle-section">
          <h2 style={{ fontWeight: "bold" }}>Company Details</h2>

          <label>Username</label>
          <input
            type="text"
            name="userName"
            value={user.userName}
            disabled
            className="profile-input"
          />

          <label>Agency Name</label>
          <input
            type="text"
            name="agencyName"
            value={user.agencyName}
            onChange={handleChange}
            disabled={loadings}
            className="profile-input"
          />

          <label>Email</label>
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleChange}
            disabled={loadings}
            className="profile-input"
          />

          <label>Timezone</label>
          <input
            type="text"
            name="timezone"
            value={user.timezone}
            disabled
            className="profile-input"
          />
        </div>

        {/* Right Column */}
        <div className="profile-column">
          <h2 style={{ fontWeight: "bold" }}>Contact Details</h2>

          <label>Company Phone</label>
          <input
            type="text"
            name="companyPhone"
            value={user.companyPhone}
            onChange={handleChange}
            disabled={loadings}
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
        </div>

        <div className="update-btn-container">
          <button
            type="button"
            onClick={handleUpdate}
            disabled={loadings}
            className="update-btn"
          >
            {loadings ? "Updating..." : "Update Profile"}
          </button>
        </div>
      </form>
    </div>
  ) : (
    <div className="no-data-message">
      <p style={{textAlign:"center", padding:"30px 0px"}}>No profile data found. Please try again.</p>
    </div>
  )
) : null}

      

    
    </>
  );
}
