import React from 'react';
import { motion } from 'framer-motion';
import './AboutUs.css';
import withLayout from '../../layouts/HOC/withLayout.jsx';

const AboutUs = () => {
  return (
    <div className="about-container">
      {/* Hero Section */}
      <section className="about-hero">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="hero-content"
        >
          <h1>About Mankind Matrix</h1>
          <p>Empowering the future through innovative technology and sustainable solutions</p>
        </motion.div>
      </section>

      {/* Mission Section */}
      <section className="mission-section">
        <div className="section-content">
          <h2>Our Mission</h2>
          <p>
            At Mankind Matrix, we are dedicated to creating a sustainable future through
            innovative technology solutions that empower individuals and businesses to
            make a positive impact on the world. Our commitment to excellence and
            innovation drives us to develop cutting-edge solutions that address the
            complex challenges of today and tomorrow.
          </p>
        </div>
      </section>

      {/* Vision Section */}
      <section className="vision-section">
        <div className="section-content">
          <h2>Our Vision</h2>
          <p>
            We envision a world where technology serves as a catalyst for positive change,
            where innovation meets sustainability, and where every individual has access
            to the tools and resources they need to thrive in the digital age.
          </p>
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section">
        <h2>Our Core Values</h2>
        <div className="values-grid">
          <div className="value-card">
            <i className="fas fa-lightbulb"></i>
            <h3>Innovation</h3>
            <p>Pushing boundaries and exploring new possibilities in technology and sustainability</p>
          </div>
          <div className="value-card">
            <i className="fas fa-handshake"></i>
            <h3>Integrity</h3>
            <p>Building trust through honest and ethical practices in all our operations</p>
          </div>
          <div className="value-card">
            <i className="fas fa-leaf"></i>
            <h3>Sustainability</h3>
            <p>Creating solutions that respect our planet and promote environmental responsibility</p>
          </div>
          <div className="value-card">
            <i className="fas fa-users"></i>
            <h3>Community</h3>
            <p>Fostering collaboration and shared success through meaningful partnerships</p>
          </div>
        </div>
      </section>

      {/* History Section */}
      <section className="history-section">
        <h2>Our Journey</h2>
        <div className="timeline">
          <div className="timeline-item">
            <div className="year">2020</div>
            <div className="content">
              <h3>Foundation</h3>
              <p>Mankind Matrix was founded with a vision to revolutionize technology solutions</p>
            </div>
          </div>
          <div className="timeline-item">
            <div className="year">2021</div>
            <div className="content">
              <h3>Expansion</h3>
              <p>Launched our first major product line and expanded operations globally</p>
            </div>
          </div>
          <div className="timeline-item">
            <div className="year">2022</div>
            <div className="content">
              <h3>Innovation</h3>
              <p>Introduced breakthrough technologies in sustainable development</p>
            </div>
          </div>
          <div className="timeline-item">
            <div className="year">2023</div>
            <div className="content">
              <h3>Growth</h3>
              <p>Achieved significant market presence and established key partnerships</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section">
        <h2>Our Leadership Team</h2>
        <div className="team-grid">
          <div className="team-member">
            <div className="member-image"></div>
            <h3>John Doe</h3>
            <p>Chief Executive Officer</p>
            <p className="member-bio">20+ years of experience in technology leadership and innovation</p>
          </div>
          <div className="team-member">
            <div className="member-image"></div>
            <h3>Jane Smith</h3>
            <p>Chief Technology Officer</p>
            <p className="member-bio">Expert in AI and sustainable technology solutions</p>
          </div>
          <div className="team-member">
            <div className="member-image"></div>
            <h3>Mike Johnson</h3>
            <p>Chief Operations Officer</p>
            <p className="member-bio">Specialized in global operations and strategic planning</p>
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="achievements-section">
        <h2>Our Achievements</h2>
        <div className="achievements-grid">
          <div className="achievement-card">
            <i className="fas fa-award"></i>
            <h3>100+</h3>
            <p>Successful Projects</p>
          </div>
          <div className="achievement-card">
            <i className="fas fa-globe"></i>
            <h3>25+</h3>
            <p>Countries Served</p>
          </div>
          <div className="achievement-card">
            <i className="fas fa-users"></i>
            <h3>50K+</h3>
            <p>Happy Customers</p>
          </div>
          <div className="achievement-card">
            <i className="fas fa-certificate"></i>
            <h3>15+</h3>
            <p>Industry Awards</p>
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Join Us in Our Journey</h2>
          <p>Be part of our mission to create a better future through innovation and sustainability</p>
          <div className="cta-buttons">
            <button className="cta-button primary">Get in Touch</button>
            <button className="cta-button secondary">Learn More</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default withLayout(AboutUs); 