const formulario = document.getElementById('reclamaciones');

formulario.addEventListener('submit', function (event) {
    event.preventDefault();

    const formData = new FormData(formulario);

    // Verificar los valores antes de enviar la solicitud
    console.log('Nombre:', formData.get('nombre'));
    console.log('Reclamacion:', formData.get('reclamacion'));
    console.log('Descripción:', formData.get('descripcion'));

    // Crear un objeto con los datos del formulario
    const jsonData = {
        nombre: formData.get('nombre'),
        reclamacion: formData.get('reclamacion'),
        descripcion: formData.get('descripcion'),
    };

    // Verificar el objeto JSON antes de enviar la solicitud
    console.log('JSON Data:', jsonData);

    fetch('/guardar-reclamacion', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonData),
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Reclamación enviada con éxito');
                formulario.reset();
            } else {
                alert('Error al enviar la reclamación');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
});