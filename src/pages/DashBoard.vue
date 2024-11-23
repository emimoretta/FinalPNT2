<template>
    <div>
      <h1>Bienvenido al Dashboard</h1>
      <p>Solo puedes ver esto si has iniciado sesión correctamente.</p>
      <button @click="handleLogout" class="btn btn-danger">Cerrar Sesión</button>
    </div>
  </template>
  
  <script>
  import { logoutUser } from "@/services/api";
  
  export default {
    methods: {
      handleLogout() {
        logoutUser();
        alert("Has cerrado sesión.");
        this.$router.push("/");
      },
    },
  };
  </script>