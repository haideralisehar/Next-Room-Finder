"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Header from "../components/Header";
import "../bookingPage/mybooking.css";
import "../profile/profile.css";
import Image from "next/image";
import CountryCodeSelector from "../components/countryCode"
import { apiFetch } from "../lib/apiFetch";
import { Skeletons } from '../components/Skeletons';


export default function ProfilePage() {
  const router = useRouter();

  const [agency, setAgency] = useState({
    userName: "",
    password: "",
    firstName: "",
    lastName: "",
    fullName: "",
    email: "",
    middleName: "",
    profileImage: "",
    roleName: "",
    timezone: "",
    companyPhone: "",
    accountingId: "",
    agencyId: "",
    userRights: [],
    agencyName: "",
    agencyPhone: "",
    createdAt: "",
    status: ""
  });

  const [loading, setLoading] = useState(true);
  const [loadings, setLoadings] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [countryCode, setCountryCode] = useState("");
  const [loadingfetch, setLoadingfetch] = useState(false);
   const token = Cookies.get("token");

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
         setLoadingfetch(true);
        const res = await apiFetch("/api/getAgency");
        const data = await res.json();

        if (!res.ok || !data.agency) {
          throw new Error(data.error || "Failed to load profile");
           setLoadingfetch(false);
        }

        const ag = data.agency;
         setLoadingfetch(false);
        

        setAgency({
          userName: ag.userName || "",
          password: agency.password,
          agencyName: ag.agencyName || "",
          firstName: ag.firstName || "",
          lastName: ag.lastName || "",
          middleName: ag.middleName,
          email: ag.email,
          companyPhone: ag.companyPhone,
          fullName: ag.fullName || "",
          createdAt: ag.createdAt || "",
          profileImage: ag.profileImage  || "",
          roleName: ag.roleName || "",
          timezone: ag.timezone || "",
          accountingId: ag.accountingId,
          agencyId: ag.agencyId || "",
          userRights: ag.userRights,
          status: ag.status || "",
          countryCodes: countryCode,
         
        });

        
      } catch (err) {
        console.error("Profile fetch error:", err);
         setLoadingfetch(false);
        setError("Failed to load profile details.");
      } finally {
        setLoading(false);
         setLoadingfetch(false);
      }
    }

    fetchProfile();
  }, [router]);

  

//   const uploadImage = async (file) => {
//   const formData = new FormData();
//   formData.append("file", file);

//   const res = await fetch(
//     "https://cityinbookingapi20251018160614-fxgqdkc6d4hwgjf8.canadacentral-01.azurewebsites.net/api/Users/upload-profile-image",
//     {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${token}` // ✅ correct
//       },
//       body: formData, // ✅ correct
//     }
//   );

//   if (!res.ok) {
//     throw new Error("Image upload failed");
//   }

//   const data = await res.json();
//   return data.imageUrl;
// };


const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/pImage", {
    method: "POST",
    body: formData
  });

  if (!res.ok) {
    throw new Error("Image upload failed");
  }

  const data = await res.json();
  console.log(data.imageUrl);
  return data.imageUrl;
};


 const handleUpdate = async () => {
  try {
    setLoadings(true);
    setError(null);
    setSuccess(null);

    let imageUrl = agency.profileImage || "";

    /* ───── STEP 1: Upload image ───── */
    if (selectedFile) {
      try {
        imageUrl = await uploadImage(selectedFile);
      } catch {
        setError("Image upload failed. Profile not updated.");
        return;
      }
    }

    /* ───── STEP 2: JSON payload (IMPORTANT) ───── */
    const payload = {
      email: agency.email, 
      password: agency.password,             // ✅ FIXED
      firstName: agency.firstName || "",
      lastName: agency.lastName || "",
      middleName: agency.middleName || "",
      profileImage: imageUrl,            // ✅ URL only
      roleName: agency.roleName,
      timezone: agency.timezone,
      companyPhone: agency.companyPhone || "",
      accountingId: agency.accountingId || "",
      agencyId: agency.agencyId || "",
      userRights: agency.userRights || [],
      status : agency.status
    };

    // if (agency.password) {
    //   payload.password = agency.password;
    // }

    const res = await fetch("/api/updateProfile", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error);
      setError("Network or server error");
    }

    if(res.ok){
      console.log(JSON.stringify(data));
      setSuccess("You have Successfully updated your profile.");
    }
    
  } catch (err) {
    console.error(err);
    setError(err.message || "Something went wrong");
  } finally {
    setLoadings(false);
  }
};



  return (
    <>
      <Header />
      {loadingfetch && (
                  <ProfileSkeletons/>
                )}
      <div className="rprt">My Account</div>

      {/* ✅ Loading Overlay */}
      {/* {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <p className="loading-text">Loading your profile...</p>
        </div>
      )} */}

      {/* {loadings && (
        <div className="update-overlay">
          <div className="update-box">
            <div className="spinner"></div>
            <p className="loading-text">Updating...</p>
          </div>
        </div>
      )} */}

      {!loading ? (
        agency   ? (
          <div className="profile-container">
            <div className="response" style={{backgroundColor: success? "#77cc78ff" : "#d46d6dff", margin:"10px 0px", borderRadius:"4px"}}>
{error && <p className="error-text">{error}</p>}
            {success && <p className="success-text">{success}</p>}

            </div>
            
{!error ?
            <form className="profile-grid">
              {/* Left column */}
              <div className="profile-column">
                <h2 style={{ fontWeight: "bold" }}>Personal Information</h2>

                <div className="profile-avatar-section">
                  <div className="avatar-wrapper">
                    <img
                      src={ preview ? preview : agency.profileImage || "https://www.shutterstock.com/shutterstock/videos/3605058573/thumb/1.jpg?ip=x480"
                        
                        
                        
                      }
                       onError={(e) => {
                e.target.src =
                  "https://thumbs.dreamstime.com/b/gmail-logo-google-product-icon-logotype-editorial-vector-illustration-vinnitsa-ukraine-october-199405574.jpg";
              }}
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

                 <label>Password </label>
                 <span style={{color:"red", fontSize:"11px", marginTop:"-10px", marginBottom:"-5px"}}>If you don't want to change password, left it blank.</span>
                <input
                title="If you don't want to change password, left it blank."
                  type="password"
                  name="password"
                  value={agency.password}
                  onChange={handleChange}
                  // disabled={!loadings}
                  placeholder="Enter new password to change"
                  className="profile-input"
                />

                      <label>Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={agency.fullName}
                  onChange={handleChange}
                  // disabled={!loadings}
                  className="profile-input"
                />
                


                 
              </div>

              {/* Middle Section */}
              <div className="middle-section">
                <h2 style={{ fontWeight: "bold" }}>Other Details</h2>

                 <label>Agency Name</label>
                <input
                  type="text"
                  name="agencyName"
                  value={agency.agencyName}
                  onChange={handleChange}
                  disabled
                  className="profile-input"
                />

                 <label>First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={agency.firstName}
                  onChange={handleChange}
                  // disabled={!loadings}
                  className="profile-input"
                />

                <label>Middle Name</label>
                <input
                  type="text"
                  name="middleName"
                  value={agency.middleName}
                  onChange={handleChange}
                  // disabled={!loadings}
                  className="profile-input"
                />

                <label>Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={agency.lastName}
                  onChange={handleChange}
                  // disabled={!loadings}
                  className="profile-input"
                />

                
                {/* <label>CR Number</label>
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
              /> */}

               

               
              </div>

              {/* Right Column */}
              <div className="profile-column">
                <h2 style={{ fontWeight: "bold" }}>Contact Details</h2>
 {/* <CountryCodeSelector onSelect={(code) => setCountryCode(code)} /> */}
                <label>Phone Number</label>
                <input
                  type="text"
                  name="companyPhone"
                  value={agency.companyPhone}
                  onChange={handleChange}
                  disabled={loadings}
                  className="profile-input"
                />
                <label>Email Address</label>
                <input
                  type="text"
                  name="email"
                  value={agency.email}
                  onChange={handleChange}
                  disabled={loadings}
                  className="profile-input"
                />

                {/* <label>Address</label>
                <textarea
                  type="text"
                  name="agencyAddress"
                  value={agency.agencyAddress}
                  onChange={handleChange}
                  disabled={loadings}
                  className="profile-input"
                /> */}
              </div>

              <div className="update-btn-container">
                <button
                type="button"
                onClick={handleUpdate}
                disabled={loadings}
                className="px-5 bg-indigo-600 hover:bg-indigo-600 disabled:opacity-50 text-white font-bold py-4 rounded-2xl shadow-xl shadow-indigo-600/20 transition-all flex items-center justify-center space-x-3 active:scale-[0.98] cursor-pointer"
              >
                {loadings ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin not-allowed" />
                    <span>Updating Profile...</span>
                  </>
                ) : (
                  <span>Save All Changes</span>
                )}
              </button>
              </div>
            </form>
            : ""}
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

function ProfileSkeletons() {
  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
      {/* Header Skeletons */}
      {/* <div className="space-y-2">
        <Skeletons width={200} height={32} />
        <Skeletons width={300} height={16} />
      </div> */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Col 1 Skeletons */}
        <div className=" border border-zinc-200 p-8 rounded-3xl space-y-4">
          <Skeletons width={180} height={24} />
          <div className="flex flex-col items-center py-4">
            <Skeletons circle width={128} height={128} />
          </div>
          <div className="space-y-6">
            <div className="space-y-2"><Skeletons width="40%" height={12} /><Skeletons height={44} className="rounded-xl" /></div>
            <div className="space-y-2"><Skeletons width="40%" height={12} /><Skeletons height={44} className="rounded-xl" /></div>
            <div className="space-y-2"><Skeletons width="40%" height={12} /><Skeletons height={44} className="rounded-xl" /></div>
          </div>
        </div>

        {/* Col 2 Skeletons */}
        <div className=" border border-zinc-200 p-8 rounded-3xl space-y-4">
          <Skeletons width={150} height={24} />
          <div className="space-y-6">
            <div className="space-y-2"><Skeletons width="40%" height={12} /><Skeletons height={44} className="rounded-xl" /></div>
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2"><Skeletons width="40%" height={12} /><Skeletons height={44} className="rounded-xl" /></div>
               <div className="space-y-2"><Skeletons width="40%" height={12} /><Skeletons height={44} className="rounded-xl" /></div>
            </div>
            <div className="space-y-2"><Skeletons width="40%" height={12} /><Skeletons height={44} className="rounded-xl" /></div>
            <div className="space-y-2"><Skeletons width="40%" height={12} /><Skeletons height={44} className="rounded-xl" /></div>
          </div>
        </div>

        {/* Col 3 Skeletons */}
        <div className="border border-zinc-200 p-8 rounded-3xl space-y-4">
          <Skeletons width={160} height={24} />
          <div className="space-y-6">
            <div className="space-y-2"><Skeletons width="40%" height={12} /><Skeletons height={44} className="rounded-xl" /></div>
            <div className="space-y-2"><Skeletons width="40%" height={12} /><Skeletons height={44} className="rounded-xl" /></div>
            <div className="pt-10">
              <Skeletons height={56} className="rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
