// --- REEMPLAZA EL BLOQUE ENTERO DEL FORMULARIO DE CONTACTO POR ESTE ---

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const webhookURL = 'https://muna.auto.hostybee.com/webhook-test/solicitud-contacto';
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalButtonHTML = submitButton.innerHTML;

        // Deshabilitamos el botón para prevenir envíos múltiples
        submitButton.disabled = true;
        submitButton.innerHTML = '<span>Enviando...</span>';

        const formData = {
            name: contactForm.querySelector('#name').value,
            email: contactForm.querySelector('#email').value,
            message: contactForm.querySelector('#message').value
        };

        try {
            const response = await fetch(webhookURL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            // LA CLAVE ESTÁ AQUÍ:
            // Simplemente verificamos que el servidor respondió 'OK' (código 200-299).
            // No intentamos leer el cuerpo de la respuesta como JSON, porque no es necesario.
            if (response.ok) {
                showConfirmationMessage('¡Gracias! Tu mensaje ha sido enviado.');
                contactForm.reset();
            } else {
                // Si el servidor responde con un error explícito (4xx, 5xx)
                const errorText = await response.text();
                console.error('Error del servidor:', response.status, errorText);
                alert('Hubo un problema al procesar tu mensaje en el servidor.');
            }
        } catch (error) {
            console.error('Error de red:', error);
            alert('No se pudo enviar el mensaje por un error de red.');
        } finally {
            // Volvemos a habilitar el botón al final, tanto si tuvo éxito como si no.
            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonHTML;
        }
    });
}
