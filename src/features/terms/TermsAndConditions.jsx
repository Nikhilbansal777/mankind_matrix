import React from 'react';
import { motion } from 'framer-motion';
import './TermsAndConditions.css';
import withLayout from '../../layouts/HOC/withLayout.jsx';

const TermsAndConditions = () => {
  return (
    <div className="terms-container">
      <section className="terms-hero">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="hero-content"
        >
          <h1>Terms & Conditions</h1>
          <p>Last updated: September 30, 2025 — Please read these terms carefully before using our services.</p>
        </motion.div>
      </section>

      <section className="terms-section">
        <div className="section-content">
          <h2>1. Introduction</h2>
          <p>
            These Terms and Conditions govern your use of the Mankind Matrix website and services. By accessing or using
            our services you agree to be bound by these Terms.
          </p>

          <h2>2. Using Our Services</h2>
          <p>
            You agree to use the services only for lawful purposes and in accordance with these Terms. We reserve the right
            to suspend or terminate access for conduct that violates these Terms or is harmful to other users or our systems.
          </p>

          <h2>3. Accounts & Registration</h2>
          <p>
            When you create an account you must provide accurate information and keep your credentials secure. You are
            responsible for all activity that occurs under your account.
          </p>

          <h2>4. Orders, Pricing & Payments</h2>
          <p>
            Prices, availability, and promotions are subject to change. Payment terms are governed by any checkout
            or payment provider agreements you accept at purchase.
          </p>

          <h2>5. Intellectual Property</h2>
          <p>
            All content on the site, including text, graphics, logos, and software, is owned or licensed by Mankind Matrix
            and is protected by intellectual property laws. You may not reproduce or use our content without written
            permission, except as provided by these Terms.
          </p>

          <h2>6. Prohibited Activities</h2>
          <p>
            You shall not misuse the services (for example, interfering with the site, attempting to access restricted
            areas, or distributing malicious software). Violations may result in termination and legal action.
          </p>

          <h2>7. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, Mankind Matrix will not be liable for indirect, incidental,
            consequential, or punitive damages arising from your use of the services.
          </p>

          <h2>8. Indemnification</h2>
          <p>
            You agree to indemnify and hold harmless Mankind Matrix and its affiliates from any claims, losses, liabilities,
            damages, and expenses arising out of your breach of these Terms or your use of the services.
          </p>

          <h2>9. Governing Law</h2>
          <p>
            These Terms are governed by the laws of the jurisdiction in which Mankind Matrix is incorporated, without regard
            to conflict of law principles.
          </p>

          <h2>10. Changes to Terms</h2>
          <p>
            We may revise these Terms from time to time. If changes are material, we will provide notice. Continued use
            of the services after changes constitutes acceptance of the updated Terms.
          </p>

          <h2>11. Contact</h2>
          <p>
            For questions about these Terms, contact us at support@mankindmatrix.example (sample address).
          </p>
        </div>
      </section>
    </div>
  );
};

export default withLayout(TermsAndConditions);
