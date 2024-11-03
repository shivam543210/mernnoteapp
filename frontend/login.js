document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const apiUrl = 'http://localhost:5000/data/login';

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Prevent form submission

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) throw new Error('Login failed');
            const data = await response.json();

            console.log(data); // Log entire response data for debugging
            console.log(data.token); // Log the token itself

            // Store token in localStorage
            localStorage.setItem('token', data.token);
            
            // Redirect to the notes page after successful login
            window.location.href = 'index.html';
        } catch (error) {
            console.error('Error logging in:', error);
            alert('Login failed. Please check your credentials.');
        }
    });
});
