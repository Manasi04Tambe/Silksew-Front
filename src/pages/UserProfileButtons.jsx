
// "use client"

// import { useEffect, useState, useContext, useCallback } from "react"
// import axios from "axios"
// import { ShopContext } from "../context/ShopContext"
// import { AuthContext } from "../context/AuthContext"
// import { useNavigate } from "react-router-dom"
// import profile_icon from "../components/Assets/profile_icon.png"
// import "../pages/CSS/UserProfile.css"
// import { ToastContainer, toast } from "react-toastify"
// import "react-toastify/dist/ReactToastify.css"
// import OrderItems from "../components/OrderItems/OrderItems"
// import CartItems from "../components/CartItems/CartItems"

// const UserProfileButtons = () => {
//   // eslint-disable-next-line no-unused-vars
//   const { token } = useContext(ShopContext)
//   const { logout } = useContext(AuthContext)
//   const navigate = useNavigate()
//   const [userData, setUserData] = useState(null)
//   const [loading, setLoading] = useState(true)
//   const [activeTab, setActiveTab] = useState("info")
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false)
//   const [isEditing, setIsEditing] = useState(false)
//   const [userProducts, setUserProducts] = useState([])
//   const [loadingProducts, setLoadingProducts] = useState(true)
//   const [debugMode, setDebugMode] = useState(false)
//    const [profile, setProfile] = useState({});

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
//       const response = await axios.get("https://silksew-back.onrender.com/api/userProfileDetail/user-profile", {
//         headers: {
//           Authorization: `Bearer ${authToken}`,
//         },
//       })

//       setUserData(response.data)
//       console.log("-----", response)
//     } catch (err) {
//       console.error("Error fetching user data:", err)
//       toast.error("Failed to fetch user data. Please try again later.")
//     }
//   }, [])

//   const fetchUserProducts = useCallback(async () => {
//     try {
//       const authToken = localStorage.getItem("token")
//       if (!authToken) {
//         toast.error("No authentication token found. Please log in.")
//         return
//       }
//       const response = await axios.get("https://silksew-back.onrender.com/api/orders", {
//         headers: {
//           Authorization: `Bearer ${authToken}`,
//         },
//       })
//       console.log("12345",response)
//       setUserProducts(response.data)
//     } catch (err) {
//       console.error("Error fetching user products:", err)
//       toast.error("Failed to fetch user products. Please try again later.")
//     }
//   }, [])

//   const handleLogoutClick = () => {
//     logout()
//     navigate("/login")
//   }

//   // eslint-disable-next-line no-unused-vars
//   const handleLogout = () => {
//     // Clear the token from localStorage
//     localStorage.removeItem("token")
//     // Clear any user-related state
//     setUserData(null)
//     setUserProducts([])
//     // Show a success message
//     toast.success("Logged out successfully")
//     // Redirect to the login page or home page
//     navigate("/login") // Adjust this path as needed
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
//     // Prevent form submission from reloading the page
//     e.preventDefault();
    
//     const token = localStorage.getItem("token");
  
//     if (!token) {
//       console.log("No token found. Please log in.");
//       return;
//     }
  
//     try {
//       const response = await axios.put(
//         "https://silksew-back.onrender.com/api/updateUserProfileDetail/update-user-profile",
//         userData, // Send the updated state dynamically
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
  
//       // Toast will now show after a successful update
//       toast.success("Profile Successfully Updated.");
      
//     } catch (error) {
//       console.error("Update failed:", error);
//       toast.error("Update failed. Please try again.");
//     }
//   };

//   const renderContent = () => {
//     switch (activeTab) {
//       case "info":
//         return (
//           <div className="tab-content">
//             {!isEditing && (
//               <h2 style={{ color: "#3498db", display: "flex", justifyContent: "center", fontWeight: "bold" }}>
//                 User Information
//               </h2>
//             )}

//             {isEditing ? renderUserForm() : renderUserCard()}
//           </div>

//         )
//       case "orders":
//         return <CartItems />
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

//   // const renderUserForm = () => (
//   //   <section className="container-fluid">
//   //     <div className="profile-bg container">
//   //       <div className="content">
//   //         <form>
//   //           <div className="mb-3">
//   //             <label htmlFor="name" className="form-label">
//   //               Name
//   //             </label>
//   //             <input type="text" className="form-control" id="name" defaultValue={userData?.name} />
//   //           </div>
//   //           <div className="mb-3">
//   //             <label htmlFor="phone" className="form-label">
//   //               Phone
//   //             </label>
//   //             <input type="tel" className="form-control" id="phone" defaultValue={userData?.phone} />
//   //           </div>
//   //           <div className="mb-3">
//   //             <label htmlFor="email" className="form-label">
//   //               Email address
//   //             </label>
//   //             <input type="email" className="form-control" id="email" defaultValue={userData?.email} />
//   //           </div>
//   //           <button type="submit" className="btn btn-primary">
//   //             Save Changes
//   //           </button>
//   //         </form>
//   //       </div>
//   //     </div>
//   //   </section>
//   // )

//   const renderUserForm = () => (
//     <section className="container py-8 mx-auto">
//       <div className="bg-white p-8 rounded-xl shadow-lg  mx-auto" >
//         <h2 className="text-3xl font-semibold text-center text-gray-800 mb-8">Edit Profile</h2>

//         <form>
//           <div className="mb-6">
//             <label htmlFor="name" className="block text-xl font-medium text-gray-700 mb-2">
//               Name
//             </label>
//             <input
//               type="text"
//               className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition duration-300 ease-in-out"
//               id="name"
//               name="name"
//               value={userData?.name}
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
//               value={userData?.phone}
//               onChange={handleChange}
//               placeholder="Enter your phone number"
//               required
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
//               value={userData?.email}
//               onChange={handleChange}
//               placeholder="Enter your email"
//               required
//             />
//           </div>

//           <div className="mt-6">
//             <button
//               type="submit"
//               className="w-full py-4 bg-indigo-500 text-white text-xl font-semibold rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 transition duration-300 ease-in-out"
//               onClick={updateProfile}
//             >
//               Save Changes
//             </button>
//           </div>
//         </form>
//       </div>
//     </section>
//   );

//   return (
//     <div className="user-profile-container" style={{ position: "fixed" }}>
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
//                 <span>{item.title}</span>
//               </button>
//             </li>
//           ))}
//         </ul>
//       </div>
//       <main className="main-content">
//         <h1>Welcome to Your Profile</h1>
//         {renderContent()}
//       </main>
//       <ToastContainer style={{mt:10}} />
//     </div>
//   )
// }

// export default UserProfileButtons



"use client"

import { useEffect, useState, useContext, useCallback } from "react"
import axios from "axios"
import { ShopContext } from "../context/ShopContext"
import { AuthContext } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"
import profile_icon from "../components/Assets/profile_icon.png"
import "../pages/CSS/UserProfile.css" // Make sure to update this file with the new CSS
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import OrderItems from "../components/OrderItems/OrderItems"
import CartItems from "../components/CartItems/CartItems"

const UserProfileButtons = () => {
  const { token } = useContext(ShopContext)
  const { logout } = useContext(AuthContext)
  const navigate = useNavigate()
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("info")
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [userProducts, setUserProducts] = useState([])
  const [loadingProducts, setLoadingProducts] = useState(true)

  const menuItems = [
    { id: "info", title: "Info", icon: "👤" },
    { id: "orders", title: "My Orders", icon: "📦" },
    { id: "logout", title: "Logout", icon: "🚪" },
  ]

  useEffect(() => {
    fetchUserData()
    fetchUserProducts()
  }, [])

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const fetchUserData = useCallback(async () => {
    try {
      const authToken = localStorage.getItem("token")
      if (!authToken) {
        toast.error("No authentication token found. Please log in.")
        return
      }
      const response = await axios.get("https://silksew-back.onrender.com/api/userProfileDetail/user-profile", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })

      setUserData(response.data)
      setLoading(false)
    } catch (err) {
      console.error("Error fetching user data:", err)
      toast.error("Failed to fetch user data. Please try again later.")
      setLoading(false)
    }
  }, [])

  const fetchUserProducts = useCallback(async () => {
    try {
      const authToken = localStorage.getItem("token")
      if (!authToken) {
        toast.error("No authentication token found. Please log in.")
        return
      }
      setLoadingProducts(true)
      const response = await axios.get("https://silksew-back.onrender.com/api/orders", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
      setUserProducts(response.data)
      setLoadingProducts(false)
    } catch (err) {
      console.error("Error fetching user products:", err)
      toast.error("Failed to fetch user products. Please try again later.")
      setLoadingProducts(false)
    }
  }, [])

  const handleLogoutClick = () => {
    logout()
    navigate("/login")
  }

  const handleTabClick = (tabId) => {
    if (tabId === "logout") {
      handleLogoutClick()
    } else {
      setActiveTab(tabId)
      setIsSidebarOpen(false)
      setIsEditing(false)
    }
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const updateProfile = async (e) => {
    e.preventDefault();
    
    const token = localStorage.getItem("token");
  
    if (!token) {
      console.log("No token found. Please log in.");
      return;
    }
  
    try {
      const response = await axios.put(
        "https://silksew-back.onrender.com/api/updateUserProfileDetail/update-user-profile",
        userData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      toast.success("Profile Successfully Updated.");
      setIsEditing(false); // Close edit form after successful update
      
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Update failed. Please try again.");
    }
  };

  const renderContent = () => {
    if (loading) {
      return <div className="loading">Loading user data...</div>;
    }

    switch (activeTab) {
      case "info":
        return (
          <div className="tab-content">
            {!isEditing && (
              <h2 style={{ color: "#3498db", display: "flex", justifyContent: "center", fontWeight: "bold", marginTop:50 }}>
                User Information
              </h2>
            )}

            {isEditing ? renderUserForm() : renderUserCard()}
          </div>
        )
      case "orders":
        return (
          <div className="tab-content order-content">
            <h2 style={{ color: "#3498db", display: "flex", justifyContent: "center", fontWeight: "bold",marginTop:30 }}>
              My Orders
            </h2>
            {loadingProducts ? (
              <div className="loading">Loading orders...</div>
            ) : (
              <OrderItems />
            )}
          </div>
        )
      default:
        return null
    }
  }

  const renderUserCard = () => (
    <section className="container-fluid">
      <div className="profile-bg container">
        <div className="content">
          <img src={profile_icon || "/placeholder.svg"} className="user-logo" alt="Logo" />
          <h4>
            <strong>User Name : </strong>
            {userData?.name}
          </h4>
          <br />
          <h4>
            <strong>Phone : </strong> {userData?.phone || "Not provided"}
          </h4>
          <br />
          <h4>
            <strong>Email : </strong> {userData?.email}
          </h4>
        </div>
        <button className="btn btn-default" onClick={() => setIsEditing(true)}>
          Edit Profile
        </button>
      </div>
    </section>
  )

  const renderUserForm = () => (
    <section className="container py-9 mx-auto">
      <div className="bg-white p-20 rounded-xl shadow-lg mx-auto mt-10" >
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-8">Edit Profile</h2>

        <form onSubmit={updateProfile}>
          <div className="mb-6">
            <label htmlFor="name" className="block text-xl font-medium text-gray-700 mb-2">
              Name
            </label>
            <input
              type="text"
              className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition duration-300 ease-in-out"
              id="name"
              name="name"
              value={userData?.name || ""}
              onChange={handleChange}
              placeholder="Enter your name"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="phone" className="block text-xl font-medium text-gray-700 mb-2">
              Phone
            </label>
            <input
              type="tel"
              className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition duration-300 ease-in-out"
              id="phone"
              name="phone"
              value={userData?.phone || ""}
              onChange={handleChange}
              placeholder="Enter your phone number"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="email" className="block text-xl font-medium text-gray-700 mb-2">
              Email address
            </label>
            <input
              type="email"
              className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition duration-300 ease-in-out"
              id="email"
              name="email"
              value={userData?.email || ""}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="gap-5" >
            <button
              type="submit"
              className="flex-1 p-4 bg-indigo-500 text-white text-xl font-semibold  hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 transition duration-300 ease-in-out"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </section>
  );

  return (
    <div className="user-profile-container">
      <button className="mobile-menu-toggle" onClick={toggleSidebar}>
        ☰
      </button>
      <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <h2 className="sidebar-title">User Profile</h2>
        <ul className="sidebar-menu">
          {menuItems.map((item) => (
            <li key={item.id} className="sidebar-menu-item">
              <button
                className={`sidebar-menu-button ${activeTab === item.id ? "active" : ""}`}
                onClick={() => handleTabClick(item.id)}
              >
                <span className="sidebar-menu-icon">{item.icon}</span>
                <span >{item.title}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <main className="main-content">
        {renderContent()}
      </main>
      <ToastContainer style={{marginTop: "10px"}} />
    </div>
  )
}

export default UserProfileButtons

