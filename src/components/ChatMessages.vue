<template>
  <div class="chat-app">
    <!-- Sidebar for Contacts -->
    <div class="sidebar">
      <div class="search">
        <input type="text" v-model="search" placeholder="Search" class="search-input" />
      </div>

      <ul class="contact-list">
        <li
  v-for="contact in filteredContacts"
  :key="contact.id"
  @click="selectContact(contact)"
  :class="{ active: selectedContact && selectedContact.id === contact.id }"
>
  <div class="contact-info">
    <!-- Display user profile picture -->
    <img :src="contact.photoURL || 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/User-avatar.svg/2048px-User-avatar.svg.png'" alt="Avatar" class="contact-avatar" />
    <div class="contact-details">
      <h4>{{ contact.name }}</h4>
      <p>{{ contact.lastMessage }}</p>
    </div>
  </div>
</li>
      </ul>
    </div>

    <!-- Chat Window -->
    <div class="chat-window" v-if="selectedContact">
      <header>
        
        <h2>{{ selectedContact.name }}</h2>
        <span v-if="selectedContact.isOnline">Online</span>
      </header>
      <div class="messages">
        <div
  v-for="message in messages"
  :key="message.id"
  :class="{ 'message-sent': message.sender === currentUser.uid, 'message-received': message.sender !== currentUser.uid }"
>
  <p class="toap">{{ message.content }}</p>
  <span class="timestamp">{{ message.timestamp ? message.timestamp.toDate().toLocaleTimeString() : 'N/A' }}</span>
</div>
      </div>

      <!-- Message Input -->
      <footer>
        <input v-model="newMessage" type="text" placeholder="Type a message..." @keyup.enter="sendMessage" />
        <button @click="sendMessage">Send</button>
      </footer>
    </div>
  </div>
</template>

<script>
import { auth, db } from "@/firebaseConfig";
import { collection, query, where, addDoc, onSnapshot, orderBy, serverTimestamp } from "firebase/firestore";

export default {
  data() {
    return {
      search: "",
      contacts: [],
      selectedContact: null,
      messages: [],
      newMessage: "",
      currentUser: auth.currentUser,
    };
  },
  computed: {
    filteredContacts() {
      return this.contacts.filter(contact =>
        contact.name.toLowerCase().includes(this.search.toLowerCase())
      );
    },
  },
  methods: {
    async selectContact(contact) {
      this.selectedContact = contact;
      this.loadMessages(contact.id);
    },
    async loadContacts() {
      const contactsRef = collection(db, "users");

      // Real-time updates for contacts
      onSnapshot(contactsRef, (querySnapshot) => {
        this.contacts = querySnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(contact => contact.uid !== this.currentUser.uid);
      });
    },
    async loadMessages(contactId) {
      const messagesRef = collection(db, "messages");
      const q = query(
        messagesRef,
        where("chatId", "==", this.getChatId(contactId)),
        orderBy("timestamp", "asc")
      );

      // Real-time updates for messages
      onSnapshot(q, (querySnapshot) => {
        this.messages = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      });
    },
    getChatId(contactId) {
      const ids = [this.currentUser.uid, contactId].sort();
      return ids.join("_");
    },
    async sendMessage() {
      if (this.newMessage.trim() === "") return;

      const message = {
        chatId: this.getChatId(this.selectedContact.id),
        content: this.newMessage,
        sender: this.currentUser.uid,
        timestamp: serverTimestamp(),
      };

      try {
        await addDoc(collection(db, "messages"), message);
        this.newMessage = ""; // Clear input
      } catch (error) {
        console.error("Error sending message: ", error);
      }
    },
    // Helper method to get the user's profile picture
    getUserPhoto(userId) {
      const user = this.contacts.find(contact => contact.uid === userId);
      return user ? user.photoURL : 'default-avatar.png'; // Fallback to default image
    },
  },
  mounted() {
    this.loadContacts();
  },
};
</script>

<style scoped>
.chat-app {
  display: flex;
  height: 100vh;
  font-family: Arial, sans-serif;
}

.sidebar {
  width: 25%;
  background: #f9f9f9;
  padding: 20px;
  border-right: 1px solid #ddd;
}

.contact-list li {
  display: flex;
  padding: 20px;
  cursor: pointer;
  transition: background 0.3s;
}

.contact-info {
  display: flex; /* Align items in a row */
  align-items: center; /* Center items vertically */
}

.contact-avatar {
  width: 40px; /* Adjust size as needed */
  height: 40px; /* Adjust size as needed */
  border-radius: 50%; /* Makes the image circular */
}

.contact-details {
  margin-left: 30px; /* Space between avatar and contact details */
}

.contact-details h4 {
  margin: 0; /* Remove default margin */
  font-size: 16px; /* Adjust font size as needed */
}

.contact-details p {
  margin: 0; /* Remove default margin */
  font-size: 14px; /* Adjust font size for the last message */
  color: #777; /* Optional: change the color for last message */
}

.chat-window {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #fff;
}

header {
  padding: 10px;
  border-bottom: 1px solid #ddd;
  background: #f2f2f2;
}

.messages {
  
  flex: 1;
  padding: 20px;
  font-size: 25px;
  overflow-y: auto;
  background: #fafafa;
}






.message-sent {
  text-align: right;
  color: #4a90e2;
  margin: 10px 0;
}

.message-received {
  text-align: left;
  color: #333;
  margin: 10px 0;
}

.message-avatar {
  width: 30px; /* Adjust size as needed */
  height: 30px; /* Adjust size as needed */
  border-radius: 50%; /* Makes the image circular */
  margin-right: 10px; /* Space between image and text */
}

.timestamp {
  font-size: 0.8em;
  color: #aaa;
}

footer {
  display: flex;
  padding: 10px;
  border-top: 1px solid #ddd;
}

footer input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  outline: none;
}

footer button {
  padding: 10px 20px;
  margin-left: 10px;
  background-color: #4caf50;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
}

footer button:hover {
  background-color: #357ab7;
}

.search {
  margin-bottom: 20px; /* Space below the search bar */
}

.search-input {
  width: 100%; /* Full width */
  padding: 10px; /* Inner spacing */
  border: 1px solid #ccc; /* Light border */
  border-radius: 5px; /* Rounded corners */
  outline: none; /* Remove outline */
  transition: border-color 0.3s; /* Smooth transition for border color */
}

.search-input:focus {
  border-color: #4a90e2; /* Change border color on focus */
}
</style>
