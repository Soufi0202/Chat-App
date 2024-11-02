<template>
  <div class="signup">
    <h2>Sign Up</h2>
    <form @submit.prevent="signup">
      <div>
        <label for="name">Name:</label>
        <input type="text" v-model="name" required />
      </div>
      <div>
        <label for="email">Email:</label>
        <input type="email" v-model="email" required />
      </div>
      <div>
        <label for="password">Password:</label>
        <input type="password" v-model="password" required />
      </div>
      <div>
        <label for="photo">Profile Picture:</label>
        <input type="file" @change="onFileChange" accept="image/*" />
      </div>
      <button type="submit">Sign Up</button>
    </form>
    <p>{{ error }}</p>
  </div>
</template>

<script>
import { auth, db, storage } from "@/firebaseConfig"; // Import your Firebase config including storage
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default {
  data() {
    return {
      name: "",
      email: "",
      password: "",
      photoURL: "",
      selectedFile: null, // Store the selected file
      error: "",
    };
  },
  methods: {
    onFileChange(event) {
      this.selectedFile = event.target.files[0]; // Get the selected file
    },
    async signup() {
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          this.email,
          this.password
        );
        const user = userCredential.user;

        // Upload the image to Firebase Storage if a file was selected
        if (this.selectedFile) {
          const storageRef = ref(storage, `profile_pictures/${user.uid}`);
          await uploadBytes(storageRef, this.selectedFile);
          // Get the download URL
          this.photoURL = await getDownloadURL(storageRef);
        }

        // Add user to Firestore
        await this.addUserToFirestore(user);
        alert("User registered successfully!");
      } catch (error) {
        this.error = "Error signing up: " + error.message;
        console.error("Error signing up: ", error);
      }
    },
    async addUserToFirestore(user) {
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, {
        email: user.email,
        name: this.name, // Use the entered name
        photoURL: this.photoURL || "", // Save the photo URL
        createdAt: serverTimestamp(),
      });
    },
  },
};
</script>

<style scoped>
.signup {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 10px;
  background-color: #f9f9f9;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.signup h2 {
  text-align: center;
  color: #333;
}

.signup div {
  margin-bottom: 15px;
}

.signup label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #555;
}

.signup input[type="text"],
.signup input[type="email"],
.signup input[type="password"] {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
}

.signup input[type="file"] {
  margin-top: 5px;
}

.signup button {
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 5px;
  background-color: #4a90e2;
  color: white;
  font-size: 16px;
  cursor: pointer;
}

.signup button:hover {
  background-color: #357ab8;
}

.signup p {
  text-align: center;
  color: red; /* Error messages */
}
</style>
