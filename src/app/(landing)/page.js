'use client';

import { useState, useEffect } from 'react';
import './LandingPage.css';
import './FeatureCards.css';
import './CircleAnimation.css';
import flowLogo from '@/assets/images/flow-logo.png';
import Footer from '@/components/Footer';
import InteractiveDemo from '@/components/InteractiveDemo';
import Link from 'next/link';
import Image from 'next/image';

function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    document.body.classList.add('landing-page');

    return () => {
      document.body.classList.remove('landing-page');
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    document.body.style.overflow = isMenuOpen ? 'auto' : 'hidden';
  };

  const handleClickOutside = (e) => {
    if (
      !e.target.closest('.menu-content') &&
      !e.target.closest('.hamburger-menu')
    ) {
      toggleMenu();
    }
  };

  useEffect(() => {
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'auto';
    };
  }, [isMenuOpen]);

  return (
    <div className="landing-container">
      <div className="landing-header">
        <div className="header-content">
          <div className="logo-container">
            <Image src={flowLogo} alt="Flow Logo" className="header-logo" />
          </div>
          <div className="header-title">Flow.</div>
          <button className="hamburger-menu" onClick={toggleMenu}>
            <div className={`hamburger-icon ${isMenuOpen ? 'open' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </button>
        </div>
      </div>

      <div className={`menu-overlay ${isMenuOpen ? 'open' : ''}`}>
        <nav className="menu-content">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault(); //
              toggleMenu();
            }}
          >
            Login
          </a>
          <Link href="/pricing" onClick={toggleMenu}>
            Pricing
          </Link>
          <a href="#about" onClick={toggleMenu}>
            About
          </a>
          <a href="#careers" onClick={toggleMenu}>
            Careers
          </a>
          <a href="mailto:seth141592@gmail.com" onClick={toggleMenu}>
            Contact
          </a>
        </nav>
      </div>

      <div className="landing-content">
        <div className="landing-main">
          <h1 className="landing-title animate-rise">Welcome to Flow.</h1>
          <p className="landing-description">
            Transform your project planning with Flow - where AI meets intuitive
            task management.
            <span className="underline-animation generate">Generate</span>,
            <span className="underline-animation organize">organize</span>, and
            <span className="underline-animation track">track</span> your
            project tasks effortlessly with our intelligent Kanban system.
          </p>
          <Link href="/login" className="start-button">
            Try Flow
          </Link>
        </div>
        <div className="landing-animation">
          <div className="circle-container">
            <div className="circle circle1"></div>
            <div className="circle circle2"></div>
            <div className="circle circle3"></div>
            <div className="circle circle4"></div>
            <div className="circle circle5"></div>
            <div className="circle circle6"></div>
            <div className="circle circle7"></div>
          </div>
        </div>
      </div>

      {/* How Flow Works Section */}
      <section className="how-flow-works">
        <div className="container">
          <h2 className="section-title">How Flow Works</h2>
          <div className="steps-container">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Describe Your Project</h3>
              <p>Simply describe your project requirements and goals in natural language.</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>AI Task Generation</h3>
              <p>Our AI analyzes your project and breaks it down into organized, actionable tasks.</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Intelligent Organization</h3>
              <p>Tasks are automatically categorized and prioritized in your Kanban board.</p>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <h3>Track & Optimize</h3>
              <p>Monitor progress, collaborate with your team, and optimize your workflow.</p>
            </div>
          </div>
        </div>
      </section>

      {/* AI Task Generation Demo */}
      <section className="ai-demo-section">
        <div className="container">
          <h2 className="section-title">AI Task Generation</h2>
          <p className="section-subtitle">Flow's AI breaks down your project into organized, actionable tasks.</p>
          <div className="task-examples">
            <div className="task-example">
              <div className="task-icon">📊</div>
              <div className="task-content">
                <h4>Set up product database schema</h4>
                <p>Design and implement the database structure for your product catalog</p>
              </div>
            </div>
            <div className="task-example">
              <div className="task-icon">🛍️</div>
              <div className="task-content">
                <h4>Create product listing component</h4>
                <p>Build responsive product cards with search and filter functionality</p>
              </div>
            </div>
            <div className="task-example">
              <div className="task-icon">🛒</div>
              <div className="task-content">
                <h4>Implement shopping cart functionality</h4>
                <p>Add cart management, quantity updates, and checkout flow</p>
              </div>
            </div>
            <div className="task-example">
              <div className="task-icon">💳</div>
              <div className="task-content">
                <h4>Set up payment gateway integration</h4>
                <p>Integrate secure payment processing with Stripe or PayPal</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Flow Advantage */}
      <section className="flow-advantage">
        <div className="container">
          <h2 className="section-title">The Flow Advantage</h2>
          <div className="stats-container">
            <div className="stat">
              <div className="stat-number">40%</div>
              <div className="stat-label">Time Saved in Planning</div>
            </div>
            <div className="stat">
              <div className="stat-number">30%</div>
              <div className="stat-label">Faster Project Completion</div>
            </div>
            <div className="stat">
              <div className="stat-number">$15K</div>
              <div className="stat-label">Average Monthly Savings</div>
            </div>
          </div>
        </div>
      </section>

      <InteractiveDemo />

      <div className="feature-cards">
        <div className="feature-card" style={{ '--card-index': 1 }}>
          <div className="card-icon">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              {/* Input Layer */}
              <circle cx="4" cy="8" r="2" className="node input-node" />
              <circle cx="4" cy="16" r="2" className="node input-node" />

              {/* Hidden Layer */}
              <circle cx="12" cy="6" r="2" className="node hidden-node" />
              <circle cx="12" cy="18" r="2" className="node hidden-node" />

              {/* Output Layer */}
              <circle cx="20" cy="8" r="2" className="node output-node" />
              <circle cx="20" cy="16" r="2" className="node output-node" />

              {/* Connections from Input to Hidden */}
              <path d="M6 8L10 6" className="connection input-connection" />
              <path d="M6 8L10 18" className="connection input-connection" />
              <path d="M6 16L10 6" className="connection input-connection" />
              <path d="M6 16L10 18" className="connection input-connection" />

              {/* Connections from Hidden to Output */}
              <path d="M14 6L18 8" className="connection output-connection" />
              <path d="M14 6L18 16" className="connection output-connection" />
              <path d="M14 18L18 8" className="connection output-connection" />
              <path d="M14 18L18 16" className="connection output-connection" />
            </svg>
          </div>
          <h2>AI-Powered Planning</h2>
          <p>
            Let Flow analyze your project requirements and automatically
            generate structured task breakdowns, saving countless hours of
            planning time.
          </p>
        </div>

        <div className="feature-card" style={{ '--card-index': 2 }}>
          <div className="card-icon">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <rect
                x="3"
                y="3"
                width="18"
                height="18"
                rx="2"
                strokeLinecap="round"
              />
              <path d="M3 9h18" strokeLinecap="round" />
              <path d="M9 3v18" strokeLinecap="round" />
              <circle cx="6" cy="6" r="1" strokeLinecap="round" />
              <circle cx="12" cy="6" r="1" strokeLinecap="round" />
              <rect x="11" y="11" width="4" height="4" strokeLinecap="round" />
              <path d="M15 15l2 2M17 17l-2-2" strokeLinecap="round" />
            </svg>
          </div>
          <h2>Smart Organization</h2>
          <p>
            Intelligent task categorization and priority management helps keep
            your engineering workflow smooth and on track.
          </p>
        </div>

        <div className="feature-card" style={{ '--card-index': 3 }}>
          <div className="card-icon">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M4 4v16h16"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                className="chart-line"
                d="M4 16l4-4 4 2 4-6 4 2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="8" cy="12" r="1" className="chart-point" />
              <circle cx="12" cy="14" r="1" className="chart-point" />
              <circle cx="16" cy="8" r="1" className="chart-point" />
              <circle cx="20" cy="10" r="1" className="chart-point" />
            </svg>
          </div>
          <h2>Progress Tracking</h2>
          <p>
            Visual progress indicators and automated status updates keep your
            entire team aligned and moving forward week after week.
          </p>
        </div>
      </div>

      {/* Comprehensive Features Section */}
      <section className="comprehensive-features">
        <div className="container">
          <h2 className="section-title">Everything You Need to Succeed</h2>
          <div className="features-grid">
            <div className="feature-category">
              <h3>🤖 AI-Powered Features</h3>
              <ul>
                <li>Natural language project description</li>
                <li>Automatic task breakdown and generation</li>
                <li>Intelligent task categorization</li>
                <li>Smart priority management</li>
                <li>AI-driven workflow optimization</li>
              </ul>
            </div>
            <div className="feature-category">
              <h3>📋 Task Management</h3>
              <ul>
                <li>Intuitive Kanban board interface</li>
                <li>Drag-and-drop task organization</li>
                <li>Custom task statuses and workflows</li>
                <li>Task dependencies and relationships</li>
                <li>Bulk task operations</li>
              </ul>
            </div>
            <div className="feature-category">
              <h3>👥 Team Collaboration</h3>
              <ul>
                <li>Real-time team collaboration</li>
                <li>Task assignment and ownership</li>
                <li>Team member activity tracking</li>
                <li>Comment and discussion threads</li>
                <li>Role-based permissions</li>
              </ul>
            </div>
            <div className="feature-category">
              <h3>📊 Analytics & Reporting</h3>
              <ul>
                <li>Project progress visualization</li>
                <li>Team performance metrics</li>
                <li>Time tracking and estimates</li>
                <li>Burndown charts and velocity</li>
                <li>Custom report generation</li>
              </ul>
            </div>
            <div className="feature-category">
              <h3>🔗 Integrations</h3>
              <ul>
                <li>GitHub and GitLab integration</li>
                <li>Slack and Microsoft Teams</li>
                <li>Jira and Linear import</li>
                <li>Calendar and scheduling tools</li>
                <li>API for custom integrations</li>
              </ul>
            </div>
            <div className="feature-category">
              <h3>⚡ Performance & Security</h3>
              <ul>
                <li>Lightning-fast task generation</li>
                <li>Enterprise-grade security</li>
                <li>Data encryption at rest and in transit</li>
                <li>Regular automated backups</li>
                <li>99.9% uptime guarantee</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default LandingPage;
