"use client"

import { useState, useContext, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { ShopContext } from "../../context/ShopContext"
import { AuthContext } from "../../context/AuthContext"
import logo from "../Assets/logo.png"
import cart_icon from "../Assets/cart_icon.png"
import { User, Menu, Bold } from "lucide-react"
import "../Navbar/Navbar.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';


const Navbar = ({ onLoginClick }) => {
  const [menu, setMenu] = useState("shop")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()

  const { cartItems, products, searchTerm, setSearchTerm } = useContext(ShopContext)
  const location = useLocation()

  useEffect(() => {
    if (location.pathname === "/") {
      setMenu("shop")
    } else if (location.pathname === "/mens") {
      setMenu("mens")
    } else if (location.pathname === "/womens") {
      setMenu("womens")
    }
  }, [location])

  useEffect(() => {
    const resetBodyOverflow = () => {
      document.body.style.overflow = "auto"
      setIsMobileMenuOpen(false)
    }

    return () => {
      resetBodyOverflow()
    }
  }, [])

  const calculateTotalCartItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0)

  }

  useEffect(() => {
    const totalCount = cartItems.reduce((total, item) => total + item.quantity, 0)
    console.log("🛒 Total cart item count:", totalCount)
  }, [cartItems])


  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
    document.body.style.overflow = isMobileMenuOpen ? "auto" : "hidden"
  }

  const handleMenuClick = (menuOption) => {
    setMenu(menuOption)
    setIsMobileMenuOpen(false)
    document.body.style.overflow = "auto"
  }

  const handleSearch = (e) => {
    e.preventDefault()
    const trimmedQuery = searchTerm.trim().toLowerCase()

    if (trimmedQuery) {
      const product = products.find((product) => product.name.toLowerCase().includes(trimmedQuery))

      if (product) {
        setIsMobileMenuOpen(false)
        navigate(`category/${trimmedQuery}`)
      } else {
        alert("No product found with this name!")
      }
    }
  }

  return (
    <nav className="navbar" style={{ position: 'fixed', backgroundColor: "#4d0000" }}>
      <div className="nav-logo">
        <img src={logo || "/placeholder.svg"} alt="Logo" />
        <Link to="/" style={{ textDecoration: "none", color: "white", marginTop: "7px" }}>
          <p>SILKSEW</p>
        </Link>
      </div>

      <div className={`nav-menu ${isMobileMenuOpen ? "active" : ""}`} role="navigation">
        <ul>
          <li onClick={() => handleMenuClick("Home")}>
            <Link to="/" style={{ fontWeight: "bold" }}>Home</Link>
            {menu === "Home" && <hr />}
          </li>
          <li onClick={() => handleMenuClick("mens")}>
            <Link to="/mens" style={{ fontWeight: "bold" }}>Men</Link>
            {menu === "mens" && <hr />}
          </li>
          <li onClick={() => handleMenuClick("womens")}>
            <Link to="/womens" style={{ fontWeight: "bold" }}>Women</Link>
            {menu === "womens" && <hr />}
          </li>
        </ul>

        {location.pathname === "/" && (
          <div className="search-container" style={{ position: 'relative', width: '300px' }}>
            <form
              onSubmit={handleSearch}
              style={{
                display: 'flex',
                width: '100%',
                maxWidth: '700px',
                height: '40px',
                overflow: 'hidden',
              }}
            >
              <input
                type="text"
                placeholder="Search by Name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  flex: 1,
                  padding: '0 10px',
                  border: 'none',
                  outline: 'none',
                  fontSize: '16px',
                  color: "black"
                }}
              />
              <button
                type="submit"
                style={{
                  width: '50px',
                  backgroundColor: '#febd69',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <FontAwesomeIcon icon={faMagnifyingGlass} style={{ color: '#333', fontSize: '18px' }} />
              </button>
            </form>

          </div>

        )}
      </div>

      <div className="nav-right">
        <div className="nav-login-cart">
          <Link to="/cart" className="cart-icon-wrapper">
            <img src={cart_icon || "/placeholder.svg"} alt="Cart" className="cart-icon" />
            {calculateTotalCartItems() > 0 && <div className="cart-item-count" style={{ color: "black" }}>{calculateTotalCartItems()}</div>}
          </Link>

          {user ? (
            <Link to="/user-profile-buttons" className="profile-info">
              <User className="profile-icon clickable" style={{ height: '30px' }} />
            </Link>
          ) : (
            <Link
              onClick={onLoginClick}
              className="login-btn transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg text-white font-semibold px-6 py-2 rounded"
              style={{ backgroundColor: "#f0ad4e" }}
            >
              Login
            </Link>

          )}
        </div>
        <div className="hamburger-wrapper">
          <div className="mobile-icons">
            <Link to="/cart" className="mobile-cart-icon-wrapper" >
              <img src={cart_icon || "/placeholder.svg"} alt="Cart" className="mobile-cart-icon" />
              {calculateTotalCartItems() > 0 && (
                <div className="mobile-cart-item-count">{calculateTotalCartItems()}</div>
              )}
            </Link>
            {user && (
              <Link to="/user-profile-buttons" className="mobile-profile-icon-wrapper">
                <User className="mobile-profile-icon" style={{ height: '30px' }} />
              </Link>
            )}
          </div>
          <button className={`hamburger-menu ${isMobileMenuOpen ? "active" : ""}`} onClick={toggleMobileMenu}>
            <Menu className="hamburger-icon" />
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

