<template>
    <div class="card w-50 p-4 shadow">
      <h2 class="text-center mb-4">Iniciar Sesión</h2>
      <form>
        <div class="mb-3">
          <label for="username" class="form-label">Usuario</label>
          <input type="text" class="form-control" id="username" placeholder="Ingresa tu usuario" />
        </div>
        <div class="mb-3">
          <label for="password" class="form-label">Contraseña</label>
          <input
            type="password"
            class="form-control"
            id="password"
            placeholder="Ingresa tu contraseña"
          />
        </div>
        <button type="submit" class="btn btn-primary w-100">Iniciar Sesión</button>
      </form>
      <div class="text-center mt-3">
        <p class="mb-0">¿No tienes cuenta? <a href="#" class="text-decoration-none">¡Regístrate!</a></p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "LoginForm",
  };
  </script>
  
  <style scoped>
  /* Estilos específicos del login */
  </style>