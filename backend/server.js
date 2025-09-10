const express = require("express");
const cors = require("cors");
const path = require("path");

// --------------------------------
//  DATABASE (Solo en Desarrollo)
// --------------------------------
const { initDatabase } = require("./config/dbInit");


const app = express();

app.use(cors());
app.use(express.json());

// --------------------------------
//            BACKEND
// --------------------------------
const AuthRoutes = require('./routes/AuthRoutes');
app.use('/', AuthRoutes);
app.use((req, res) => {
    res.status(404).json({ success: false, message: "Ruta de API no encontrada" });
});


// --------------------------------
//            FRONTEND
// --------------------------------
/*
app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});
*/



async function start() {
    try {
        await initDatabase();
        console.log('Base de datos inicializada correctamente.');
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`Servidor corriendo en http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error('Error inicializando la base de datos:', err.message);
        process.exit(1);
    }
}

start();