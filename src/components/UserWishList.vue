<template>
    <div class="user-wishlist">
      <h1>Mostrando lista de deseos del usuario {{ username }}</h1>
      <div v-if="items.length === 0" class="empty-message">
        <p>Este usuario no tiene deseos en su lista.</p>
      </div>
      <div v-else class="grid">
        <div v-for="item in items" :key="item.code" class="card">
          <a :href="item.permalink" target="_blank" class="card-link">
            <img :src="item.picture" alt="Imagen del producto" class="card-img" />
            <h3 class="card-title">{{ item.title }}</h3>
            <p class="card-price">${{ item.price }}</p>
            <p class="card-status" :class="item.status">
              {{ item.status === "gifted" ? "Regalado 🎁" : "Disponible 🛒" }}
            </p>
          </a>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    name: "UserWishlist",
    props: {
      username: {
        type: String,
        required: true,
      },
    },
    data() {
      return {
        items: [], // Lista de deseos del usuario
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
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 20px;
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
  </style>