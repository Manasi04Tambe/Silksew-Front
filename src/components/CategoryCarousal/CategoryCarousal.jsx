import React from 'react';
import { Link } from 'react-router-dom';
import './CategoryCarousal.css';

const categories = [
  {
    id: 1,
    title: "Women's Ethnic",
    image: "https://imagescdn.pantaloons.com/uploads/menuitemimages/production/1677570657_Ethnicwear.jpg",
    link: "/womens"
  },
  {
    id: 2,
    title: "Women's Western",
    image: "https://imagescdn.pantaloons.com/uploads/menuitemimages/production/1677570657_Westernwear.jpg",
    link: "/womens"
  },
  {
    id: 3,
    title: "Men's Formal",
    image: "https://imagescdn.pantaloons.com/uploads/menuitemimages/production/1677570657_Formalwear.jpg",
    link: "/mens"
  },
  {
    id: 4,
    title: "Men's Casual",
    image: "https://imagescdn.pantaloons.com/uploads/menuitemimages/production/1677570657_Casualwear.jpg",
    link: "/mens"
  },
  {
    id: 5,
    title: "Kids Wear",
    image: "https://imagescdn.pantaloons.com/uploads/menuitemimages/production/1677570657_Kidswear.jpg",
    link: "/kids"
  },
  {
    id: 6,
    title: "Accessories",
    image: "https://imagescdn.pantaloons.com/uploads/menuitemimages/production/1677570657_Accessories.jpg",
    link: "/accessories"
  }
];

const CategoryCarousal = () => {
  return (
    <div className="category-carousel">
      <div className="category-header">
        <h2 className="section-title">SHOP BY CATEGORY</h2>
        <div className="section-subtitle">Discover our curated collection of fashion categories</div>
      </div>
      <div className="category-container">
        {categories.map((category) => (
          <Link to={category.link} key={category.id} className="category-item">
            <div className="category-image-wrapper">
              <img src={category.image} alt={category.title} className="category-image" />
              <div className="category-overlay">
                <span className="category-title">{category.title}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryCarousal; 