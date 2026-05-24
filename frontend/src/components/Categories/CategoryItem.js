import React from 'react';

const CategoryItem = ({ category, selected, onClick }) => {
  return (
    <div
      className={`category-item ${selected ? 'selected' : ''}`}
      onClick={() => onClick(category)}
      style={{ borderLeft: `4px solid ${category.color}` }}
    >
      <span>{category.name}</span>
    </div>
  );
};

export default CategoryItem;