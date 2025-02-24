document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
    const nombre = document.getElementById("nombre");
    const apellidoPaterno = document.getElementById("apellido-p");
    const apellidoMaterno = document.getElementById("apellido-m");
    const especialidad = document.getElementById("especialidad");
    const cedula = document.getElementById("cedula");
    const correoElectronico = document.getElementById("correo-electronico");
    const password1 = document.getElementById("password-1");
    const password2 = document.getElementById("password-2");

    // Expresión regular para evitar caracteres no permitidos
    const textRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;

    form.addEventListener("submit", async (event) => {
        event.preventDefault(); // Prevenir el envío del formulario si hay errores

        // Validar Nombre
        if (nombre.value.trim() === "") {
            alert("El campo 'Nombre(s)' es obligatorio.");
            nombre.focus();
            return;
        }
        if (!textRegex.test(nombre.value)) {
            alert("El campo 'Nombre(s)' solo puede contener letras y espacios.");
            nombre.focus();
            return;
        }

        // Validar Apellido Paterno
        if (apellidoPaterno.value.trim() === "") {
            alert("El campo 'Apellido Paterno' es obligatorio.");
            apellidoPaterno.focus();
            return;
        }
        if (!textRegex.test(apellidoPaterno.value)) {
            alert("El campo 'Apellido Paterno' solo puede contener letras y espacios.");
            apellidoPaterno.focus();
            return;
        }

        // Validar Apellido Materno
        if (apellidoMaterno.value.trim() === "") {
            alert("El campo 'Apellido Materno' es obligatorio.");
            apellidoMaterno.focus();
            return;
        }
        if (!textRegex.test(apellidoMaterno.value)) {
            alert("El campo 'Apellido Materno' solo puede contener letras y espacios.");
            apellidoMaterno.focus();
            return;
        }

        // Validar Especialidad
        if (especialidad.value === "ninguna") {
            alert("Debe seleccionar una especialidad.");
            especialidad.focus();
            return;
        }

        // Validar Cédula (exactamente 7 u 8 dígitos)
        const cedulaRegex = /^[0-9]{7,8}$/;
        if (!cedulaRegex.test(cedula.value)) {
            alert("La cédula debe tener 7 u 8 dígitos numéricos (sin letras ni caracteres especiales).");
            cedula.focus();
            return;
        }

        // Validar Correo Electrónico
        const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!correoRegex.test(correoElectronico.value)) {
            alert("Debe ingresar un correo electrónico válido.");
            correoElectronico.focus();
            return;
        }

        // Validar Contraseña (mínimo 8 caracteres)
        if (password1.value.length < 8) {
            alert("La contraseña debe tener al menos 8 caracteres.");
            password1.focus();
            return;
        }

        // Validar Confirmación de Contraseña
        if (password1.value !== password2.value) {
            alert("Las contraseñas no coinciden.");
            password2.focus();
            return;
        }

        // Verificar si el correo ya existe
        try {
            const checkCorreoResponse = await fetch("http://localhost:3000/check-correo", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ correo: correoElectronico.value.trim() }),
            });

            const correoExists = await checkCorreoResponse.json();
            if (correoExists.exists) {
                alert("El correo electrónico ya está registrado. Use otro correo.");
                correoElectronico.focus();
                return;
            }
        } catch (error) {
            console.error("Error al verificar el correo:", error);
            alert("No se pudo verificar el correo. Intente más tarde.");
            return;
        }

        // Si todo es válido, enviar los datos al backend para registrar el doctor
        const formData = {
            nombre: nombre.value.trim(),
            ap_paterno: apellidoPaterno.value.trim(),
            ap_materno: apellidoMaterno.value.trim(),
            especialidad: especialidad.value,
            correo: correoElectronico.value.trim(),
            contrasena: password1.value.trim(),
        };

        try {
            const response = await fetch("https://host-doctrack-production.up.railway.app/Doctor.html/registro-doctor", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const result = await response.text(); // Obtener el mensaje del backend
            if (response.ok) {
                alert("Doctor registrado exitosamente. Redirigiendo...");
                window.location.href = "PaginaD.html"; // Cambia la URL según sea necesario
            } else {
                alert(`Error al registrar el doctor: ${result}`);
            }
        } catch (error) {
            console.error("Error al conectar con el servidor:", error);
            alert("No se pudo conectar con el servidor.");
        }
    });
});
