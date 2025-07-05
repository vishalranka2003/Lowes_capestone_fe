import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Calendar, Wrench, Users, ArrowRight, CheckCircle } from 'lucide-react';
import '../styles/Home.css';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
export const Home = () => {
    const { token } = useSelector((state) => state.auth);
 if (token) {
  return <Navigate to="/dashboard" replace />;
    }

  const features = [
    {
      icon: Shield,
      title: "Warranty Protection",
      description: "Never lose track of your appliance warranties with automated tracking"
    },
    {
      icon: Calendar,
      title: "Smart Reminders",
      description: "Get notified before your warranties expire and service due dates"
    },
    {
      icon: Wrench,
      title: "Easy Service Booking",
      description: "Schedule maintenance and repairs with certified technicians"
    },
    {
      icon: Users,
      title: "Expert Support",
      description: "Access to verified professionals for all your appliance needs"
    }
  ];

  return (
    <main className="home-container">
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">Welcome to Warranty Tracker</h1>
            <p className="hero-description">
              Track your appliances, manage service requests, and never miss a warranty again. 
              Your complete solution for appliance management and maintenance scheduling.
            </p>
            <div className="hero-buttons">
              <Link to="/register" className="cta-button primary">
                Get Started Free
                <ArrowRight className="button-icon" />
              </Link>
              
            </div>
          </div>
          <div className="hero-visual">
            <div className="warranty-card">
              <div className="card-header">
                <span className="status-badge active">
                  <CheckCircle className="status-icon" />
                  Active
                </span>
              </div>
              <div className="card-content">
                <h3 className="appliance-name">Samsung Refrigerator</h3>
                <p className="warranty-info">Warranty expires in 45 days</p>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: '75%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Why Choose Warranty Tracker?</h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">
                  <feature.icon />
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Protect Your Appliances?</h2>
            <p className="cta-description">
              Join thousands of homeowners who trust Warranty Tracker to manage their appliances
            </p>
            <Link to="/register" className="cta-button primary large">
              Start Your Free Trial
              <ArrowRight className="button-icon" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};