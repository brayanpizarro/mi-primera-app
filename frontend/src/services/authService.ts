// src/services/authService.ts
import axios, { AxiosError } from 'axios';

const API_URL = 'http://localhost:3000/api/v1/auth';

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
}

export interface LoginCredentials {
  rut: string;
  password: string;
}

export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  try {
    const response = await axios.post(`${API_URL}/login`, credentials);
    const data = response.data;
    
    // Guardar el token y el rol en localStorage
    localStorage.setItem('token', data.token);
    localStorage.setItem('userRole', data.user.role);
    
    // Disparar un evento para notificar que el almacenamiento ha cambiado
    window.dispatchEvent(new Event('storage'));
    
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<{message: string}>;
      if (axiosError.response?.status === 401) {
        throw new Error('RUT o contraseña incorrectos');
      }
      throw new Error(axiosError.response?.data?.message || 'Error al iniciar sesión');
    }
    throw new Error('Error al iniciar sesión');
  }
};

export const logout = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('userRole');
  // Disparar un evento para notificar que el almacenamiento ha cambiado
  window.dispatchEvent(new Event('storage'));
};

export const getToken = (): string | null => {
  return localStorage.getItem('token');
};

export const isAdmin = (): boolean => {
  const userRole = localStorage.getItem('userRole');
  return userRole === 'admin';
};
