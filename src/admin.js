        console.error("Error loading pending users: ", error);
        pendingTableBody.innerHTML = `<tr><td colspan="3" class="px-6 py-4 text-center text-red-500">Error loading pending users: ${error.message}</td></tr>`;
    }
}
