document.addEventListener("DOMContentLoaded", () => { 
    const form = document.querySelector("#login-form");

    form.addEventListener("submit", (event) => {
        event.preventDefault(); // Evitar envío por defecto

        // Capturar valores
        const correo = document.getElementById("correo").value.trim();
        const contrasena = document.getElementById("contrasena").value.trim();

        // Validar que los campos no estén vacíos
        if (!correo || !contrasena) {
            alert("Por favor, completa todos los campos.");
            return;
        }

        // Enviar los datos al servidor
        fetch("http://localhost:3000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ correo, contrasena })
        })
            .then((response) => {
                if (!response.ok) {
                    return response.text().then((message) => {
                        throw new Error(message);
                    });
                }
                return response.json();
            })
            .then((result) => {
                // Verifica el tipo de usuario y almacena el id
                if (result.type === "paciente") {
                    window.location.href = "PaginaP.html";
                } else if (result.type === "doctor") {
                    // Almacenar el id_doctor en el localStorage
                    localStorage.setItem("id_doctor", result.id_doctor);
                    window.location.href = "PaginaD.html";
                } else {
                    alert("Credenciales incorrectas. Por favor, verifica tu correo y contraseña.");
                }
            })
            .catch((error) => {
                alert(`Error: ${error.message}`);
            });
    });
});