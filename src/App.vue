<template>
  <head>
    <link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet">
  </head>
  <!-- Renderiza las páginas dinámicamente según la ruta actual -->
  <router-view />
  <!-- Footer -->
  <footer class="footer bg-light text-center py-3">
      Diseñado por Emiliano Moretta - 2024
      <div class="social-links mt-2">
        <a href="https://www.facebook.com" target="_blank" class="text-decoration-none me-3">
          <i class="fab fa-facebook"></i>
        </a>
        <a href="https://www.instagram.com" target="_blank" class="text-decoration-none me-3">
          <i class="fab fa-instagram"></i>
        </a>
        <a href="https://www.linkedin.com" target="_blank" class="text-decoration-none">
          <i class="fab fa-linkedin"></i>
        </a>
      </div>
    </footer>
</template>

<script>
export default {
  name: 'App',
};
</script>

<style>


#app {
  font-family: 'Poppins';
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;

}

/* Footer */
.footer {
  box-shadow: 0 -4px 10px rgba(0, 0, 0, 0.1); /* Sombra superior */
}

.footer .social-links a {
  font-size: 20px;
  color: #007bff; /* Azul destacado */
  transition: color 0.3s;
}

.footer .social-links a:hover {
  color: #0056b3; /* Azul más oscuro */
}

</style>