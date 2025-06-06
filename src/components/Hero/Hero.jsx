
import React, { useState, useEffect } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import './Hero.css';
import h1_img from '../Assets/h-1.png';
import h2_img from '../Assets/h2.jpeg';
import h3_img from '../Assets/h-3.png';
import h4_img from '../Assets/h-4.png';
import h5_img from '../Assets/h-5.png';
import h6_img from '../Assets/h-6.jpeg';
import h7_img from '../Assets/h-7.png';
import h8_img from '../Assets/h-8.jpeg';


const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const slides = [
    {
      image: h1_img,
      title: "Summer Collection",
      subtitle: "2025",
      description: "Discover the latest trends in summer fashion",
      link: "/summer"
    },
    {
      image: h2_img,
      title: "Luxury Essentials",
      subtitle: "Premium",
      description: "Elevate your wardrobe with luxury pieces",
      link: "/luxury"
    },
    {
      image: h3_img,
      title: "Women's Traditional",
      subtitle: "Heritage",
      description: "Timeless traditional attire celebrating cultural elegance",
      link: "/women-traditional"
    },
    {
      image: h4_img,
      title: "Men's Traditional",
      subtitle: "Classic",
      description: "Sophisticated traditional wear for the modern gentleman",
      link: "/men-traditional"
    },
    {
      image: h5_img,
      title: "Festive Collection",
      subtitle: "Celebration",
      description: "Stunning traditional ensembles for festive celebrations",
      link: "/festive"
    },
    {
      image: h6_img,
      title: "Bridal Collection",
      subtitle: "Wedding",
      description: "Elegant bridal wear for your special day",
      link: "/bridal"
    },
    {
      image: h7_img,
      title: "Cultural Fusion",
      subtitle: "Modern Heritage",
      description: "Contemporary designs with traditional elements",
      link: "/fusion"
    },
    {
      image: h8_img,
      title: "Urban Style",
      subtitle: "Street",
      description: "Contemporary urban fashion for modern lifestyle",
      link: "/urban"
    }
  ];

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    
    setMousePosition({
      x: (clientX - innerWidth / 2) / innerWidth,
      y: (clientY - innerHeight / 2) / innerHeight
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section className="hero-section" onMouseMove={handleMouseMove} style={{top:"50px"}} >
      <div className="hero-slider">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
            style={{
              backgroundImage: `url(${slide.image})`,
              transform: index === currentSlide 
                ? `translate(${mousePosition.x * 20}px, ${mousePosition.y * 20}px) scale(1.1)`
                : 'none'
            }}
          >
            <div className="hero-overlay"></div>
            <div className="hero-content">
              <div className="hero-text-content">
                <span className="hero-eyebrow">Featured Collection</span>
                <h1 className="hero-title" style={{color:"#00bfff"}}>
                  {slide.title}
                  <span className="hero-subtitle">{slide.subtitle}</span>
                </h1>
                <p className="hero-description">{slide.description}</p>
                <a href={slide.link} className="hero-button">
                  Explore Now
                  <ArrowRight className="button-icon" size={20} />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="hero-controls">
        <button className="hero-nav prev" onClick={prevSlide} aria-label="Previous slide">
          <ChevronLeft size={24} />
        </button>
        <div className="hero-indicators">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`indicator ${index === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
        <button className="hero-nav next" onClick={nextSlide} aria-label="Next slide">
          <ChevronRight size={24} />
        </button>
      </div>
    </section>
  );
};

export default Hero;