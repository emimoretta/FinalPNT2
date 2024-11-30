<template>
  <div class="user-wishlist">
    <div class="grid">
  <div v-for="item in items" :key="item.code" class="card">
    <img :src="item.picture" alt="Imagen del producto" class="card-img" />
    <a :href="item.permalink" target="_blank" class="card-link"><h3 class="card-title">{{ item.title }}</h3></a>
    <p class="card-price">${{ item.price }}</p>
    <p class="card-status" :class="item.status">
      {{ item.status === "gifted" ? "Regalado 🎁" : "Disponible 🛒" }}
    </p>

    <!-- Botón "Regalar" si el ítem está disponible -->
    <button
      v-if="item.status === 'available'"
      @click="confirmGift(item)"
      class="btn btn-primary"
    >
      Regalar
    </button>
  </div>
</div>
  </div>

  <!-- Popup de confirmación -->
  <div v-if="showPopup" class="popup-overlay">
    <div class="popup-content">
      <p>¿Estás seguro de que quieres regalar este ítem?</p>
      <button @click="markAsGifted" class="btn btn-success">Sí, regalar</button>
      <button @click="closePopup" class="btn btn-secondary">Cancelar</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "UserWishList",
  props: {
    username: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      items: [], // Lista de deseos
      showPopup: false, // Controla la visibilidad del popup
      selectedItem: null, // Ítem seleccionado para regalar
    };
  },
  async mounted() {
    await this.fetchWishlist();
  },
  methods: {
    async fetchWishlist() {
      try {
        // Obtener el usuario específico
        const userResponse = await axios.get(
          "https://673f4527a9bc276ec4b7e74c.mockapi.io/api/v1/users",
          { params: { username: this.username } }
        );

        if (userResponse.data.length === 0) {
          alert("No se encontró el usuario.");
          return;
        }

        const userId = userResponse.data[0].id;

        // Obtener los ítems de la base de datos para el usuario
        const itemsResponse = await axios.get(
          "https://673f4527a9bc276ec4b7e74c.mockapi.io/api/v1/items",
          { params: { userId } }
        );

        // Consultar la API de MercadoLibre para cada ítem y mostrar detalles
        this.items = await Promise.all(
          itemsResponse.data.map(async (item) => {
            const apiResponse = await axios.get(
              `https://api.mercadolibre.com/items/${item.code}`
            );
            const { title, price, pictures, permalink } = apiResponse.data;

            return {
              id: item.id, // Asegúrate de incluir el ID
              code: item.code,
              title,
              price,
              picture: pictures[0]?.url || "",
              permalink,
              status: item.status || "available", // Estado del ítem
            };
          })
        );
      } catch (error) {
        console.error("Error cargando la lista de deseos:", error);
        alert("Hubo un error al cargar la lista de deseos del usuario.");
      }
    },
    confirmGift(item) {
      this.selectedItem = item; // Guardar el ítem seleccionado
      this.showPopup = true; // Mostrar el popup
    },
    closePopup() {
      this.selectedItem = null; // Limpiar el ítem seleccionado
      this.showPopup = false; // Ocultar el popup
    },
    async markAsGifted() {
      if (!this.selectedItem) return;

      try {
        // Actualizar el estado del ítem en la base de datos
        await axios.put(
          `https://673f4527a9bc276ec4b7e74c.mockapi.io/api/v1/items/${this.selectedItem.id}`,
          { status: "gifted" }
        );

        // Actualizar la lista local
        this.items = this.items.map((item) =>
          item.id === this.selectedItem.id
            ? { ...item, status: "gifted" }
            : item
        );

        alert("¡Ítem marcado como regalado!");
        this.closePopup(); // Cerrar el popup
      } catch (error) {
        console.error("Error actualizando el estado del ítem:", error);
        alert("Hubo un error al regalar el ítem. Por favor, intenta de nuevo.");
      }
    },
  },
};
</script>

<style scoped>
.user-wishlist {
  padding: 20px;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
}

.card {
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  padding: 15px;
  text-align: center;
  transition: transform 0.2s ease-in-out;
}

.card:hover {
  transform: translateY(-5px);
}

.card-link {
  text-decoration: none;
  color: inherit;
}

.card-img {
  max-width: 100%;
  border-radius: 10px;
  margin-bottom: 10px;
}

.card-title {
  font-size: 16px;
  margin-bottom: 5px;
}

.card-price {
  font-size: 14px;
  color: #28a745;
}

.card-status {
  font-size: 12px;
  margin-top: 5px;
}

.card-status.available {
  color: green;
}

.card-status.gifted {
  color: red;
}

.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.popup-content {
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25);
}

.popup-content button {
  margin: 10px;
}
</style>