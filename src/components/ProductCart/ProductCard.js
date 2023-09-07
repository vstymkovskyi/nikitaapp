import React from "react";
import "./ProductCard.css";

const ProductCard = (props) => {
  const { image, description, name, formattedPrice } = props;

  return (
    <div className="product-card">
      {image &&
        <img className="product-card__image" src={image} alt={name} />
      }
      <p className="product-card__brand">{name}</p>
      <p className="product-card__description">{description}</p>
      <p className="product-card__price">{formattedPrice}</p>
    </div>
  );
};

export default ProductCard;
