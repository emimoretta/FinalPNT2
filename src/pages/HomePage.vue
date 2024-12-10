<template>
  <div class="d-flex flex-column justify-content-center align-items-center vh-90" style="height: 100vh;" >
    <!-- Logo -->
    <div class="upperBar">
      <label>⚡Bienvenido a Wishlist! Comenzá con el paso a paso para registrarte⚡</label>
    </div>
    <div class="mb-4">
      <img src="@/assets/logo.png" alt="Logo" class="logo" />
    </div>

    <!-- Barra de búsqueda -->


    <!-- Formulario de login -->
    <LoginForm />

    <div class="features-section">
      <h2 class="section-title">¿Cómo funciona?</h2>
      <div class="features-container">
        <!-- Tarjeta 1 -->
        <div class="feature-card">
          <div class="feature-icon">
            <i class="fas fa-user-plus"></i>
          </div>
          <h3 class="feature-title">Regístrate</h3>
          <p class="feature-description">
            Crea tu cuenta en pocos pasos y comienza a construir tu lista de deseos.
          </p>
        </div>

        <!-- Tarjeta 2 -->
        <div class="feature-card">
          <div class="feature-icon">
            <i class="fas fa-gift"></i>
          </div>
          <h3 class="feature-title">Agrega tus regalos</h3>
          <p class="feature-description">
            Añade tus deseos y organiza tus regalos por ocasión.
          </p>
        </div>

        <!-- Tarjeta 3 -->
        <div class="feature-card">
          <div class="feature-icon">
            <i class="fas fa-share-alt"></i>
          </div>
          <h3 class="feature-title">Comparte tu perfil</h3>
          <p class="feature-description">
            Comparte tu lista con familiares y amigos para recibir los regalos que realmente quieres.
          </p>
        </div>
      </div>
    </div>

 

  </div>
</template>

<script>
import LoginForm from "@/components/LoginForm.vue"; 

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
.upperBar{
  background-color: rgba(255, 238, 84, 0.978);
  width: 100vi;
  vertical-align: middle;
}

.features-section {

  padding: 40px 20px;
  text-align: center;
}

.section-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
}

.features-container {
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
}

.feature-card {
  background-color: #ffffff;
  border-radius: 10px;
  padding: 20px;
  max-width: 300px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  flex: 1;
}

.feature-icon {
  font-size: 40px;
  color: #1889da;
  margin-bottom: 10px;
}

.feature-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
}

.feature-description {
  font-size: 14px;
  color: #666;
}
</style>