const fs = require("fs");
const path = require("path");
const os = require("os");

// Configuración
const logBasePath = path.join(__dirname, '../logs'); 
function getCpuUsagePercent(interval = 100) {
    return new Promise((resolve) => {
        const startMeasure = os.cpus();

        setTimeout(() => {
            const endMeasure = os.cpus();

            let idleDiff = 0;
            let totalDiff = 0;

            for (let i = 0; i < startMeasure.length; i++) {
                const startCpu = startMeasure[i].times;
                const endCpu = endMeasure[i].times;

                const idle = endCpu.idle - startCpu.idle;
                const total = (endCpu.user - startCpu.user) +
                    (endCpu.nice - startCpu.nice) +
                    (endCpu.sys - startCpu.sys) +
                    (endCpu.irq - startCpu.irq) +
                    idle;

                idleDiff += idle;
                totalDiff += total;
            }
            const usagePercent = 100 - (idleDiff / totalDiff) * 100;
            resolve(Math.round(usagePercent * 100) / 100); 
        }, interval);
    });
}

const SystemController = {
    // Obtener Logs
    getLogs: (req, res) => {
        try {
            const logs = fs
                .readdirSync(logBasePath, { withFileTypes: true })
                .filter((dirent) => dirent.isFile())
                .map((dirent) => dirent.name)
                .sort((a, b) => b.localeCompare(a));

            res.json(logs);
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    },

    // Obtener contenido de un archivo log
    getLog: (req, res) => {
        try {
            const { log } = req.params;
            const logPath = path.resolve(logBasePath, log);


            if (!fs.existsSync(logPath)) {
                return res.status(404).json({ code: "Archivo log no encontrado" });
            }
            try {
                const content = fs.readFileSync(logPath, "utf-8");
                res.type("text/plain").send(content);
            } catch (err) {
                res.status(500).json({ code: "No se pudo leer el archivo log" });
            }

        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    },

    // Descargar un archivo log
    downloadLog: (req, res) => {
        try {
            const { log } = req.params;
            const logPath = path.resolve(logBasePath, log);

            if (!fs.existsSync(logPath)) {
                return res.status(404).json({ code: "Archivo log no encontrado" });
            }

            try {
                res.download(logPath, log);
            } catch (err) {
                res.status(500).json({ code: "No se pudo descargar el archivo log" });
            }
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    },

    // Obtener métricas del sistema
    getSystemMetrics: async (req, res) => {
        try {
            const memoryUsedMB = Math.round((process.memoryUsage().rss / 1024 / 1024) * 100) / 100;
            const uptimeSeconds = Math.floor(process.uptime());
            const threadsCount = os.cpus().length;

            const cpuUsagePercent = await getCpuUsagePercent(100); 

            res.json({
                CpuUsagePercent: cpuUsagePercent,
                MemoryUsedMB: memoryUsedMB,
                ThreadsCount: threadsCount,
                UptimeSeconds: uptimeSeconds
            });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },
};

module.exports = SystemController;

