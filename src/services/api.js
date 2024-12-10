import axios from "axios";

// URL base de Mockapi.io
const API_URL = "https://673f4527a9bc276ec4b7e74c.mockapi.io/api/v1/users";

// Simular un token único
const generateToken = () => Math.random().toString(36).substr(2);

// Registrar un usuario
export const registerUser = async (user) => {
  try {
    const existingUserResponse = await axios.get(API_URL);

    const existingUser = existingUserResponse.data.find(
      (u) => u.username.toLowerCase() === user.username.toLowerCase()
    );

    if (existingUser) {
      throw new Error("El usuario ya existe.");
    }

    const newUser = {
      username: user.username, 
      password: user.password,
      fullName: "", 
      city: "",
      birthday: "",
      interests: "",
    };

    const response = await axios.post(API_URL, newUser);


    return response.data;
  } catch (error) {
    // Log detallado para depurar errores
    if (error.response) {
      console.error("Error en la respuesta del servidor:", error.response.data);
      console.error("Código de estado:", error.response.status);
    } else {
      console.error("Error al conectar con el servidor:", error.message);
    }
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