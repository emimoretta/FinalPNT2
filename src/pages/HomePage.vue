<template>
  <div class="d-flex flex-column justify-content-center align-items-center vh-90">
    <!-- Logo -->
    <div class="mb-4">
      <img src="@/assets/logo.png" alt="Logo" class="logo" />
    </div>

    <!-- Barra de búsqueda -->


    <!-- Formulario de login -->
    <LoginForm />
  </div>
</template>

<script>
import LoginForm from "@/components/LoginForm.vue"; // Importa el componente Login

export default {
  name: "HomePage",
  components: {
    LoginForm,

  },
};
</script>

<style scoped>
/* Estilos específicos para la HomePage */
.logo {
  max-width: 150px;
}
.card{
  height: auto!important;
}
</style>