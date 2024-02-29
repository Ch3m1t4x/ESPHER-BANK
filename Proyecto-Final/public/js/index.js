login = document.getElementById('loginForm')
login.addEventListener('submit', function (event) {
    event.preventDefault();

    const formData = new FormData(login);
    console.log(Object.fromEntries(formData));

    fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(Object.fromEntries(formData))
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                window.location.href = 'movimientos.html';
            } else {
                alert('Usuario no registrado');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
});

