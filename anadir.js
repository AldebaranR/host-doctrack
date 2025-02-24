document.addEventListener("DOMContentLoaded", async () => {
    const form = document.getElementById("anadir-cita-form");
    const pacienteDropdown = document.getElementById("paciente-seleccionado");
    const fechaInput = document.getElementById("fecha-cita");
    const horaInput = document.getElementById("hora-cita");
    const motivoInput = document.getElementById("motivo-cita");

    const idDoctor = localStorage.getItem("id_doctor");

    // Validar que el ID del doctor esté disponible
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

    // Validación en tiempo real para el campo motivo
    motivoInput.addEventListener("input", () => {
        if (motivoInput.value.length > 50) {
            motivoInput.value = motivoInput.value.slice(0, 50); // Limitar a 50 caracteres
            alert("El motivo no puede tener más de 50 caracteres.");
        }
        if (contieneCaracteresEspeciales(motivoInput.value)) {
            motivoInput.value = motivoInput.value.replace(/['"<>&;`]/g, ""); // Remover caracteres especiales
            alert("No se pueden ingresar caracteres especiales.");
        }
    });

    // Cargar pacientes dinámicamente
    async function cargarPacientes() {
        try {
            const response = await fetch("http://localhost:3000/obtener-pacientes");
            if (!response.ok) throw new Error("Error al obtener la lista de pacientes.");

            const pacientes = await response.json();
            pacientes.forEach((paciente) => {
                const option = document.createElement("option");
                option.value = paciente.id_paciente;
                option.textContent = paciente.nombre_completo;
                pacienteDropdown.appendChild(option);
            });
        } catch (error) {
            console.error("Error al cargar pacientes:", error);
            alert("No se pudo cargar la lista de pacientes.");
        }
    }

    await cargarPacientes();

    // Validar que la fecha no sea anterior a hoy
    function esFechaValida(fecha) {
        const fechaHoy = new Date();
        fechaHoy.setHours(0, 0, 0, 0); // Establecer la hora en 0 para solo comparar fechas
        const fechaIngresada = new Date(fecha);
        return fechaIngresada >= fechaHoy;
    }

    // Manejar el envío del formulario
    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const idPaciente = pacienteDropdown.value;
        const fecha = fechaInput.value.trim();
        const hora = horaInput.value.trim();
        const motivo = motivoInput.value.trim();

        // Validaciones
        if (!idPaciente) {
            alert("Por favor, seleccione un paciente.");
            pacienteDropdown.focus();
            return;
        }
        if (!fecha) {
            alert("Por favor, ingrese una fecha válida.");
            fechaInput.focus();
            return;
        }
        if (!esFechaValida(fecha)) {
            alert("La fecha no puede ser anterior a hoy.");
            fechaInput.focus();
            return;
        }
        if (!hora) {
            alert("Por favor, ingrese una hora válida.");
            horaInput.focus();
            return;
        }
        if (!motivo || motivo.length > 50 || contieneCaracteresEspeciales(motivo)) {
            alert("El motivo no debe contener caracteres especiales ni exceder los 50 caracteres.");
            motivoInput.focus();
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/agregar-cita", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id_doctor: idDoctor,
                    id_paciente: idPaciente,
                    fecha,
                    hora,
                    motivo,
                }),
            });

            if (response.ok) {
                alert("Cita añadida con éxito.");
                form.reset();
                pacienteDropdown.value = "";
            } else {
                alert("Error al añadir la cita. Inténtelo de nuevo.");
            }
        } catch (error) {
            console.error("Error al conectar con el servidor:", error);
            alert("No se pudo conectar con el servidor.");
        }
    });
});
