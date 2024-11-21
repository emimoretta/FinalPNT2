<template>
  <div class="d-flex flex-column justify-content-center align-items-center vh-100">
    <!-- Logo -->
    <div class="mb-4">
      <img src="@/assets/logo.png" alt="Logo" class="logo" />
    </div>

    <!-- Barra de búsqueda -->
    <SearchBar />

    <!-- Formulario de login -->
    <LoginForm />
  </div>
</template>

<script>
import LoginForm from "@/components/LoginForm.vue"; // Importa el componente Login
import SearchBar from "@/components/SearchBar.vue"; // Importa el componente SearchBar

export default {
  name: "HomePage",
  components: {
    LoginForm,
    SearchBar,
  },
};
</script>

<style scoped>
/* Estilos específicos para la HomePage */
.logo {
  max-width: 150px;
}
</style>