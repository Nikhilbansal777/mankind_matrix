import React from 'react';
import { motion } from 'framer-motion';
import './PrivacyPolicy.css';
import withLayout from '../../layouts/HOC/withLayout.jsx';

const PrivacyPolicy = () => {
  return (
    <div className="privacy-container">
      <section className="privacy-hero">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="hero-content"
        >
          <h1>Privacy Policy</h1>
          <p>Your privacy is important to us. This policy explains how we collect, use, and protect your information.</p>
        </motion.div>
      </section>

      <section className="policy-section">
        <div className="section-content">
          <h2>1. Information We Collect</h2>
          <p>
            We collect information you provide directly (for example, when you create an account, place an order, or
            contact support) and information collected automatically (such as usage data, device information, and
            cookies).
          </p>

          <h2>2. How We Use Your Information</h2>
          <p>
            We use the information to provide and improve our services, process orders, communicate with you,
            personalize your experience, and for security and fraud prevention.
          </p>

          <h2>3. Sharing & Disclosure</h2>
          <p>
            We do not sell your personal information. We may share data with service providers who perform
            services on our behalf (payment processors, shipping partners, analytics providers) and when required by law.
          </p>

          <h2>4. Cookies & Tracking</h2>
          <p>
            We use cookies and similar technologies to remember preferences, analyze site traffic, and deliver
            relevant content. You can manage cookies via your browser settings.
          </p>

          <h2>5. Data Security</h2>
          <p>
            We implement reasonable technical and organizational measures to protect your information. However,
            no method of transmission or storage is 100% secure — please take care with your account credentials.
          </p>

          <h2>6. Your Choices</h2>
          <p>
            You can access, correct, or delete your account information by visiting your account settings or
            contacting our support team. You may also opt out of promotional emails.
          </p>

          <h2>7. Children</h2>
          <p>
            Our services are not directed to children under 13. We do not knowingly collect personal information
            from children under 13. If you believe we have inadvertently collected such information, contact us.
          </p>

          <h2>8. Changes to This Policy</h2>
          <p>
            We may update this policy from time to time. When we do, we'll post the new policy here with an updated
            effective date.
          </p>

          <h2>Contact Us</h2>
          <p>
            If you have questions about this privacy policy, please contact us at privacy@mankindmatrix.example
            (sample address).
          </p>
        </div>
      </section>
    </div>
  );
};

export default withLayout(PrivacyPolicy);
