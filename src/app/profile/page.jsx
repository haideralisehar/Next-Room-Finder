"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Header from "../components/Header";
import "../bookingPage/mybooking.css";
import "../profile/profile.css";
import CountryCodeSelector from "../components/countryCode"

export default function ProfilePage() {
  const router = useRouter();

  const [agency, setAgency] = useState({
    userName: "",
    agencyName: "",
    agencyAddress: "",
    agencyEmail: "",
    agencyPhoneNumber: "",
    agencyCRNumber: "",
    agencyCRExpiryDate: "",
    
    status: '',
    createdAt: "",
  });

  const [loading, setLoading] = useState(true);
  const [loadings, setLoadings] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [countryCode, setCountryCode] = useState("");

  // ✅ Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAgency((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Handle file upload preview
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // ✅ Fetch agency profile on load
  useEffect(() => {
    const userId = Cookies.get("userId");
    if (!userId) {
      router.push("/authentication/login");
      return;
    }

    async function fetchProfile() {
      try {
        const res = await fetch("/api/getAgency");
        const data = await res.json();

        if (!res.ok || !data.agency?.data) {
          throw new Error(data.error || "Failed to load profile");
        }

        const ag = data.agency.data;
        console.log(ag.password);

        setAgency({
          userName: ag.userName || "",
          agencyName: ag.agencyName || "",
          agencyAddress: ag.agencyAddress || "",
          agencyEmail: ag.agencyEmail || "",
          agencyPhoneNumber: ag.agencyPhoneNumber || "",
          agencyCRNumber: ag.agencyCRNumber || "",
          agencyCRExpiryDate: ag.agencyCRExpiryDate?.split("T")[0] || "",
          createdAt: ag.createdAt || "",
          status: ag.status || false,
          countryCodes: countryCode,
         
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

  const handleUpdate = async () => {
    try {
      
      setLoadings(true);
      setSuccess(null);
      setError(null);

      const formData = new FormData();
      formData.append("userName", agency.userName);

      formData.append("agencyName", agency.agencyName);
      formData.append("agencyEmail", agency.agencyEmail);
      formData.append("agencyAddress", agency.agencyAddress);
      formData.append("agencyCRExpiryDate", agency.agencyCRExpiryDate);
      formData.append("agencyCRNumber", agency.agencyCRNumber);
      formData.append("agencyPhoneNumber", agency.agencyPhoneNumber);
      formData.append("status", agency.status);
      if (selectedFile) formData.append("profileImage", selectedFile);

      const res = await fetch("/api/updateProfile", {
        method: "POST",
        body: formData,
      });

      // console.log(ag.status);
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
        agency && agency.agencyEmail ? (
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
                      alt="Profile"
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

                <label>User Name</label>
                <input
                  type="text"
                  name="userName"
                  value={agency.userName}
                  onChange={handleChange}
                  disabled={!loadings}
                  className="profile-input"
                />

                

                
                 <label>Status</label>
                <input
                  type="text"
                  value={agency.status?"active":"inactive"}
                  onChange={handleChange}
                  disabled={!loadings}
                  className="profile-input"
                />


                 
              </div>

              {/* Middle Section */}
              <div className="middle-section">
                <h2 style={{ fontWeight: "bold" }}>Agency Details</h2>

                 <label>Agency Name</label>
                <input
                  type="text"
                  name="agencyName"
                  value={agency.agencyName}
                  onChange={handleChange}
                  disabled={loadings}
                  className="profile-input"
                />

                
                <label>CR Number</label>
                <input
                  type="text"
                  name="agencyCRNumber"
                  value={agency.agencyCRNumber}
                  onChange={handleChange}
                  disabled={loadings}
                  className="profile-input"
                />
                <label>CR Expiry Date</label>
              <input
                type="date"
                name="agencyCRExpiryDate"
                value={agency.agencyCRExpiryDate}
                onChange={handleChange}
                className="profile-input"
              />

               

               
              </div>

              {/* Right Column */}
              <div className="profile-column">
                <h2 style={{ fontWeight: "bold" }}>Contact Details</h2>
 {/* <CountryCodeSelector onSelect={(code) => setCountryCode(code)} /> */}
                <label>Agency Phone</label>
                <input
                  type="text"
                  name="agencyPhoneNumber"
                  value={agency.agencyPhoneNumber}
                  onChange={handleChange}
                  disabled={loadings}
                  className="profile-input"
                />
                <label>Email Address</label>
                <input
                  type="text"
                  name="agencyEmail"
                  value={agency.agencyEmail}
                  onChange={handleChange}
                  disabled={loadings}
                  className="profile-input"
                />

                <label>Address</label>
                <textarea
                  type="text"
                  name="agencyAddress"
                  value={agency.agencyAddress}
                  onChange={handleChange}
                  disabled={loadings}
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
            <p style={{ textAlign: "center", padding: "30px 0px" }}>
              No profile data found. Please try again.
            </p>
          </div>
        )
      ) : null}
    </>
  );
}
