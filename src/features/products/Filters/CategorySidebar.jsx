import React, { useState, useEffect, useCallback, memo } from "react";
import useCategories from '../../../hooks/useCategories';
import "./CategorySidebar.css";

// Category Item Component
const CategoryItem = memo(({ 
  category, 
  level = 0, 
  onCategorySelect, 
  selectedCategory,
  expandedCategories,
  onToggleExpand 
}) => {
  const hasSubcategories = category.subcategories && category.subcategories.length > 0;
  const isExpanded = expandedCategories.includes(category.id);
  const isSelected = selectedCategory === category.id;
  
  const handleClick = useCallback((e) => {
    e.preventDefault();
    if (hasSubcategories) {
      onToggleExpand(category.id);
    } else {
      onCategorySelect(category.id);
    }
  }, [category, hasSubcategories, onCategorySelect, onToggleExpand]);

  const handleCategorySelect = useCallback((e) => {
    e.stopPropagation();
    onCategorySelect(category.id);
  }, [category.id, onCategorySelect]);

  return (
    <li className={`sidenav-list-item ${isSelected ? 'selected' : ''}`}>
      <div className="category-item" style={{ '--level': level }}>
        {hasSubcategories && (
          <button 
            className={`expand-button ${isExpanded ? 'expanded' : ''}`}
            onClick={handleClick}
            aria-label={isExpanded ? 'Collapse' : 'Expand'}
            aria-expanded={isExpanded}
          >
            <span className="expand-icon">▶</span>
          </button>
        )}
        
        <button 
          className={`category-button ${isSelected ? 'selected' : ''}`}
          onClick={hasSubcategories ? handleCategorySelect : handleClick}
        >
          <span className="category-name">{category.name}</span>
        </button>
      </div>
      
      {hasSubcategories && isExpanded && (
        <ul className="subcategories-list">
          {category.subcategories.map((subcategory) => (
            <CategoryItem
              key={subcategory.id}
              category={subcategory}
              level={level + 1}
              onCategorySelect={onCategorySelect}
              selectedCategory={selectedCategory}
              expandedCategories={expandedCategories}
              onToggleExpand={onToggleExpand}
            />
          ))}
        </ul>
      )}
    </li>
  );
});

CategoryItem.displayName = 'CategoryItem';

// Main Sidebar Component
function CategorySidebar({ onCategorySelect, selectedCategory }) {
  const { categories, loading, getCategories } = useCategories();
  const [expandedCategories, setExpandedCategories] = useState([]);

  // Fetch categories on component mount
  useEffect(() => {
    getCategories();
  }, [getCategories]);

  // Handle expanding/collapsing categories
  const handleToggleExpand = useCallback((categoryId) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  }, []);

  // Handle category selection
  const handleCategorySelect = useCallback((categoryId) => {
    onCategorySelect(categoryId);
  }, [onCategorySelect]);

  // Handle "All Products" selection
  const handleAllProducts = useCallback(() => {
    onCategorySelect(null);
  }, [onCategorySelect]);

  if (loading.categories) {
    return (
      <div className="category-sidebar">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="category-sidebar">
      <div className="sidenav-header">
        <h6>PRODUCT CATEGORIES</h6>
      </div>
      
      <ul className="sidenav-list">
        {/* All Products Option */}
        <li className={`sidenav-list-item ${selectedCategory === null ? 'selected' : ''}`}>
          <button 
            className={`category-button all-products ${selectedCategory === null ? 'selected' : ''}`}
            onClick={handleAllProducts}
          >
            <span className="category-name">All Products</span>
          </button>
        </li>
        
        {/* Categories */}
        {categories && categories.map((category) => (
          <CategoryItem
            key={category.id}
            category={category}
            onCategorySelect={handleCategorySelect}
            selectedCategory={selectedCategory}
            expandedCategories={expandedCategories}
            onToggleExpand={handleToggleExpand}
          />
        ))}
        
        {(!categories || categories.length === 0) && (
          <li className="sidenav-list-item">
            <div className="no-categories">
              <p>No categories available</p>
            </div>
          </li>
        )}
      </ul>
    </div>
  );
}

export default memo(CategorySidebar); 