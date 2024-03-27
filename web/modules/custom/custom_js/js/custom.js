console.log('El código JavaScript se está ejecutando correctamente.');
// Función para obtener el estado del inmueble asociado al nodo mediante AJAX
function obtenerEstadoInmuebleAjax(nodoId, callback) {
    // Realizar una solicitud AJAX al servidor Drupal para obtener el estado del inmueble asociado al nodo
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/api/inmueble/' + nodoId, true); // Reemplaza '/api/inmueble/' con la ruta real de tu endpoint en Drupal
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                var respuesta = JSON.parse(xhr.responseText);
                var estadoInmueble = respuesta.estado; // Suponiendo que el estado se encuentra en la propiedad 'estado' de la respuesta
                callback(estadoInmueble);
            } else {
                console.error('Error al obtener el estado del inmueble:', xhr.status, xhr.statusText);
            }
        }
    };
    xhr.send();
}

// Función para actualizar la clase de todas las zonas del mapa SVG según el estado de los inmuebles asociados
function actualizarClasesZonas() {
    // Obtener todas las zonas del mapa SVG (rect, path, o polygon)
    var zones = document.querySelectorAll('#map-container rect, #map-container path, #map-container polygon');

    // Iterar sobre todas las zonas y actualizar su clase según el estado de los inmuebles asociados
    zones.forEach(function(zone) {
        var zoneId = zone.getAttribute('id');
        obtenerEstadoInmuebleAjax(zoneId, function(estadoInmueble) {
            zone.classList.remove("disponible", "vendido", "bloqueado", "reservado"); // Eliminar todas las clases de estado previas
            zone.classList.add(estadoInmueble); // Agregar la clase correspondiente al estado
        });
    });
}

// Llamar a la función para actualizar las clases de las zonas cada cierto intervalo de tiempo
setInterval(actualizarClasesZonas, 5000); // Actualizar cada 5 segundos (por ejemplo)
