import { db, collection, doc, setDoc, getDocs, deleteDoc } from "./firebase-init.js";

// Simple Master Password (In a real app, use Firebase Auth)
const MASTER_PASSWORD = "admin"; 

const adminLogin = document.getElementById('adminLogin');
const adminContent = document.getElementById('adminContent');
const loginBtn = document.getElementById('loginBtn');
const masterPasswordInput = document.getElementById('masterPassword');
const loginError = document.getElementById('loginError');
const addUserBtn = document.getElementById('addUserBtn');
const newEmailInput = document.getElementById('newEmail');
const addMessage = document.getElementById('addMessage');
const userTableBody = document.getElementById('userTableBody');

// Login Logic
loginBtn.addEventListener('click', () => {
    if (masterPasswordInput.value === MASTER_PASSWORD) {
        adminLogin.classList.add('hidden');
        adminContent.classList.remove('hidden');
        loadUsers();
    } else {
        loginError.classList.remove('hidden');
    }
});

// Add User Logic
addUserBtn.addEventListener('click', async () => {
    const email = newEmailInput.value.trim().toLowerCase();
    if (!email) return;

    try {
        addMessage.textContent = "Adding...";
        addMessage.className = "mt-2 text-sm text-gray-600";
        
        // Add to Firestore (ID is the email)
        await setDoc(doc(db, "allowed_users", email), {
            email: email,
            addedAt: new Date().toISOString()
        });

        addMessage.textContent = "User added successfully!";
        addMessage.className = "mt-2 text-sm text-green-600";
        newEmailInput.value = "";
        loadUsers(); // Refresh list
    } catch (error) {
        console.error("Error adding user: ", error);
        addMessage.textContent = "Error adding user: " + error.message;
        addMessage.className = "mt-2 text-sm text-red-600";
    }
});

// Load Users Logic
async function loadUsers() {
    await loadPendingUsers(); // Load pending requests first
    
    userTableBody.innerHTML = '<tr><td colspan="3" class="px-6 py-4 text-center">Loading...</td></tr>';
    
    try {
        const querySnapshot = await getDocs(collection(db, "allowed_users"));
        userTableBody.innerHTML = ''; // Clear loading

        if (querySnapshot.empty) {
            userTableBody.innerHTML = '<tr><td colspan="3" class="px-6 py-4 text-center text-gray-500">No users found.</td></tr>';
            return;
        }

        querySnapshot.forEach((doc) => {
            const user = doc.data();
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${user.email}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${new Date(user.addedAt).toLocaleDateString()}</td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button class="text-red-600 hover:text-red-900 delete-btn" data-email="${user.email}">Delete</button>
                </td>
            `;
            userTableBody.appendChild(row);
        });

        // Attach delete event listeners
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const emailToDelete = e.target.getAttribute('data-email');
                if (confirm(`Are you sure you want to remove access for ${emailToDelete}?`)) {
                    await deleteDoc(doc(db, "allowed_users", emailToDelete));
                    loadUsers(); // Refresh
                }
            });
        });

    } catch (error) {
        console.error("Error loading users: ", error);
        userTableBody.innerHTML = `<tr><td colspan="3" class="px-6 py-4 text-center text-red-500">Error loading users: ${error.message}</td></tr>`;
    }
}

// Load Pending Users Logic
const pendingTableBody = document.getElementById('pendingTableBody');

async function loadPendingUsers() {
    pendingTableBody.innerHTML = '<tr><td colspan="3" class="px-6 py-4 text-center">Loading...</td></tr>';
    
    try {
        const querySnapshot = await getDocs(collection(db, "pending_users"));
        pendingTableBody.innerHTML = ''; // Clear loading

        if (querySnapshot.empty) {
            pendingTableBody.innerHTML = '<tr><td colspan="3" class="px-6 py-4 text-center text-gray-500">No pending requests.</td></tr>';
            return;
        }

        querySnapshot.forEach((doc) => {
            const user = doc.data();
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${user.email}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${new Date(user.requestedAt).toLocaleDateString()}</td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <button class="text-green-600 hover:text-green-900 approve-btn" data-email="${user.email}">Approve</button>
                    <button class="text-red-600 hover:text-red-900 reject-btn" data-email="${user.email}">Reject</button>
                </td>
            `;
            pendingTableBody.appendChild(row);
        });

        // Attach approve event listeners
        document.querySelectorAll('.approve-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const email = e.target.getAttribute('data-email');
                if (confirm(`Approve access for ${email}?`)) {
                    // 1. Add to allowed_users
                    await setDoc(doc(db, "allowed_users", email), {
                        email: email,
                        addedAt: new Date().toISOString()
                    });
                    // 2. Remove from pending_users
                    await deleteDoc(doc(db, "pending_users", email));
                    loadUsers(); // Refresh both lists
                }
            });
        });

        // Attach reject event listeners
        document.querySelectorAll('.reject-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const email = e.target.getAttribute('data-email');
                if (confirm(`Reject request from ${email}?`)) {
                    await deleteDoc(doc(db, "pending_users", email));
                    loadUsers(); // Refresh both lists
                }
            });
        });

    } catch (error) {
        console.error("Error loading pending users: ", error);
        pendingTableBody.innerHTML = `<tr><td colspan="3" class="px-6 py-4 text-center text-red-500">Error loading pending users: ${error.message}</td></tr>`;
    }
}
