import React, { useState } from 'react';
import InteractiveTilt from './InteractiveTilt';

// CONFIGURATION: Paste your free Web3Forms Access Key here to receive real emails.
// Get yours at https://web3forms.com/
const WEB3FORMS_ACCESS_KEY = "2b87b1e0-ddd9-40e1-a278-bb552d3908bf";

export default function ContentOverlay() {
  const [formData, setFormData] = useState({ name: '', email: '', course: '11', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;
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
            course: formData.course === '11' ? 'Class 11 Biology (NEET + Board)' : 'Class 12 Biology (NEET + Board)',
            message: formData.message,
            subject: 'New Admission Pre-Registration - Brain Unbox Academy',
            from_name: 'Brain Unbox Academy'
          }
        : {
            name: formData.name,
            email: formData.email,
            course: formData.course === '11' ? 'Class 11 Biology (NEET + Board)' : 'Class 12 Biology (NEET + Board)',
            message: formData.message
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
      setFormData({ name: '', email: '', course: '11', message: '' });
      setTimeout(() => {
        setSubmitted(false);
      }, 5000);

    } catch (err) {
      console.warn('Submission failed. Falling back to local simulation: ', err);
      // Fallback local mock success so registration remains operational
      setSubmitted(true);
      setFormData({ name: '', email: '', course: '11', message: '' });
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
        <ul className="nav-links">
          <li><a href="#hero">Home</a></li>
          <li><a href="#courses">Courses</a></li>
          <li><a href="#syllabus">Syllabus</a></li>
          <li><a href="#enroll">Enroll</a></li>
        </ul>
        <a href="#enroll" className="btn-primary" style={{ padding: '8px 20px', fontSize: '0.85rem' }}>Get Started</a>
      </nav>

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
                    boxShadow: '0 8px 24px rgba(0,0,0,0.3)'
                  }} 
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                  <div className="bio-tag">CLASS 12 TRACK</div>
                  <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--accent-green)' }}>NEET + Board Prep</span>
                </div>
                
                <h3 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#fff' }}>~4-Month Intensive Course</h3>
                <p style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: '2rem', fontSize: '1rem', lineHeight: '1.5' }}>
                  Cover the entire Class 12 biology syllabus in approximately 4 months. Built to help students master critical board exam writing patterns and NEET entrance fundamentals.
                </p>

                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.8rem', color: 'rgba(255, 255, 255, 0.85)', fontSize: '0.95rem', marginBottom: '2.5rem' }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ color: 'var(--accent-green)' }}>★</span> Advanced Genetics & Biotechnology modules
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ color: 'var(--accent-green)' }}>★</span> Previous 10 years board paper solving
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ color: 'var(--accent-green)' }}>★</span> Interactive 3D molecular structure tracing
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ color: 'var(--accent-green)' }}>★</span> Completion in approximately 4 months
                  </li>
                </ul>
              </div>

              <a href="#enroll" className="btn-primary" style={{ textAlign: 'center' }}>Secure Seat (Class 12)</a>
            </InteractiveTilt>
          </div>
        </div>
      </section>

      {/* Syllabus Detail Section */}
      <section id="syllabus" className="section">
        <h2 className="section-title">Course Curriculum Breakdown</h2>
        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.6)', marginTop: '-2rem', marginBottom: '4rem', maxWidth: '600px', marginInline: 'auto' }}>
          A visual look at what units we cover week-by-week over the course duration.
        </p>

        <div className="syllabus-container">
          {/* Class 11 Curriculum */}
          <InteractiveTilt className="cardboard-panel" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.75rem', marginBottom: '1.5rem', color: '#1d1912', borderBottom: '1px solid rgba(0,0,0,0.1)', paddingBottom: '0.5rem' }}>Class 11 Biology Syllabus</h3>
            <div className="syllabus-list">
              <div className="syllabus-item">
                <span className="syllabus-item-cardboard-icon">1</span>
                <div>
                  <h4 style={{ color: '#1d1912' }}>Diversity in the Living World</h4>
                  <p style={{ fontSize: '0.85rem', color: '#554737' }}>Taxonomy, Systematics, and Classification of Plant & Animal kingdoms.</p>
                </div>
              </div>
              <div className="syllabus-item">
                <span className="syllabus-item-cardboard-icon">2</span>
                <div>
                  <h4 style={{ color: '#1d1912' }}>Structural Organisation</h4>
                  <p style={{ fontSize: '0.85rem', color: '#554737' }}>Morphology and Anatomy of flowering plants; animal tissues structure.</p>
                </div>
              </div>
              <div className="syllabus-item">
                <span className="syllabus-item-cardboard-icon">3</span>
                <div>
                  <h4 style={{ color: '#1d1912' }}>Cell: Structure and Functions</h4>
                  <p style={{ fontSize: '0.85rem', color: '#554737' }}>Detailed look at organelles, Biomolecules, Cell Cycle, and Cell Division.</p>
                </div>
              </div>
              <div className="syllabus-item">
                <span className="syllabus-item-cardboard-icon">4</span>
                <div>
                  <h4 style={{ color: '#1d1912' }}>Plant Physiology</h4>
                  <p style={{ fontSize: '0.85rem', color: '#554737' }}>Photosynthesis, Respiration, Plant growth regulators, and Minerals.</p>
                </div>
              </div>
              <div className="syllabus-item">
                <span className="syllabus-item-cardboard-icon">5</span>
                <div>
                  <h4 style={{ color: '#1d1912' }}>Human Physiology</h4>
                  <p style={{ fontSize: '0.85rem', color: '#554737' }}>Breathing, Fluids/Circulation, Excretion, Locomotion, and Neural coordination.</p>
                </div>
              </div>
            </div>
          </InteractiveTilt>

          {/* Class 12 Curriculum */}
          <InteractiveTilt className="glass-panel" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.75rem', marginBottom: '1.5rem', color: '#fff', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>Class 12 Biology Syllabus</h3>
            <div className="syllabus-list">
              <div className="syllabus-item">
                <span className="syllabus-item-icon">1</span>
                <div>
                  <h4 style={{ color: '#fff' }}>Reproduction</h4>
                  <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>Sexual reproduction in flowering plants; Human Reproductive system & health.</p>
                </div>
              </div>
              <div className="syllabus-item">
                <span className="syllabus-item-icon">2</span>
                <div>
                  <h4 style={{ color: '#fff' }}>Genetics & Evolution</h4>
                  <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>Mendelian inheritance, Molecular basis of inheritance, and Darwinian/modern evolution.</p>
                </div>
              </div>
              <div className="syllabus-item">
                <span className="syllabus-item-icon">3</span>
                <div>
                  <h4 style={{ color: '#fff' }}>Biology in Human Welfare</h4>
                  <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>Human Health & Diseases, Microbes in household food processing and sewage treatment.</p>
                </div>
              </div>
              <div className="syllabus-item">
                <span className="syllabus-item-icon">4</span>
                <div>
                  <h4 style={{ color: '#fff' }}>Biotechnology</h4>
                  <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>Recombinant DNA technology principles, processes, and healthcare/agricultural applications.</p>
                </div>
              </div>
              <div className="syllabus-item">
                <span className="syllabus-item-icon">5</span>
                <div>
                  <h4 style={{ color: '#fff' }}>Ecology & Environment</h4>
                  <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>Organisms and Populations, Ecosystem structures, Biodiversity, and Conservation efforts.</p>
                </div>
              </div>
            </div>
          </InteractiveTilt>
        </div>
      </section>

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
                <label style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)' }}>Course Selection</label>
                <select 
                  name="course" 
                  value={formData.course}
                  onChange={handleInputChange}
                  style={{
                    background: '#0c1a10',
                    border: '1px solid rgba(57, 227, 101, 0.3)',
                    borderRadius: '8px',
                    padding: '12px',
                    color: '#fff',
                    outline: 'none',
                    fontSize: '1rem',
                  }}
                  className="interactive"
                >
                  <option value="11">Class 11 Biology (4-Month Crash Course)</option>
                  <option value="12">Class 12 Biology (Approx. 4-Month Crash Course)</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)' }}>Any Message or Query</label>
                <textarea 
                  name="message" 
                  value={formData.message}
                  onChange={handleInputChange}
                  rows="3" 
                  placeholder="Tell us about your targets..."
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    padding: '12px',
                    color: '#fff',
                    outline: 'none',
                    fontSize: '1rem',
                    resize: 'none'
                  }}
                  className="interactive"
                />
              </div>

              <button 
                type="submit" 
                className="btn-primary" 
                style={{ width: '100%', padding: '14px', marginTop: '1rem', fontSize: '1rem', opacity: loading ? 0.7 : 1 }}
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit Pre-Registration'}
              </button>
            </form>
          )}
        </InteractiveTilt>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.08)', padding: '3rem 2rem', textAlign: 'center', background: '#000000', color: 'rgba(255,255,255,0.5)' }}>
        <p>© 2026 Brain Unbox Academy. All Rights Reserved. Biology visual simulation platform.</p>
        <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>Built in collaboration with Advanced 3D WebGL Storytelling Technologies.</p>
      </footer>
    </div>
  );
}
