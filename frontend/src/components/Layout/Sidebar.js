import React from 'react';
import CategoryList from '../Categories/CategoryList';

const Sidebar = ({ selectedCategory, onSelectCategory }) => {
  return (
    <aside className="sidebar">
      <CategoryList
        selectedCategory={selectedCategory}
        onSelectCategory={onSelectCategory}
      />
    </aside>
  );
};

export default Sidebar;