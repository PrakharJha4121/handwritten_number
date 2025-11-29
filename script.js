const API_BASE_URL = 'https://handwritten-number-2.onrender.com';

// --- IMAGE UPLOAD & PREVIEW ---

document.getElementById('imageInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            document.getElementById('preview-image').src = event.target.result;
            document.getElementById('preview-section').style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
});

// --- IMAGE SUBMISSION ---

async function submitImage() {
    const fileInput = document.getElementById('imageInput');
    const file = fileInput.files[0];

    if (!file) {
        alert('Please select an image first');
        return;
    }

    document.getElementById('loading').style.display = 'flex';
    document.getElementById('preview-section').style.display = 'none';

    try {
        const formData = new FormData();
        formData.append('image', file);

        const response = await fetch(`${API_BASE_URL}/api/identify`, {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (data.success) {
            document.getElementById('result-text').textContent = data.result;
        } else {
            document.getElementById('result-text').textContent = `Error: ${data.error}`;
        }

        document.getElementById('loading').style.display = 'none';
        document.getElementById('result-section').style.display = 'block';

    } catch (error) {
        document.getElementById('loading').style.display = 'none';
        document.getElementById('result-text').textContent = `Error: ${error.message}`;
        document.getElementById('result-section').style.display = 'block';
    }
}

// --- FORM RESET ---

function resetForm() {
    document.getElementById('imageInput').value = '';
    document.getElementById('preview-section').style.display = 'none';
    document.getElementById('result-section').style.display = 'none';
}

// --- AUTH MODAL ---

function toggleAuthModal() {
    const modal = document.getElementById('authModal');
    modal.style.display = modal.style.display === 'none' ? 'flex' : 'none';
}

// --- TAB SWITCHING FOR LOGIN/SIGNUP ---

function switchTab(tab) {
    // Hide both forms, remove 'active' class
    document.getElementById('login-form').classList.remove('active');
    document.getElementById('signup-form').classList.remove('active');
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('signup-form').style.display = 'none';

    // Support both old and new button classes
    document.querySelectorAll('.tab-btn, .switch-btn').forEach(btn => btn.classList.remove('active'));

    if (tab === 'login') {
        document.getElementById('login-form').classList.add('active');
        document.getElementById('login-form').style.display = 'flex';
        // Activate the login tab button
        const loginButton = document.getElementById('loginTab') || document.querySelectorAll('.tab-btn, .switch-btn')[0];
        if (loginButton) loginButton.classList.add('active');
    } else {
        document.getElementById('signup-form').classList.add('active');
        document.getElementById('signup-form').style.display = 'flex';
        // Activate signup tab button
        const signupButton = document.getElementById('signupTab') || document.querySelectorAll('.tab-btn, .switch-btn')[1];
        if (signupButton) signupButton.classList.add('active');
    }
}

// --- LOGIN & SIGNUP PLACEHOLDER ---

async function login() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    if (!email || !password) {
        alert('Please fill in all fields');
        return;
    }

    // Placeholder
    console.log('Login:', email);
    alert('Login functionality coming soon!');
    toggleAuthModal();
}

async function signup() {
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;

    if (!name || !email || !password) {
        alert('Please fill in all fields');
        return;
    }

    // Placeholder
    console.log('Signup:', name, email);
    alert('Signup functionality coming soon!');
    toggleAuthModal();
}

// --- CLOSE MODAL WHEN CLICKED OUTSIDE ---

window.onclick = function(event) {
    const modal = document.getElementById('authModal');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}