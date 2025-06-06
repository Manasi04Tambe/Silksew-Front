
import { useEffect, useRef } from "react";
import { ShoppingCart, Package, Shield, Headphones } from "lucide-react";
import "./OfferBanner.css";

export default function SpecialFeatures() {
  const featuresRef = useRef(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    const featureItems = document.querySelectorAll(".feature-item");
    featureItems.forEach((item, index) => {
      item.style.transitionDelay = `${index * 150}ms`;
      observer.observe(item);
    });

    return () => {
      featureItems.forEach((item) => observer.unobserve(item));
    };
  }, []);

  const features = [
    {
      icon: <ShoppingCart className="feature-icon" />,
      title: "Free Delivery",
      description: "On all orders above $50"
    },
    {
      icon: <Package className="feature-icon" />,
      subtitle: "3 DAYS",
      title: "For Free Return",
       description: "No questions asked policy"
    },
    {
      icon: <Shield className="feature-icon" />,
      subtitle: "PAYMENT",
      title: "Secure System",
      description: "Protected by 256-bit encryption"
    },
    {
      icon: <Headphones className="feature-icon" />,
      subtitle: "24/7",
      title: "Online Supports",
      description: "Always here to help you"
    },
  ];

  return (
    <div className="special-features-container" ref={featuresRef}>
      <div className="special-features-content">
        <div className="features-list">
          {features.map((feature, index) => (
            <div key={index} className="feature-item">
              <div className="feature-content">
                <div className="icon-diamond">
                  {feature.icon}
                </div>
                <h3 className="feature-title" style={{color:"whitesmoke"}}>{feature.title}</h3>
                <p className="feature-description" style={{color:"whitesmoke"}}>{feature.description}</p>
              </div>
              {index < features.length - 1 && (
                <div className="connector">
                  <div className="dotted-line"></div>
                  <div className="arrow"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}