const API_URL = 'http://localhost:5001/api/departments';

export const addDepartment = async (data) => {
  try {
    const res = await fetch(API_URL, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data) });
    return await res.json();
  } catch (err) { return { success: false, error: err.message }; }
};

export const getDepartments = async () => {
  try { return await (await fetch(API_URL)).json(); } catch(e) { return []; }
};

export const getDepartmentById = async (id) => { return { success: false, error: "Mocked" }; };
export const updateDepartment = async (id, data) => { return { success: false }; };

export const deleteDepartment = async (id) => {
  try {
    const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    return await res.json();
  } catch (err) { return { success: false }; }
};

export const getDepartmentEmployees = async (id) => { return []; };
export const getDepartmentStats = async (id) => { return { data: {totalEmployees:0, activeEmployees:0, inactiveEmployees:0, onLeave:0}, success: true }; };

export const getDepartmentCount = async () => {
  try { return await (await fetch(`${API_URL}/count`)).json(); } catch(e) { return 0; }
};
