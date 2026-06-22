import React, { useState } from 'react';
import { supabase } from './supabaseClient';
import './App.css';

function App() {
  const [currentScreen, setCurrentScreen] = useState(1);
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [cityLocation, setCityLocation] = useState('');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [timeline, setTimeline] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const goTo = (n) => {
    setErrors({});
    setCurrentScreen(n);
  };

  // Step 2 validation: Contact details
  const validateStep2 = () => {
    const newErrors = {};
    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^[+0-9\s-]{8,20}$/.test(phoneNumber.trim())) {
      newErrors.phoneNumber = 'Please enter a valid phone number (8-20 digits)';
    }

    if (!emailAddress.trim()) {
      newErrors.emailAddress = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(emailAddress)) {
      newErrors.emailAddress = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Step 3 validation: Company & Product Requirement
  const validateStep3 = () => {
    const newErrors = {};
    if (!companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    }
    if (!cityLocation.trim()) {
      newErrors.cityLocation = 'City / Location is required';
    }
    if (selectedProducts.length === 0) {
      newErrors.product = 'Please select at least one product';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Step 4 validation: Order Timeline
  const validateStep4 = () => {
    const newErrors = {};
    if (!timeline) {
      newErrors.timeline = 'Please select your order timeline';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep2 = () => {
    if (validateStep2()) {
      goTo(3);
    }
  };

  const handleNextStep3 = () => {
    if (validateStep3()) {
      goTo(4);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep4()) return;
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('leads')
        .insert([
          {
            full_name: fullName.trim(),
            phone_number: phoneNumber.trim(),
            email_address: emailAddress.trim(),
            company_name: companyName.trim(),
            city_location: cityLocation.trim(),
            product_interest: selectedProducts.join(', '),
            order_timeline: timeline
          }
        ]);
      if (error) throw error;
      goTo(5);
    } catch (err) {
      console.error("Error inserting lead:", err);
      setErrors({ submit: `Database Error: ${err.message || 'Failed to submit form. Please check that the leads table exists and RLS is disabled.'}` });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="app-layout">
      {/* Dynamic colorful decorative background blobs */}
      <div className="bg-blob blob-1"></div>
      <div className="bg-blob blob-2"></div>
      <div className="bg-blob blob-3"></div>

      <div className="form-card-container">
        {/* Brand header above card */}
        <header className="brand-header">
          <div className="brand-logo-container">
            <span className="brand-logo-text">AERON COMPOSITE</span>
            <span className="brand-tagline">THE COMPOSITE EXPERT</span>
          </div>
        </header>

        <div className="form-card">
          {/* Progress Header: Show only on step 2, 3, 4 */}
          {currentScreen >= 2 && currentScreen <= 4 && (
            <div className="progress-section">
              <div className="progress-tracker">
                <div className="progress-track-bg"></div>
                <div 
                  className="progress-track-fill" 
                  style={{ width: `${((currentScreen - 2) / 2) * 100}%` }}
                ></div>
                
                <div className={`step-node ${currentScreen >= 2 ? 'active' : ''} ${currentScreen > 2 ? 'completed' : ''}`}>
                  <div className="node-dot">{currentScreen > 2 ? '✓' : '1'}</div>
                  <span className="node-label">Contact</span>
                </div>
                
                <div className={`step-node ${currentScreen >= 3 ? 'active' : ''} ${currentScreen > 3 ? 'completed' : ''}`}>
                  <div className="node-dot">{currentScreen > 3 ? '✓' : '2'}</div>
                  <span className="node-label">Requirement</span>
                </div>
                
                <div className={`step-node ${currentScreen >= 4 ? 'active' : ''} ${currentScreen > 4 ? 'completed' : ''}`}>
                  <div className="node-dot">{currentScreen > 4 ? '✓' : '3'}</div>
                  <span className="node-label">Timeline</span>
                </div>
              </div>
            </div>
          )}

          {/* SCREEN 1: WELCOME INTRO */}
          {currentScreen === 1 && (
            <div className="form-step active-step" id="step-intro">
              <div className="hero-badge">TÜV SÜD CERTIFIED &middot; EXPORTING TO 32+ COUNTRIES</div>
              <h1 className="step-h1">Get a Free FRP/GRP Product Quote</h1>
              <p className="step-p">
                Tell us your requirement and our engineering team will get back to you within 24 hours with custom pricing and technical datasheet.
              </p>
              
              <div className="value-props">
                <div className="prop-item">
                  <div className="prop-icon">✓</div>
                  <div className="prop-text">
                    <strong>RoHS & REACH Compliant</strong>
                    <span>High quality raw materials only</span>
                  </div>
                </div>
                <div className="prop-item">
                  <div className="prop-icon">✓</div>
                  <div className="prop-text">
                    <strong>800+ Global Clients</strong>
                    <span>Trusted globally for industrial composite solutions</span>
                  </div>
                </div>
                <div className="prop-item">
                  <div className="prop-icon">✓</div>
                  <div className="prop-text">
                    <strong>Quick Turnaround</strong>
                    <span>Quotes prepared within 24 hours</span>
                  </div>
                </div>
              </div>

              <div className="btn-actions">
                <button className="btn-next" onClick={() => goTo(2)}>
                  Start Request 
                  <span className="arrow-icon">→</span>
                </button>
              </div>
            </div>
          )}

          {/* SCREEN 2: CONTACT DETAILS */}
          {currentScreen === 2 && (
            <div className="form-step active-step" id="step-contact">
              <div className="step-header">
                <span className="step-tag">Step 1 of 3</span>
                <h2 className="step-h2">Your Contact Details</h2>
                <p className="step-sub">Please fill in your primary details so our team can send the quote directly.</p>
              </div>

              <div className="form-groups">
                <div className={`form-group ${errors.fullName ? 'has-error' : ''}`}>
                  <label htmlFor="fullName" className="input-label">Full Name</label>
                  <div className="input-wrapper">
                    <input 
                      id="fullName"
                      type="text" 
                      className="input-control" 
                      placeholder="e.g. Rajesh Kumar" 
                      value={fullName}
                      onChange={(e) => {
                        setFullName(e.target.value);
                        if (errors.fullName) setErrors(prev => ({ ...prev, fullName: '' }));
                      }}
                    />
                  </div>
                  {errors.fullName && <span className="error-message">{errors.fullName}</span>}
                </div>

                <div className={`form-group ${errors.phoneNumber ? 'has-error' : ''}`}>
                  <label htmlFor="phoneNumber" className="input-label">Phone Number</label>
                  <div className="input-wrapper">
                    <input 
                      id="phoneNumber"
                      type="tel" 
                      className="input-control" 
                      placeholder="e.g. +91 98765 43210" 
                      value={phoneNumber}
                      onChange={(e) => {
                        setPhoneNumber(e.target.value);
                        if (errors.phoneNumber) setErrors(prev => ({ ...prev, phoneNumber: '' }));
                      }}
                    />
                  </div>
                  {errors.phoneNumber && <span className="error-message">{errors.phoneNumber}</span>}
                </div>

                <div className={`form-group ${errors.emailAddress ? 'has-error' : ''}`}>
                  <label htmlFor="emailAddress" className="input-label">Email Address</label>
                  <div className="input-wrapper">
                    <input 
                      id="emailAddress"
                      type="email" 
                      className="input-control" 
                      placeholder="e.g. rajesh@company.com" 
                      value={emailAddress}
                      onChange={(e) => {
                        setEmailAddress(e.target.value);
                        if (errors.emailAddress) setErrors(prev => ({ ...prev, emailAddress: '' }));
                      }}
                    />
                  </div>
                  {errors.emailAddress && <span className="error-message">{errors.emailAddress}</span>}
                </div>
              </div>

              <div className="btn-actions flex-buttons">
                <button className="btn-back" onClick={() => goTo(1)}>Back</button>
                <button className="btn-next" onClick={handleNextStep2}>Continue</button>
              </div>
            </div>
          )}

          {/* SCREEN 3: REQUIREMENT DETAILS */}
          {currentScreen === 3 && (
            <div className="form-step active-step" id="step-requirement">
              <div className="step-header">
                <span className="step-tag">Step 2 of 3</span>
                <h2 className="step-h2">Tell us about your requirement</h2>
                <p className="step-sub">We supply custom engineered composite structures. Select all products that apply.</p>
              </div>

              <div className="form-groups">
                <div className={`form-group ${errors.companyName ? 'has-error' : ''}`}>
                  <label htmlFor="companyName" className="input-label">Company Name</label>
                  <input 
                    id="companyName"
                    type="text" 
                    className="input-control" 
                    placeholder="e.g. ABC Engineering Pvt Ltd" 
                    value={companyName}
                    onChange={(e) => {
                      setCompanyName(e.target.value);
                      if (errors.companyName) setErrors(prev => ({ ...prev, companyName: '' }));
                    }}
                  />
                  {errors.companyName && <span className="error-message">{errors.companyName}</span>}
                </div>

                <div className={`form-group ${errors.cityLocation ? 'has-error' : ''}`}>
                  <label htmlFor="cityLocation" className="input-label">City / Location</label>
                  <input 
                    id="cityLocation"
                    type="text" 
                    className="input-control" 
                    placeholder="e.g. Vadodara, Gujarat" 
                    value={cityLocation}
                    onChange={(e) => {
                      setCityLocation(e.target.value);
                      if (errors.cityLocation) setErrors(prev => ({ ...prev, cityLocation: '' }));
                    }}
                  />
                  {errors.cityLocation && <span className="error-message">{errors.cityLocation}</span>}
                </div>

                <div className={`form-group ${errors.product ? 'has-error' : ''}`}>
                  <label className="input-label">Which products are you interested in? (Select all that apply)</label>
                  <div className="option-cards-grid">
                    {[
                      { val: 'FRP/GRP Gratings', title: 'FRP/GRP Gratings', desc: 'Molded & pultruded gratings' },
                      { val: 'FRP/GRP Ladders', title: 'FRP/GRP Ladders', desc: 'Cage & step ladders' },
                      { val: 'Gigabar FRP Rebar', title: 'Gigabar FRP Rebar', desc: 'Non-corrosive concrete reinforcement' },
                      { val: 'Rail Chocks / Stoppers', title: 'Rail Chocks / Stoppers', desc: 'Safety wheel chocks' },
                      { val: 'Other / Not sure yet', title: 'Other / Custom Structural', desc: 'Profiles, handrails, cable trays' }
                    ].map((opt) => {
                      const isSelected = selectedProducts.includes(opt.val);
                      return (
                        <div 
                          key={opt.val} 
                          className={`option-card ${isSelected ? 'selected' : ''}`}
                          onClick={() => {
                            let updated;
                            if (isSelected) {
                              updated = selectedProducts.filter(item => item !== opt.val);
                            } else {
                              updated = [...selectedProducts, opt.val];
                            }
                            setSelectedProducts(updated);
                            if (errors.product) setErrors(prev => ({ ...prev, product: '' }));
                          }}
                        >
                          <div className="card-selector-circle">
                            {isSelected && <div className="selector-inner"></div>}
                          </div>
                          <div className="card-content">
                            <span className="card-title">{opt.title}</span>
                            <span className="card-desc">{opt.desc}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {errors.product && <span className="error-message">{errors.product}</span>}
                </div>
              </div>

              <div className="btn-actions flex-buttons">
                <button className="btn-back" onClick={() => goTo(2)}>Back</button>
                <button className="btn-next" onClick={handleNextStep3}>Continue</button>
              </div>
            </div>
          )}

          {/* SCREEN 4: TIMELINE + PRIVACY + SUBMIT */}
          {currentScreen === 4 && (
            <div className="form-step active-step" id="step-submit">
              <div className="step-header">
                <span className="step-tag">Step 3 of 3</span>
                <h2 className="step-h2">Almost done</h2>
                <p className="step-sub">Select your project schedule to help our sales managers prioritize your request.</p>
              </div>

              <div className="form-groups">
                <div className={`form-group ${errors.timeline ? 'has-error' : ''}`}>
                  <label className="input-label">What is your order timeline?</label>
                  <div className="option-cards-grid text-only-grid">
                    {[
                      { val: 'Immediately (within 1 week)', label: 'Immediately (within 1 week)' },
                      { val: 'Within 1 month', label: 'Within 1 month' },
                      { val: '1 to 3 months', label: '1 to 3 months' },
                      { val: 'Just exploring options', label: 'Just exploring options / RFQ' }
                    ].map((opt) => (
                      <div 
                        key={opt.val} 
                        className={`option-card text-only-card ${timeline === opt.val ? 'selected' : ''}`}
                        onClick={() => {
                          setTimeline(opt.val);
                          if (errors.timeline) setErrors(prev => ({ ...prev, timeline: '' }));
                        }}
                      >
                        <div className="card-selector-circle">
                          {timeline === opt.val && <div className="selector-inner"></div>}
                        </div>
                        <span className="card-title">{opt.label}</span>
                      </div>
                    ))}
                  </div>
                  {errors.timeline && <span className="error-message">{errors.timeline}</span>}
                </div>
              </div>

              <div className="privacy-disclosure">
                <div className="disclosure-icon">🔒</div>
                <p className="disclosure-text">
                  By submitting this form, you agree to share your information with Aeron Composite Limited, who will use it in accordance with their <a href="https://www.aeroncomposite.com/privacy-policy" target="_blank" rel="noopener noreferrer">privacy policy</a>.
                </p>
              </div>

              {errors.submit && <div className="form-submit-error">{errors.submit}</div>}

              <div className="btn-actions flex-buttons">
                <button className="btn-back" onClick={() => goTo(3)} disabled={isSubmitting}>Back</button>
                <button 
                  className="btn-submit" 
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="spinner-container">
                      <span className="spinner"></span> Submitting...
                    </span>
                  ) : (
                    'Submit Request'
                  )}
                </button>
              </div>
            </div>
          )}

          {/* SCREEN 5: THANK YOU / SUCCESS */}
          {currentScreen === 5 && (
            <div className="form-step active-step success-step" id="step-thankyou">
              <div className="success-icon-wrap">
                <div className="success-circle">
                  <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                    <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
                    <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                  </svg>
                </div>
              </div>

              <h2 className="success-title">Thank You!</h2>
              <h3 className="success-subtitle">We have received your enquiry.</h3>
              <p className="success-desc">
                Our engineering team is already reviewing your details. A technical sales representative will contact you within 24 hours with a custom quote.
              </p>

              <div className="info-box">
                <div className="info-box-title">Urgent Enquiry?</div>
                <p className="info-box-text">
                  Call our head office directly at <strong>+91-98099 88266</strong> or email us at <strong>sales@aeroncomposite.com</strong>.
                </p>
              </div>

              <div className="btn-actions">
                <a 
                  href="https://www.aeroncomposite.com" 
                  className="btn-website" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Visit Our Website
                </a>
              </div>
            </div>
          )}
        </div>

        <footer className="form-footer">
          &copy; {new Date().getFullYear()} Aeron Composite Limited. All Rights Reserved. &middot; RoHS, REACH &amp; ISO 9001:2015 Certified.
        </footer>
      </div>
    </div>
  );
}

export default App;
