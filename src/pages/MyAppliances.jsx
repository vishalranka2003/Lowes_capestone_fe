import { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchUserAppliances } from '../features/auth/appliances/appliancesAPI';
import { ApplianceCard } from '../components/ApplianceCard';
import RegisterModal from '../components/RegisterModal';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import '../styles/MyAppliances.css';
import axios from 'axios';

export const MyAppliances = () => {
  const [appliances, setAppliances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [selectedAppliance, setSelectedAppliance] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [applianceToDelete, setApplianceToDelete] = useState(null);

  const token = useSelector((state) => state.auth.token);
  const navigate = useNavigate();

  const loadAppliances = useCallback(async () => {
    try {
      const res = await fetchUserAppliances(token);
      if (!res || res.error) throw new Error('Failed to fetch appliances.');
      setAppliances(res);
    } catch (err) {
      console.error(err);
      setError('Could not load your appliances.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadAppliances();
  }, [loadAppliances]);

  const handleEdit = (appliance) => {
    setSelectedAppliance(appliance);
    setShowRegisterModal(true);
  };

  const handleCloseModal = () => {
    setShowRegisterModal(false);
    setSelectedAppliance(null);
  };

  const confirmDeleteAppliance = async () => {
    try {
      const API_URL = process.env.REACT_APP_API_URL;
      await axios.delete(`${API_URL}/homeowner/delete/${applianceToDelete}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setShowConfirmModal(false);
      setApplianceToDelete(null);
      loadAppliances();
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Failed to delete appliance.');
    }
  };

  const handleDelete = (id) => {
    setApplianceToDelete(id);
    setShowConfirmModal(true);
  };

  return (
    <div className="appliances-wrapper">
      <div className="dashboard-hero">
        <h1>Welcome back!</h1>
        <p>Keep track of warranties easily!</p>
      </div>

      <div className="register-btn-container">
        <button className="register-btn" onClick={() => setShowRegisterModal(true)}>
          ➕ Register New Appliance
        </button>
        <button
          className="view-service-requests-btn"
          onClick={() => navigate('/dashboard/homeowner/service-requests')}
        >
          View All Service Requests
        </button>
      </div>

      {loading && <p className="status-text">Loading...</p>}
      {error && <p className="error-text">{error}</p>}

      {!loading && appliances.length === 0 && (
        <p className="status-text">You haven't registered any appliances yet.</p>
      )}

      <div className="appliance-grid">
        {appliances.map((item) => (
          <ApplianceCard
            key={item.id}
            appliance={item}
            onEdit={() => handleEdit(item)}
            onDelete={() => handleDelete(item.id)}
          />
        ))}
      </div>

      {showRegisterModal && (
        <RegisterModal
          onClose={handleCloseModal}
          onRegisterSuccess={loadAppliances}
          token={token}
          existingAppliance={selectedAppliance}
        />
      )}

      {showConfirmModal && (
        <ConfirmDeleteModal
          onConfirm={confirmDeleteAppliance}
          onCancel={() => {
            setShowConfirmModal(false);
            setApplianceToDelete(null);
          }}
        />
      )}
    </div>
  );
};





// // src/pages/MyAppliances.jsx
// import { useEffect, useState } from 'react';
// import { useSelector } from 'react-redux';
// import { fetchUserAppliances } from '../features/auth/appliances/appliancesAPI';
// import { ApplianceCard } from '../components/ApplianceCard';
// console.log("ApplianceCard:", ApplianceCard); // should log a function, not undefined

// import RegisterModal from '../components/RegisterModal'; // ✅ Import modal
// import '../styles/MyAppliances.css';

// export const MyAppliances = () => {
//   const [appliances, setAppliances] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [showRegisterModal, setShowRegisterModal] = useState(false); // ✅ Modal toggle

//   const token = useSelector((state) => state.auth.token);
//   const username = useSelector((state) => state.auth.username);

//   // ✅ Extracted so we can call it from RegisterModal
//   const loadAppliances = async () => {
//     try {
//       const res = await fetchUserAppliances(token);
//       if (!res || res.error) throw new Error('Failed to fetch appliances.');
//       setAppliances(res);
//     } catch (err) {
//       console.error(err);
//       setError('Could not load your appliances.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadAppliances();
//   }, [username, token]);

//   return (
//     <div className="appliances-wrapper">
//       <h1 className="page-title">📦 My Appliances</h1>

//       <div className="register-btn-container">
//         <button className="register-btn" onClick={() => setShowRegisterModal(true)}>
//           ➕ Register New Appliance
//         </button>
//       </div>

//       {loading && <p className="status-text">Loading...</p>}
//       {error && <p className="error-text">{error}</p>}

//       {!loading && appliances.length === 0 && (
//         <p className="status-text">You haven't registered any appliances yet.</p>
//       )}

//       <div className="appliance-grid">
//         {appliances.map((item) => (
//           <ApplianceCard key={item.id} appliance={item} />
//         ))}
//       </div>

//       {/* ✅ Modal rendering */}
//       {showRegisterModal && (
//         <RegisterModal
//           onClose={() => setShowRegisterModal(false)}
//           onRegisterSuccess={loadAppliances}
//           token={token}
//         />
//       )}
//     </div>
//   );
// };
