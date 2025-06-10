// src/services/authService.ts
import axios from 'axios';
const API_URL = 'http://localhost:3000/api/v1/auth'; // ajusta si usas variable de entorno

export async function login({ rut, password }: { rut: string; password: string }) {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rut, password }),
  });

  if (!response.ok) {
    throw new Error('Credenciales inválidas');
  }

  return response.json(); // puedes guardar token aquí si se devuelve
}
export const registerUser = async (userData: {
    username: string;
    email: string;
    password: string;
    role: string;
}) => {
    const response = await axios.post(`${API_URL}/auth/register`, userData, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}` // Solo accesible con token de admin
        }
    });
    return response.data;
};
