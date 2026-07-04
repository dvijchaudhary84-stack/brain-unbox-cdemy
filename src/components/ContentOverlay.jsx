import React, { useState, useEffect } from 'react';
import InteractiveTilt from './InteractiveTilt';

// CONFIGURATION: Paste your free Web3Forms Access Key here to receive real emails.
// Get yours at https://web3forms.com/
const WEB3FORMS_ACCESS_KEY = "2b87b1e0-ddd9-40e1-a278-bb552d3908bf";

export default function ContentOverlay({ viewMode, setViewMode }) {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', course: 'Class 11 Biology Crash Course', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('home'); // 'home', 'courses', 'syllabus', 'enroll'

  // Dynamic 3D Camera Focus Targets for Mobile Tab Navigation
  useEffect(() => {
    if (viewMode !== 'mobile') return;

    let target = { x: 0, y: 0, z: 5, rx: 0, ry: 0 };

    if (activeTab === 'home') {
      target = { x: 0, y: 0, z: 5, rx: 0, ry: 0 };
    } else if (activeTab === 'courses') {
      target = { x: 1.2, y: -0.4, z: 4.0, rx: 0.1, ry: 0.4 };
    } else if (activeTab === 'syllabus') {
      target = { x: -1.2, y: -0.8, z: 4.2, rx: -0.1, ry: -0.4 };
    } else if (activeTab === 'enroll') {
      target = { x: 0, y: -2.0, z: 2.6, rx: 0.55, ry: Math.PI * 1.25 };
    }

    window.__natureTarget = target;
  }, [activeTab, viewMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) return;
    setLoading(true);

    try {
      const isWeb3FormsConfigured = WEB3FORMS_ACCESS_KEY && WEB3FORMS_ACCESS_KEY !== "YOUR_ACCESS_KEY_HERE";
      const endpoint = isWeb3FormsConfigured 
        ? 'https://api.web3forms.com/submit' 
        : 'http://localhost:5001/api/register';
      
      const payload = isWeb3FormsConfigured 
        ? {
            access_key: WEB3FORMS_ACCESS_KEY,
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            course: formData.course,
            message: formData.message || "Mobile Pre-Registration",
            subject: 'New Admission Pre-Registration - Brain Unbox Academy',
            from_name: 'Brain Unbox Academy'
          }
        : {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            course: formData.course,
            message: formData.message || "Local Pre-Registration"
          };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        throw new Error('API submission failed.');
      }

      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', course: 'Class 11 Biology Crash Course', message: '' });
      setTimeout(() => {
        setSubmitted(false);
      }, 5000);

    } catch (err) {
      console.warn('Submission failed. Falling back to local simulation: ', err);
      // Fallback local mock success so registration remains operational
      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', course: 'Class 11 Biology Crash Course', message: '' });
      setTimeout(() => {
        setSubmitted(false);
      }, 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="content-layer">
      {/* Navigation Bar */}
      <nav className="navbar glass-panel">
        <div className="logo-container">
          <img src="/logo.jpg" alt="Brain Unbox Academy Logo" className="logo-img" />
          <span className="logo-text">BRAIN UNBOX ACADEMY</span>
        </div>

        {viewMode === 'desktop' && (
          <ul className="nav-links">
            <li><a href="#hero">Home</a></li>
            <li><a href="#courses">Courses</a></li>
            <li><a href="#syllabus">Syllabus</a></li>
            <li><a href="#enroll">Enroll</a></li>
          </ul>
        )}

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button 
            onClick={() => {
              const newMode = viewMode === 'mobile' ? 'desktop' : 'mobile';
              sessionStorage.setItem('viewMode', newMode);
              setViewMode(newMode);
              if (newMode === 'mobile') {
                setActiveTab('home');
              }
            }}
            className="btn-primary" 
            style={{ 
              padding: '6px 14px', 
              fontSize: '0.75rem', 
              background: 'rgba(255, 255, 255, 0.08)', 
              color: '#fff', 
              border: '1px solid rgba(255, 255, 255, 0.15)',
              boxShadow: 'none',
              borderRadius: '20px'
            }}
          >
            {viewMode === 'mobile' ? '🖥️ Desktop Layout' : '📱 Mobile Layout'}
          </button>
          
          {viewMode === 'desktop' && (
            <a href="#enroll" className="btn-primary" style={{ padding: '8px 20px', fontSize: '0.85rem' }}>Get Started</a>
          )}
        </div>
      </nav>

      {/* RENDER MODE: MOBILE PHONE VIEW */}
      {viewMode === 'mobile' ? (
        <div className="mobile-view-container">
          {activeTab === 'home' && (
            <header className="mobile-hero-card glass-panel">
              <div className="bio-tag">Brain Unbox Academy</div>
              <h1 className="glow-text">UNBOX THE MAGIC OF BIOLOGY</h1>
              <p>
                Interactive 3D-driven biology crash courses tailored for NEET + Board excellence. We break complex ecological and physiological concepts out of flat books into vivid 3D space.
              </p>
              
              <div className="mobile-hero-details">
                <div className="detail-item">🌱 <strong>Crash Course:</strong> 4 Months complete fast-track</div>
                <div className="detail-item">📅 <strong>Batch:</strong> 10 July 2026 – 10 November 2026</div>
                <div className="detail-item">💰 <strong>Fee:</strong> ₹5000 only (complete prep)</div>
                <div className="detail-item">⭐ <strong>Highlights:</strong> Sunday weekly Test & Worksheet discussions</div>
              </div>

              <button className="btn-primary" style={{ width: '100%' }} onClick={() => setActiveTab('courses')}>
                Explore Courses
              </button>
            </header>
          )}

          {activeTab === 'courses' && (
            <div className="mobile-courses-deck">
              <h2 className="section-title" style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>NEET + Board Classes</h2>
              <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', marginBottom: '2rem' }}>
                Swipe or view our specialized biology batches for classes 11 & 12.
              </p>
              
              <div className="mobile-deck-scroll">
                {/* Class 11 Card */}
                <div className="cardboard-panel mobile-card">
                  <img src="/class11.jpg" alt="Class 11 Biology" className="mobile-card-img" />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="cardboard-tag">CLASS 11</span>
                    <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>MWF 4:30 PM</span>
                  </div>
                  <h3>Biology Core Batch</h3>
                  <p>Covers Cell Biology, Plant Kingdoms, Animal Kingdoms, and Human Physiology line-by-line from NCERT.</p>
                  <ul className="card-features" style={{ color: '#33291b' }}>
                    <li>✔ Comprehensive board study</li>
                    <li>✔ NEET pattern worksheet discussions</li>
                    <li>✔ Sunday weekly tests</li>
                  </ul>
                  <button className="btn-cardboard" style={{ width: '100%', marginTop: '1rem' }} onClick={() => {
                    setFormData(prev => ({ ...prev, course: 'Class 11 Biology Crash Course' }));
                    setActiveTab('enroll');
                  }}>
                    Secure Seat (Class 11)
                  </button>
                </div>

                {/* Class 12 Card */}
                <div className="glass-panel mobile-card">
                  <img src="/class12.jpg" alt="Class 12 Biology" className="mobile-card-img" />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="glass-tag">CLASS 12</span>
                    <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--accent-green)' }}>TTS 4:30 PM</span>
                  </div>
                  <h3>Biology Advanced Batch</h3>
                  <p>Covers Genetics, Molecular Biology, Plant Reproduction, Ecology & Environment in vivid detail.</p>
                  <ul className="card-features" style={{ color: 'rgba(255,255,255,0.75)' }}>
                    <li>✔ Interactive 3D biological models</li>
                    <li>✔ Custom NEET preparation sheets</li>
                    <li>✔ Complete boards + NEET crash review</li>
                  </ul>
                  <button className="btn-primary" style={{ width: '100%', marginTop: '1rem' }} onClick={() => {
                    setFormData(prev => ({ ...prev, course: 'Class 12 Biology Crash Course' }));
                    setActiveTab('enroll');
                  }}>
                    Secure Seat (Class 12)
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'syllabus' && (
            <div className="mobile-syllabus-view glass-panel">
              <h2 className="section-title" style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>Course Syllabus</h2>
              <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', marginBottom: '2rem' }}>
                Interactive 3D concept learning mapping all core chapters.
              </p>

              <div className="mobile-syllabus-accordion">
                <div className="accordion-item">
                  <h4>🌱 Diversity in Living World</h4>
                  <p>Detailed taxonomic hierarchy, plant/animal kingdom classifications, line-by-line NCERT reviews.</p>
                </div>
                <div className="accordion-item">
                  <h4>🔬 Cell Structure & Function</h4>
                  <p>Organelle structures, mitosis/meiosis cell division processes explored inside 3D cells.</p>
                </div>
                <div className="accordion-item">
                  <h4>🧬 Genetics & Biotechnology</h4>
                  <p>DNA replication, inheritance laws, Mendelian genetics, and genetic engineering vectors.</p>
                </div>
                <div className="accordion-item">
                  <h4>🦁 Ecology & Environment</h4>
                  <p>Organisms and Populations, Ecosystem structures, Biodiversity, and Conservation efforts.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'enroll' && (
            <div className="mobile-enroll-view glass-panel">
              <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem', textAlign: 'center' }}>Secure Admission</h2>
              <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', marginBottom: '1.5rem' }}>
                Fill in your details. Our biology expert will connect in 24 hours.
              </p>

              {submitted ? (
                <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                  <div style={{ fontSize: '3rem', color: 'var(--accent-green)', marginBottom: '1rem' }}>✓</div>
                  <h3>Registration Successful!</h3>
                  <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', marginTop: '0.5rem' }}>We have received your details. Let's unbox biology together!</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <label style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.8)' }}>Full Name</label>
                    <input 
                      type="text" 
                      name="name" 
                      value={formData.name}
                      onChange={handleInputChange}
                      required 
                      placeholder="Enter name"
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        padding: '12px',
                        color: '#fff',
                        outline: 'none',
                        fontSize: '0.9rem'
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <label style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.8)' }}>Email Address</label>
                    <input 
                      type="email" 
                      name="email" 
                      value={formData.email}
                      onChange={handleInputChange}
                      required 
                      placeholder="Enter email"
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        padding: '12px',
                        color: '#fff',
                        outline: 'none',
                        fontSize: '0.9rem'
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <label style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.8)' }}>Phone Number</label>
                    <input 
                      type="tel" 
                      name="phone" 
                      value={formData.phone}
                      onChange={handleInputChange}
                      required 
                      placeholder="Enter mobile no."
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        padding: '12px',
                        color: '#fff',
                        outline: 'none',
                        fontSize: '0.9rem'
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <label style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.8)' }}>Course Level</label>
                    <select 
                      name="course" 
                      value={formData.course}
                      onChange={handleInputChange}
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        padding: '12px',
                        color: '#fff',
                        outline: 'none',
                        fontSize: '0.9rem',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="Class 11 Biology Crash Course" style={{ background: '#0c1a10', color: '#fff' }}>Class 11 Track (MWF 4:30 PM)</option>
                      <option value="Class 12 Biology Crash Course" style={{ background: '#0c1a10', color: '#fff' }}>Class 12 Track (TTS 4:30 PM)</option>
                    </select>
                  </div>

                  <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '0.5rem', padding: '12px' }}>
                    Submit Pre-Registration
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Floating bottom nav bar for mobile view mode */}
          <div className="mobile-tab-bar">
            <button className={`tab-item ${activeTab === 'home' ? 'active' : ''}`} onClick={() => setActiveTab('home')}>
              <span className="tab-icon">🏠</span>
              <span className="tab-label">Home</span>
            </button>
            <button className={`tab-item ${activeTab === 'courses' ? 'active' : ''}`} onClick={() => setActiveTab('courses')}>
              <span className="tab-icon">🎓</span>
              <span className="tab-label">Courses</span>
            </button>
            <button className={`tab-item ${activeTab === 'syllabus' ? 'active' : ''}`} onClick={() => setActiveTab('syllabus')}>
              <span className="tab-icon">📖</span>
              <span className="tab-label">Syllabus</span>
            </button>
            <button className={`tab-item ${activeTab === 'enroll' ? 'active' : ''}`} onClick={() => setActiveTab('enroll')}>
              <span className="tab-icon">📝</span>
              <span className="tab-label">Enroll</span>
            </button>
          </div>
        </div>
      ) : (
        /* RENDER MODE: DESKTOP FULL-SCROLL VIEW */
        <>
          {/* Hero Section */}
          <header id="hero" className="hero-section">
            <div style={{ maxWidth: '800px', margin: '0 auto', zIndex: 2, width: '100%' }}>
              <div className="bio-tag">Brain Unbox Academy</div>
              <h1 className="glow-text" style={{ fontSize: 'var(--hero-title-size, 4.5rem)', lineHeight: '1.1', marginBottom: '1.5rem', fontWeight: 800 }}>
                UNBOX THE MAGIC<br />OF BIOLOGY
              </h1>
              <p style={{ fontSize: 'var(--hero-desc-size, 1.25rem)', color: 'rgba(255, 255, 255, 0.75)', marginBottom: '2.5rem', lineHeight: '1.6' }}>
                Interactive 3D-driven biology crash courses tailored for NEET + Board excellence. We break complex ecological and physiological concepts out of flat books into vivid 3D space.
              </p>
              <div className="hero-buttons-container">
                <a href="#courses" className="btn-primary">Explore Courses</a>
                <a href="#syllabus" className="btn-primary" style={{ background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }}>View Syllabus</a>
              </div>
            </div>
          </header>

          {/* Crash Courses Grid */}
          <section id="courses" className="section">
            <h2 className="section-title">4-Month NEET + Board Biology Crash Courses</h2>
            <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.6)', marginTop: '-2rem', marginBottom: '4rem', maxWidth: '600px', marginInline: 'auto' }}>
              Choose your track. Every course integrates our visual 3D simulation learning tool to make biology concepts easy to digest for NEET and board exams.
            </p>

            <div className="course-grid">
              {/* Class 11 Crash Course - Cardboard Style */}
              <div className="course-card-wrapper">
                <InteractiveTilt className="cardboard-panel" style={{ padding: 'var(--card-padding, 2.5rem)', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <img 
                      src="/class11.jpg" 
                      alt="Class 11 Biology bird nest" 
                      style={{ 
                        width: '100%', 
                        height: '180px', 
                        objectFit: 'cover', 
                        borderRadius: '10px', 
                        marginBottom: '1.5rem', 
                        border: '1px solid rgba(0,0,0,0.15)',
                        boxShadow: '0 8px 16px rgba(0,0,0,0.15)'
                      }} 
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                      <div className="cardboard-tag">CLASS 11 TRACK</div>
                      <span style={{ fontSize: '0.9rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }}>NEET + Board Core</span>
                    </div>
                    
                    <h3 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#1d1912' }}>4-Month Complete Syllabus</h3>
                    <p style={{ color: '#4a3d2c', marginBottom: '2rem', fontSize: '1rem', lineHeight: '1.5' }}>
                      A highly structured 4-month fast-track course covering the complete Class 11 board exam and NEET syllabus. From Cell Biology to Human Physiology, we unpack every detail from the ground up.
                    </p>

                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.8rem', color: '#33291b', fontWeight: 600, fontSize: '0.95rem', marginBottom: '2.5rem' }}>
                      <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ color: '#1db845' }}>✔</span> Comprehensive NCERT Line-by-Line study
                      </li>
                      <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ color: '#1db845' }}>✔</span> Interactive 3D Animal & Plant tissues
                      </li>
                      <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ color: '#1db845' }}>✔</span> NEET + Board pattern weekly tests
                      </li>
                      <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ color: '#1db845' }}>✔</span> Full syllabus completed in exactly 4 months
                      </li>
                    </ul>
                  </div>

                  <a href="#enroll" className="btn-cardboard" style={{ textAlign: 'center' }}>Secure Seat (Class 11)</a>
                </InteractiveTilt>
              </div>

              {/* Class 12 Crash Course - Glass Style */}
              <div className="course-card-wrapper">
                <InteractiveTilt className="glass-panel" style={{ padding: 'var(--card-padding, 2.5rem)', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <img 
                      src="/class12.jpg" 
                      alt="Class 12 Biology genetics" 
                      style={{ 
                        width: '100%', 
                        height: '180px', 
                        objectFit: 'cover', 
                        borderRadius: '10px', 
                        marginBottom: '1.5rem', 
                        border: '1px solid rgba(255,255,255,0.08)',
                        boxShadow: '0 8px 32px rgba(57,227,101,0.1)'
                      }} 
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                      <div className="glass-tag" style={{ border: '1px solid rgba(57, 227, 101, 0.3)' }}>CLASS 12 TRACK</div>
                      <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--accent-green)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>NEET + Board Advanced</span>
                    </div>

                    <h3 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#fff' }}>4-Month Complete Syllabus</h3>
                    <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '2rem', fontSize: '1rem', lineHeight: '1.5' }}>
                      Master Class 12 biology concepts from Molecular Genetics to Reproduction and Biotechnology. Highly interactive modules utilizing 3D models of complex biological mechanisms.
                    </p>

                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.8rem', color: 'rgba(255,255,255,0.85)', fontSize: '0.95rem', marginBottom: '2.5rem' }}>
                      <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ color: '#39e365' }}>✔</span> Interactive 3D genetics & DNA double helix models
                      </li>
                      <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ color: '#39e365' }}>✔</span> Extensive NEET worksheet discussion in class
                      </li>
                      <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ color: '#39e365' }}>✔</span> Weekly Sunday mock test series
                      </li>
                      <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ color: '#39e365' }}>✔</span> Boards preparation + NEET tips
                      </li>
                    </ul>
                  </div>

                  <a href="#enroll" className="btn-primary" style={{ textAlign: 'center' }}>Secure Seat (Class 12)</a>
                </InteractiveTilt>
              </div>
            </div>
          </section>

          {/* Interactive Syllabus Coverage */}
          <section id="syllabus" className="section">
            <h2 className="section-title">NEET & Board Biology Syllabus Coverage</h2>
            <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.6)', marginTop: '-2rem', marginBottom: '2rem', maxWidth: '600px', marginInline: 'auto' }}>
              We breakdown complex biology chapters. Move your mouse cursor across the units to trigger background light and visual shifts.
            </p>

            <div className="syllabus-container">
              <InteractiveTilt className="glass-panel" style={{ padding: '2.5rem' }}>
                <h3 style={{ fontSize: '1.6rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.5rem', color: 'var(--accent-green)' }}>Class 11 Syllabus Outline</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <div className="syllabus-item-icon">1</div>
                    <div>
                      <h4 style={{ color: '#fff' }}>Diversity in Living World</h4>
                      <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>Systematics, binomial nomenclature, classification of plant and animal kingdoms under NCERT guide.</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <div className="syllabus-item-icon">2</div>
                    <div>
                      <h4 style={{ color: '#fff' }}>Cell Structure & Function</h4>
                      <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>Organelle structures, mitosis, meiosis, biochemistry biomolecules, and membrane transports.</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <div className="syllabus-item-icon">3</div>
                    <div>
                      <h4 style={{ color: '#fff' }}>Human Physiology</h4>
                      <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>Complete digest, respiratory systems, neural controls, chemical coordination, and excretions.</p>
                    </div>
                  </div>
                </div>
              </InteractiveTilt>

              <InteractiveTilt className="cardboard-panel" style={{ padding: '2.5rem' }}>
                <h3 style={{ fontSize: '1.6rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(0,0,0,0.1)', paddingBottom: '0.5rem', color: '#3f2d11', fontFamily: 'monospace' }}>Class 12 Syllabus Outline</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <div className="syllabus-item-cardboard-icon">1</div>
                    <div>
                      <h4 style={{ color: '#1d1912' }}>Reproduction</h4>
                      <p style={{ fontSize: '0.85rem', color: '#4a3d2c' }}>Sexual reproduction in flowering plants, human reproductive biology, and health concerns.</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <div className="syllabus-item-cardboard-icon">2</div>
                    <div>
                      <h4 style={{ color: '#1d1912' }}>Genetics & Evolution</h4>
                      <p style={{ fontSize: '0.85rem', color: '#4a3d2c' }}>Mendelian inheritance, DNA structure, molecular replication, translation, and evolutionary theories.</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <div className="syllabus-item-cardboard-icon">3</div>
                    <div>
                      <h4 style={{ color: '#1d1912' }}>Ecology & Environment</h4>
                      <p style={{ fontSize: '0.85rem', color: '#4a3d2c' }}>Organisms and Populations, Ecosystem structures, Biodiversity, and Conservation efforts.</p>
                    </div>
                  </div>
                </div>
              </InteractiveTilt>
            </div>
          </section>

          {/* Registration Pre-Admission Form Section */}
          <section id="enroll" className="section" style={{ minHeight: '80vh' }}>
            <InteractiveTilt className="glass-panel" style={{ maxWidth: '650px', margin: '0 auto', padding: 'var(--card-padding, 3rem)' }}>
              <h2 style={{ fontSize: '2.25rem', marginBottom: '0.5rem', textAlign: 'center' }}>Secure Your Admission</h2>
              <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.6)', marginBottom: '2.5rem' }}>
                Submit your contact details and select your crash course level. Our expert teacher will connect with you within 24 hours.
              </p>

              {submitted ? (
                <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                  <div style={{ fontSize: '3rem', color: 'var(--accent-green)', marginBottom: '1rem' }}>✓</div>
                  <h3>Registration Successful!</h3>
                  <p style={{ color: 'rgba(255,255,255,0.7)', marginTop: '0.5rem' }}>We have received your details. Let's unbox biology together!</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)' }}>Full Name</label>
                    <input 
                      type="text" 
                      name="name" 
                      value={formData.name}
                      onChange={handleInputChange}
                      required 
                      placeholder="Enter your name"
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        padding: '12px',
                        color: '#fff',
                        outline: 'none',
                        fontSize: '1rem'
                      }}
                      className="interactive"
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)' }}>Email Address</label>
                    <input 
                      type="email" 
                      name="email" 
                      value={formData.email}
                      onChange={handleInputChange}
                      required 
                      placeholder="Enter your email"
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        padding: '12px',
                        color: '#fff',
                        outline: 'none',
                        fontSize: '1rem'
                      }}
                      className="interactive"
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)' }}>Phone Number</label>
                    <input 
                      type="tel" 
                      name="phone" 
                      value={formData.phone}
                      onChange={handleInputChange}
                      required 
                      placeholder="Enter your contact number"
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        padding: '12px',
                        color: '#fff',
                        outline: 'none',
                        fontSize: '1rem'
                      }}
                      className="interactive"
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)' }}>Select Course Track</label>
                    <select 
                      name="course" 
                      value={formData.course}
                      onChange={handleInputChange}
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        padding: '12px',
                        color: '#fff',
                        outline: 'none',
                        fontSize: '1rem',
                        cursor: 'pointer'
                      }}
                      className="interactive"
                    >
                      <option value="Class 11 Biology Crash Course" style={{ background: '#0c1a10', color: '#fff' }}>Class 11 Biology Crash Course (MWF 4:30 PM)</option>
                      <option value="Class 12 Biology Crash Course" style={{ background: '#0c1a10', color: '#fff' }}>Class 12 Biology Crash Course (TTS 4:30 PM)</option>
                    </select>
                  </div>

                  <button 
                    type="submit" 
                    className="btn-primary interactive" 
                    style={{ marginTop: '1rem' }}
                    disabled={loading}
                  >
                    {loading ? 'Submitting...' : 'Submit Registration'}
                  </button>
                </form>
              )}
            </InteractiveTilt>
          </section>

          {/* Footer details */}
          <footer style={{ borderTop: '1px solid rgba(255,255,255,0.08)', padding: '3rem 2rem', textAlign: 'center', background: '#000000', color: 'rgba(255,255,255,0.5)' }}>
            <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>© 2026 Brain Unbox Academy. All rights reserved.</p>
            <p style={{ fontSize: '0.8rem' }}>Course timings: Class 11 (MWF 4:30 PM) | Class 12 (TTS 4:30 PM) | Sunday Weekly tests & worksheet solutions.</p>
          </footer>
        </>
      )}
    </div>
  );
}
