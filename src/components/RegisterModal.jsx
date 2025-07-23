// import { useEffect, useState } from 'react';
// import { X, Package, Calendar, FileText } from 'lucide-react';

// export default function RegisterModal({
//   onClose,
//   onRegisterSuccess,
//   token,
//   existingAppliance, // <-- passed if in edit mode
// }) {
//   const isEditMode = !!existingAppliance;

//   const [form, setForm] = useState({
//     brand: '',
//     category: '',
//     modelNumber: '',
//     serialNumber: '',
//     purchaseDate: '',
//     warrantyExpiryDate: '',
//     invoice: null,
//   });

//   const [submitting, setSubmitting] = useState(false);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     if (existingAppliance) {
//       setForm({
//         brand: existingAppliance.brand || '',
//         category: existingAppliance.category || '',
//         modelNumber: existingAppliance.modelNumber || '',
//         serialNumber: existingAppliance.serialNumber || '',
//         purchaseDate: existingAppliance.purchaseDate || '',
//         warrantyExpiryDate: existingAppliance.warrantyExpiryDate || '',
//         invoice: null, // do not prefill invoice file
//       });
//     }
//   }, [existingAppliance]);

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

//       const applianceData = {
//         brand: form.brand,
//         category: form.category,
//         modelNumber: form.modelNumber,
//         serialNumber: form.serialNumber,
//         purchaseDate: form.purchaseDate,
//         warrantyExpiryDate: form.warrantyExpiryDate,
//       };

//       formData.append(
//         'appliance',
//         new Blob([JSON.stringify(applianceData)], { type: 'application/json' })
//       );

//       if (form.invoice) {
//         formData.append('invoice', form.invoice);
//       }
//       const API_URL = process.env.REACT_APP_API_URL;
//       const url = isEditMode
//         ? `${API_URL}/homeowner/edit/${existingAppliance.id}`
//         : `${API_URL}/homeowner/appliance`;

//       const method = isEditMode ? 'PUT' : 'POST';

//       const response = await fetch(url, {
//         method,
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         body: formData,
//       });

//       if (!response.ok) {
//         throw new Error('Request failed');
//       }

//       onRegisterSuccess();
//       onClose();
//     } catch (err) {
//       console.error(err);
//       setError('Submission failed. Please check your input.');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={onClose}>
//       <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
//         <div className="flex items-center justify-between p-6 border-b border-gray-200">
//           <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
//             <Package className="h-5 w-5 text-lowesBlue-500" />
//             {isEditMode ? 'Edit Appliance' : 'Register New Appliance'}
//           </h2>
//           <button
//             onClick={onClose}
//             className="text-gray-400 hover:text-gray-600 transition-colors"
//           >
//             <X className="h-5 w-5" />
//           </button>
//         </div>

//         <form className="p-6 space-y-4" onSubmit={handleSubmit}>
//           <div>
//             <input
//               name="brand"
//               type="text"
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lowesBlue-500 focus:border-lowesBlue-500"
//               placeholder="Brand"
//               value={form.brand}
//               onChange={handleChange}
//               required
//             />
//           </div>
          
//           <div>
//             <input
//               name="category"
//               type="text"
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lowesBlue-500 focus:border-lowesBlue-500"
//               placeholder="Category"
//               value={form.category}
//               onChange={handleChange}
//               required
//             />
//           </div>
          
//           <div>
//             <input
//               name="modelNumber"
//               type="text"
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lowesBlue-500 focus:border-lowesBlue-500"
//               placeholder="Model Number"
//               value={form.modelNumber}
//               onChange={handleChange}
//               required
//             />
//           </div>
          
//           <div>
//             <input
//               name="serialNumber"
//               type="text"
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lowesBlue-500 focus:border-lowesBlue-500"
//               placeholder="Serial Number"
//               value={form.serialNumber}
//               onChange={handleChange}
//               required
//             />
//           </div>
          
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
//               <Calendar className="h-4 w-4" />
//               Purchase Date:
//             </label>
//             <input
//               name="purchaseDate"
//               type="date"
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lowesBlue-500 focus:border-lowesBlue-500"
//               value={form.purchaseDate}
//               onChange={handleChange}
//               required
//             />
//           </div>
          
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
//               <Calendar className="h-4 w-4" />
//               Warranty Expiry Date:
//             </label>
//             <input
//               name="warrantyExpiryDate"
//               type="date"
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lowesBlue-500 focus:border-lowesBlue-500"
//               value={form.warrantyExpiryDate}
//               onChange={handleChange}
//               required
//             />
//           </div>
          
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
//               <FileText className="h-4 w-4" />
//               Upload Invoice (PDF only):
//             </label>
//             <input
//               name="invoice"
//               type="file"
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lowesBlue-500 focus:border-lowesBlue-500"
//               accept="application/pdf"
//               onChange={handleChange}
//             />
//           </div>

//           {error && (
//             <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded-lg">
//               {error}
//             </div>
//           )}

//           <div className="flex gap-3 pt-4">
//             <button
//               type="button"
//               className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
//               onClick={onClose}
//               disabled={submitting}
//             >
//               Cancel
//             </button>
//             <button 
//               type="submit" 
//               className="flex-1 px-4 py-2 bg-lowesBlue-500 text-white rounded-lg hover:bg-lowesBlue-500 transition-colors disabled:bg-gray-400"
//               disabled={submitting}
//             >
//               {submitting
//                 ? isEditMode
//                   ? 'Updating...'
//                   : 'Registering...'
//                 : isEditMode
//                 ? 'Update'
//                 : 'Submit'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }



import { useEffect, useState } from 'react';
import { X, Package, Calendar, FileText } from 'lucide-react';

export default function RegisterModal({
  onClose,
  onRegisterSuccess,
  token,
  existingAppliance,
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
        invoice: null, // do not prefill invoice
      });
    }
  }, [existingAppliance]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
    setError(''); // clear error on change
  };

  // ✅ Check if dates are valid
  const isDateValid = !form.purchaseDate || !form.warrantyExpiryDate
    ? true
    : form.warrantyExpiryDate >= form.purchaseDate;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // ✅ Prevent if dates are invalid
    if (!isDateValid) {
      setError('Warranty expiry date cannot be before purchase date.');
      return;
    }

    setSubmitting(true);

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

      const API_URL = process.env.REACT_APP_API_URL;
      const url = isEditMode
        ? `${API_URL}/homeowner/edit/${existingAppliance.id}`
        : `${API_URL}/homeowner/appliance`;

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
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Package className="h-5 w-5 text-lowesBlue-500" />
            {isEditMode ? 'Edit Appliance' : 'Register New Appliance'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form className="p-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <input
              name="brand"
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lowesBlue-500 focus:border-lowesBlue-500"
              placeholder="Brand"
              value={form.brand}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <input
              name="category"
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lowesBlue-500 focus:border-lowesBlue-500"
              placeholder="Category"
              value={form.category}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <input
              name="modelNumber"
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lowesBlue-500 focus:border-lowesBlue-500"
              placeholder="Model Number"
              value={form.modelNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <input
              name="serialNumber"
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lowesBlue-500 focus:border-lowesBlue-500"
              placeholder="Serial Number"
              value={form.serialNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Purchase Date:
            </label>
            <input
  name="purchaseDate"
  type="date"
  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lowesBlue-500 focus:border-lowesBlue-500"
  value={form.purchaseDate}
  onChange={handleChange}
  required
  max={new Date().toISOString().split('T')[0]}  // ✅ today's date in YYYY-MM-DD format
/>
            {/* <input
              name="purchaseDate"
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lowesBlue-500 focus:border-lowesBlue-500"
              value={form.purchaseDate}
              onChange={handleChange}
              required
            /> */}
          </div>

          <div>
  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
    <Calendar className="h-4 w-4" />
    Warranty Expiry Date:
  </label>
  <input
    name="warrantyExpiryDate"
    type="date"
    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lowesBlue-500 focus:border-lowesBlue-500 ${
      !form.purchaseDate ? 'cursor-not-allowed bg-gray-100' : ''
    }`}
    value={form.warrantyExpiryDate}
    onChange={handleChange}
    required
    disabled={!form.purchaseDate}
    min={form.purchaseDate || ''}
  />
  {!isDateValid && (
    <p className="text-red-600 text-sm mt-1">
      Warranty expiry date must be after purchase date.
    </p>
  )}
</div>

          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Upload Invoice (PDF only):
            </label>
            <input
              name="invoice"
              type="file"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lowesBlue-500 focus:border-lowesBlue-500"
              accept="application/pdf"
              onChange={handleChange}
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-lowesBlue-500 text-white rounded-lg hover:bg-lowesBlue-500 transition-colors disabled:bg-gray-400"
              disabled={submitting || !isDateValid}
            >
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
