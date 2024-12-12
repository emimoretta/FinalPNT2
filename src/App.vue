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
      <a href="https://www.facebook.com/EmiMoretta/?locale=es_LA" target="_blank" class="text-decoration-none me-3">
        <i class="fab fa-facebook"></i>
      </a>
      <a href="https://www.instagram.com/emimoretta_/?hl=es" target="_blank" class="text-decoration-none me-3">
        <i class="fab fa-instagram"></i>
      </a>
      <a href="https://www.linkedin.com/in/emiliano-moretta-a4b9986b/" target="_blank" class="text-decoration-none">
        <i class="fab fa-linkedin"></i>
      </a>
    </div>

    <div>
    <button @click="openPopup" class="btn btn-link">
      Sugerencias / Reportar Bugs
    </button>

    <div v-if="showPopup" class="popup-overlay">
      <div class="popup-content">
        <h3>Enviar Sugerencia o Reporte</h3>
        <form @submit.prevent="submitForm">
          <div class="mb-3">
            <label for="email" class="form-label">Tu correo electrónico (opcional)</label>
            <input
              type="email"
              id="email"
              v-model="form.email"
              class="form-control"
              placeholder="Tu correo"
            />
          </div>
          <div class="mb-3">
            <label for="message" class="form-label">Tu mensaje</label>
            <textarea
              id="message"
              v-model="form.message"
              class="form-control"
              rows="4"
              placeholder="Escribe aquí tu sugerencia o reporte..."
              required
            ></textarea>
          </div>
          <div class="d-flex justify-content-between">
            <button type="submit" class="btn btn-primary">Enviar</button>
            <button type="button" @click="closePopup" class="btn btn-secondary">
              Cerrar
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  </footer>
</template>

<script>
import emailjs from "emailjs-com";

export default {
  name: 'App',
  data() {
    return {
      showPopup: false, // Controla la visibilidad del popup
      form: {
        from_name: "", // Correo opcional
        message: "", // Mensaje del usuario
      },
    };
  },
  methods: {
    openPopup() {
      this.showPopup = true;
    },
    closePopup() {
      this.showPopup = false;
      this.resetForm();
    },
    resetForm() {
      this.form.from_name = "";
      this.form.message = "";
    },
    async submitForm() {
      if (!this.form.message.trim()) {
        alert("Por favor, escribe un mensaje.");
        return;
      }

      try {
        // Enviar correo usando EmailJS
        const serviceId = "service_lp2hebc";
        const templateId = "template_e8xro55";
        const publicKey = "6VGLQjjrDhIjpqGiM";

        const templateParams = {
          from_name: this.form.email || "Sin correo",
          message: this.form.message,
        };

        await emailjs.send(serviceId, templateId, templateParams, publicKey);

        alert("¡Gracias por tu mensaje! Lo hemos recibido correctamente.");
        this.closePopup();
      } catch (error) {
        console.error("Error al enviar el correo:", error);
        alert("Hubo un error al enviar el mensaje. Intenta nuevamente.");
      }
    },
  },
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

.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

/* Contenido del popup */
.popup-content {
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}

.popup-content h3 {
  margin-bottom: 20px;
}

.popup-content .btn {
  margin: 5px;
}

</style>