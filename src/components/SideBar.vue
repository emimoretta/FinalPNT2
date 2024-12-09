<template>
  <div class="sidebar">
    <!-- Logo -->
    <div class="sidebar-logo">
      <img src="@/assets/logo.png" alt="Logo" />
    </div>

    <!-- Bienvenida -->
    <div class="sidebar-welcome">
      <p>Bienvenid@, <span class="username">{{ username }}</span></p>
    </div>

    <!-- Separador -->
    <hr class="sidebar-separator" />


    <!-- Opciones del menú -->
    <ul class="sidebar-menu">
      <li @click="selectPage('UserProfile')">
        <a class="sidebar-link">
          <i class="fas fa-user-circle"></i>
          <span>Mi cuenta</span>
        </a>
      </li>
      <li @click="selectPage('WishList')">
        <a class="sidebar-link">
          <i class="fas fa-heart"></i>
          <span>Mis deseos</span>
        </a>
      </li>
      <li @click="selectPage('GiftPage')">
        <a class="sidebar-link">
          <i class="fas fa-gift"></i>
          <span>Regalar</span>
        </a>
      </li>
      <li @click="selectPage('AccountSettings')">
        <a class="sidebar-link">
          <i class="fas fa-cog"></i>
          <span>Configuración</span>
        </a>
      </li>
       <!-- Cerrar sesión -->
       <li @click="logout">
        <a class="sidebar-link">
          <i class="fas fa-sign-out-alt"></i>
          <span>Cerrar sesión</span>
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "SideBar",
  data() {
    return {
      username: "", // Nombre del usuario
    };
  },
  methods: {
    selectPage(page) {
      this.$emit("selectPage", page); // Emite el evento para cambiar la página
    },
    logout() {
      // Eliminar datos de sesión
      localStorage.removeItem("currentUser");
      // Redirigir al login
      this.$router.push({ path: "/" });

    },
  },
  mounted() {
    // Obtener el username desde localStorage
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    this.username = currentUser ? currentUser.username : "Usuario";
  },
};
</script>

<style scoped>
.sidebar-separator {
  height: 2px;
  /* Grosor de la línea */
  background-color: #007bff;
  /* Color más destacado */
}

.sidebar {
  width: 250px;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
}

.sidebar-logo img {
  width: 50px;
  margin-bottom: 20px;
}

.sidebar-menu {
  list-style: none;
  padding: 0;
  width: 100%;
}

.sidebar-link {
  display: flex;
  align-items: center;
  padding: 10px 15px;
  border-radius: 5px;
  color: #333333;
  text-decoration: none;
  transition: all 0.2s ease-in-out;
}

.sidebar-link:hover {
  background-color: #f0f4f7;
  color: #007bff;
}

.sidebar-link i {
  margin-right: 10px;
  font-size: 20px;
}

.sidebar-link span {
  font-size: 16px;
  font-weight: 500;
}

.sidebar-welcome {
  text-align: center;
  margin-bottom: 20px;
}

.sidebar-welcome p {
  font-size: 16px;
  font-weight: bold;
  margin: 0;
}

.username {
  color: #007bff;
}
.sidebar-menu li:last-child .sidebar-link {
  color: red;
  font-weight: bold;
}

.sidebar-menu li:last-child .sidebar-link:hover {
  color: darkred;
}
</style>