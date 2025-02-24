document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("#registro-form");

    form.addEventListener("submit", (event) => {
        event.preventDefault(); // Evitar envío del formulario por defecto

        // Captura de datos del formulario
        const data = {
            CURP: document.getElementById("curp").value.trim(),
            nombre: document.getElementById("nombre").value.trim(),
            ap_paterno: document.getElementById("apellidoPaterno").value.trim(),
            ap_materno: document.getElementById("apellidoMaterno").value.trim(),
            fecha_nacimiento: document.getElementById("fechaNacimiento").value,
            telefono: document.getElementById("telefono").value.trim(),
            correo: document.getElementById("correo").value.trim(),
            contrasena: document.getElementById("contrasena").value.trim()
        };

        // Validaciones en el cliente
        let errores = [];

        // Validar correo (formato válido)
        const correoRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
        if (!correoRegex.test(data.correo)) {
            errores.push("El correo debe tener un formato válido.");
        }

        // Validar otros campos (por ejemplo, CURP, nombres, etc.)
        const soloLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
        if (!soloLetras.test(data.nombre)) errores.push("El nombre debe contener solo letras.");
        if (!soloLetras.test(data.ap_paterno)) errores.push("El apellido paterno debe contener solo letras.");
        if (!soloLetras.test(data.ap_materno)) errores.push("El apellido materno debe contener solo letras.");

        const curpRegex = /^[A-Z]{4}[0-9]{6}[HM][A-Z]{5}[A-Z0-9][0-9]$/;
        if (!curpRegex.test(data.CURP)) errores.push("El CURP debe tener un formato válido.");

        const telefonoRegex = /^[0-9]{10}$/;
        if (!telefonoRegex.test(data.telefono)) errores.push("El teléfono debe contener exactamente 10 dígitos.");

        const contrasenaRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        if (!contrasenaRegex.test(data.contrasena)) {
            errores.push(
                "La contraseña debe tener al menos 8 caracteres, incluyendo una mayúscula, una minúscula y un número."
            );
        }

        if (!data.fecha_nacimiento) errores.push("Por favor, selecciona tu fecha de nacimiento.");

        // Mostrar errores en el cliente si existen
        if (errores.length > 0) {
            alert(errores.join("\n"));
            return;
        }

        // Enviar correo al servidor para verificar si ya está registrado
        fetch("http://localhost:3000/check-correo", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ correo: data.correo }) // Enviar solo el correo para validación
        })
            .then((response) => {
                if (!response.ok) {
                    return response.text().then((message) => {
                        throw new Error(message);
                    });
                }
                return response.json();
            })
            .then((result) => {
                if (result.exists) {
                    alert("El correo ya está registrado. Por favor, usa uno diferente.");
                } else {
                    // Proceder con el registro si el correo no existe
                    return fetch("http://localhost:3000/register-paciente", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(data)
                    });
                }
            })
            .then((response) => {
                if (response && response.ok) {
                    alert("Paciente registrado con éxito.");
                    window.location.href = "PaginaP.html"; // Redirigir al usuario
                }
            })
            .catch((error) => {
                alert(`Error: ${error.message}`);
            });
    });
});
    