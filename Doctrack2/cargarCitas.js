document.addEventListener("DOMContentLoaded", async () => {
    const idDoctor = localStorage.getItem("id_doctor");

    if (!idDoctor) {
        alert("Debe iniciar sesión primero.");
        window.location.href = "Inicio-Sesion.html"; // Redirige al inicio de sesión si no hay ID del doctor
        return;
    }

    const tablaCitas = document.getElementById("tabla-citas");

    // Función para formatear la fecha
    function formatearFecha(fechaISO) {
        const fecha = new Date(fechaISO);
        const opciones = { year: "numeric", month: "long", day: "numeric" };
        return fecha.toLocaleDateString("es-ES", opciones); // Ejemplo: 1 de diciembre de 2024
    }

    // Función para cargar las citas en la tabla
    async function cargarCitas() {
        try {
            const response = await fetch(`http://localhost:3000/obtener-citas/${idDoctor}`);
            if (!response.ok) throw new Error("Error al obtener la lista de citas.");

            const citas = await response.json();
            citas.forEach((cita) => {
                const fila = document.createElement("tr");
                fila.innerHTML = `
                    <td>${cita.nombre_completo}</td>
                    <td>${formatearFecha(cita.fecha)}</td>
                    <td>${cita.motivo}</td>
                `;
                tablaCitas.appendChild(fila);
            });
        } catch (error) {
            console.error("Error al cargar citas:", error);
            alert("No se pudo cargar la lista de citas.");
        }
    }

    await cargarCitas();
});