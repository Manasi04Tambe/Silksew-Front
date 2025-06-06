
"use client"

import { useState, useContext, useEffect } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import "./ProductDisplay.css"
import { ShopContext } from "../../context/ShopContext"
import { AuthContext } from "../../context/AuthContext"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import RelatedProducts from "../RelatedProducts/RelatedProducts"
import axios from "axios"
import { BASEURL } from "../../config"
import StarRating from "./StarRating"
import FeedBack from "./FeedBack"

const ProductDisplay = () => {
  const { state } = useLocation()
  const { productId } = useParams()
  const [product, setProduct] = useState(null)
  const [review, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filterReview, setFilterReview] = useState([])

  const shopContext = useContext(ShopContext)
  const { addToCart, products } = shopContext
  const { token } = useContext(AuthContext)

  const [selectedSize, setSelectedSize] = useState("")
  const [selectedColor, setSelectedColor] = useState("")
  const [mainImage, setMainImage] = useState("")
  const [activeTab, setActiveTab] = useState("description")

  const navigate = useNavigate()

  useEffect(() => {
    console.log("ProductDisplay mounted with productId:", productId)
    const fetchProduct = async () => {
      setLoading(true)
      setError(null)
      try {
        console.log("Fetching product data for ID:", productId)
        // First, try to find the product in the context
        let productData = null
        
        // Check if we have products in the context
        if (products && products.length > 0) {
          console.log("Looking for product in context products array:", products.length, "products")
          productData = products.find(p => p._id === productId)
          if (productData) {
            console.log("Found product in context:", productData.name)
          }
        }
        
        // If not found in context, check if it was passed in state
        if (!productData && state?.product) {
          console.log("Found product in route state")
          productData = state.product
        }

        // If still not found, check localStorage
        if (!productData) {
          const storedProduct = localStorage.getItem(`product_${productId}`)
          if (storedProduct) {
            console.log("Found product in localStorage")
            productData = JSON.parse(storedProduct)
          }
        }

        // If still not found, fetch from API
        if (!productData && productId) {
          console.log("Fetching product from API")
          const response = await axios.get(`${BASEURL}/api/products/${productId}`)
          if (response.status === 200) {
            console.log("API response successful:", response.data)
            productData = response.data
            localStorage.setItem(`product_${productId}`, JSON.stringify(productData))
          } else {
            throw new Error("Failed to fetch product data")
          }
        }

        if (productData) {
          console.log("Setting product data:", productData)
          setProduct(productData)
          
          // Handle images properly
          try {
            // Handle images
            let parsedImages = {}
            if (productData.images && Array.isArray(productData.images) && productData.images.length > 0) {
              // Check if it's already a parsed object
              if (typeof productData.images[0] === 'object') {
                parsedImages = productData.images[0]
              } else {
                parsedImages = JSON.parse(productData.images[0])
              }
            }
            
            // Handle available colors
            let parsedColors = []
            if (productData.availableColors && Array.isArray(productData.availableColors) && productData.availableColors.length > 0) {
              if (Array.isArray(productData.availableColors[0])) {
                parsedColors = productData.availableColors[0]
              } else {
                try {
                  parsedColors = JSON.parse(productData.availableColors[0])
                } catch (e) {
                  console.error("Error parsing colors:", e)
                  parsedColors = []
                }
              }
            }
            
            const defaultColor = parsedColors?.[0]?.name || "Black"
            setSelectedColor(defaultColor)
            
            // Set main image based on selected color
            if (parsedImages[defaultColor] && parsedImages[defaultColor].length > 0) {
              setMainImage(parsedImages[defaultColor][0])
              console.log("Set main image:", parsedImages[defaultColor][0])
            } else {
              console.warn("No images found for color:", defaultColor)
            }
          } catch (parseError) {
            console.error("Error parsing product data:", parseError)
          }
        } else {
          throw new Error("No product data available")
        }
      } catch (error) {
        console.error("Error fetching product:", error)
        setError("Failed to load product details. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
    window.scrollTo(0, 0)
  }, [productId, state, products])

  // Update localStorage when product changes
  useEffect(() => {
    if (product) {
      localStorage.setItem(`product_${product._id}`, JSON.stringify(product))
    }
  }, [product])

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get(`${BASEURL}/api/review`)
        console.log("Fetched reviews:", res.data.data.length)
        setReviews(res.data.data)
      } catch (error) {
        console.error("Error fetching reviews:", error)
      }
    }

    fetchReviews()
  }, [])

  // Filter reviews for this product
  useEffect(() => {
    if (productId && review.length > 0) {
      const filterData = review.filter((r) => r.productId === productId)
      console.log("Filtered reviews for product:", filterData.length)
      setFilterReview(filterData)
    }
  }, [review, productId])

  if (loading) {
    return <div className="loading-container">Loading product details...</div>
  }

  if (error) {
    return <div className="error-container">{error}</div>
  }

  if (!product) {
    return <div className="not-found-container">Product not found.</div>
  }

  // Parse product data safely
  const parseProductData = (data, defaultValue = []) => {
    if (!data || !Array.isArray(data) || data.length === 0) return defaultValue;
    
    try {
      if (typeof data[0] === 'object') return data[0];
      return JSON.parse(data[0]);
    } catch (e) {
      console.error("Error parsing data:", e);
      return defaultValue;
    }
  };

  // Parse product data
  const images = parseProductData(product.images, {});
  const availableSizes = parseProductData(product.availableSizes, []);
  const availableColors = parseProductData(product.availableColors, []);

  const handleAddToCart = () => {
    if (!token) {
      toast.warn("Log in to add to cart.", {
        position: "top-right",
        autoClose: 1000,
      })
      navigate("/login")
      return
    }

    if (!selectedSize) {
      toast.error("Select a size.", { position: "top-right", autoClose: 1000 })
      return
    }

    if (!selectedColor) {
      toast.error("Select a color.", {
        position: "top-right",
        autoClose: 1000,
      })
      return
    }

    console.log("Adding to cart:", {
      productId: product._id,
      size: selectedSize,
      color: selectedColor
    });
    
    addToCart(product._id, selectedSize, selectedColor)
    toast.success("Added to cart!", { position: "top-right", autoClose: 1000 })
    setTimeout(() => navigate("/cart"), 1000)
  }

  const handleColorChange = (color) => {
    console.log("Changing color to:", color)
    setSelectedColor(color)
    if (images[color] && images[color].length > 0) {
      setMainImage(images[color][0])
    }
  }

  const handleNewFeedback = (newFeedback) => {
    setFilterReview((prevReviews) => [...prevReviews, newFeedback])
  }

  return (
    <>
      <div className="productdisplay">
        <ToastContainer />
        <div className="productdisplay-left">
          <div className="productdisplay-img-list">
            {images[selectedColor]?.map((img, i) => (
              <img
                key={i}
                src={img || "/placeholder.svg"}
                alt={`Product ${i + 1}`}
                onClick={() => setMainImage(img)}
                className={mainImage === img ? "active" : ""}
              />
            ))}
          </div>
          <div className="productdisplay-img">
            <img className="productdisplay-main-img" src={mainImage || "/placeholder.svg"} alt={product.name} />
          </div>
        </div>
        <div className="productdisplay-right">
          <h2>{product.name}</h2>
          <p className="description" style={{ textAlign: "justify" }}>
            {product.description}
          </p>
          <div className="productdisplay-right-prices">
            <div className="productdisplay-right-price-new">Rs {product.price}</div>
            {product.oldPrice && <div className="productdisplay-right-price-old">Rs {product.oldPrice}</div>}
          </div>
          <div className="productdisplay-right-colors">
            <h3>Generic Name</h3>
            <div className="color-options">{product.subcategory}</div>
          </div>
          <div className="productdisplay-right-colors">
            <h3>Available Colors</h3>
            <div className="color-options">
              {availableColors?.map((colorObj, i) => (
                <div
                  key={i}
                  className={`color-circle ${selectedColor === colorObj.name ? "selected" : ""}`}
                  style={{ backgroundColor: colorObj.name }}
                  onClick={() => handleColorChange(colorObj.name)}
                  title={colorObj.name}
                />
              ))}
            </div>
          </div>
          <div className="productdisplay-right-sizes">
            <h3>Available Size</h3>
            <div className="size-options">
              {availableSizes?.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`size-box ${selectedSize === size ? "selected" : ""}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
          <button className="add-to-cart-btn" onClick={handleAddToCart}>
            Add to Cart
          </button>
        </div>
      </div>
      <div className="descriptionbox">
        <div className="descriptionbox-navigator">
          <button
            className={`descriptionbox-nav-box ${activeTab === "description" ? "active" : ""}`}
            onClick={() => setActiveTab("description")}
          >
            Description
          </button>
          &ensp;&ensp;
          <button
            className={`descriptionbox-nav-box ${activeTab === "reviews" ? "active" : ""}`}
            onClick={() => setActiveTab("reviews")}
          >
            Reviews ({filterReview.length})
          </button>
        </div>
        <div className="descriptionbox-description" style={{ textAlign: "justify" }}>
          {activeTab === "description" ? (
            <p>{product.description}</p>
          ) : (
            <>
              <div className="flex">
                <div className="feedback-container">
                  <FeedBack productId={productId} onNewFeedback={handleNewFeedback} />
                </div>
                <div className="review-box">
                  <h3 className="customer">Customer Reviews</h3>
                  <div className="review-list-container">
                    {filterReview.length > 0 ? (
                      <ul className="review-list">
                        {filterReview.map((review) => (
                          <li key={review._id} className="review-item">
                            <div className="review-header">
                              <h4 className="review-name">{review.name}</h4>
                              <StarRating star={review.rating} className="star-rating"  />
                            </div>
                            <p className="review-text">{review.review}</p>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="no-reviews">No reviews yet.</p>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <RelatedProducts subcategory={product.subcategory} currentProductId={product._id} />
    </>
  )
}

export default ProductDisplay