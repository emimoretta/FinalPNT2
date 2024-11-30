<template>
    <div class="gift-page">
      <!-- Barra de búsqueda de usuarios -->
      <div class="search-bar">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Buscar usuarios por username"
          class="form-control"
        />
        <button @click="searchUsers" class="btn btn-primary">Buscar</button>
      </div>
    </div>
  
      <!-- Grilla de usuarios -->

    <div class="grid">
        <div v-for="user in users" :key="user.id" class="card" @click="viewUserWishlist(user.username)">
      <img
        :src="user.avatar"
        alt="Avatar del usuario"
        class="avatar-img"
        width="100"
        height="100"
      />
      <h3 class="card-title">{{ user.username }}</h3>
  </div>
</div>
    
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    name: "GiftPage",
    data() {
      return {
        searchQuery: "", // Consulta de búsqueda
        users: [], // Lista de usuarios encontrados
      };
    },
    methods: {
        viewUserWishlist(username) {
    this.$emit("viewWishlist", username);
  },
      async searchUsers() {
        try {
          const response = await axios.get(
            "https://673f4527a9bc276ec4b7e74c.mockapi.io/api/v1/users",
            {
              params: { username: this.searchQuery },
            }
          );
  
          // Generar un avatar aleatorio para cada usuario
          this.users = response.data.map((user) => ({
            ...user,
           avatar: `https://api.multiavatar.com/${user.username}.png`,
          }));
        } catch (error) {
          console.error("Error buscando usuarios:", error);
          alert("Hubo un error al buscar usuarios. Inténtalo nuevamente.");
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .gift-page {
    padding: 20px;
  }
  .search-bar {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
  }
  .search-bar input {
    flex: 1;
    margin-right: 10px;
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
  .avatar-img {
  border-radius: 50%;
  object-fit: cover; /* Asegura que la imagen se ajuste al contenedor circular */
  display: block;
  margin: 0 auto;
}
  .card-title {
    font-size: 16px;
    margin-bottom: 5px;
  }
  </style>