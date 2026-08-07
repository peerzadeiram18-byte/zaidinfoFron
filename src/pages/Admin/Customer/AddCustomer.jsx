// import React, { useState } from 'react';
// import './AddCustomer.css';

// const AddCustomer = () => {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     password: '',
//     role: 'customer',
//     isVerified: true,
//   });

//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState({ type: '', text: '' });

//   // Handle Input Changes
//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value,
//     }));
//   };

//   // Submit Data to Backend API
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage({ type: '', text: '' });

//     try {
//       // Adjust the endpoint matching your Express router (e.g., http://localhost:5000/api/v1/users)
//       const token = localStorage.getItem('token'); // Retrieve JWT token if auth is required
      
//       const response = await fetch('/api/v1/users', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           ...(token && { Authorization: `Bearer ${token}` }),
//         },
//         body: JSON.stringify(formData),
//       });

//       const resData = await response.json();

//       if (!response.ok) {
//         throw new Error(resData.message || 'Failed to add customer.');
//       }

//       setMessage({ type: 'success', text: 'Customer created successfully!' });

//       // Reset form
//       setFormData({
//         name: '',
//         email: '',
//         phone: '',
//         password: '',
//         role: 'customer',
//         isVerified: true,
//       });
//     } catch (error) {
//       setMessage({ type: 'error', text: error.message || 'Something went wrong.' });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="add-customer-container">
//       <div className="add-customer-card">
//         <div className="card-header">
//           <h2>Add New Customer</h2>
//           <p>Enter details below to register a new user/customer account.</p>
//         </div>

//         {message.text && (
//           <div className={`alert-box ${message.type}`}>
//             {message.text}
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="customer-form">
//           <div className="form-grid">
//             {/* Full Name */}
//             <div className="form-group">
//               <label htmlFor="name">Full Name *</label>
//               <input
//                 type="text"
//                 id="name"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 placeholder="John Doe"
//                 required
//               />
//             </div>

//             {/* Email Address */}
//             <div className="form-group">
//               <label htmlFor="email">Email Address *</label>
//               <input
//                 type="email"
//                 id="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 placeholder="john@example.com"
//                 required
//               />
//             </div>

//             {/* Phone Number */}
//             <div className="form-group">
//               <label htmlFor="phone">Phone Number *</label>
//               <input
//                 type="tel"
//                 id="phone"
//                 name="phone"
//                 value={formData.phone}
//                 onChange={handleChange}
//                 placeholder="+91 9876543210"
//                 required
//               />
//             </div>

//             {/* Temporary Password */}
//             <div className="form-group">
//               <label htmlFor="password">Password *</label>
//               <input
//                 type="password"
//                 id="password"
//                 name="password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 placeholder="••••••••"
//                 required
//               />
//             </div>

//             {/* Role */}
//             <div className="form-group">
//               <label htmlFor="role">User Role</label>
//               <select
//                 id="role"
//                 name="role"
//                 value={formData.role}
//                 onChange={handleChange}
//               >
//                 <option value="customer">Customer</option>
//                 <option value="admin">Admin</option>
//               </select>
//             </div>

//             {/* Verification Status */}
//             <div className="form-group checkbox-group">
//               <label className="checkbox-label">
//                 <input
//                   type="checkbox"
//                   name="isVerified"
//                   checked={formData.isVerified}
//                   onChange={handleChange}
//                 />
//                 Mark as Verified Account
//               </label>
//             </div>
//           </div>

//           {/* Form Controls */}
//           <div className="form-actions">
//             <button
//               type="button"
//               className="btn-cancel"
//               onClick={() => setFormData({ name: '', email: '', phone: '', password: '', role: 'customer', isVerified: true })}
//             >
//               Reset
//             </button>
//             <button type="submit" className="btn-submit" disabled={loading}>
//               {loading ? 'Creating...' : 'Add Customer'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddCustomer;


import React, { useState } from 'react';
import './AddCustomer.css';

const AddCustomer = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'customer',
    isVerified: true,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Submit Data to Backend API
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Adjust the endpoint matching your Express router (e.g., http://localhost:5000/api/v1/users)
      const token = localStorage.getItem('token'); // Retrieve JWT token if auth is required
      
      const response = await fetch('/api/v1/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(formData),
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.message || 'Failed to add customer.');
      }

      setMessage({ type: 'success', text: 'Customer created successfully!' });

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        password: '',
        role: 'customer',
        isVerified: true,
      });
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Something went wrong.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-customer-container">
      <div className="add-customer-card">
        <div className="card-header">
          <h2>Add New Customer</h2>
          <p>Enter details below to register a new user/customer account.</p>
        </div>

        {message.text && (
          <div className={`alert-box ${message.type}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="customer-form">
          <div className="form-grid">
            {/* Full Name */}
            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
              />
            </div>

            {/* Email Address */}
            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                required
              />
            </div>

            {/* Phone Number */}
            <div className="form-group">
              <label htmlFor="phone">Phone Number *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 9876543210"
                required
              />
            </div>

            {/* Temporary Password */}
            <div className="form-group">
              <label htmlFor="password">Password *</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
            </div>

            {/* Role */}
            <div className="form-group">
              <label htmlFor="role">User Role</label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="customer">Customer</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {/* Verification Status */}
            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="isVerified"
                  checked={formData.isVerified}
                  onChange={handleChange}
                />
                Mark as Verified Account
              </label>
            </div>
          </div>

          {/* Form Controls */}
          <div className="form-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={() => setFormData({ name: '', email: '', phone: '', password: '', role: 'customer', isVerified: true })}
            >
              Reset
            </button>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Creating...' : 'Add Customer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCustomer;