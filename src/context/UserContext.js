import { createContext, useState } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [userDepartment, setUserDepartment] = useState(null);
  const [userPermissions, setUserPermissions] = useState([]);

  const updateUserContext = (user, role, department, permissions = []) => {
    setSelectedUser(user);
    setUserRole(role);
    setUserDepartment(department);
    setUserPermissions(permissions);
  };

  const clearUserContext = () => {
    setSelectedUser(null);
    setUserRole(null);
    setUserDepartment(null);
    setUserPermissions([]);
  };

  const hasPermission = (permission) => {
    return userPermissions.includes(permission);
  };

  const value = {
    selectedUser,
    userRole,
    userDepartment,
    userPermissions,
    updateUserContext,
    clearUserContext,
    hasPermission,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
