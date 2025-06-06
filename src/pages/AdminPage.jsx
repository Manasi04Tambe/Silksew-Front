import { useState, useContext, useEffect } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import "../pages/CSS/AdminPage.css"
import { AuthContext } from "../context/AuthContext"
import AdminComplaints from "../pages/AdminComplaints"
import ConfirmedOrder from "./ShippedOrders"
import AdminAddProduct from "./AdminAddProduct"
import AdminProductlist from "./AdminProductlist"
import AdminNavbar from "../components/Navbar/AdminNavbar"
import {
  faHome,
  faShoppingCart,
  faSignOutAlt,
  faPlus,
  faList,
  faComments,
  faTruck,
  faCheck,
  faUndo,
  faTags,
  faBox,
  faChartLine,
  faCheckCircle,
  faDollarSign
} from "@fortawesome/free-solid-svg-icons"
import AdminUser from "./AdminUser"
import ShippedOrders from "./ConfirmedOrders"
import ReturnOrderList from "../components/ReturnOrderList/ReturnOrderList"
import OfferForm from "../components/OfferForm/OfferForm"
import UPdateRemoveoffer from "../components/UpdateRemoveOffer/UpdateRemoveOffer"

const Dashboard = () => {
  const { user, token, logout } = useContext(AuthContext)
  const navigate = useNavigate()

  const [isSidebarOpen, setSidebarOpen] = useState(false)
  const [selectedOption, setSelectedOption] = useState("Dashboard")
  const [totalProducts, setTotalProducts] = useState(0)
  const [totalOrders, setTotalOrders] = useState(0)
  const [confirmedOrdersCount, setConfirmedOrdersCount] = useState(0)
  const [totalSales, setTotalSales] = useState(() => {
    const storedTotalSales = localStorage.getItem("totalSales")
    return storedTotalSales ? Number.parseFloat(storedTotalSales) : 0
  })

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen)
  }

  const handleMenuClick = (option) => {
    setSelectedOption(option)
    setSidebarOpen(false)
  }

  const updateTotalProducts = (count) => {
    setTotalProducts(count)
  }

  const updateTotalOrders = (count) => {
    setTotalOrders(count)
  }

  const updateConfirmedOrdersCount = (count) => {
    setConfirmedOrdersCount(count)
  }

  const updateTotalSales = (amount) => {
    setTotalSales(amount)
    localStorage.setItem("totalSales", amount.toString())
  }

  const handleLogoutClick = () => {
    logout()
    navigate("/login")
  }

  const fetchInitialCounts = async () => {
    if (token) {
      try {
        const [productsResponse, ordersResponse] = await Promise.all([
          axios.get("https://silksew-back.onrender.com/api/products", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("https://silksew-back.onrender.com/api/orders", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ])

        const productsData = Array.isArray(productsResponse.data)
          ? productsResponse.data
          : productsResponse.data.products || []
        setTotalProducts(productsData.length)

        const ordersData = Array.isArray(ordersResponse.data) ? ordersResponse.data : ordersResponse.data.orders || []
        setTotalOrders(ordersData.length)

        let totalSales = 0
        let confirmedCount = 0
        ordersData.forEach((order) => {
          if (order.status === "ConfirmedOrder") {
            totalSales += order.totalAmount || 0
            confirmedCount++
          }
        })
        updateTotalSales(totalSales)
        setConfirmedOrdersCount(confirmedCount)
      } catch (error) {
        console.error("Error fetching initial counts:", error)
      }
    }
  }

  useEffect(() => {
    fetchInitialCounts()
  }, [fetchInitialCounts])

  useEffect(() => {
    if (!token) {
      navigate("/login")
    }
  }, [token, navigate])

  const pieChartData = [
    { name: 'Products', value: totalProducts, color: '#4F46E5', icon: faBox },
    { name: 'Orders', value: totalOrders, color: '#059669', icon: faShoppingCart },
    { name: 'Confirmed', value: confirmedOrdersCount, color: '#D97706', icon: faCheckCircle },
    { name: 'Sales (100s)', value: Math.round(totalSales / 100), color: '#DC2626', icon: faDollarSign }
  ]

  const COLORS = ['#4F46E5', '#059669', '#D97706', '#DC2626']

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const RADIAN = Math.PI / 180
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        fontSize="12"
        fontWeight="600"
        style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div style={{
          backgroundColor: 'white',
          padding: '12px 16px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          border: '1px solid #e5e7eb',
          fontSize: '14px'
        }}>
          <p style={{
            fontWeight: '600',
            color: '#1f2937',
            margin: '0 0 4px 0',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <FontAwesomeIcon icon={data.icon} style={{ color: data.color }} />
            {data.name}
          </p>
          <p style={{
            fontSize: '16px',
            fontWeight: 'bold',
            color: data.color,
            margin: '0'
          }}>
            {data.name === 'Sales (100s)'
              ? `₹${(data.value * 100).toLocaleString()}`
              : data.value.toLocaleString()
            }
          </p>
        </div>
      )
    }
    return null
  }

  if (!token) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#f3f4f6',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          border: '4px solid #e5e7eb',
          borderTop: '4px solid #4F46E5',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
      </div>
    )
  }

  return (
    <>
      <AdminNavbar />
      <div style={{
        display: 'flex',
        height: 'calc(100vh - 60px)', // Subtract navbar height
        overflow: 'hidden',
        backgroundColor: '#f8fafc'
      }}>
        {/* Enhanced Sidebar */}
        <div
          className={`sidebar ${isSidebarOpen ? 'open' : ''}`}
          style={{
            width: '250px',
            minWidth: '250px',
            backgroundColor: 'white',
            boxShadow: '4px 0 10px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <div style={{
            background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
            color: 'white',
            padding: '16px 20px',
            fontSize: '18px',
            fontWeight: 'bold',
            textAlign: 'center',
            letterSpacing: '0.5px',
            flexShrink: 0
          }}>
            Admin Panel
          </div>
         
          <div style={{
            flex: 1,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{ flex: 1 }}>
              {[
                { key: 'Dashboard', icon: faHome, label: 'Dashboard' },
                { key: 'AddProduct', icon: faPlus, label: 'Add Product' },
                { key: 'ListProducts', icon: faList, label: 'Product List' },
                { key: 'Orders', icon: faShoppingCart, label: 'Orders' },
                { key: 'ReturnRequest', icon: faUndo, label: 'Return Requests' },
                { key: 'ShippedOrders', icon: faCheck, label: 'Confirmed Orders' },
                { key: 'ConfirmedOrder', icon: faTruck, label: 'Shipped Orders' },
                { key: 'complaints', icon: faComments, label: 'Complaints' },
                { key: 'OfferForm', icon: faTags, label: 'Add Offers' },
                { key: 'update-remove-offer', icon: faTags, label: 'Offers List' }
              ].map((item) => (
                <div
                  key={item.key}
                  onClick={() => handleMenuClick(item.key)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px 16px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    backgroundColor: selectedOption === item.key ? '#f0f4ff' : 'transparent',
                    borderRight: selectedOption === item.key ? '4px solid #4F46E5' : '4px solid transparent',
                    color: selectedOption === item.key ? '#4F46E5' : '#64748b',
                    fontWeight: selectedOption === item.key ? '600' : '500',
                    fontSize: '14px'
                  }}
                  onMouseEnter={(e) => {
                    if (selectedOption !== item.key) {
                      e.target.style.backgroundColor = '#f8fafc'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedOption !== item.key) {
                      e.target.style.backgroundColor = 'transparent'
                    }
                  }}
                >
                  <FontAwesomeIcon
                    icon={item.icon}
                    style={{
                      marginRight: '10px',
                      width: '14px',
                      color: selectedOption === item.key ? '#4F46E5' : '#94a3b8'
                    }}
                  />
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
           
            {/* Logout Button */}
            <div
              onClick={handleLogoutClick}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px 16px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                color: '#64748b',
                fontWeight: '500',
                borderTop: '1px solid #e2e8f0',
                fontSize: '14px',
                marginTop: 'auto',
                flexShrink: 0
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#fef2f2'
                e.target.style.color = '#dc2626'
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent'
                e.target.style.color = '#64748b'
              }}
            >
              <FontAwesomeIcon
                icon={faSignOutAlt}
                style={{
                  marginRight: '10px',
                  width: '14px'
                }}
              />
              <span>Logout</span>
            </div>
          </div>
        </div>

        {/* Hamburger Menu for Mobile */}
        <div
          className="hamburger-menu"
          onClick={toggleSidebar}
          style={{
            position: 'fixed',
            top: '70px',
            left: '20px',
            zIndex: 1001,
            backgroundColor: 'white',
            padding: '12px',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            cursor: 'pointer',
            display: 'none'
          }}
        >
          <div style={{ color: '#64748b', fontSize: '18px' }}>&#9776;</div>
        </div>

        {/* Main Content */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          backgroundColor: '#f8fafc',
          minWidth: 0 // Prevents flex item from growing beyond container
        }}>
          {selectedOption === 'Dashboard' && (
            <div style={{
              minHeight: '100%',
              background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)',
              padding: '20px'
            }}>
              <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                  <h1 style={{
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    color: '#1e293b',
                    marginBottom: '8px',
                    background: 'linear-gradient(135deg, #1e293b 0%, #475569 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px'
                  }}>
                    <FontAwesomeIcon icon={faChartLine} style={{ color: '#4F46E5' }} />
                    Dashboard Overview
                  </h1>
                  <p style={{
                    color: '#64748b',
                    fontSize: '1rem',
                    fontWeight: '500'
                  }}>
                    Real-time business insights and analytics
                  </p>
                </div>

                {/* Stats Cards */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '20px',
                  marginBottom: '30px'
                }}>
                  {pieChartData.map((item, index) => (
                    <div
                      key={index}
                      style={{
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                        border: '1px solid #e2e8f0',
                        padding: '20px',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)'
                        e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.1)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)'
                        e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.05)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                          <h3 style={{
                            color: '#64748b',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            marginBottom: '6px'
                          }}>
                            {item.name.replace(' (100s)', '')}
                          </h3>
                          <p style={{
                            fontSize: '1.5rem',
                            fontWeight: 'bold',
                            color: '#1e293b',
                            margin: '0'
                          }}>
                            {item.name === 'Sales (100s)'
                              ? `₹${totalSales.toLocaleString()}`
                              : item.value.toLocaleString()}
                          </p>
                        </div>
                        <div style={{
                          fontSize: '1.5rem',
                          padding: '12px',
                          borderRadius: '50%',
                          backgroundColor: `${item.color}15`,
                          color: item.color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <FontAwesomeIcon icon={item.icon} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Chart Section */}
                <div style={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                  border: '1px solid #e2e8f0',
                  padding: '24px'
                }}>
                  <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <h2 style={{
                      fontSize: '1.5rem',
                      fontWeight: 'bold',
                      color: '#1e293b',
                      marginBottom: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '12px'
                    }}>
                      <FontAwesomeIcon icon={faChartLine} style={{ color: '#4F46E5' }} />
                      Data Visualization
                    </h2>
                    <p style={{
                      color: '#64748b',
                      fontSize: '0.9rem'
                    }}>
                      Interactive distribution metrics
                    </p>
                  </div>

                  <div style={{ height: '300px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <defs>
                          {COLORS.map((color, index) => (
                            <linearGradient
                              key={index}
                              id={`gradient${index}`}
                              x1="0%"
                              y1="0%"
                              x2="100%"
                              y2="100%"
                            >
                              <stop offset="0%" stopColor={color} />
                              <stop offset="100%" stopColor={color} stopOpacity={0.8} />
                            </linearGradient>
                          ))}
                        </defs>
                        <Pie
                          data={pieChartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={renderCustomizedLabel}
                          outerRadius={100}
                          innerRadius={45}
                          dataKey="value"
                          stroke="rgba(255,255,255,0.8)"
                          strokeWidth={2}
                          paddingAngle={2}
                        >
                          {pieChartData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={`url(#gradient${index})`}
                            />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend
                          wrapperStyle={{
                            fontSize: '12px',
                            fontWeight: '500',
                            paddingTop: '16px',
                          }}
                          iconType="circle"
                          layout="horizontal"
                          verticalAlign="bottom"
                          align="center"
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div style={{
                    backgroundColor: '#eff6ff',
                    borderRadius: '8px',
                    padding: '12px',
                    marginTop: '16px',
                    textAlign: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}>
                    <FontAwesomeIcon icon={faChartLine} style={{ color: '#1d4ed8' }} />
                    <p style={{
                      fontSize: '0.75rem',
                      color: '#1d4ed8',
                      fontWeight: '600',
                      margin: '0'
                    }}>
                      Sales values scaled for optimal chart visualization
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
         
          {selectedOption === 'AddProduct' && <AdminAddProduct />}
          {selectedOption === 'ListProducts' && (
            <AdminProductlist updateTotalProducts={updateTotalProducts} />
          )}
          {selectedOption === 'Orders' && (
            <AdminUser updateTotalOrders={updateTotalOrders} />
          )}
          {selectedOption === 'complaints' && (
            <AdminComplaints updateTotalOrders={updateTotalOrders} />
          )}
          {selectedOption === 'ConfirmedOrder' && (
            <ConfirmedOrder
              updateTotalOrders={updateTotalOrders}
              updateTotalSales={updateTotalSales}
              updateConfirmedOrdersCount={updateConfirmedOrdersCount}
            />
          )}
          {selectedOption === 'ShippedOrders' && (
            <ShippedOrders updateTotalOrders={updateTotalOrders} />
          )}
          {selectedOption === 'ReturnRequest' && <ReturnOrderList />}
          {selectedOption === 'OfferForm' && (
            <div style={{ position: 'relative', zIndex: 10 }}>
              <OfferForm />
            </div>
          )}
          {selectedOption === 'update-remove-offer' && (
            <div style={{ position: 'relative', zIndex: 10 }}>
              <UPdateRemoveoffer />
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
       
        @media (max-width: 768px) {
          .hamburger-menu {
            display: block !important;
          }
         
          .sidebar {
            position: fixed !important;
            left: ${isSidebarOpen ? '0' : '-250px'} !important;
            top: 60px !important;
            height: calc(100vh - 60px) !important;
            width: 250px !important;
            z-index: 1000 !important;
          }
        }
       
        @media (min-width: 769px) {
          .sidebar {
            position: relative !important;
            left: 0 !important;
          }
        }
      `}</style>
    </>
  )
}

export default Dashboard