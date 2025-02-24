document.addEventListener("DOMContentLoaded", async () => {
    const idDoctor = localStorage.getItem("id_doctor");

    if (!idDoctor) {
        alert("Debe iniciar sesión primero.");
        window.location.href = "Inicio-Sesion.html"; // Redirige a la página de inicio de sesión
        return;
    }


    const dropdown = document.getElementById("paciente-seleccionado");

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
});