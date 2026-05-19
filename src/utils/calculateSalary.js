// Salary calculation utilities

export const calculateNetSalary = (basicSalary, hra, da, ta, deductions = 0) => {
  const gross = basicSalary + hra + da + ta;
  return Math.round(gross - deductions);
};

export const calculatePF = (basicSalary) => {
  // PF is typically 12% of basic salary
  return Math.round(basicSalary * 0.12);
};

export const calculateTax = (salary) => {
  // Simplified tax calculation (adjust based on actual tax slabs)
  if (salary < 250000) return 0;
  if (salary < 500000) return Math.round((salary - 250000) * 0.05);
  if (salary < 1000000) return Math.round(12500 + (salary - 500000) * 0.1);
  return Math.round(62500 + (salary - 1000000) * 0.2);
};

export const calculateHRA = (basicSalary) => {
  // HRA is typically 50% of basic salary (or fixed amount, adjust as needed)
  return Math.round(basicSalary * 0.5);
};

export const calculateDA = (basicSalary) => {
  // DA is typically 50% of basic salary
  return Math.round(basicSalary * 0.5);
};

export const calculateOvertime = (hourlyRate, overtimeHours) => {
  // Overtime is typically 1.5x hourly rate
  return Math.round(hourlyRate * overtimeHours * 1.5);
};

export const calculateBonus = (salary, bonusPercentage) => {
  return Math.round(salary * (bonusPercentage / 100));
};

export const calculateGrossSalary = (basicSalary, hra, da, ta) => {
  return basicSalary + hra + da + ta;
};
