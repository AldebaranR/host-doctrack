document.addEventListener("DOMContentLoaded", async () => {
    const dropdown = document.getElementById("paciente-seleccionado");
    const form = document.getElementById("form-anadir-tratamiento");
    const tratamientoInput = document.getElementById("tratamiento");
    const cantidadInput = document.getElementById("cantidad");

    // Obtener el ID del doctor desde el localStorage
    const idDoctor = localStorage.getItem("id_doctor");
    if (!idDoctor) {
        alert("Debe iniciar sesión primero.");
        window.location.href = "Inicio-Sesion.html";
        return;
    }

    // Validar si contiene inyecciones SQL o etiquetas HTML
    function contieneInyeccionSQLoHTML(texto) {
        const regexInyeccionSQL = /('|--|;|\/\*|\*\/|DROP|SELECT|INSERT|DELETE|UPDATE|CREATE|ALTER|EXEC|SHOW|DESCRIBE|TRUNCATE|WHERE|GRANT)/i;
        const regexHTML = /<[^>]*>/g;
        return regexInyeccionSQL.test(texto) || regexHTML.test(texto);
    }

    // Validación en tiempo real para tratamiento y cantidad
    tratamientoInput.addEventListener("input", () => {
        if (tratamientoInput.value.length > 50) {
            tratamientoInput.value = tratamientoInput.value.slice(0, 50);
            alert("El tratamiento no puede tener más de 50 caracteres.");
        }
        if (contieneInyeccionSQLoHTML(tratamientoInput.value)) {
            tratamientoInput.value = tratamientoInput.value.replace(/('|--|;|\/\*|\*\/|<[^>]*>|DROP|SELECT|INSERT|DELETE|UPDATE|CREATE|ALTER|EXEC|SHOW|DESCRIBE|TRUNCATE|WHERE|GRANT)/gi, "");
            alert("El tratamiento no debe contener inyecciones SQL o etiquetas HTML.");
        }
    });

    cantidadInput.addEventListener("input", () => {
        if (cantidadInput.value.length > 50) {
            cantidadInput.value = cantidadInput.value.slice(0, 50);
            alert("La cantidad no puede tener más de 50 caracteres.");
        }
        if (contieneInyeccionSQLoHTML(cantidadInput.value)) {
            cantidadInput.value = cantidadInput.value.replace(/('|--|;|\/\*|\*\/|<[^>]*>|DROP|SELECT|INSERT|DELETE|UPDATE|CREATE|ALTER|EXEC|SHOW|DESCRIBE|TRUNCATE|WHERE|GRANT)/gi, "");
            alert("La cantidad no debe contener inyecciones SQL o etiquetas HTML.");
        }
    });

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
        const cantidad = cantidadInput.value.trim();

        // Validaciones
        if (!idPaciente) {
            alert("Por favor, seleccione un paciente.");
            dropdown.focus();
            return;
        }
        if (!tratamiento || tratamiento.length > 50 || contieneInyeccionSQLoHTML(tratamiento)) {
            alert("Por favor, ingrese un tratamiento válido (sin caracteres especiales ni más de 50 caracteres).");
            tratamientoInput.focus();
            return;
        }
        if (!cantidad || cantidad.length > 50 || contieneInyeccionSQLoHTML(cantidad)) {
            alert("Por favor, ingrese una cantidad válida (sin caracteres especiales ni más de 50 caracteres).");
            cantidadInput.focus();
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/anadir-tratamiento", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id_doctor: idDoctor, id_paciente: idPaciente, tratamiento, cantidad }),
            });

            if (response.ok) {
                alert("Tratamiento añadido con éxito.");
                form.reset(); // Limpiar formulario
            } else {
                const errorText = await response.text();
                alert(`Error al añadir tratamiento: ${errorText}`);
            }
        } catch (error) {
            console.error("Error al conectar con el servidor:", error);
            alert("No se pudo conectar con el servidor.");
        }
    });
});
