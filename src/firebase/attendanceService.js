const API_URL = 'http://localhost:5001/api/attendance';

export const checkIn = async (employeeId, location) => {
  const tzOffset = new Date().getTimezoneOffset() * 60000;
  const date = new Date(Date.now() - tzOffset).toISOString().split("T")[0];
  try {
    const res = await fetch(`${API_URL}/check-in`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ employeeId, date }) });
    return await res.json();
  } catch (err) { return { success: false, error: err.message }; }
};

export const checkOut = async (employeeId, location) => {
  const tzOffset = new Date().getTimezoneOffset() * 60000;
  const date = new Date(Date.now() - tzOffset).toISOString().split("T")[0];
  try {
    const res = await fetch(`${API_URL}/check-out`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ employeeId, date }) });
    return await res.json();
  } catch (err) { return { success: false, error: err.message }; }
};

export const getAttendanceRecord = async (employeeId, date) => {
  try {
    const res = await fetch(`${API_URL}/record/${employeeId}/${date}`);
    return await res.json();
  } catch(e) { return { success: false }; }
};

export const getAttendanceHistory = async () => { return []; };
export const markAttendance = async () => { return { success: false }; };
export const getAttendanceSummary = async () => { return { data: {present:0, absent:0, late:0, halfDay:0}, success: true }; };

export const getPresentCountToday = async () => {
  try { 
      const tzOffset = new Date().getTimezoneOffset() * 60000;
      const today = new Date(Date.now() - tzOffset).toISOString().split("T")[0];
      return await (await fetch(`${API_URL}/present-today/${today}`)).json(); 
  } catch(e) { return 0; }
};

export const getAttendance = async () => {
  try { return await (await fetch(API_URL)).json(); } catch(e) { return []; }
};
