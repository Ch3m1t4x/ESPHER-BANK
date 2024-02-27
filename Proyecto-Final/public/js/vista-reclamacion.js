fetch('/reclamaciones', {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    },
    credentials: 'include'
})
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            mostrarReclamaciones(data);
        } else {
            alert('Error al obtener las reclamaciones');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });

function mostrarReclamaciones(data) {
    const reclamacionesList = document.getElementById('reclamacionesList');
    reclamacionesList.innerHTML = '';

    if (data.reclamaciones && Array.isArray(data.reclamaciones)) {
        data.reclamaciones.forEach(reclamacion => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${reclamacion.nombre}</td>
                <td>${reclamacion.reclamacion}</td>
                <td>${reclamacion.descripcion}</td>
            `;
            reclamacionesList.appendChild(row);
        });
    } else {
        console.error('La propiedad reclamaciones en data no es un array o es undefined');
    }
}