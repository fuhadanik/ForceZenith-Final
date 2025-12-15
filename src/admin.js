        console.error("Error loading pending users: ", error);
        pendingTableBody.innerHTML = `<tr><td colspan="3" class="px-6 py-4 text-center text-red-500">Error loading pending users: ${error.message}</td></tr>`;
    }
}

// Load Users Logic
async function loadUsers() {
    await loadPendingUsers(); // Load pending requests first
    await loadLoginLogs(); // Load login logs
    
    userTableBody.innerHTML = '<tr><td colspan="3" class="px-6 py-4 text-center">Loading...</td></tr>';
    
    try {
        const db = window.db;
        if (!db) throw new Error("Database not initialized");

        const querySnapshot = await db.collection("allowed_users").get();
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
                    await db.collection("allowed_users").doc(emailToDelete).delete();
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
        const db = window.db;
        if (!db) throw new Error("Database not initialized");

        const querySnapshot = await db.collection("pending_users").get();
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
                    const db = window.db;
                    // 1. Add to allowed_users
                    await db.collection("allowed_users").doc(email).set({
                        email: email,
                        addedAt: new Date().toISOString()
                    });
                    // 2. Remove from pending_users
                    await db.collection("pending_users").doc(email).delete();
                    loadUsers(); // Refresh both lists
                }
            });
        });

        // Attach reject event listeners
        document.querySelectorAll('.reject-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const email = e.target.getAttribute('data-email');
                if (confirm(`Reject request from ${email}?`)) {
                    const db = window.db;
                    await db.collection("pending_users").doc(email).delete();
                    loadUsers(); // Refresh both lists
                }
            });
        });

    } catch (error) {
        console.error("Error loading pending users: ", error);
        pendingTableBody.innerHTML = `<tr><td colspan="3" class="px-6 py-4 text-center text-red-500">Error loading pending users: ${error.message}</td></tr>`;
    }
}

// Load Login Logs Logic
const logsTableBody = document.getElementById('logsTableBody');

async function loadLoginLogs() {
    if (!logsTableBody) return;
    logsTableBody.innerHTML = '<tr><td colspan="3" class="px-6 py-4 text-center">Loading...</td></tr>';
    
    try {
        const db = window.db;
        if (!db) throw new Error("Database not initialized");

        // Order by timestamp desc, limit 50
        const querySnapshot = await db.collection("login_logs")
            .orderBy("timestamp", "desc")
            .limit(50)
            .get();
            
        logsTableBody.innerHTML = ''; // Clear loading

        if (querySnapshot.empty) {
            logsTableBody.innerHTML = '<tr><td colspan="3" class="px-6 py-4 text-center text-gray-500">No logs found.</td></tr>';
            return;
        }

        querySnapshot.forEach((doc) => {
            const log = doc.data();
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${log.email}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${log.ip || 'Unknown'}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${new Date(log.timestamp).toLocaleString()}</td>
            `;
            logsTableBody.appendChild(row);
        });

    } catch (error) {
        console.error("Error loading logs: ", error);
        logsTableBody.innerHTML = `<tr><td colspan="3" class="px-6 py-4 text-center text-red-500">Error loading logs: ${error.message}</td></tr>`;
    }
}
