document.getElementById("convert").addEventListener("click", async () => {
    const from = document.getElementById("from").value;
    const to = document.getElementById("to").value;
    const amount = document.getElementById("amount").value;

    if (amount <= 0) {
        alert("Ingrese un monto válido");
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/convert?from=${from}&to=${to}&amount=${amount}`);
        const data = await response.json();

        if (data.error) {
            document.getElementById("result").innerText = "Error: " + data.error;
        } else {
            document.getElementById("result").innerText = `Resultado: ${data.convertedAmount} ${to}`;
        }
    } catch (error) {
        console.error("Error al obtener los datos:", error);
        document.getElementById("result").innerText = "Error al obtener datos.";
    }
});
