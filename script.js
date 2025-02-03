const apiKeyCurrency = "cur_live_y1h9CdBtca6fROoT0Tg8qGjNUUVgPDM9iLEKqV76";  // API de CurrencyAPI
const apiKeyExchangeRate = "10f5ca20ff469d3bccb6eb58";  // API de ExchangeRate

// URLs de las APIs
const apiUrlRatesCurrencyAPI = `https://v6.currencyapi.com/latest?apikey=${apiKeyCurrency}`;  // Para obtener las tasas de cambio de CurrencyAPI
const apiUrlRates = `https://v6.exchangerate-api.com/v6/${apiKeyExchangeRate}/latest/USD`;  // Para obtener las tasas de cambio de ExchangeRate
const apiUrlCodes = `https://v6.exchangerate-api.com/v6/${apiKeyExchangeRate}/codes`;  // Para obtener los códigos y nombres de las monedas

const fromCurrency = document.getElementById("fromCurrency");
const toCurrency = document.getElementById("toCurrency");
const amountInput = document.getElementById("amount");
const resultText = document.getElementById("result");

let exchangeRates = {};  // Para almacenar las tasas de cambio
let currencyNames = {};  // Para almacenar los nombres de las monedas

// Función para cargar las monedas y sus nombres
async function cargarMonedas() {
    try {
        // Obtener los nombres y códigos de las monedas de ExchangeRate API
        const resCodes = await fetch(apiUrlCodes);
        const dataCodes = await resCodes.json();

        if (dataCodes.result === "success") {
            currencyNames = dataCodes.supported_codes;

            // Llenar los select de monedas con las monedas obtenidas
            for (const [code, name] of Object.entries(currencyNames)) {
                fromCurrency.innerHTML += `<option value="${code}">${name} (${code})</option>`;
                toCurrency.innerHTML += `<option value="${code}">${name} (${code})</option>`;
            }
        }

        // Obtener las tasas de cambio de ExchangeRate API
        const resRates = await fetch(apiUrlRates);
        const dataRates = await resRates.json();

        if (dataRates.result === "success") {
            exchangeRates = dataRates.conversion_rates;
        }

        // Establecer valores por defecto en los selects
        fromCurrency.value = "USD";
        toCurrency.value = "EUR";
    } catch (error) {
        console.error("Error al cargar las monedas o las tasas:", error);
    }
}

// Función para convertir divisa usando CurrencyAPI
async function convertirDivisa() {
    const from = fromCurrency.value;
    const to = toCurrency.value;
    const amount = parseFloat(amountInput.value);

    if (isNaN(amount) || amount <= 0) {
        resultText.innerText = "Ingresa una cantidad válida.";
        return;
    }

    if (!exchangeRates[from] || !exchangeRates[to]) {
        resultText.innerText = "Error: Moneda no encontrada.";
        return;
    }

    const tasaFrom = exchangeRates[from];
    const tasaTo = exchangeRates[to];
    const conversion = (amount / tasaFrom) * tasaTo;

    const nombreFrom = currencyNames[from] || from;
    const nombreTo = currencyNames[to] || to;

    resultText.innerText = `${amount} ${nombreFrom} (${from}) = ${conversion.toFixed(2)} ${nombreTo} (${to})`;
}

// Función para obtener las tasas de cambio
async function obtenerTasas() {
    try {
        // Llamada a la API de CurrencyAPI
        const resRatesCurrencyAPI = await fetch(apiUrlRatesCurrencyAPI);
        const dataRatesCurrencyAPI = await resRatesCurrencyAPI.json();
        console.log("Respuesta de CurrencyAPI:", dataRatesCurrencyAPI);

        if (dataRatesCurrencyAPI.success) {
            exchangeRates = dataRatesCurrencyAPI.data; // Ajusta según la estructura de la respuesta
        } else {
            resultText.innerText = "Error al obtener las tasas de cambio de CurrencyAPI.";
        }

        // Llamada a la API de ExchangeRate
        const resRates = await fetch(apiUrlRates);
        const dataRates = await resRates.json();
        console.log("Tasas de cambio de ExchangeRate:", dataRates);

        if (dataRates.result === "success") {
            exchangeRates = dataRates.conversion_rates;
        } else {
            resultText.innerText = "Error al obtener las tasas de cambio de ExchangeRate.";
        }
    } catch (error) {
        console.error("Error al obtener las tasas de cambio:", error);
        resultText.innerText = "Hubo un problema al obtener las tasas de cambio.";
    }
}

// Llamar a la función obtenerTasas cuando se cargue la página
window.addEventListener("DOMContentLoaded", async () => {
    await obtenerTasas();  // Obtener las tasas de cambio al cargar la página
    await cargarMonedas();  // Cargar las monedas
});

// Evento al hacer clic en el botón de conversión
document.getElementById("convert").addEventListener("click", convertirDivisa);
