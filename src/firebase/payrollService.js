const API_URL = 'http://localhost:5001/api/payroll';

export const calculateSalary = async () => { return { success: false }; };
export const createPayroll = async () => { return { success: true }; };
export const processMonthlyPayroll = async (month) => {
  try {
    const res = await fetch(`${API_URL}/process`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ month })
    });
    return await res.json();
  } catch (e) {
    return { success: false, error: e.message };
  }
};
export const getPayrollRecord = async () => { return { success: false }; };
export const generatePayslip = async (uid, month, email = null) => {
  try {
    const url = email 
      ? `${API_URL}/payslip/${uid}/${month}?email=${encodeURIComponent(email)}`
      : `${API_URL}/payslip/${uid}/${month}`;
    const res = await fetch(url);
    return await res.json();
  } catch (e) {
    return { success: false, error: e.message };
  }
};
export const getPayrollHistory = async () => { return []; };
export const updatePayroll = async () => { return { success: false }; };
export const markPayrollAsPaid = async () => { return { success: false }; };

export const getTotalPayrollForMonth = async (month) => {
  try {
    const res = await fetch(`${API_URL}/total/${month}`);
    return await res.json();
  } catch (e) { return { data: { totalNetSalary: 0, employeeCount: 0 }, success: true }; }
};
