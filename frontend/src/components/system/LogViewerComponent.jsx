import React from 'react';
import { Card, CardBody } from "reactstrap";

export default function LogViewerComponent({ content }) {
    const renderLine = (line, index) => {
        // Buscar el nivel de log: INFO, WARN, ERROR
        const match = line.match(/\[(INFO|WARN|ERROR)\]/i);
        if (!match) {
            return <div key={index}>{line}</div>;
        }

        const level = match[1].toUpperCase(); // Normalizamos
        const colorMap = {
            INFO: 'blue',
            WARN: 'orange',
            ERROR: 'red'
        };

        // Dividir en tres partes: timestamp, nivel, mensaje
        const parts = line.split(`[${match[1]}]`);
        return (
            <div key={index} style={{ color: colorMap[level] || 'black' }}>
                <span>{parts[0]}</span>
                <span style={{ fontWeight: 'bold' }}>[{level}]</span>
                <span>{parts[1]}</span>
            </div>
        );
    };

    return (
        <Card className="d-flex flex-column" style={{ flex: 1, minHeight: '50vh' }}>
            <CardBody style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div
                    style={{
                        whiteSpace: 'pre-wrap',
                        fontFamily: 'monospace',
                        overflowY: 'auto',
                        flex: 1
                    }}
                >
                    {content.split('\n').map((line, index) => renderLine(line, index))}
                </div>
            </CardBody>
        </Card>
    );
}
