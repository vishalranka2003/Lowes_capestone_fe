import { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchUserAppliances } from '../features/auth/appliances/appliancesAPI';
import { ApplianceCard } from '../components/ApplianceCard';
import RegisterModal from '../components/RegisterModal';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import { Plus, FileText, Package } from 'lucide-react';
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
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Package className="h-8 w-8 text-loweslowesBlue-500" />
            <h1 className="text-3xl font-bold text-gray-900">My Appliances</h1>
          </div>
          <p className="text-gray-600">Manage your registered appliances and track warranty information</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-4 mb-8">
          <button 
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-loweslowesBlue-500 text-white font-medium rounded-lg hover:bg-loweslowesBlue-500 transition-colors duration-200"
            onClick={() => setShowRegisterModal(true)}
          >
            <Plus className="h-5 w-5" />
            <span>Register New Appliance</span>
          </button>
          <button
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors duration-200"
            onClick={() => navigate('/dashboard/homeowner/service-requests')}
          >
            <FileText className="h-5 w-5" />
            <span>View All Service Requests</span>
          </button>
        </div>

        {/* Status Messages */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-600">Loading your appliances...</div>
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {!loading && appliances.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No appliances registered yet</h3>
            <p className="text-gray-600 mb-6">Start by registering your first appliance to track its warranty.</p>
            <button 
              className="flex items-center space-x-2 px-4 py-2 bg-loweslowesBlue-500 text-white rounded-lg hover:bg-loweslowesBlue-500 transition-colors mx-auto"
              onClick={() => setShowRegisterModal(true)}
            >
              <Plus className="h-4 w-4" />
              <span>Register Your First Appliance</span>
            </button>
          </div>
        )}

        {/* Appliances Grid */}
        {!loading && appliances.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {appliances.map((item) => (
              <ApplianceCard
                key={item.id}
                appliance={item}
                onEdit={() => handleEdit(item)}
                onDelete={() => handleDelete(item.id)}
              />
            ))}
          </div>
        )}

        {/* Modals */}
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
