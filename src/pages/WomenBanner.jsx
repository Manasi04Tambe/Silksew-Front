import React from 'react';
import { ArrowRight } from 'lucide-react';
import './CSS/WomenBanner.css';
import womenBanner from "../components/Assets/womenBanner2.jpg"

const WomenBanner = () => {
  const staticContent = {
    image:womenBanner,
    title: "About Our Brand",
    subtitle: "Heritage & Craftsmanship",
    description: "Discover the story behind our timeless collections and the artisans who bring them to life. Our brand represents a fusion of traditional techniques with contemporary design, creating pieces that celebrate cultural heritage while embracing modern aesthetics.",
    link: "/about"
  };

  return (
    <section className="static-page-section" style={{marginTop:"20px"}}>
      <div className="static-page-container">
        <div 
          className="static-page-image"
          style={{ backgroundImage: `url(${staticContent.image})` }}
        >
          <div className="static-overlay"></div>
        </div>
        
        <div className="static-content">
          <div className="static-text-content">
            <span className="static-eyebrow">Our Story</span>
            <h1 className="static-title">
              {staticContent.title}
              <span className="static-subtitle">{staticContent.subtitle}</span>
            </h1>
            <p className="static-description">{staticContent.description}</p>
            <a href={staticContent.link} className="static-button">
              Learn More
              <ArrowRight className="button-icon" size={20} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WomenBanner;