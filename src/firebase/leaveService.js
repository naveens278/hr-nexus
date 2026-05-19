const API_URL = 'http://localhost:5001/api/leaves';

export const applyLeave = async (d) => {
  try {
    const res = await fetch(API_URL, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(d) });
    return await res.json();
  } catch (err) { return { success: false, error: err.message }; }
};

export const getLeaveRequestsForApproval = async (id) => {
  try { return await (await fetch(`${API_URL}/pending`)).json(); } catch(e) { return []; }
};

export const approveLeave = async (id) => {
  try { return await (await fetch(`${API_URL}/approve/${id}`, { method: 'PUT' })).json(); } catch(e) { return { success: false }; }
};

export const rejectLeave = async (id, reason) => {
  try { 
    const res = await fetch(`${API_URL}/reject/${id}`, { 
      method: 'PUT', 
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason })
    });
    return await res.json();
  } catch(e) { return { success: false }; }
};

export const cancelLeave = async (id, reason) => {
  try { 
    const res = await fetch(`${API_URL}/cancel/${id}`, { 
      method: 'PUT', 
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason })
    });
    return await res.json();
  } catch(e) { return { success: false }; }
};

export const getLeaveHistory = async (id) => {
  try { return await (await fetch(`${API_URL}/employee/${id}`)).json(); } catch(e) { return []; }
};
export const getLeaveBalance = async () => { return { data: { casual: 10, medical: 5, personal: 3, annual: 15 }, success: true }; };
export const updateLeaveBalance = async () => { return { success: true }; };
export const initializeLeaveBalance = async () => { return { success: true }; };

export const getPendingLeaveCount = async () => {
  try { return await (await fetch(`${API_URL}/pending-count`)).json(); } catch(e) { return 0; }
};

export const getLeaves = async () => {
  try { return await (await fetch(API_URL)).json(); } catch(e) { return []; }
};

export const clearLeaveHistory = async () => {
  try { 
    const res = await fetch(API_URL, { method: 'DELETE' });
    return await res.json();
  } catch(e) { return { success: false, error: e.message }; }
};
