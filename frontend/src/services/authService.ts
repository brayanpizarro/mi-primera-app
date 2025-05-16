// src/services/authService.ts
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
