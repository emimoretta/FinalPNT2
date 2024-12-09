<template>
  <div class="user-wishlist">
    <div>

      <div class="user-banner">
        <!-- Avatar -->
        <div class="avatar-container">
          <img :src="user.avatar" alt="Avatar" class="avatar-img" />
        </div>

        <!-- Información del Usuario -->
        <div class="user-info">
          <h1>{{ username }}</h1>
          <p><strong>Nombre completo:</strong> {{ user.fullName }}</p>
          <p><strong>Ciudad:</strong> {{ user.city }}</p>
          <p><strong>Fecha de cumpleaños:</strong> {{ user.birthday }}</p>
          <p><strong>Intereses:</strong> {{ user.interests }}</p>
        </div>
      </div>

      <!-- Mensaje cuando no hay ítems -->
      <div v-if="items.length === 0" class="empty-message">
        <p>El usuario aún no cargó sus deseos. ¡Sugerile un regalo!</p>
      </div>

      <!-- Mensaje cuando hay ítems -->
      <div v-else class="non-empty-message">
        <p>¡Estos son los deseos del usuario ¿Qué le regalarás?</p>
      </div>
    </div>
    <div class="grid">
      <div v-for="item in items" :key="item.code" class="card">
        <p>{{ item.tag }}</p>
        <img :src="item.picture" alt="Imagen del producto" class="card-img" />
        <a :href="item.permalink" target="_blank" class="card-link">
          <h3 class="card-title">{{ item.title }}</h3>
        </a>
        <p class="card-price">${{ item.price }}</p>
        <p class="card-status" :class="item.status">
          {{ item.status === "gifted" ? "Regalado 🎁" : "Disponible 🛒" }}
        </p>

        <!-- Botón "Regalar" si el ítem está disponible -->
        <button v-if="item.status === 'available'" @click="confirmGift(item)" class="btn btn-primary">
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
import formatearFecha from "../services/formatos";

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
      user: {
        fullName: "",
        city: "",
        birthday: "",
        interests: "",
        avatar: "",
      },
      items: [], // Lista de deseos
      showPopup: false, // Controla la visibilidad del popup
      selectedItem: null, // Ítem seleccionado para regalar
    };
  },
  async mounted() {
    await this.fetchWishlist();
    await this.fetchUserData();
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
              status: item.status || "available", // Estado del ítem,
              tag: item.tag
            };
          })
        );
      } catch (error) {
        console.error("", error);

      }
    },

    async fetchUserData() {
      try {
        // Obtener datos del usuario
        const userResponse = await axios.get(
          `https://673f4527a9bc276ec4b7e74c.mockapi.io/api/v1/users`,
          { params: { username: this.username } }
        );

        if (userResponse.data.length > 0) {
          const user = userResponse.data[0];

          this.user = {
            fullName: user.fullName || "No especificado",
            city: user.city || "No especificado",
            birthday: formatearFecha(user.birthday) || "No especificado",
            interests: user.interests || "No especificado",
            avatar: `https://api.multiavatar.com/${user.username}.png`,
          };

          


          // Obtener ítems del usuario
          const itemsResponse = await axios.get(
            "https://673f4527a9bc276ec4b7e74c.mockapi.io/api/v1/items",
            { params: { userId: user.id } }
          );

          // Consultar la API de MercadoLibre para cada ítem
          this.items = await Promise.all(
            itemsResponse.data.map(async (item) => {
              const apiResponse = await axios.get(
                `https://api.mercadolibre.com/items/${item.code}`
              );
              const { title, price, pictures, permalink } = apiResponse.data;

              return {
                id: item.id,
                title,
                price,
                picture: pictures[0]?.url || "",
                permalink,
                status: item.status || "available",
                tag: item.tag || "",
              };
            })
          );
        } else {
          console.error("Usuario no encontrado.");
        }
      } catch (error) {
        console.error("Error al cargar los datos del usuario:", error);
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

.user-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

/* Avatar */
.avatar-container {
  flex: 1;
  /* Ocupa 1 parte del espacio */
  display: flex;
  justify-content: center;
  align-items: center;
}

.avatar-img {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #007bff;
}

/* Información del usuario */
.user-info {
  flex: 3;
  /* Ocupa 3 partes del espacio */
  padding-left: 20px;
  text-align: left;
}

.user-info h1 {
  font-size: 24px;
  margin-bottom: 10px;
  text-align: left;
}

.user-info p {
  font-size: 16px;
  margin: 5px 0;
}

.username {
  font-size: 24px;
  margin-bottom: 20px;
  text-align: left;
}
</style>