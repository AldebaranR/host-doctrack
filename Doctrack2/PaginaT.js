document.addEventListener("DOMContentLoaded", async () => {
    const idDoctor = localStorage.getItem("id_doctor");

    if (!idDoctor) {
        alert("Debe iniciar sesión primero.");
        window.location.href = "Inicio-Sesion.html";
        return;
    }

    const dropdown = document.getElementById("paciente-seleccionado");
    const formNotas = document.getElementById("form-notas");
    const notaInput = document.getElementById("nota-texto");

    // Cargar pacientes dinámicamente
    async function cargarPacientes() {
        try {
            const response = await fetch("https://host-doctrack-production.up.railway.app/obtener-pacientes");
            if (!response.ok) throw new Error("Error al obtener la lista de pacientes.");

            const pacientes = await response.json();
            pacientes.forEach((paciente) => {
                const option = document.createElement("option");
                option.value = paciente.id_paciente;
                option.textContent = paciente.nombre_completo;
                dropdown.appendChild(option);
            });
        } catch (error) {
            console.error("Error al cargar pacientes:", error);
            alert("No se pudo cargar la lista de pacientes.");
        }
    }

    // Manejar envío del formulario de notas
    formNotas.addEventListener("submit", async (event) => {
        event.preventDefault();

        const idPaciente = dropdown.value;
        const nota = notaInput.value.trim();

        if (!idPaciente) {
            alert("Seleccione un paciente.");
            dropdown.focus();
            return;
        }

        if (!nota) {
            alert("El campo de nota no puede estar vacío.");
            notaInput.focus();
            return;
        }

        try {
            const response = await fetch("https://host-doctrack-production.up.railway.app/guardar-nota", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id_doctor: idDoctor, id_paciente: idPaciente, nota }),
            });

            if (response.ok) {
                notaInput.style.color = "blue";
                alert("Nota guardada con éxito.");
                notaInput.value = "";
            } else {
                alert("Error al guardar la nota. Inténtelo de nuevo.");
            }
        } catch (error) {
            console.error("Error al conectar con el servidor:", error);
            alert("No se pudo conectar con el servidor.");
        }
    });

    // Llamada para cargar pacientes
    await cargarPacientes();
});
