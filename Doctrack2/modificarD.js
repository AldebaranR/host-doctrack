document.addEventListener("DOMContentLoaded", async () => {
    const form = document.getElementById("form-modificar");
    const dropdown = document.getElementById("paciente-seleccionado");
    const fechaActualInput = document.getElementById("fecha-actual");
    const fechaNuevaInput = document.getElementById("fecha-nueva");
    const horaActualInput = document.getElementById("hora-actual");
    const horaNuevaInput = document.getElementById("hora-nueva");
    const motivoNuevoInput = document.getElementById("motivo-nuevo");

    // Obtener id_doctor del localStorage
    const idDoctor = localStorage.getItem("id_doctor");

    if (!idDoctor) {
        alert("Debe iniciar sesión primero.");
        window.location.href = "Inicio-Sesion.html";
        return;
    }

    // Validar si contiene caracteres especiales utilizados en HTML o SQL
    function contieneCaracteresEspeciales(texto) {
        const regexEspeciales = /['"<>&;`]/g;
        return regexEspeciales.test(texto);
    }

    // Validaciones en tiempo real para evitar caracteres especiales
    function agregarValidacionTiempoReal(input) {
        input.addEventListener("input", () => {
            if (input.value.length > 50) {
                input.value = input.value.slice(0, 50); // Limitar a 50 caracteres
                alert("El texto no puede tener más de 50 caracteres.");
            }
            if (contieneCaracteresEspeciales(input.value)) {
                input.value = input.value.replace(/['"<>&;`]/g, ""); // Eliminar caracteres especiales
                alert("No se pueden ingresar caracteres especiales.");
            }
        });
    }

    // Aplicar validaciones en tiempo real
    [motivoNuevoInput].forEach((input) => agregarValidacionTiempoReal(input));

    // Cargar pacientes en el dropdown
    async function cargarPacientes() {
        try {
            const response = await fetch("http://localhost:3000/obtener-pacientes");
            if (!response.ok) throw new Error("Error al obtener la lista de pacientes.");

            const pacientes = await response.json();
            pacientes.forEach((paciente) => {
                const option = document.createElement("option");
                option.value = paciente.id_paciente; // Usar id del paciente para identificar
                option.textContent = paciente.nombre_completo;
                dropdown.appendChild(option);
            });
        } catch (error) {
            console.error("Error al cargar pacientes:", error);
            alert("No se pudo cargar la lista de pacientes.");
        }
    }

    await cargarPacientes();

    // Manejar el envío del formulario
    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const idPaciente = dropdown.value;
        const fechaActual = fechaActualInput.value.trim();
        const fechaNueva = fechaNuevaInput.value.trim();
        const horaActual = horaActualInput.value.trim();
        const horaNueva = horaNuevaInput.value.trim();
        const nuevoMotivo = motivoNuevoInput.value.trim();

        // Validación
        if (!idPaciente) {
            alert("Por favor, seleccione un paciente.");
            return;
        }

        if (!fechaActual || !horaActual) {
            alert("Debe especificar la fecha y hora actuales de la cita.");
            return;
        }

        if (!fechaNueva && !horaNueva && !nuevoMotivo) {
            alert("Debe modificar al menos un campo (fecha, hora o motivo).");
            return;
        }

        // Validar motivo para caracteres especiales
        if (nuevoMotivo && contieneCaracteresEspeciales(nuevoMotivo)) {
            alert("El motivo no debe contener caracteres especiales.");
            motivoNuevoInput.focus();
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/modificar-cita", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id_doctor: idDoctor,
                    id_paciente: idPaciente,
                    fecha_actual: fechaActual,
                    hora_actual: horaActual,
                    nueva_fecha: fechaNueva || null,
                    nueva_hora: horaNueva || null,
                    nuevo_motivo: nuevoMotivo || null,
                }),
            });

            if (response.ok) {
                alert("Cita modificada con éxito.");
                form.reset();
            } else {
                const errorText = await response.text();
                alert(`Error al modificar la cita: ${errorText}`);
            }
        } catch (error) {
            console.error("Error al conectar con el servidor:", error);
            alert("No se pudo conectar con el servidor.");
        }
    });
});
