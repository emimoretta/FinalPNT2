<template>
  <div class="card w-50 p-4 shadow">
    <h2 class="text-center mb-4">{{ isRegistering ? "Regístrate" : "Iniciar Sesión" }}</h2>

    <form @submit.prevent="handleSubmit">
      <div class="mb-3">
        <label for="username" class="form-label">Usuario</label>
        <input type="text" class="form-control" id="username" placeholder="Ingresa tu usuario" v-model="username" />
      </div>

      <div class="mb-3">
        <label for="password" class="form-label">Contraseña</label>
        <input
          type="password"
          class="form-control"
          id="password"
          placeholder="Ingresa tu contraseña"
          v-model="password"
        />
      </div>

      <div v-if="isRegistering" class="mb-3">
        <label for="confirmPassword" class="form-label">Reingresar Contraseña</label>
        <input
          type="password"
          class="form-control"
          id="confirmPassword"
          placeholder="Reingresa tu contraseña"
          v-model="confirmPassword"
        />
      </div>

      <button type="submit" class="btn btn-primary w-100">
        {{ isRegistering ? "Registrarme" : "Iniciar Sesión" }}
      </button>
    </form>

    <div class="text-center mt-3">
      <p class="mb-0">
        {{ isRegistering ? "¿Ya tienes cuenta?" : "¿No tienes cuenta?" }}
        <a href="#" class="text-decoration-none" @click.prevent="toggleForm">
          {{ isRegistering ? "Inicia sesión" : "¡Regístrate!" }}
        </a>
      </p>
    </div>
  </div>
</template>

<script>
import { registerUser, loginUser, logoutUser } from "@/services/api";



export default {
  name: "LoginForm",
  data() {
    return {
      isRegistering: false,
      username: "",
      password: "",
      confirmPassword: "",
    };
  },
  methods: {
    toggleForm() {
      this.isRegistering = !this.isRegistering;
      this.username = "";
      this.password = "";
      this.confirmPassword = "";
    },
    async handleSubmit() {
      if (this.isRegistering) {
        // Registro
        try {
          const user = await registerUser({ username: this.username, password: this.password });
          alert(`Usuario registrado con éxito: ${user.username}`);
          this.toggleForm();
        } catch (error) {
          alert("Error al registrar usuario.");
        }
      } else {
        // Inicio de sesión
        try {
          const { user } = await loginUser(this.username, this.password);
          alert(`Bienvenido, ${user.username}`);
          this.$router.push("/dashboard"); // Redirigir al dashboard
        } catch (error) {
          alert("Usuario o contraseña incorrectos.");
        }
      }
    },
    handleLogout() {
      logoutUser();
      alert("Has cerrado sesión.");
      this.$router.push("/");
    },
  },
};
</script>

<style scoped>
/* Estilos específicos */
</style>