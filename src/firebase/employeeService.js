import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./firebaseConfig";

const API_URL = 'http://localhost:5001/api/employees';

// Add new employee
export const addEmployee = async (employeeData) => {
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(employeeData)
    });
    const data = await res.json();
    return { ...data };
  } catch (error) {
    console.error("Add Employee Error:", error);
    return { error: error.message, success: false };
  }
};

// Get all employees
export const getEmployees = async () => {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) {
      throw new Error(`Server error: ${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    
    // Ensure we return an array even if the backend returns an error object
    if (Array.isArray(data)) {
      return data;
    } else if (data && data.success && Array.isArray(data.data)) {
      return data.data;
    } else {
      console.error("Unexpected data format from getEmployees:", data);
      throw new Error("Invalid data format received from server");
    }
  } catch (error) {
    console.error("Get Employees Error:", error);
    // Rethrow to allow the component to handle the error
    throw error;
  }
};

// Get employee by ID
export const getEmployeeById = async (employeeId) => {
  try {
    const res = await fetch(`${API_URL}/${employeeId}`);
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Get Employee Error:", error);
    return { error: error.message, success: false };
  }
};

// Get employees by department
export const getEmployeesByDepartment = async (departmentId) => {
  try {
    const employees = await getEmployees();
    return employees.filter(emp => emp.department === departmentId);
  } catch (error) {
    console.error("Get Employees by Department Error:", error);
    return [];
  }
};

// Update employee
export const updateEmployee = async (employeeId, updates) => {
  try {
    const res = await fetch(`${API_URL}/${employeeId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Update Employee Error:", error);
    return { error: error.message, success: false };
  }
};

// Delete employee
export const deleteEmployee = async (employeeId) => {
  try {
    const res = await fetch(`${API_URL}/${employeeId}`, {
      method: 'DELETE'
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Delete Employee Error:", error);
    return { error: error.message, success: false };
  }
};

// Upload employee profile picture directly to MySQL backend
export const uploadProfilePicture = async (employeeId, file) => {
  try {
    const formData = new FormData();
    formData.append('profilePic', file);
    
    // Use standard HTTP POST to our Multer endpoint
    const res = await fetch(`${API_URL}/${employeeId}/upload`, {
      method: 'POST',
      body: formData
    });
    
    const result = await res.json();
    if (!result.success) throw new Error(result.error || "Upload failed");

    return { url: result.url, success: true };
  } catch (error) {
    console.error("Upload error:", error);
    return { success: false, error: error.message };
  }
};

// Upload employee documents
export const uploadEmployeeDocument = async (employeeId, docType, file) => {
  try {
    const storageRef = ref(storage, `employees/${employeeId}/documents/${docType}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return { url: downloadURL, success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get employee count
export const getEmployeeCount = async () => {
  try {
    const res = await fetch(`${API_URL}/count`);
    const count = await res.json();
    return count;
  } catch (error) {
    console.error("Get Employee Count Error:", error);
    return 0;
  }
};

// Search employees
export const searchEmployees = async (searchTerm) => {
  try {
    const employees = await getEmployees();
    return employees.filter(emp =>
      emp.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  } catch (error) {
    console.error("Search Employees Error:", error);
    return [];
  }
};
