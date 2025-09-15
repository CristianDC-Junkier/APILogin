import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, CardBody, CardTitle, CardText } from 'reactstrap';
import Swal from 'sweetalert2';

import { getLogs, getLog, downloadLog, getSystemMetrics } from '../../services/SystemService';
import { useAuth } from "../../hooks/useAuth";

import BackButton from '../../components/utils/BackButtonComponent';
import LogListComponent from '../../components/system/LogListComponent';
import LogViewerComponent from '../../components/system/LogViewerComponent';
import Spinner from '../../components/utils/SpinnerComponent';


function formatUptime(totalSeconds) {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export default function DashboardSystem() {
    const [logs, setLogs] = useState([]);
    const [selectedLog, setSelectedLog] = useState(null);
    const [logContent, setLogContent] = useState('Selecciona un archivo para ver su contenido');

    const { user: currentUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const token = currentUser?.token;

    const [cpuUsage, setCpuUsage] = useState(null);
    const [memoryUsed, setMemoryUsed] = useState(null);
    const [threadsCount, setThreadsCount] = useState(null);
    const [uptimeSeconds, setUptimeSeconds] = useState(null);

    useEffect(() => {
        const fetchLogs = async () => {
            if (!token) return;
            setLoading(true);
            try {
                const res = await getLogs(token);
                if (res.success) setLogs(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchLogs();
    }, [token]);

    useEffect(() => {
        const fetchMetrics = async () => {
            if (!token) return;
            try {
                const res = await getSystemMetrics(token);
                if (res.success) {
                    setCpuUsage(res.data.CpuUsagePercent);
                    setMemoryUsed(res.data.MemoryUsedMB);
                    setThreadsCount(res.data.ThreadsCount);
                    setUptimeSeconds(res.data.UptimeSeconds);
                }
            } catch (err) {
                console.error(err);
            }
        };

        fetchMetrics();
        const interval = setInterval(fetchMetrics, 1000);
        return () => clearInterval(interval);
    }, [token]);


    const handleSelectLog = async (log) => {
        setSelectedLog(log);
        const res = await getLog(log, token);
        if (res.success) {
            setLogContent(res.data);
        } else {
            setLogContent('Error al cargar el archivo');
        }
    };

    const handleDownloadLog = (log) => {
        downloadLog(log, token).then(({ success, error }) => {
            if (!success) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: `No se pudo descargar el archivo: ${error.message}`,
                });
            } else {
                Swal.fire({
                    icon: 'success',
                    title: 'Descarga iniciada',
                    text: `El archivo "${log}" se está descargando.`,
                    timer: 2000,
                    showConfirmButton: false
                });
            }
        });
    };

    if (loading) return <Spinner />;

    return (
        <Container className="container mt-4 position-relative">
            <h3 className="text-center mb-5">Estadísticas del Servidor</h3>
            <div className="position-absolute top-0 start-0">
                <BackButton back="/home" />
            </div>
            <Row className="mb-3 text-center g-2">
                <Col md={3}>
                    <Card className="border-warning shadow-sm">
                        <CardBody>
                            <CardTitle tag="h6">CPU Usage (%)</CardTitle>
                            <CardText className="fs-4 fw-bold">
                                {typeof cpuUsage === 'number' ? `${cpuUsage.toFixed(2)}%` : 'Cargando...'}
                            </CardText>
                        </CardBody>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="border-warning shadow-sm">
                        <CardBody>
                            <CardTitle tag="h6">Memoria Usada (MB)</CardTitle>
                            <CardText className="fs-4 fw-bold">
                                {typeof memoryUsed === 'number' ? memoryUsed.toFixed(2) : 'Cargando...'}
                            </CardText>
                        </CardBody>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="border-info shadow-sm">
                        <CardBody>
                            <CardTitle tag="h6">Threads Activos</CardTitle>
                            <CardText className="fs-4 fw-bold">
                                {threadsCount !== null ? threadsCount : 'Cargando...'}
                            </CardText>
                        </CardBody>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="border-primary shadow-sm">
                        <CardBody>
                            <CardTitle tag="h6">Uptime</CardTitle>
                            <CardText className="fs-4 fw-bold">
                                {uptimeSeconds !== null ? formatUptime(uptimeSeconds) : 'Cargando...'}
                            </CardText>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
            <Row className="mt-5 mb-3 h-100 d-none d-lg-flex" style={{ height: 'calc(100vh - 200px)' }}>
                <Col lg="3" className="border-end overflow-auto d-flex flex-column">
                    <LogListComponent
                        logs={logs}
                        selectedLog={selectedLog}
                        onSelectLog={handleSelectLog}
                        onDownloadLog={handleDownloadLog}
                    />
                </Col>
                <Col lg="9" className="d-flex flex-column">
                    <LogViewerComponent content={logContent} />
                </Col>
            </Row>
            <Row className="d-flex d-lg-none flex-column">
                <Col xs="12" className="mb-3" style={{ maxHeight: '80vh', overflowY: 'auto', width: '100%' }}>
                    <LogViewerComponent content={logContent} />
                </Col>
                <Row xs="12" className="w-100 mb-3">
                    <Col xs="12">
                        <LogListComponent
                            logs={logs}
                            selectedLog={selectedLog}
                            onSelectLog={handleSelectLog}
                        />
                    </Col>
                </Row>
            </Row>
        </Container>
    );
}
