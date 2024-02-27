const nombreUsuario = document.cookie.split('; ').find(row => row.startsWith('nombreUsuario')).split('=')[1];

fetch('/movimientos', {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    },
    credentials: 'include'
})
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            mostrarMovimientos(data.movimientos);
        } else {
            alert('Error al obtener los movimientos');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });

function mostrarMovimientos(movimientos) {
    const movimientosList = document.getElementById('movimientosList');
    movimientosList.innerHTML = '';
    movimientos.forEach(movimiento => {
        const row = document.createElement('tr');
        row.innerHTML = `
                    <td>${movimiento.nombre}</td>
                    <td>${movimiento.promotor}</td>
                    <td>${movimiento.banco}</td>
                    <td>${movimiento.mes}</td>
                    <td>${movimiento.aportacion}</td>
                    <td>${movimiento.total}</td>
                `;
        movimientosList.appendChild(row);
    });
}