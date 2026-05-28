import React, { useState } from 'react';
import './Blog.css';
import withLayout from "../../layouts/HOC/withLayout";


const blogPosts = [
  {
    id: 1,
    title: 'Exciting New Product Launches!',
    date: '2024-06-20',
    author: 'Team Mankind Matrix',
    summary: 'We are thrilled to announce the launch of our latest products. Check out what’s new in our store and discover exclusive features and offers!',
    description: 'Here is the full description for the new product launches.\nYou can add as much detail as you want here.\nThis will be shown in the modal when you click the saved post.\n\n- Feature 1: Amazing speed\n- Feature 2: Great value\n- Feature 3: 24/7 support',
    category: 'Product Update',
  },
  {
    id: 2,
    title: 'June Newsletter: What’s New?',
    date: '2024-06-15',
    author: 'Marketing Team',
    summary: 'Our June newsletter is out! Get the latest updates, tips, and special deals delivered straight to your inbox. Don’t miss out on our summer promotions.',
    fullContent: 'Welcome to our June newsletter!\n\nThis month, we’re excited to bring you exclusive deals, product tips, and a behind-the-scenes look at what’s coming next.\n\n- Summer Sale: Up to 30% off select items!\n- New arrivals in our product line.\n- Customer spotlight: Share your story with us!\n\nThank you for being part of our community. Stay tuned for more updates!',
    category: 'Newsletter',
  },
  {
    id: 3,
    title: 'Behind the Scenes: How We Build Products',
    date: '2024-06-10',
    author: 'Product Team',
    summary: 'Take a look behind the curtain at our product development process, from idea to launch. Meet the team and see how your feedback shapes our roadmap.',
    category: 'Company News',
  },
];

const BookmarkIcon = ({ active }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? '#6366f1' : 'none'} stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
);
const HeartIcon = ({ active }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? '#f43f5e' : 'none'} stroke="#f43f5e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>
);
const MenuIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/></svg>
);
const CloseIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
);

const Blog = () => {
  const [bookmarks, setBookmarks] = useState({});
  const [favorites, setFavorites] = useState({});
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [modalPost, setModalPost] = useState(null);

  const toggleBookmark = (id) => {
    setBookmarks((prev) => ({ ...prev, [id]: !prev[id] }));
  };
  const toggleFavorite = (id) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const bookmarkedPosts = blogPosts.filter(post => bookmarks[post.id]);
  const favoritePosts = blogPosts.filter(post => favorites[post.id]);

  const renderBlogCard = (post) => (
    <div
      className={`blog-card${post.category === 'Newsletter' ? ' blog-card-newsletter' : ''}`}
      key={post.id}
    >
      <div className="blog-meta">
        <span className="blog-category">{post.category}</span>
        <span className="blog-date">{new Date(post.date).toLocaleDateString()}</span>
      </div>
      <div className="blog-icons">
        <button
          className="blog-icon-btn"
          onClick={e => { e.stopPropagation(); toggleBookmark(post.id); }}
          aria-label={bookmarks[post.id] ? 'Remove bookmark' : 'Add bookmark'}
        >
          <BookmarkIcon active={bookmarks[post.id]} />
        </button>
        <button
          className="blog-icon-btn"
          onClick={e => { e.stopPropagation(); toggleFavorite(post.id); }}
          aria-label={favorites[post.id] ? 'Remove from favorites' : 'Add to favorites'}
        >
          <HeartIcon active={favorites[post.id]} />
        </button>
      </div>
      <h2 className="blog-post-title">{post.title}</h2>
      <p className="blog-summary">{post.summary}</p>
      <div className="blog-author">By {post.author}</div>
    </div>
  );

  const renderDrawerListItem = (post) => (
    <div
      key={post.id}
      className="blog-drawer-list-item"
      onClick={() => { setModalPost(post); }}
      style={{ cursor: 'pointer', padding: '8px 0', color: '#22223b', fontWeight: 500 }}
    >
      {post.title}
    </div>
  );

  const closeModal = () => setModalPost(null);

  return (
    <div className="blog-page">
      <div className="blog-header">
        <h1 className="blog-title">Latest Updates & News</h1>
        <button className="blog-menu-btn" onClick={() => setDrawerOpen(true)} aria-label="Show bookmarks and favorites">
          <MenuIcon />
        </button>
      </div>

      <div className="blog-section">
        <h2 className="blog-section-title">All Posts</h2>
        <div className="blog-list">
          {blogPosts.map(renderBlogCard)}
        </div>
      </div>

      {/* Drawer overlay */}
      {drawerOpen && <div className="blog-drawer-overlay" onClick={() => setDrawerOpen(false)} />}
      {/* Drawer */}
      <div className={`blog-drawer${drawerOpen ? ' open' : ''}`}>
        <div className="blog-drawer-header">
          <span className="blog-drawer-title">Saved Posts</span>
          <button className="blog-drawer-close" onClick={() => setDrawerOpen(false)} aria-label="Close drawer">
            <CloseIcon />
          </button>
        </div>
        <div className="blog-drawer-content">
          <div className="blog-drawer-section">
            <h3>Bookmarked</h3>
            {bookmarkedPosts.length === 0 ? <div className="blog-drawer-empty">No bookmarks yet.</div> :
              bookmarkedPosts.map(renderDrawerListItem)}
          </div>
          <div className="blog-drawer-section">
            <h3>Favorites</h3>
            {favoritePosts.length === 0 ? <div className="blog-drawer-empty">No favorites yet.</div> :
              favoritePosts.map(renderDrawerListItem)}
          </div>
        </div>
      </div>

      {/* Modal for post details */}
      {modalPost && (
        <>
          <div className="blog-modal-overlay" onClick={closeModal} />
          <div className="blog-modal">
            <button className="blog-modal-close" onClick={closeModal} aria-label="Close modal">
              <CloseIcon />
            </button>
            <div className="blog-meta">
              <span className="blog-category">{modalPost.category}</span>
              <span className="blog-date">{new Date(modalPost.date).toLocaleDateString()}</span>
            </div>
            <h2 className="blog-post-title">{modalPost.title}</h2>
            <p className="blog-summary">
              {(modalPost.description || modalPost.fullContent || modalPost.summary)
                .split('\n').map((line, i) => <span key={i}>{line}<br /></span>)}
            </p>
            <div className="blog-author">By {modalPost.author}</div>
          </div>
        </>
      )}
    </div>
  );
};

export default withLayout(Blog); 