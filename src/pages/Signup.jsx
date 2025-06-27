import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Signup.css'; // ✅ Import styling

export const Signup = () => {
  const [role, setRole] = useState('homeowner');
  const [form, setForm] = useState({
    username: '', email: '', password: '',
    address: '', phoneNumber: '',
    specialization: '', experience: '',
    firstName: '', lastName: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async () => {
    const endpoint = `${process.env.REACT_APP_API_URL}/api/auth/register/${role}`;
    const body = {
      email: form.email,
      password: form.password,
      username: form.username,
      firstName: form.firstName,
      lastName: form.lastName,
      ...(role === 'homeowner'
        ? { address: form.address, phoneNumber: form.phoneNumber }
        : {
            specialization: form.specialization,
            experience: parseInt(form.experience),
            phoneNumber: form.phoneNumber
          })
    };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (res.ok) {
        navigate('/login');
      } else {
        const data = await res.json();
        setError(data.message || 'Signup failed');
      }
    } catch (err) {
      console.error(err);
      setError('Network error');
    }
  };

  return (
    <div className="signup-wrapper">
      <div className="signup-card">
        <h1 className="brand-title">🔵 WarrantyWise</h1>
        <h2 className="welcome-msg">Create Account</h2>
        <p className="instruction-text">Choose your account type and fill in your details</p>

        <div className="role-tabs">
          <button className={role === 'homeowner' ? 'active' : ''} onClick={() => setRole('homeowner')}>Homeowner</button>
          <button className={role === 'technician' ? 'active' : ''} onClick={() => setRole('technician')}>Technician</button>
        </div>

        <input name="firstName" onChange={handleChange} placeholder="First Name" className="input-field" />
        <input name="lastName" onChange={handleChange} placeholder="Last Name" className="input-field" />
        <input name="username" onChange={handleChange} placeholder="Username" className="input-field" />
        <input name="email" onChange={handleChange} placeholder="Email" className="input-field" />
        <input name="password" onChange={handleChange} placeholder="Password" type="password" className="input-field" />

        {role === 'homeowner' && (
          <>
            <input name="address" onChange={handleChange} placeholder="Address" className="input-field" />
            <input name="phoneNumber" onChange={handleChange} placeholder="Phone Number" className="input-field" />
          </>
        )}

        {role === 'technician' && (
          <>
            <input name="specialization" onChange={handleChange} placeholder="Specialization" className="input-field" />
            <input name="experience" onChange={handleChange} placeholder="Experience (in years)" className="input-field" />
            <input name="phoneNumber" onChange={handleChange} placeholder="Phone Number" className="input-field" />
          </>
        )}

        <button onClick={handleSignup} className="signup-btn">Create Account</button>
        {error && <p className="error-text">{error}</p>}

        <p className="login-redirect">
          Already have an account? <a href="/login">Sign in</a>
        </p>
      </div>
    </div>
  );
};
