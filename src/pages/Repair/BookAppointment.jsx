import React, { useState } from 'react';
import './BookAppointment.css';

const BookAppointment = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDevice, setSelectedDevice] = useState('');

  // Step 3 Specific States
  const [selectedCenter, setSelectedCenter] = useState('');
  const [serviceType, setServiceType] = useState(''); // 'visit' | 'pickup'
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');

  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    problem: '',
    serial: '',
    issue: '',
    name: '',
    email: '',
    mobile: '',
    date: ''
  });

  const centers = ['Andheri', 'Thane', 'Dadar', 'Vashi'];

  const visitTimeSlots = [
    '10:00 AM - 11:00 AM',
    '11:00 AM - 12:00 PM',
    '12:00 PM - 01:00 PM',
    '01:00 PM - 02:00 PM',
    '02:00 PM - 03:00 PM',
    '03:00 PM - 04:00 PM',
    '04:00 PM - 05:00 PM',
    '05:00 PM - 06:00 PM',
    '06:00 PM - 07:00 PM'
  ];

  const pickupTimeSlots = [
    '10:00 AM - 12:00 PM',
    '12:00 PM - 02:00 PM',
    '02:00 PM - 04:00 PM',
    '04:00 PM - 06:00 PM'
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const nextStep = (e) => {
    if (e) e.preventDefault();
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  const prevStep = (e) => {
    if (e) e.preventDefault();
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalData = {
      ...formData,
      device: selectedDevice,
      serviceCenter: selectedCenter,
      serviceType,
      timeSlot: selectedTimeSlot
    };
    console.log('Submitted Data:', finalData);
    if (onClose) onClose();
  };

  return (
    <div className="bokwrap-modal">
      <div className="card-custom">
        {onClose && (
          <button type="button" className="btn-modal-close" onClick={onClose}>
            &times;
          </button>
        )}

        {/* Floating Top Header Badge */}
        <div className="top-header-badge">
          <span>📅</span> BOOK YOUR SERVICE
        </div>

        {/* STEP 1: Device Information */}
        {currentStep === 1 && (
          <div className="step-content">
            <div className="step-header-bar">STEP 1: DEVICE INFORMATION</div>

            <div className="form-group-block">
              <label>Select your device</label>
              <div className="device-tile-grid">
                <div
                  className={`device-tile ${selectedDevice === 'laptop' ? 'active' : ''}`}
                  onClick={() => setSelectedDevice('laptop')}
                >
                  <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                    <line x1="2" y1="20" x2="22" y2="20" />
                  </svg>
                  <span>Laptop</span>
                </div>
                <div
                  className={`device-tile ${selectedDevice === 'desktop' ? 'active' : ''}`}
                  onClick={() => setSelectedDevice('desktop')}
                >
                  <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                    <line x1="8" y1="21" x2="16" y2="21" />
                    <line x1="12" y1="17" x2="12" y2="21" />
                  </svg>
                  <span>Desktop</span>
                </div>
                <div
                  className={`device-tile ${selectedDevice === 'allinone' ? 'active' : ''}`}
                  onClick={() => setSelectedDevice('allinone')}
                >
                  <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="2" width="18" height="15" rx="2" ry="2" />
                    <line x1="12" y1="17" x2="12" y2="21" />
                    <line x1="6" y1="21" x2="18" y2="21" />
                  </svg>
                  <span>All in One</span>
                </div>
                <div
                  className={`device-tile ${selectedDevice === 'ipad' ? 'active' : ''}`}
                  onClick={() => setSelectedDevice('ipad')}
                >
                  <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
                    <line x1="12" y1="18" x2="12.01" y2="18" />
                  </svg>
                  <span>iPad</span>
                </div>
              </div>
            </div>

            <div className="form-group-block">
              <label htmlFor="brand">Select your Brand</label>
              <select
                id="brand"
                name="brand"
                className="input-soft-blue"
                value={formData.brand}
                onChange={handleChange}
              >
                <option value="" disabled hidden>Select Brand</option>
                <option value="Asus">Asus</option>
                <option value="Dell">Dell</option>
                <option value="HP">HP</option>
                <option value="Lenovo">Lenovo</option>
                <option value="Apple">Apple</option>
              </select>
            </div>

            <div className="form-group-block">
              <label htmlFor="model">Select Your Model</label>
              <select
                id="model"
                name="model"
                className="input-soft-blue"
                value={formData.model}
                onChange={handleChange}
              >
                <option value="" disabled hidden>Select Model</option>
                <option value="ExpertsBook">ExpertsBook</option>
                <option value="ROG">ROG</option>
                <option value="TUF">TUF</option>
                <option value="ZenBook">ZenBook</option>
              </select>
            </div>

            <div className="form-group-block">
              <label htmlFor="problem">Select your device problem</label>
              <select
                id="problem"
                name="problem"
                className="input-soft-blue"
                value={formData.problem}
                onChange={handleChange}
              >
                <option value="" disabled hidden>Select Problem</option>
                <option value="Booting Problem">Booting Problem</option>
                <option value="Battery Issue">Battery Issue</option>
                <option value="Screen Damage">Screen Damage</option>
                <option value="Keyboard Malfunction">Keyboard Malfunction</option>
              </select>
            </div>

            <div className="form-group-block">
              <label htmlFor="serial">Serial Number (Optional)</label>
              <input
                type="text"
                id="serial"
                name="serial"
                className="input-soft-blue"
                placeholder="Enter Serial Number"
                value={formData.serial}
                onChange={handleChange}
              />
            </div>

            <div className="form-group-block">
              <label htmlFor="issue">Write Issue</label>
              <textarea
                id="issue"
                name="issue"
                rows="3"
                className="input-soft-blue"
                placeholder="Describe the issue..."
                value={formData.issue}
                onChange={handleChange}
              ></textarea>
            </div>

            <button type="button" className="btn-gradient-submit" onClick={nextStep}>
              NEXT &rarr;
            </button>
          </div>
        )}

        {/* STEP 2: Personal Information */}
        {currentStep === 2 && (
          <div className="step-content">
            <div className="step-header-bar">STEP 2: PERSONAL INFORMATION</div>

            <div className="form-group-block">
              <label>Name</label>
              <input
                type="text"
                name="name"
                className="input-soft-blue"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="form-group-block">
              <label>Email</label>
              <input
                type="email"
                name="email"
                className="input-soft-blue"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="form-group-block">
              <label>Mobile</label>
              <input
                type="tel"
                name="mobile"
                className="input-soft-blue"
                placeholder="Enter your mobile number"
                value={formData.mobile}
                onChange={handleChange}
              />
            </div>

            <div className="action-button-group">
              <button type="button" className="btn-gradient-submit" onClick={prevStep}>
                &larr; PREV
              </button>
              <button type="button" className="btn-gradient-submit" onClick={nextStep}>
                NEXT &rarr;
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Service Details */}
        {currentStep === 3 && (
          <div className="step-content">
            <div className="step-header-bar">STEP 3: SERVICE DETAILS</div>

            {/* Select Service Center */}
            <div className="form-group-block">
              <label>Select Service Center</label>
              <div className="options-row center-options">
                {centers.map((center) => (
                  <label
                    key={center}
                    className={`custom-radio-card ${selectedCenter === center ? 'selected' : ''}`}
                    onClick={() => setSelectedCenter(center)}
                  >
                    <input
                      type="radio"
                      name="serviceCenter"
                      value={center}
                      checked={selectedCenter === center}
                      onChange={() => setSelectedCenter(center)}
                    />
                    <span className="radio-circle"></span>
                    {center}
                  </label>
                ))}
              </div>
            </div>

            {/* Select Service Type */}
            <div className="form-group-block">
              <label>Select Service Type</label>
              <div className="options-row type-options">
                <label
                  className={`custom-radio-card wide ${serviceType === 'visit' ? 'selected dark' : ''}`}
                  onClick={() => setServiceType('visit')}
                >
                  <input
                    type="radio"
                    name="serviceType"
                    value="visit"
                    checked={serviceType === 'visit'}
                    onChange={() => setServiceType('visit')}
                  />
                  <span className="radio-circle"></span>
                  Visit Service Center
                </label>

                <label
                  className={`custom-radio-card wide ${serviceType === 'pickup' ? 'selected dark' : ''}`}
                  onClick={() => setServiceType('pickup')}
                >
                  <input
                    type="radio"
                    name="serviceType"
                    value="pickup"
                    checked={serviceType === 'pickup'}
                    onChange={() => setServiceType('pickup')}
                  />
                  <span className="radio-circle"></span>
                  Pickup & Drop - Service Charges
                </label>
              </div>
            </div>

            {/* White Sub-card Box */}
            {serviceType && (
              <div className="service-details-card">
                {/* Always-Visible Charges Table when Pickup is Selected */}
                {serviceType === 'pickup' && (
                  <div className="charges-table-container">
                    <table className="charges-table">
                      <thead>
                        <tr>
                          <th>SERVICE</th>
                          <th>CHARGES (₹)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Pickup & Drop Charges</td>
                          <td>₹ 450.00</td>
                        </tr>
                        <tr>
                          <td>Diagnostic Charges</td>
                          <td>₹ 1770.00</td>
                        </tr>
                        <tr className="total-row">
                          <td>TOTAL CHARGES</td>
                          <td>₹ 2,220.00</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Booking Date */}
                <div className="form-group-block">
                  <label>Select Booking Date</label>
                  <input
                    type="date"
                    name="date"
                    className="input-soft-blue"
                    value={formData.date}
                    onChange={handleChange}
                  />
                </div>

                {/* Dynamic Time Slots */}
                <div className="form-group-block">
                  <label>Select Time Slot</label>
                  <div className="slots-grid">
                    {(serviceType === 'visit' ? visitTimeSlots : pickupTimeSlots).map((slot) => (
                      <label
                        key={slot}
                        className={`custom-radio-card slot-card ${selectedTimeSlot === slot ? 'selected' : ''}`}
                        onClick={() => setSelectedTimeSlot(slot)}
                      >
                        <input
                          type="radio"
                          name="timeSlot"
                          value={slot}
                          checked={selectedTimeSlot === slot}
                          onChange={() => setSelectedTimeSlot(slot)}
                        />
                        <span className="radio-circle"></span>
                        {slot}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="action-button-group">
              <button type="button" className="btn-gradient-submit" onClick={prevStep}>
                &larr; PREV
              </button>
              <button type="button" className="btn-dark-submit" onClick={handleSubmit}>
                {serviceType === 'pickup' ? 'PAY NOW' : 'SUBMIT'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookAppointment;