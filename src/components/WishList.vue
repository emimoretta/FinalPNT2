<template>
  <div class="wishlist">
    <!-- Barra de búsqueda -->
    <div class="search-bar">
      <input
        type="text"
        v-model="itemUrl"
        @input="validateUrl"
        placeholder="Inserta la URL del artículo de MercadoLibre"
        class="form-control"
      />
      <span class="status-icon">
        <i v-if="status === 'validating'" class="fas fa-spinner fa-spin"></i>
        <i v-else-if="status === 'valid'" class="fas fa-check-circle text-success"></i>
        <i v-else-if="status === 'invalid'" class="fas fa-times-circle text-danger"></i>
      </span>
      <button @click="addItem" :disabled="status !== 'valid'" class="btn btn-primary">
        Agregar
      </button>
    </div>

    <!-- Grilla de tarjetas -->
    <div class="grid">
      <div v-for="item in items" :key="item.code" class="card">
        <!-- Ícono de cierre -->
        <span class="card-close" @click="confirmDeletion(item.code)">×</span>

        <a :href="item.permalink" target="_blank" class="card-link">
          <img :src="item.picture" alt="Imagen del producto" class="card-img" />
          <h3 class="card-title">{{ item.title }}</h3>
          <p class="card-price">${{ item.price }}</p>
        </a>
      </div>
    </div>

    <!-- Popup de confirmación -->
    <div v-if="showPopup" class="popup-overlay">
      <div class="popup-content">
        <p>¿Estás seguro de que quieres eliminar este ítem?</p>
        <button @click="deleteItem" class="btn btn-danger">Eliminar</button>
        <button @click="closePopup" class="btn btn-secondary">Cancelar</button>
      </div>
    </div>
  </div>
</template>


<script>
import axios from "axios";

export default {
  name: "WishList",
  data() {
  return {
    itemUrl: "",
    items: [],
    status: "",
    showPopup: false, // Controla la visibilidad del popup
    itemToDelete: null, // Código del ítem a eliminar
  };
},
  methods: {

    confirmDeletion(code) {
    this.itemToDelete = code; // Almacena el código del ítem a eliminar
    this.showPopup = true; // Muestra el popup
  },
  closePopup() {
    this.itemToDelete = null; // Limpia el código del ítem a eliminar
    this.showPopup = false; // Oculta el popup
  },

  async deleteItem() {
    if (!this.itemToDelete) return;

    try {
      // Eliminar el ítem de MockAPI
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));
      const userId = currentUser.id;

      // Buscar el ítem en MockAPI con userId y código
      const response = await axios.get("https://673f4527a9bc276ec4b7e74c.mockapi.io/api/v1/items", {
        params: { userId, code: this.itemToDelete },
      });

      if (response.data.length > 0) {
        const itemId = response.data[0].id; // ID del ítem en MockAPI
        await axios.delete(`https://673f4527a9bc276ec4b7e74c.mockapi.io/api/v1/items/${itemId}`);
      }

      // Eliminar el ítem de la lista local
      this.items = this.items.filter((item) => item.code !== this.itemToDelete);

      // Cerrar el popup
      this.closePopup();
    } catch (error) {
      console.error("Error eliminando el ítem:", error);
      alert("Hubo un error al eliminar el ítem. Inténtalo nuevamente.");
    }
  },
  
    // Función para extraer y validar el código desde la URL
    async extractCode(url) {
  try {
    let code;

    // Validación 1: Formato estándar "MLA-xxxxx"
    const matchStandard = url.match(/MLA-\d+/);
    if (matchStandard) {
      code = matchStandard[0].replace("-", "");
    } else {
      // Validación 2: Formato "&wid=MLAxxxxx"
      const matchWid = url.match(/[?&]wid=(MLA\d+)/);
      if (matchWid) {
        code = matchWid[1]; // Extraer el código después de "wid="
      } else {
        // Validación 3: Formato "/p/MLAxxxxx"
        const matchP = url.match(/\/p\/(MLA\d+)/);
        if (matchP) {
          const intermediateCode = matchP[1]; // Código intermedio (e.g., MLA38098260)

          // Llamar a la API para obtener el itemId final
          const response = await axios.get(
            `https://www.mercadolibre.com.ar/p/api/products/${intermediateCode}/s`
          );

          const items =
            response.data?.components?.track?.melidata_event?.event_data?.items;
           
          if (!items || items.length === 0) {
            throw new Error("No se pudo obtener un itemId válido de la API.");
          }

          code = items[0]?.item_id; // Usamos el primer item_id disponible
          
        }
      }
    }

    if (!code) throw new Error("URL no válida.");

    // Verificar que el código exista en la API principal
    await axios.get(`https://api.mercadolibre.com/items/${code}`);
    return code; // Retorna el código válido
  } catch (error) {
    console.error("Error extrayendo el código:", error);
    throw error; // Lanzar error para manejarlo en las funciones principales
  }
},

    // Validar URL y actualizar estado visual
    async validateUrl() {
      this.status = "validating";
      try {
        await this.extractCode(this.itemUrl); // Extrae y valida el código
        this.status = "valid"; // Mostrar tick verde si es válido
      } catch (error) {
        this.status = "invalid"; // Mostrar cruz roja si no es válido
      }
    },

    // Agregar un ítem
    async addItem() {
  if (!this.itemUrl) {
    alert("Por favor, ingresa una URL válida.");
    return;
  }

  try {
    const code = await this.extractCode(this.itemUrl); // Extrae y valida el código

    // Verificar si el código ya está en la lista local
    if (this.items.some((item) => item.code === code)) {
      alert("Este artículo ya está en tu lista.");
      return;
    }

    // Obtener el userId del usuario actual
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser || !currentUser.id) {
      alert("No se pudo identificar al usuario actual. Por favor, inicia sesión nuevamente.");
      return;
    }
    const userId = currentUser.id;

    // Guardar el código y el userId en MockAPI
    await axios.post("https://673f4527a9bc276ec4b7e74c.mockapi.io/api/v1/items", {
      userId,
      code,
    });

    // Llamar a la API principal para obtener datos del producto
    const finalResponse = await axios.get(`https://api.mercadolibre.com/items/${code}`);
    const { title, price, pictures, permalink } = finalResponse.data;
    const picture = pictures[0]?.url || "";

    // Agregar el nuevo ítem al array local
    this.items.push({ code, title, price, picture, permalink });
    this.itemUrl = ""; // Limpiar el campo de entrada
    this.status = ""; // Resetear el estado de validación
  } catch (error) {
    console.error("Error agregando el ítem:", error);
    alert("Hubo un error al agregar el ítem. Verifica la URL e inténtalo de nuevo.");
  }
},

// Cargar ítems desde MockAPI
async fetchItems() {
      try {
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        if (!currentUser || !currentUser.id) {
          alert("No se pudo identificar al usuario actual. Por favor, inicia sesión nuevamente.");
          return;
        }
        const userId = currentUser.id;

        const response = await axios.get(
          "https://673f4527a9bc276ec4b7e74c.mockapi.io/api/v1/items",
          { params: { userId } }
        );

        const items = await Promise.all(
          response.data.map(async (item) => {
            const apiResponse = await axios.get(
              `https://api.mercadolibre.com/items/${item.code}`
            );
            const { title, price, pictures,permalink } = apiResponse.data;
            const picture = pictures[0]?.url || "";
            return { code: item.code, title, price, picture, permalink };
          })
        );

        this.items = items; // Actualizar el array local
      } catch (error) {
        console.error("Error cargando ítems:", error);
        alert("Hubo un error al cargar tus deseos.");
      }
    },
  },

  

  

  mounted() {
    this.fetchItems();
  },
};
</script>

<style scoped>
.wishlist {
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
.status-icon {
  margin-right: 10px;
  font-size: 18px;
}
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}
.card {
  position: relative;
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
.card-close {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 20px;
  color: red;
  cursor: pointer;
  font-weight: bold;
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