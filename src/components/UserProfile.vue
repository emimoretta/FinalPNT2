<template>
    <div class="user-profile">
        <!-- Avatar del usuario -->
        <div class="avatar-container">
            <img :src="avatarUrl" alt="Avatar del usuario" class="avatar" />
        </div>

        <!-- Nombre de usuario -->
        <h1 class="username">{{ username }}</h1>

        <!-- Campos editables -->
        <div v-if="isEditable" class="editable-fields">
            <label>Nombre completo:</label>
            <input type="text" v-model="user.fullName" class="input-field" placeholder="Escribe tu nombre completo" />

            <label>Ciudad:</label>
            <input type="text" v-model="user.city" class="input-field" placeholder="Escribe tu ciudad" />

            <label>Fecha de cumpleaños:</label>
            <input type="date" v-model="user.birthday" class="input-field" />

            <label>Intereses:</label>
            <textarea v-model="user.interests" class="textarea-field" placeholder="Escribe tus intereses"></textarea>

            <button @click="saveProfile" class="btn btn-save">Guardar cambios</button>
        </div>

        <!-- Vista de solo lectura -->
        <div v-else class="read-only-fields">
            <p><strong>Nombre completo:</strong> {{ user.fullName }}</p>
            <p><strong>Ciudad:</strong> {{ user.city }}</p>
            <p><strong>Fecha de cumpleaños:</strong> {{ user.birthday }}</p>
            <p><strong>Intereses:</strong> {{ user.interests }}</p>
        </div>
    </div>
</template>

<script>
import axios from "axios";

export default {
    name: "UserProfile",
    
    data() {
        return {
            avatarUrl: "", // URL del avatar del usuario
            username: "", // Username del usuario autenticado
            user: {
                fullName: "",
                city: "",
                birthday: "",
                interests: "",
            },
        };
    },
    methods: {
        async fetchUserProfile() {
            try {
                // Obtener el perfil del usuario desde MockAPI
                const response = await axios.get(
                    `https://673f4527a9bc276ec4b7e74c.mockapi.io/api/v1/users`,
                    { params: { username: this.username } }
                );

                if (response.data.length > 0) {
                    const user = response.data[0];
                    this.user = {
                        fullName: user.fullName || "",
                        city: user.city || "",
                        birthday: user.birthday || "",
                        interests: user.interests || "",
                    };
                    this.avatarUrl = `https://api.multiavatar.com/${this.username}.png`;
                } else {
                    console.error("No se encontraron datos del usuario.");
                }
            } catch (error) {
                console.error("Error al cargar el perfil del usuario:", error);
            }
        },
        async saveProfile() {
            try {
                // Guardar cambios del perfil en MockAPI
                const response = await axios.get(
                    `https://673f4527a9bc276ec4b7e74c.mockapi.io/api/v1/users`,
                    { params: { username: this.username } }
                );

                if (response.data.length > 0) {
                    const userId = response.data[0].id;
                    await axios.put(
                        `https://673f4527a9bc276ec4b7e74c.mockapi.io/api/v1/users/${userId}`,
                        this.user
                    );
                    alert("¡Perfil actualizado con éxito!");
                }
            } catch (error) {
                console.error("Error al guardar el perfil:", error);
                alert("Hubo un error al guardar los cambios.");
            }
        },
    },
    mounted() {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (currentUser && currentUser.username) {
      this.username = currentUser.username;
      this.fetchUserProfile();
      this.isEditable = true; // Activar modo editable para el usuario autenticado
    } else {
      this.isEditable = false; // Vista de solo lectura para otros usuarios
    }
  },
};
</script>

<style scoped>

.editable-fields{
    margin: auto;
    max-width: 50%;
}
.user-profile {
    text-align: center;
    padding: 20px;
}

.avatar-container {
    margin: 0 auto;
}

.avatar {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    object-fit: cover;
    margin-bottom: 20px;
}

.username {
    font-size: 24px;
    margin-bottom: 20px;
}

.input-field,
.textarea-field {
    display: block;
    width: 80%;
    margin: 10px auto;
    padding: 10px;
    border-radius: 10px;
    border: 1px solid #ccc;
    font-size: 16px;
}

.textarea-field {
    height: 80px;
    resize: none;
}

.btn-save {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
}

.btn-save:hover {
    background-color: #0056b3;
}

.read-only-fields p {
    font-size: 16px;
    margin: 10px 0;
}
</style>