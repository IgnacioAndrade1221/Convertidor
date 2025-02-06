import dotenv from "dotenv";
import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import path from "path";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.API_KEY;

// ARCHIVOS ESTATICOS
app.use(express.static("public"));

app.use(cors());

app.get("/convert", async (req, res) => {
    try {
        const { from, to, amount } = req.query;

        if (!from || !to || !amount) {
            return res.status(400).json({ error: "Faltan parámetros requeridos." });
        }

        const url = `https://v6.exchangerate-api.com/v6/${API_KEY}/pair/${from}/${to}/${amount}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.result === "error") {
            return res.status(400).json({ error: data["error-type"] });
        }

        res.json({
            from,
            to,
            amount,
            convertedAmount: data.conversion_result,
            rate: data.conversion_rate,
        });
    } catch (error) {
        console.error("Error al obtener tasas de cambio:", error);
        res.status(500).json({ error: "Error del servidor." });
    }
});

// INICIAR SERVER
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
