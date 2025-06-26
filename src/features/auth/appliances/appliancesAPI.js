// ✅ appliancesAPI.js
export const fetchUserAppliances = async (token) => {
  const response = await fetch('http://localhost:8080/homeowner/appliances', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch appliances');
  }

  return response.json();
};
