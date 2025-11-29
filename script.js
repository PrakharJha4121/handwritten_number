const API_BASE_URL = 'http://localhost:5000';

document.getElementById('imageInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            document.getElementById('preview-image').src = event.target.result;
            document.getElementById('preview-section').style.display = 'block';
        };
        reader. readAsDataURL(file);
    }
});

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
        document.getElementById('result-section'). style.display = 'block';
    }
}

function resetForm() {
    document.getElementById('imageInput').value = '';
    document.getElementById('preview-section').style.display = 'none';
    document.getElementById('result-section').style.display = 'none';
}

function toggleAuthModal() {
    const modal = document.getElementById('authModal');
    modal.style.display = modal.style.display === 'none' ? 'flex' : 'none';
}

function switchTab(tab) {
    document.getElementById('login-form').classList.remove('active');
    document.getElementById('signup-form').classList.remove('active');
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('signup-form').style.display = 'none';

    document.querySelectorAll('.tab-btn'). forEach(btn => btn.classList. remove('active'));

    if (tab === 'login') {
        document.getElementById('login-form').classList.add('active');
        document.getElementById('login-form').style.display = 'flex';
        document.querySelectorAll('.tab-btn')[0].classList.add('active');
    } else {
        document.getElementById('signup-form').classList.add('active');
        document.getElementById('signup-form').style.display = 'flex';
        document.querySelectorAll('.tab-btn')[1].classList.add('active');
    }
}

async function login() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword'). value;

    if (!email || !password) {
        alert('Please fill in all fields');
        return;
    }

    console.log('Login:', email);
    alert('Login functionality coming soon!');
    toggleAuthModal();
}

async function signup() {
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail'). value;
    const password = document.getElementById('signupPassword').value;

    if (!name || !email || !password) {
        alert('Please fill in all fields');
        return;
    }

    console.log('Signup:', name, email);
    alert('Signup functionality coming soon!');
    toggleAuthModal();
}

window.onclick = function(event) {
    const modal = document.getElementById('authModal');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}
