// import { useState } from 'react';
// import '../styles/RegisterModal.css';

// export default function RegisterModal({ onClose, onRegisterSuccess, token }) {
//   const [form, setForm] = useState({
//     brand: '',
//     modelNumber: '',
//     serialNumber: '',
//     purchaseDate: '',
//     warrantyExpiryDate: '',
//     invoice: null,
//   });

//   const [submitting, setSubmitting] = useState(false);
//   const [error, setError] = useState('');

//   const handleChange = (e) => {
//     const { name, value, files } = e.target;
//     setForm((prev) => ({
//       ...prev,
//       [name]: files ? files[0] : value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSubmitting(true);
//     setError('');

//     try {
//       const formData = new FormData();

//       // Create JSON blob for appliance details (without invoice)
//       const applianceData = {
//         brand: form.brand,
//         modelNumber: form.modelNumber,
//         serialNumber: form.serialNumber,
//         purchaseDate: form.purchaseDate,
//         warrantyExpiryDate: form.warrantyExpiryDate,
//       };

//       formData.append(
//         'appliance',
//         new Blob([JSON.stringify(applianceData)], { type: 'application/json' })
//       );

//       // Append invoice file
//       formData.append('invoice', form.invoice);

//       const response = await fetch('http://localhost:8080/homeowner/appliance', {
//         method: 'POST',
//         headers: {
//           Authorization: `Bearer ${token}`,
//           // DO NOT set Content-Type; browser will handle it for multipart form
//         },
//         body: formData,
//       });

//       if (!response.ok) {
//         throw new Error('Failed to register appliance');
//       }

//       onRegisterSuccess();
//       onClose();
//     } catch (err) {
//       console.error(err);
//       setError('Registration failed. Please check your input.');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <div className="modal-overlay" onClick={onClose}>
//       <div
//         className="modal-container"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <h2 className="modal-title">Register New Appliance</h2>

//         <form className="modal-form" onSubmit={handleSubmit}>
//           <input
//             name="brand"
//             type="text"
//             className="modal-input"
//             placeholder="Brand"
//             value={form.brand}
//             onChange={handleChange}
//             required
//           />
//           <input
//             name="modelNumber"
//             type="text"
//             className="modal-input"
//             placeholder="Model Number"
//             value={form.modelNumber}
//             onChange={handleChange}
//             required
//           />
//           <input
//             name="serialNumber"
//             type="text"
//             className="modal-input"
//             placeholder="Serial Number"
//             value={form.serialNumber}
//             onChange={handleChange}
//             required
//           />
//           <label>Purchase Date:</label>
//           <input
//             name="purchaseDate"
//             type="date"
//             className="modal-input"
//             value={form.purchaseDate}
//             onChange={handleChange}
//             required
//           />
//           <label>Warranty Expiry Date:</label>
//           <input
//             name="warrantyExpiryDate"
//             type="date"
//             className="modal-input"
//             value={form.warrantyExpiryDate}
//             onChange={handleChange}
//             required
//           />
//           <label>Upload Invoice (PDF only):</label>
//           <input
//             name="invoice"
//             type="file"
//             className="modal-input"
//             accept="application/pdf"
//             onChange={handleChange}
//             required
//           />

//           {error && <p className="error-text">{error}</p>}

//           <div className="modal-actions">
//             <button
//               type="button"
//               className="btn-cancel"
//               onClick={onClose}
//               disabled={submitting}
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="btn-submit"
//               disabled={submitting}
//             >
//               {submitting ? 'Submitting...' : 'Submit'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

import { useEffect, useState } from 'react';
import '../styles/RegisterModal.css';

export default function RegisterModal({
  onClose,
  onRegisterSuccess,
  token,
  existingAppliance, // <-- passed if in edit mode
}) {
  const isEditMode = !!existingAppliance;

  const [form, setForm] = useState({
    brand: '',
    category: '',
    modelNumber: '',
    serialNumber: '',
    purchaseDate: '',
    warrantyExpiryDate: '',
    invoice: null,
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (existingAppliance) {
      setForm({
        brand: existingAppliance.brand || '',
        category: existingAppliance.category || '',
        modelNumber: existingAppliance.modelNumber || '',
        serialNumber: existingAppliance.serialNumber || '',
        purchaseDate: existingAppliance.purchaseDate || '',
        warrantyExpiryDate: existingAppliance.warrantyExpiryDate || '',
        invoice: null, // do not prefill invoice file
      });
    }
  }, [existingAppliance]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const formData = new FormData();

      const applianceData = {
        brand: form.brand,
        category: form.category,
        modelNumber: form.modelNumber,
        serialNumber: form.serialNumber,
        purchaseDate: form.purchaseDate,
        warrantyExpiryDate: form.warrantyExpiryDate,
      };

      formData.append(
        'appliance',
        new Blob([JSON.stringify(applianceData)], { type: 'application/json' })
      );

      if (form.invoice) {
        formData.append('invoice', form.invoice);
      }

      const url = isEditMode
        ? `http://localhost:8080/homeowner/edit/${existingAppliance.id}`
        : `http://localhost:8080/homeowner/appliance`;

      const method = isEditMode ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Request failed');
      }

      onRegisterSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      setError('Submission failed. Please check your input.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">
          {isEditMode ? 'Edit Appliance' : 'Register New Appliance'}
        </h2>

        <form className="modal-form" onSubmit={handleSubmit}>
          <input
            name="brand"
            type="text"
            className="modal-input"
            placeholder="Brand"
            value={form.brand}
            onChange={handleChange}
            required
          />
             <input
            name="category"
            type="text"
            className="modal-input"
            placeholder="Category"
            value={form.category}
            onChange={handleChange}
            required
          />
          <input
            name="modelNumber"
            type="text"
            className="modal-input"
            placeholder="Model Number"
            value={form.modelNumber}
            onChange={handleChange}
            required
          />
          <input
            name="serialNumber"
            type="text"
            className="modal-input"
            placeholder="Serial Number"
            value={form.serialNumber}
            onChange={handleChange}
            required
          />
          <label>Purchase Date:</label>
          <input
            name="purchaseDate"
            type="date"
            className="modal-input"
            value={form.purchaseDate}
            onChange={handleChange}
            required
          />
          <label>Warranty Expiry Date:</label>
          <input
            name="warrantyExpiryDate"
            type="date"
            className="modal-input"
            value={form.warrantyExpiryDate}
            onChange={handleChange}
            required
          />
          <label>Upload Invoice (PDF only):</label>
          <input
            name="invoice"
            type="file"
            className="modal-input"
            accept="application/pdf"
            onChange={handleChange}
          />

          {error && <p className="error-text">{error}</p>}

          <div className="modal-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>
            <button type="submit" className="btn-submit" disabled={submitting}>
              {submitting
                ? isEditMode
                  ? 'Updating...'
                  : 'Registering...'
                : isEditMode
                ? 'Update'
                : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
