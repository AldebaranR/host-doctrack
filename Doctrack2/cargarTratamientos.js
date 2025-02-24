document.addEventListener("DOMContentLoaded", async () => {
    const tablaTratamientos = document.getElementById("tabla-tratamientos");

    // Obtener el ID del doctor desde localStorage
    const idDoctor = localStorage.getItem("id_doctor");
    if (!idDoctor) {
        alert("Debe iniciar sesión primero.");
        window.location.href = "Inicio-Sesion.html";
        return;
    }

    // Cargar tratamientos
    async function cargarTratamientos() {
        try {
            const response = await fetch("http://localhost:3000/obtener-tratamientos");
            if (!response.ok) throw new Error("Error al obtener la lista de tratamientos.");

            const tratamientos = await response.json();
            tablaTratamientos.innerHTML = ""; // Limpiar la tabla antes de agregar los registros

            tratamientos.forEach((tratamiento) => {
                const fila = document.createElement("tr");
                fila.innerHTML = `
                    <td>${tratamiento.nombre_completo}</td>
                    <td>${tratamiento.medicamento}</td>
                    <td>${tratamiento.cantidad_hora}</td>
                `;
                tablaTratamientos.appendChild(fila);
            });
        } catch (error) {
            console.error("Error al cargar tratamientos:", error);
            alert("No se pudo cargar la lista de tratamientos.");
        }
    }

    await cargarTratamientos();
});
