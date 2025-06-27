// ✅ appliancesAPI.js
export const fetchUserAppliances = async (token) => {
  const BASE_URL = process.env.REACT_APP_API_URL;
  const response = await fetch(`${BASE_URL}/homeowner/appliances`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch appliances');
  }

  return response.json();
};
