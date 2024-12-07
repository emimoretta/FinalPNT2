<template>
  <div class="dashboard">
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
</style>