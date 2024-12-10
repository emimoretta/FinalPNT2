<template>
  <div class="dashboard">

    <div class="notifications-container">
      <div
        v-for="(notification, index) in notifications"
        :key="index"
        class="notification"
      >
        🎁 ¡Alguien te regaló algo. Revisá tu listado ahora! 🎁
      </div>
    </div>

    <SideBar @selectPage="changePage" />
    <div class="dashboard-content">
      <component
        :is="currentPage"
        @viewWishlist="viewWishlist"
        :username="selectedUsername"
      />
    </div>
  </div>
</template>

<script>
import axios from "axios";

import SideBar from "@/components/SideBar.vue";
import WishList from "@/components/WishList.vue";
import GiftPage from "@/components/GiftPage.vue";
import UserWishList from "@/components/UserWishList.vue";
import AccountSettings from "@/components/AccountSettings.vue";
import UserProfile  from "@/components/UserProfile.vue";


export default {
  name: "DashBoard",
  components: {
    SideBar,
    WishList,
    GiftPage,
    UserWishList,
    AccountSettings,
    UserProfile,
  },
  data() {
    return {
      currentPage: "WishList", // Página inicial
      selectedUsername: null, // Usuario seleccionado para la lista de deseos
      items: [], // Lista de ítems del usuario
      giftedItems: [], // Ítems que ya están en estado 'gifted'
      notifications: [], // Lista de notificaciones para los popups
    };
  },
  methods: {
    changePage(page) {
      this.currentPage = page;
    },
    viewWishlist(username) {
      this.selectedUsername = username;
      this.currentPage = "UserWishList"; // Cambiar a la vista de UserWishlist
    },

    async checkGiftedItems() {
      try {
        // Obtener el userId del usuario actual
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        if (!currentUser || !currentUser.id) {
          console.error("No se pudo identificar al usuario.");
          return;
        }
        const userId = currentUser.id;

        // Obtener los ítems del usuario desde MockAPI
        const response = await axios.get(
          "https://673f4527a9bc276ec4b7e74c.mockapi.io/api/v1/items",
          { params: { userId } }
        );

        // Detectar ítems que cambiaron su estado a "gifted"
        const updatedGiftedItems = response.data.filter(
          (item) => item.status === "gifted"
        );

        // Identificar nuevos ítems 'gifted' que no estaban en la lista anterior
        const newGiftedItems = updatedGiftedItems.filter(
          (item) => !this.giftedItems.some((gifted) => gifted.id === item.id)
        );

        // Agregar notificaciones para los nuevos ítems 'gifted'
        newGiftedItems.forEach(() => {
          this.notifications.push({}); // Notificación genérica

          // Eliminar notificación después de 5 segundos
          setTimeout(() => {
            this.notifications.shift(); // Quitar la notificación más antigua
          }, 5000);
        });

        // Actualizar la lista local de ítems 'gifted'
        this.giftedItems = updatedGiftedItems;
      } catch (error) {
        console.error("Error verificando ítems regalados:", error);
      }
    },
  },
  mounted() {
    // Inicializar los ítems regalados actuales
    this.checkGiftedItems();

    // Verificar periódicamente los cambios (cada 10 segundos)
    setInterval(this.checkGiftedItems, 10000);

  },
};
</script>

<style scoped>
.dashboard {
  display: flex;
  height: 100vh;
}
.dashboard-content {
  flex: 1;
  padding: 20px;
  background-color: #f8f9fa;
  overflow-y: auto;
}

.notifications-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px; /* Espacio entre notificaciones */
  z-index: 1000;
}

/* Estilo para cada notificación */
.notification {
  background-color: #28a745;
  color: white;
  padding: 15px 20px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  font-size: 16px;
  animation: fadeInOut 5s;
  z-index: 1000;
}

/* Animación para aparecer y desaparecer */
@keyframes fadeInOut {
  0% {
    opacity: 0;
    transform: translateY(10px);
  }
  10%, 90% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateY(10px);
  }
}
</style>