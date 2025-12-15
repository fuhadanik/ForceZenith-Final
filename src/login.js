if (getCookie("login")) window.location = "./home.html";

document.getElementById("login").onclick = () => {
    const formEl = document.forms.loginform;
    const formData = new FormData(formEl);
    login(formData)
}

// Request Access Modal Logic
const requestAccessBtn = document.getElementById('requestAccessBtn');
const requestModal = document.getElementById('requestModal');
const cancelRequest = document.getElementById('cancelRequest');
const submitRequest = document.getElementById('submitRequest');
const requestEmail = document.getElementById('requestEmail');
const requestStatus = document.getElementById('requestStatus');

requestAccessBtn.onclick = () => {
    requestModal.classList.remove('hidden');
    requestStatus.innerText = '';
    requestEmail.value = '';
}

cancelRequest.onclick = () => {
    requestModal.classList.add('hidden');
}

submitRequest.onclick = async () => {
    const email = requestEmail.value.trim().toLowerCase();
    if (!email || !email.endsWith('@micronetbd.org')) {
        requestStatus.innerText = "Please enter a valid @micronetbd.org email.";
        requestStatus.className = "mt-2 text-sm text-center text-red-600";
        return;
    }

    requestStatus.innerText = "Sending request...";
    requestStatus.className = "mt-2 text-sm text-center text-gray-600";
    submitRequest.disabled = true;

    const result = await requestAccess(email);

    if (result.success) {
        requestStatus.innerText = "Request sent! Please wait for admin approval.";
        requestStatus.className = "mt-2 text-sm text-center text-green-600";
        setTimeout(() => {
            requestModal.classList.add('hidden');
            submitRequest.disabled = false;
        }, 2000);
    } else {
        requestStatus.innerText = "Error: " + result.error;
        requestStatus.className = "mt-2 text-sm text-center text-red-600";
        submitRequest.disabled = false;
    }
}