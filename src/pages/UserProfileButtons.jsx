// "use client"

// import { useEffect, useState, useContext, useCallback } from "react"
// import axios from "axios"
// import { ShopContext } from "../context/ShopContext"
// import { AuthContext } from "../context/AuthContext"
// import { useNavigate } from "react-router-dom"
// import profile_icon from "../components/Assets/profile_icon.png"
// import "../pages/CSS/UserProfile.css" // Make sure to update this file with the new CSS
// import { ToastContainer, toast } from "react-toastify"
// import "react-toastify/dist/ReactToastify.css"
// import OrderItems from "../components/OrderItems/OrderItems"
// //import CartItems from "../components/CartItems/CartItems"

// const UserProfileButtons = () => {
//   // const { token } = useContext(ShopContext)
//   const { logout } = useContext(AuthContext)
//   const navigate = useNavigate()
//   const [userData, setUserData] = useState(null)
//   const [loading, setLoading] = useState(true)
//   const [activeTab, setActiveTab] = useState("info")
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false)
//   const [isEditing, setIsEditing] = useState(false)
//   const [setUserProducts] = useState([])
//   const [loadingProducts, setLoadingProducts] = useState(true)

//   const menuItems = [
//     { id: "info", title: "Info", icon: "👤" },
//     { id: "orders", title: "My Orders", icon: "📦" },
//     { id: "logout", title: "Logout", icon: "🚪" },
//   ]

//   useEffect(() => {
//     fetchUserData()
//     fetchUserProducts()
//   }, [])

//   const handleChange = (e) => {
//     setUserData({ ...userData, [e.target.name]: e.target.value });
//   };

//   const fetchUserData = useCallback(async () => {
//     try {
//       const authToken = localStorage.getItem("token")
//       if (!authToken) {
//         toast.error("No authentication token found. Please log in.")
//         return
//       }
//       const response = await axios.get("https://silksew-back-1.onrender.com/api/userProfileDetail/user-profile", {
//         headers: {
//           Authorization: `Bearer ${authToken}`,
//         },
//       })

//       setUserData(response.data)
//       setLoading(false)
//     } catch (err) {
//       console.error("Error fetching user data:", err)
//       toast.error("Failed to fetch user data. Please try again later.")
//       setLoading(false)
//     }
//   }, [])

//   const fetchUserProducts = useCallback(async () => {
//     try {
//       const authToken = localStorage.getItem("token")
//       if (!authToken) {
//         toast.error("No authentication token found. Please log in.")
//         return
//       }
//       setLoadingProducts(true)
//       const response = await axios.get("https://silksew-back-1.onrender.com/api/orders", {
//         headers: {
//           Authorization: `Bearer ${authToken}`,
//         },
//       })
//       setUserProducts(response.data)
//       setLoadingProducts(false)
//     } catch (err) {
//       console.error("Error fetching user products:", err)
//       toast.error("Failed to fetch user products. Please try again later.")
//       setLoadingProducts(false)
//     }
//   }, [])

//   const handleLogoutClick = () => {
//     logout()
//     navigate("/login")
//   }

//   const handleTabClick = (tabId) => {
//     if (tabId === "logout") {
//       handleLogoutClick()
//     } else {
//       setActiveTab(tabId)
//       setIsSidebarOpen(false)
//       setIsEditing(false)
//     }
//   }

//   const toggleSidebar = () => {
//     setIsSidebarOpen(!isSidebarOpen)
//   }

//   const updateProfile = async (e) => {
//     e.preventDefault();
    
//     const token = localStorage.getItem("token");
  
//     if (!token) {
//       console.log("No token found. Please log in.");
//       return;
//     }
  
//     // try {
//     //   const response = await axios.put(
//     //     "https://silksew-back-1.onrender.com/api/updateUserProfileDetail/update-user-profile",
//     //     userData,
//     //     { headers: { Authorization: `Bearer ${token}` } }
//     //   );
  
//     //   toast.success("Profile Successfully Updated.");
//     //   setIsEditing(false); // Close edit form after successful update
      
//     // } catch (error) {
//     //   console.error("Update failed:", error);
//     //   toast.error("Update failed. Please try again.");
//     // }
//   };

//   const renderContent = () => {
//     if (loading) {
//       return <div className="loading">Loading user data...</div>;
//     }

//     switch (activeTab) {
//       case "info":
//         return (
//           <div className="tab-content">
//             {!isEditing && (
//               <h2 style={{ color: "#3498db", display: "flex", justifyContent: "center", fontWeight: "bold", marginTop:50 }}>
//                 User Information
//               </h2>
//             )}

//             {isEditing ? renderUserForm() : renderUserCard()}
//           </div>
//         )
//       case "orders":
//         return (
//           <div className="tab-content order-content">
//             <h2 style={{ color: "#3498db", display: "flex", justifyContent: "center", fontWeight: "bold",marginTop:30 }}>
//               My Orders
//             </h2>
//             {loadingProducts ? (
//               <div className="loading">Loading orders...</div>
//             ) : (
//               <OrderItems />
//             )}
//           </div>
//         )
//       default:
//         return null
//     }
//   }

//   const renderUserCard = () => (
//     <section className="container-fluid">
//       <div className="profile-bg container">
//         <div className="content">
//           <img src={profile_icon || "/placeholder.svg"} className="user-logo" alt="Logo" />
//           <h4>
//             <strong>User Name : </strong>
//             {userData?.name}
//           </h4>
//           <br />
//           <h4>
//             <strong>Phone : </strong> {userData?.phone || "Not provided"}
//           </h4>
//           <br />
//           <h4>
//             <strong>Email : </strong> {userData?.email}
//           </h4>
//         </div>
//         <button className="btn btn-default" onClick={() => setIsEditing(true)}>
//           Edit Profile
//         </button>
//       </div>
//     </section>
//   )

//   const renderUserForm = () => (
//     <section className="container py-9 mx-auto">
//       <div className="bg-white p-20 rounded-xl shadow-lg mx-auto mt-10" >
//         <h2 className="text-3xl font-semibold text-center text-gray-800 mb-8">Edit Profile</h2>

//         <form onSubmit={updateProfile}>
//           <div className="mb-6">
//             <label htmlFor="name" className="block text-xl font-medium text-gray-700 mb-2">
//               Name
//             </label>
//             <input
//               type="text"
//               className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition duration-300 ease-in-out"
//               id="name"
//               name="name"
//               value={userData?.name || ""}
//               onChange={handleChange}
//               placeholder="Enter your name"
//               required
//             />
//           </div>

//           <div className="mb-6">
//             <label htmlFor="phone" className="block text-xl font-medium text-gray-700 mb-2">
//               Phone
//             </label>
//             <input
//               type="tel"
//               className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition duration-300 ease-in-out"
//               id="phone"
//               name="phone"
//               value={userData?.phone || ""}
//               onChange={handleChange}
//               placeholder="Enter your phone number"
//             />
//           </div>

//           <div className="mb-6">
//             <label htmlFor="email" className="block text-xl font-medium text-gray-700 mb-2">
//               Email address
//             </label>
//             <input
//               type="email"
//               className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition duration-300 ease-in-out"
//               id="email"
//               name="email"
//               value={userData?.email || ""}
//               onChange={handleChange}
//               placeholder="Enter your email"
//               required
//             />
//           </div>

//           <div className="gap-5" >
//             <button
//               type="submit"
//               className="flex-1 p-4 bg-indigo-500 text-white text-xl font-semibold  hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 transition duration-300 ease-in-out"
//             >
//               Save Changes
//             </button>
//           </div>
//         </form>
//       </div>
//     </section>
//   );

//   return (
//     <div className="user-profile-container">
//       <button className="mobile-menu-toggle" onClick={toggleSidebar}>
//         ☰
//       </button>
//       <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
//         <h2 className="sidebar-title">User Profile</h2>
//         <ul className="sidebar-menu">
//           {menuItems.map((item) => (
//             <li key={item.id} className="sidebar-menu-item">
//               <button
//                 className={`sidebar-menu-button ${activeTab === item.id ? "active" : ""}`}
//                 onClick={() => handleTabClick(item.id)}
//               >
//                 <span className="sidebar-menu-icon">{item.icon}</span>
//                 <span >{item.title}</span>
//               </button>
//             </li>
//           ))}
//         </ul>
//       </div>
//       <main className="main-content">
//         {renderContent()}
//       </main>
//       <ToastContainer style={{marginTop: "10px"}} />
//     </div>
//   )
// }

// export default UserProfileButtons



import React, { useEffect, useCallback, useState } from "react";
import axios from "axios";

const UserProfileButtons = ({ token }) => {
  const [userData, setUserData] = useState(null);
  const [userProducts, setUserProducts] = useState([]);

  // Wrap fetchUserData in useCallback to keep it stable
  const fetchUserData = useCallback(async () => {
    if (token) {
      try {
        const response = await axios.get("https://silksew-back-1.onrender.com/api/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
  }, [token]);

  // Wrap fetchUserProducts in useCallback to keep it stable
  const fetchUserProducts = useCallback(async () => {
    if (token) {
      try {
        const response = await axios.get("https://silksew-back-1.onrender.com/api/user/products", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserProducts(response.data.products || []);
      } catch (error) {
        console.error("Error fetching user products:", error);
      }
    }
  }, [token]);

  // useEffect with both callbacks in dependencies
  useEffect(() => {
    fetchUserData();
    fetchUserProducts();
  }, [fetchUserData, fetchUserProducts]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">User Dashboard</h2>
      {userData ? (
        <div className="mb-4">
          <p><strong>Name:</strong> {userData.name}</p>
          <p><strong>Email:</strong> {userData.email}</p>
        </div>
      ) : (
        <p>Loading user data...</p>
      )}
      <h3 className="text-lg font-semibold">Your Products</h3>
      <ul className="list-disc pl-6">
        {userProducts.length > 0 ? (
          userProducts.map((product) => (
            <li key={product.id}>{product.name}</li>
          ))
        ) : (
          <li>No products found.</li>
        )}
      </ul>
    </div>
  );
};

export default UserProfileButtons;


