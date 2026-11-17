import React, { useState, useEffect } from 'react';
import useCategories from '../../../hooks/useCategories';
import './SidebarFilters.css';

// Helper function to flatten categories for the select options
const flattenCategories = (categories, level = 0) => {
  return categories.reduce((acc, category) => {
    // Add indentation to show hierarchy
    acc.push({
      value: category.name,
      label: '  '.repeat(level) + category.name
    });
    if (category.subcategories && category.subcategories.length > 0) {
      acc.push(...flattenCategories(category.subcategories, level + 1));
    }
    return acc;
  }, []);
};

const SidebarFilters = ({ onFilterChange }) => {
  const { categories, loading, getCategories } = useCategories();
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    getCategories();
  }, [getCategories]);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    onFilterChange(e.target.value);
  };

  // Get flattened categories with hierarchy
  const categoryOptions = [
    { value: '', label: 'All Products' },
    ...(categories ? flattenCategories(categories) : [])
  ];

  return (
    <div className="product-filter">
      <h4>Filter by Category:</h4>
      <select onChange={handleCategoryChange} value={selectedCategory}>
        {categoryOptions.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SidebarFilters;