const express = require("express");
const cors = require("cors");
const LoggerController = require("./controllers/LoggerController");
const path = require("path");
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '.env') });
const basePath = '/IDEE-Almonte';

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
const UserAccountRoutes = require('./routes/UserAccountRoutes');
const SystemRoutes = require('./routes/SystemRoutes');
const DepartmentRoutes = require('./routes/DepartmentRoutes');
const LinksRoutes = require('./routes/LinksRoutes');

app.use(`${basePath}/api`, AuthRoutes);
app.use(`${basePath}/api`, SystemRoutes);
app.use(`${basePath}/api/user`, UserAccountRoutes);
app.use(`${basePath}/api/department`, DepartmentRoutes);
app.use(`${basePath}/api/link`, LinksRoutes);

// --------------------------------
//            FRONTEND
// --------------------------------

app.use(basePath, express.static(path.join(__dirname, "./dist")));
app.use(basePath, (req, res) => {
    res.sendFile(path.join(__dirname, "./dist/index.html"));
})

app.use('/', (req, res) => {
    res.redirect(`${basePath}/`);
});

app.get(`${basePath}/api`, (req, res) => {
    res.redirect(`${basePath}/`);
});

// --------------------------------
//         INICIALIZACIÓN
// --------------------------------
async function start() {
    try {
        await initDatabase();
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            LoggerController.info(`Servidor corriendo en http://localhost:${PORT}`);
        });
    } catch (err) {
        const message = err instanceof Error ? (err.message || err.stack) : JSON.stringify(err);
        LoggerController.errorCritical('❌ Error inicializando la base de datos: ' + message);
        process.exit(1);
    }
}

start();
