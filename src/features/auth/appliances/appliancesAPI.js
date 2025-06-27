// ✅ appliancesAPI.js
const API_URL = process.env.REACT_APP_API_URL;

export const fetchUserAppliances = async (token) => {
  const response = await fetch(`${API_URL}/homeowner/appliances`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch appliances');
  }

  return response.json();
};
