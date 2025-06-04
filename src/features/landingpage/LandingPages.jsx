import React, { useState, useEffect } from 'react';
import './LandingPages.css';
import withLayout from '../../layouts/HOC/withLayout';
import { getAllProducts } from '../../api/productService';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import HighlightedProductsCarousel from '../products/HighlightedProductsCarousel';
import "slick-carousel/slick/slick-theme.css";
import RecentlyViewedProducts from '../RecentlyViewedProducts.jsx';


const LandingPages = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const response = await getAllProducts(0, 6); // Get first 6 products
        setFeaturedProducts(response.content);
        setLoading(false);
      } catch (err) {
        setError('Failed to load products');
        setLoading(false);
        console.error('Error loading products:', err);
      }
    };
    
    loadProducts();
  }, []);

  const showToaster = (type) => {
    if (type === "success") {
      toast.success("Success message !!", {
        position: 'bottom-center'
      });
    }
    else if (type === "error") {
      toast.error("Error message !!", {
        position: 'bottom-center'
      });
    }
  }

  // Carousel settings
  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          arrows: true
        }
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          arrows: true
        }
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: true
        }
      }
    ]
  };

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Welcome to Mankind Matrix</h1>
          <p>Discover the future of digital innovation</p>
          <button className="cta-button">Learn More</button>
        </div>
      </section>
      

      {/* Featured Products Section */}
      <section className="featured-products">
        <h2 className="section-title">Featured Products</h2>
        {loading ? (
          <div className="loading">Loading products...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : (
          <div className="featured-products-carousel">
            <HighlightedProductsCarousel />
            <RecentlyViewedProducts />
          </div>
        )}
      </section>

      {/* Innovation Section */}
      <section className="innovation-section">
        <div className="innovation-content">
          <h2>Cutting-Edge Technology</h2>
          <p className="innovation-subtitle">Empowering the future with AI and Semiconductor Solutions</p>
          
          <div className="innovation-grid">
            <div className="innovation-card">
              <div className="innovation-icon">
                <i className="fas fa-microchip"></i>
              </div>
              <h3>Advanced Semiconductors</h3>
              <p>State-of-the-art chips and components for next-gen computing solutions</p>
            </div>

            <div className="innovation-card">
              <div className="innovation-icon">
                <i className="fas fa-bolt"></i>
              </div>
              <h3>SpectraForce X Series</h3>
              <p>High-performance AI accelerators with 4x faster processing and 60% lower power consumption</p>
            </div>

            <div className="innovation-card">
              <div className="innovation-icon">
                <i className="fas fa-atom"></i>
              </div>
              <h3>QuantumMind Systems</h3>
              <p>Quantum-inspired computing chips for complex AI workloads and neural network optimization</p>
            </div>

            <div className="innovation-card">
              <div className="innovation-icon">
                <i className="fas fa-cloud"></i>
              </div>
              <h3>CloudSphere Accelerator</h3>
              <p>Cloud-optimized processors with advanced virtualization and multi-tenant capabilities</p>
            </div>
          </div>

          <div className="innovation-stats">
            <div className="stat-item">
              <span className="stat-number">5nm</span>
              <span className="stat-label">Process Node</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">500+</span>
              <span className="stat-label">Chip Types</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">99.9%</span>
              <span className="stat-label">Yield Rate</span>
            </div>
          </div>

          <button className="secondary-button">Explore Our Products</button>
        </div>
      </section>

      {/* Information Block */}
      <section className="info-section py-5">
        <div className="container-fluid">
          <div className="text-center mb-5">
            <h2 className="display-4 fw-bold text-dark mb-3">The Future of Computing: AI & Semiconductor Technology</h2>
            <p className="lead text-muted">Explore the cutting-edge technologies shaping tomorrow's digital landscape, from quantum computing to advanced AI systems</p>
          </div>
          
          <div className="row g-4 px-4">
            <div className="col-lg-3 col-md-6">
              <div className="info-card h-100">
                <div className="info-icon">
                  <i className="fas fa-microchip"></i>
                </div>
                <h3>Understanding Semiconductors</h3>
                <p>Semiconductors are materials that have electrical conductivity between conductors and insulators. They form the foundation of modern electronics and computing. Key concepts include silicon and compound semiconductors, transistor technology, integrated circuit design, and the principles of Moore's Law and scaling. Modern chips can contain billions of transistors, each smaller than a virus, working together to process information at incredible speeds.</p>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="info-card h-100">
                <div className="info-icon">
                  <i className="fas fa-brain"></i>
                </div>
                <h3>AI Fundamentals</h3>
                <p>Artificial Intelligence is revolutionizing how we process information and make decisions. This field encompasses machine learning basics, neural networks, deep learning architectures, and AI model training. Understanding these fundamentals is crucial for anyone working with modern AI systems. From simple pattern recognition to complex natural language processing, AI systems are becoming increasingly sophisticated and capable of handling real-world tasks.</p>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="info-card h-100">
                <div className="info-icon">
                  <i className="fas fa-cogs"></i>
                </div>
                <h3>AI Hardware</h3>
                <p>Specialized hardware designed for AI workloads includes GPUs, TPUs, and custom AI accelerators. These differ from traditional processors in their architecture, parallel processing capabilities, and memory hierarchy. Understanding these differences is key to optimizing AI performance. Modern AI chips can process thousands of operations simultaneously, making them ideal for training complex neural networks and running inference at scale.</p>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="info-card h-100">
                <div className="info-icon">
                  <i className="fas fa-atom"></i>
                </div>
                <h3>Quantum Computing</h3>
                <p>Quantum computing represents the next frontier in computational power. This field explores quantum bits (qubits), quantum gates, quantum algorithms, and quantum error correction. These concepts are revolutionizing how we approach complex computational problems. Quantum computers leverage the principles of superposition and entanglement to perform calculations that would be impossible for classical computers, potentially solving problems in cryptography, drug discovery, and climate modeling.</p>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="info-card h-100">
                <div className="info-icon">
                  <i className="fas fa-microscope"></i>
                </div>
                <h3>Semiconductor Manufacturing</h3>
                <p>The process of creating semiconductor chips involves sophisticated techniques like photolithography, etching, deposition, and clean room technology. Understanding these manufacturing processes is essential for appreciating the complexity of modern chip production. The manufacturing process can involve hundreds of steps, with each layer of the chip being precisely patterned and processed. Clean rooms maintain particle-free environments where even a single speck of dust could ruin an entire batch of chips.</p>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="info-card h-100">
                <div className="info-icon">
                  <i className="fas fa-code-branch"></i>
                </div>
                <h3>AI Software Stack</h3>
                <p>The AI software ecosystem includes frameworks, model optimization tools, deployment solutions, and performance tuning utilities. This stack enables the development and deployment of AI applications across various hardware platforms. From high-level frameworks like TensorFlow and PyTorch to low-level optimization libraries, the software stack provides the tools needed to build, train, and deploy AI models efficiently. Understanding this ecosystem is crucial for developing effective AI solutions.</p>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="info-card h-100">
                <div className="info-icon">
                  <i className="fas fa-bolt"></i>
                </div>
                <h3>Power Efficiency</h3>
                <p>Power efficiency is crucial in modern computing systems. This includes power management strategies, thermal design considerations, energy-efficient computing techniques, and advanced cooling solutions. These aspects are vital for sustainable technology development. As chips become more powerful, managing their power consumption and heat generation becomes increasingly important. Advanced cooling solutions, from liquid cooling to phase-change materials, help maintain optimal operating temperatures.</p>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="info-card h-100">
                <div className="info-icon">
                  <i className="fas fa-chart-network"></i>
                </div>
                <h3>Future Technologies</h3>
                <p>Emerging technologies like neuromorphic computing, advanced materials, 3D integration, and next-generation architectures are shaping the future of AI and semiconductors. These innovations promise to revolutionize computing capabilities. From brain-inspired computing architectures to new materials like graphene and carbon nanotubes, these technologies are pushing the boundaries of what's possible in computing. 3D integration techniques are enabling more complex and efficient chip designs.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Power Your Innovation?</h2>
          <p>Access cutting-edge semiconductors and AI solutions for your next breakthrough</p>
          <div className="cta-features">
            <div className="cta-feature">
              <i className="fas fa-microchip"></i>
              <span>Advanced Process Nodes</span>
            </div>
            <div className="cta-feature">
              <i className="fas fa-shield-alt"></i>
              <span>Enterprise Security</span>
            </div>
            <div className="cta-feature">
              <i className="fas fa-tools"></i>
              <span>Custom Integration</span>
            </div>
            <div className="cta-feature">
              <i className="fas fa-headset"></i>
              <span>24/7 Technical Support</span>
            </div>
            <div className="cta-feature">
              <i className="fas fa-chart-line"></i>
              <span>Performance Analytics</span>
            </div>
            <div className="cta-feature">
              <i className="fas fa-sync"></i>
              <span>Regular Updates</span>
            </div>
          </div>
          <div className="cta-buttons">
            <button className="cta-button primary">Get Started</button>
            <button className="cta-button secondary">Schedule Call</button>
          </div>
        </div>
      </section>

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
};

export default withLayout(LandingPages); 