<template>
  <div>
    <!-- Stylish Navbar -->
    <nav class="navbar navbar-expand-lg navbar-light">
      <div class="container">
        <router-link class="navbar-brand" to="/">WHATSAPP</router-link>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item" v-if="!isAuthenticated">
              <router-link class="nav-link" to="/login">Login</router-link>
            </li>
            <li class="nav-item" v-if="!isAuthenticated">
              <router-link class="nav-link" to="/signup">Register</router-link>
            </li>
            <li class="nav-item" v-if="isAuthenticated">
              <router-link class="nav-link" to="/profile">Profile</router-link>
            </li>
            <li class="nav-item" v-if="isAuthenticated">
              <button @click="handleLogout" class="nav-link" style="background: none; border: none; color: #ffffff;">Logout</button>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <!-- Main content -->
    <router-view></router-view>

    <!-- Chat components only appear when authenticated and not on login/signup pages -->
    <div v-if="isAuthenticated && !isOnAuthPage">
      <ChatMessages />
      <ChatInput />
    </div>
  </div>
</template>

<script>
import { auth } from './firebaseConfig';
import { onAuthStateChanged } from "firebase/auth";
import ChatMessages from './components/ChatMessages.vue';

export default {
  components: {
    ChatMessages,
  },
  data() {
    return {
      isAuthenticated: false,
    };
  },
  computed: {
    // Computed property to check if the user is on the login or signup page
    isOnAuthPage() {
      return ['/login', '/signup'].includes(this.$route.path);
    },
  },
  created() {
    onAuthStateChanged(auth, (user) => {
      this.isAuthenticated = !!user;
    });
  },
  methods: {
    handleLogout() {
      auth.signOut().then(() => {
        this.$router.push('/login');
      }).catch(error => {
        console.error("Logout Error: ", error);
      });
    },
  },
  watch: {
    // Watch for route changes to re-evaluate `isOnAuthPage`
    $route() {
      // React to route changes if needed
    },
  },
};
</script>

<style scoped>
/* Navbar Styling */
.navbar {
  background: linear-gradient(135deg, #4caf50, #81c784); /* Green Gradient Background */
  padding: 10px 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); /* Shadow */
}

.navbar-brand {
  font-weight: bold;
  font-size: 1.5rem;
  color: #ffffff;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2); /* Text shadow for branding */
  letter-spacing: 1px;
}

.navbar-brand:hover {
  color: #ffd700; /* Gold hover effect */
}

.nav-link {
  font-size: 1.2rem;
  color: #ffffff !important;
  padding: 10px 15px;
  transition: color 0.3s ease, background-color 0.3s ease;
}

.nav-link:hover {
  color: #ffd700 !important; /* Gold hover effect */
  background-color: rgba(255, 255, 255, 0.2); /* Subtle background hover effect */
  border-radius: 5px;
}

.nav-item {
  margin-left: 10px;
}

.container {
  max-width: 1140px;
}

.navbar-toggler {
  border: none;
}

.navbar-toggler-icon {
  background-image: url("data:image/svg+xml;charset=utf8,%3Csvg viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath stroke='rgba%28155, 155, 155, 0.9%29' stroke-width='2' stroke-linecap='round' stroke-miterlimit='10' d='M4 7h22M4 15h22M4 23h22'/%3E%3C/svg%3E");
}

@media (max-width: 991px) {
  .navbar {
    padding: 10px 15px;
  }
  .nav-link {
    padding: 12px 20px;
    font-size: 1.2rem;
  }
}
</style>
