document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signupForm');
    const apiUrl = 'http://localhost:5000/data/signup';

    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Prevent form submission

        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password }),
            });

            if (!response.ok) throw new Error('Signup failed');

            // Redirect to the login page after successful signup
            window.location.href = 'index.html';
            // remove the login button 
            
        } catch (error) {
            console.error('Error signing up:', error);
            alert('Signup failed. Please try again.');
        }
    });
});
