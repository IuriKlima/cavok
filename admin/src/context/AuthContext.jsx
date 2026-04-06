import { createContext, useContext, useState, useEffect } from 'react';
import { getUser, setUser as saveUser, removeToken, setToken } from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUserState] = useState(getUser());

  const loginUser = (data) => {
    setToken(data.token);
    const u = { nome: data.nome, email: data.email, role: data.role };
    saveUser(u);
    setUserState(u);
  };

  const logout = () => {
    removeToken();
    localStorage.removeItem('cavok_user');
    setUserState(null);
  };

  return (
    <AuthContext.Provider value={{ user, loginUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
