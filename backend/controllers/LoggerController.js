const fs = require('fs');
const path = require('path');

class LoggerController {

    static MAX_LOGS = 30;

    static init() {
        const baseDir = process.cwd().endsWith('backend') ? process.cwd() : path.join(process.cwd(), 'backend');
        this.logsDir = path.join(baseDir, 'logs');

        if (!fs.existsSync(this.logsDir)) {
            fs.mkdirSync(this.logsDir, { recursive: true });
        }
    }

    static _getTimestamp() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    static _format(level, message) {
        const timestamp = this._getTimestamp();
        return `[${timestamp}] [${level.toUpperCase()}] ${message}`;
    }

    static _writeToFile(message) {
        const filePath = path.join(this.logsDir, `${new Date().toISOString().slice(0, 10)}.log`);
        fs.appendFile(filePath, message + '\n', err => {
            if (err) console.error('Error escribiendo el log:', err);
        });

        this._cleanupOldLogs();
    }

    static _cleanupOldLogs() {
        const files = fs.readdirSync(this.logsDir)
            .filter(f => f.endsWith('.log'))
            .map(f => ({
                name: f,
                time: fs.statSync(path.join(this.logsDir, f)).mtime.getTime()
            }))
            .sort((a, b) => a.time - b.time); 

        while (files.length > this.MAX_LOGS) {
            const oldest = files.shift();
            fs.unlink(path.join(this.logsDir, oldest.name), err => {
                if (err) console.error('Error eliminando log antiguo:', err);
            });
        }
    }

    static info(message) {
        const formatted = this._format('info', message);
        this._writeToFile(formatted);
    }

    static warn(message) {
        const formatted = this._format('warn', message);
        this._writeToFile(formatted);
    }

    static error(message) {
        const formatted = this._format('error', message);
        this._writeToFile(formatted);
    }
}

LoggerController.init();

module.exports = LoggerController;
