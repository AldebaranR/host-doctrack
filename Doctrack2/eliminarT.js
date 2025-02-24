document.addEventListener("DOMContentLoaded", async () => {
    const dropdown = document.getElementById("paciente-seleccionado");
    const form = document.getElementById("form-eliminar-tratamiento");
    const tratamientoInput = document.getElementById("tratamiento");

    // Obtener ID del doctor desde localStorage
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
                option.value = paciente.id_paciente;
                option.textContent = paciente.nombre_completo;
                dropdown.appendChild(option);
            });
        } catch (error) {
            console.error("Error al cargar pacientes:", error);
            alert("No se pudo cargar la lista de pacientes.");
        }
    }

    await cargarPacientes();

    // Manejo del envío del formulario
    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const idPaciente = dropdown.value;
        const tratamiento = tratamientoInput.value.trim();

        // Validaciones
        if (!idPaciente) {
            alert("Por favor, seleccione un paciente.");
            dropdown.focus();
            return;
        }

        if (!tratamiento) {
            alert("Por favor, introduzca un nombre de tratamiento.");
            tratamientoInput.focus();
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/eliminar-tratamiento", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id_doctor: idDoctor, id_paciente: idPaciente, tratamiento }),
            });

            if (response.ok) {
                alert("Tratamiento eliminado con éxito.");
                form.reset(); // Limpiar formulario
            } else {
                const errorText = await response.text();
                alert(`Error al eliminar tratamiento: ${errorText}`);
            }
        } catch (error) {
            console.error("Error al conectar con el servidor:", error);
            alert("No se pudo conectar con el servidor.");
        }
    });
});
