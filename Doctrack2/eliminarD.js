document.addEventListener("DOMContentLoaded", async () => {
    const dropdown = document.getElementById("paciente-seleccionado");
    const form = document.getElementById("form-eliminar");

    // Obtener id_doctor del localStorage
    const idDoctor = localStorage.getItem("id_doctor");

    if (!idDoctor) {
        alert("Debe iniciar sesión primero.");
        window.location.href = "Inicio-Sesion.html";
        return;
    }

    // Cargar pacientes en el dropdown
    async function cargarPacientes() {
        try {
            const response = await fetch("http://localhost:3000/obtener-pacientes");
            if (!response.ok) throw new Error("Error al obtener la lista de pacientes.");

            const pacientes = await response.json();
            pacientes.forEach((paciente) => {
                const option = document.createElement("option");
                option.value = paciente.nombre_completo; // Usar nombre completo para buscar id
                option.textContent = paciente.nombre_completo;
                dropdown.appendChild(option);
            });
        } catch (error) {
            console.error("Error al cargar pacientes:", error);
            alert("No se pudo cargar la lista de pacientes.");
        }
    }

    await cargarPacientes();

    // Manejar envío del formulario
    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const nombrePaciente = dropdown.value;
        const fechaCita = document.getElementById("fecha-cita").value;
        const horaCita = document.getElementById("hora-cita").value;

        if (!nombrePaciente || !fechaCita || !horaCita) {
            alert("Por favor, completa todos los campos.");
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/eliminar-cita", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id_doctor: idDoctor, nombre_paciente: nombrePaciente, fecha_cita: fechaCita, hora_cita: horaCita }),
            });

            if (response.ok) {
                alert("Cita eliminada con éxito.");
                form.reset();
            } else {
                const errorText = await response.text();
                alert(`Error al eliminar la cita: ${errorText}`);
            }
        } catch (error) {
            console.error("Error al conectar con el servidor:", error);
            alert("No se pudo conectar con el servidor.");
        }
    });
});