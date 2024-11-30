<template>
    <div class="account-settings">
      <h1>Configuración de la cuenta</h1>
      <form @submit.prevent="updateAccount">
        <!-- Campo para el nombre de usuario -->
        <div class="form-group">
          <label for="username">Nombre de usuario</label>
          <input
            type="text"
            id="username"
            v-model="form.username"
            class="form-control"
            placeholder="Nombre de usuario"
            required
          />
        </div>
  
        <!-- Campo para la contraseña -->
        <div class="form-group">
          <label for="password">Contraseña</label>
          <input
            type="password"
            id="password"
            v-model="form.password"
            class="form-control"
            placeholder="Nueva contraseña"
            required
          />
        </div>
  
        <!-- Campo para repetir la contraseña -->
        <div class="form-group">
          <label for="confirmPassword">Repetir contraseña</label>
          <input
            type="password"
            id="confirmPassword"
            v-model="form.confirmPassword"
            class="form-control"
            placeholder="Repetir nueva contraseña"
            required
          />
        </div>
  
        <!-- Botón para guardar los cambios -->
        <button type="submit" class="btn btn-primary">Guardar cambios</button>
      </form>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    name: "AccountSettings",
    data() {
      return {
        form: {
          username: "",
          password: "",
          confirmPassword: "",
        },
      };
    },
    async mounted() {
      // Obtener los datos actuales del usuario desde la base de datos
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));
      if (currentUser) {
        this.form.username = currentUser.username;
      }
    },
    methods: {
      async updateAccount() {
        if (this.form.password !== this.form.confirmPassword) {
          alert("Las contraseñas no coinciden.");
          return;
        }
  
        try {
          const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  
          // Actualizar los datos en la base de datos (MockAPI)
          await axios.put(
            `https://673f4527a9bc276ec4b7e74c.mockapi.io/api/v1/users/${currentUser.id}`,
            {
              username: this.form.username,
              password: this.form.password,
            }
          );
  
          // Actualizar los datos del usuario en localStorage
          currentUser.username = this.form.username;
          localStorage.setItem("currentUser", JSON.stringify(currentUser));
  
          alert("¡Datos actualizados correctamente!");
        } catch (error) {
          console.error("Error actualizando los datos:", error);
          alert("Hubo un error al actualizar los datos. Intenta nuevamente.");
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .account-settings {
    padding: 20px;
    max-width: 500px;
    margin: 0 auto;
  }
  h1 {
    text-align: center;
    margin-bottom: 20px;
  }
  .form-group {
    margin-bottom: 15px;
  }
  label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
  }
  input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 14px;
  }
  button {
    display: block;
    width: 100%;
    padding: 10px;
    font-size: 16px;
    color: #fff;
    background-color: #007bff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  button:hover {
    background-color: #0056b3;
  }
  </style>