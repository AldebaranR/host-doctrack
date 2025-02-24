document.addEventListener("DOMContentLoaded", async () => {
    const dropdown = document.getElementById("paciente-seleccionado");
    const form = document.getElementById("form-modificar-tratamiento");
    const tratamientoActualInput = document.getElementById("tratamiento-actual");
    const tratamientoNuevoInput = document.getElementById("tratamiento-nuevo");
    const cantidadActualInput = document.getElementById("cantidad-actual");
    const cantidadNuevaInput = document.getElementById("cantidad-nueva");

    // Obtener el ID del doctor desde localStorage
    const idDoctor = localStorage.getItem("id_doctor");
    if (!idDoctor) {
        alert("Debe iniciar sesión primero.");
        window.location.href = "Inicio-Sesion.html";
        return;
    }

    // Cargar pacientes en el dropdown
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

    await cargarPacientes();

    // Manejo del envío del formulario
    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const idPaciente = dropdown.value;
        const tratamientoActual = tratamientoActualInput.value.trim();
        const tratamientoNuevo = tratamientoNuevoInput.value.trim();
        const cantidadActual = cantidadActualInput.value.trim();
        const cantidadNueva = cantidadNuevaInput.value.trim();

        // Validaciones
        if (!idPaciente) {
            alert("Por favor, seleccione un paciente.");
            dropdown.focus();
            return;
        }

        if (!tratamientoActual && !tratamientoNuevo && !cantidadActual && !cantidadNueva) {
            alert("Por favor, modifique al menos un campo.");
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/modificar-tratamiento", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ 
                    id_doctor: idDoctor, 
                    id_paciente: idPaciente, 
                    tratamiento_actual: tratamientoActual, 
                    tratamiento_nuevo: tratamientoNuevo, 
                    cantidad_actual: cantidadActual, 
                    cantidad_nueva: cantidadNueva 
                }),
            });

            if (response.ok) {
                alert("Tratamiento modificado con éxito.");
                form.reset();
            } else {
                const errorText = await response.text();
                alert(`Error al modificar tratamiento: ${errorText}`);
            }
        } catch (error) {
            console.error("Error al conectar con el servidor:", error);
            alert("No se pudo conectar con el servidor.");
        }
    });
});