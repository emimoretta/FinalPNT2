import axios from "axios";

// URL base de Mockapi.io
const API_URL = "https://673f4527a9bc276ec4b7e74c.mockapi.io/api/v1/users";

// Simular un token único
const generateToken = () => Math.random().toString(36).substr(2);

// Registrar un usuario
// Registrar un usuario
export const registerUser = async (user) => {
  try {
    // Verificar si el usuario ya existe
    const existingUserResponse = await axios.get(API_URL, {
      params: { username: user.username },
    });

    if (existingUserResponse.data.length > 0) {
      throw new Error("El usuario ya existe.");
    }

    // Si no existe, registrar el usuario
    const response = await axios.post(API_URL, user);
    return response.data;
  } catch (error) {
    console.error("Error registrando usuario:", error.message);
    throw error; // Re-lanzar el error para manejarlo en el frontend
  }
};

// Iniciar sesión
export const loginUser = async (username, password) => {
  try {
    const response = await axios.get(API_URL, { params: { username } });
    const users = response.data;
    const user = users.find((u) => u.password === password);

    if (!user) {
      throw new Error("Usuario o contraseña incorrectos.");
    }

    // Generar y almacenar el token simulado
    const token = generateToken();
    localStorage.setItem("sessionToken", token);
    localStorage.setItem("currentUser", JSON.stringify(user));
    return { user, token };
  } catch (error) {
    console.error("Error iniciando sesión:", error);
    throw error;
  }
};

// Validar sesión activa
export const validateSession = () => {
  const token = localStorage.getItem("sessionToken");
  const user = JSON.parse(localStorage.getItem("currentUser"));
  return token && user;
};

// Cerrar sesión
export const logoutUser = () => {
  localStorage.removeItem("sessionToken");
  localStorage.removeItem("currentUser");
};