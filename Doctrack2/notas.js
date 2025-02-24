document.addEventListener("DOMContentLoaded", () => {
    const formNotas = document.getElementById("form-notas");
    const notaInput = document.getElementById("nota-texto");
    const dropdownPacientes = document.getElementById("paciente-seleccionado");
    const htmlRegex = /<[^>]*>/g; // Validación para evitar etiquetas HTML
    const idDoctor = localStorage.getItem("id_doctor"); // Obtener ID del doctor del LocalStorage

    if (!idDoctor) {
        alert("Debe iniciar sesión primero.");
        window.location.href = "Inicio-Sesion.html"; // Redirige si no está logueado
        return;
    }


    // Manejar envío del formulario
    formNotas.addEventListener("submit", async (event) => {
        event.preventDefault();

        const idPaciente = dropdownPacientes.value;
        const nota = notaInput.value.trim();

        // Validaciones
        if (!idPaciente) {
            alert("Por favor, seleccione un paciente.");
            dropdownPacientes.focus();
            return;
        }

        if (!nota) {
            alert("El campo de nota no puede estar vacío.");
            notaInput.focus();
            return;
        }

        if (htmlRegex.test(nota)) {
            alert("El campo de nota no puede contener etiquetas HTML.");
            notaInput.focus();
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/guardar-nota", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id_paciente: idPaciente, id_doctor: idDoctor, nota }),
            });

            if (response.ok) {
                notaInput.style.color = "blue"; // Cambiar color del texto enviado
                alert("Nota registrada con éxito.");
            } else {
                alert("Error al registrar la nota. Inténtelo de nuevo.");
            }
        } catch (error) {
            console.error("Error al conectar con el servidor:", error);
            alert("No se pudo conectar con el servidor.");
        }
    });

    // Reiniciar campo de texto al hacer clic
    notaInput.addEventListener("click", () => {
        notaInput.value = "";
        notaInput.style.color = "black"; // Restaurar color original
    });
});