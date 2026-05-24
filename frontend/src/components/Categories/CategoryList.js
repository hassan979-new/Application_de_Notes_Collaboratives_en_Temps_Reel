import React, { useState, useEffect } from 'react';
import CategoryItem from './CategoryItem';
import api from '../../services/api';

const CategoryList = ({ selectedCategory, onSelectCategory }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/categories');
        setCategories(response.data.data || []);
      } catch (err) {
        console.error('Erreur chargement catégories:', err);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="category-list">
      <h4>Catégories</h4>
      <div
        className={`category-item ${!selectedCategory ? 'selected' : ''}`}
        onClick={() => onSelectCategory(null)}
      >
        Toutes les notes
      </div>
      {categories.map((cat) => (
        <CategoryItem
          key={cat._id}
          category={cat}
          selected={selectedCategory?._id === cat._id}
          onClick={onSelectCategory}
        />
      ))}
    </div>
  );
};

export default CategoryList;