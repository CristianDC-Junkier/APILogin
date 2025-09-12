import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, CardBody, CardTitle, CardText } from 'reactstrap';
import BackButton from '../../components/utils/BackButtonComponent';
import FolderTree from '../../components/system/FolderTree';
import FileList from '../../components/system/FileList';
import FileViewer from '../../components/system/FileViewer';
import { getLogFolders, getLogFiles, getLogFileContent, downloadLogFile, getSystemMetrics } from '../../services/DashboardService';

function formatUptime(totalSeconds) {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    const paddedHrs = String(hrs).padStart(2, '0');
    const paddedMins = String(mins).padStart(2, '0');
    const paddedSecs = String(secs).padStart(2, '0');

    return `${paddedHrs}:${paddedMins}:${paddedSecs}`;
}

export default function DashboardSystem() {
    const [folders, setFolders] = useState([]);
    const [files, setFiles] = useState([]);
    const [selectedFolder, setSelectedFolder] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileContent, setFileContent] = useState('Selecciona un archivo para ver su contenido');

    // Estados métricas
    const [cpuUsage, setCpuUsage] = useState(null);
    const [memoryUsed, setMemoryUsed] = useState(null);
    const [threadsCount, setThreadsCount] = useState(null);
    const [uptimeSeconds, setUptimeSeconds] = useState(null);

    useEffect(() => {
        const fetchFolders = async () => {
            const res = await getLogFolders();
            if (res.success) setFolders(res.data);
            //alert(res.data);
        };
        fetchFolders();
    }, []);

    useEffect(() => {
        // Función para obtener métricas y actualizar estados
        const fetchMetrics = async () => {
            const res = await getSystemMetrics();
            //alert(res.data);
            if (res.success) {
                setCpuUsage(res.data.cpuUsagePercent);
                setMemoryUsed(res.data.memoryUsedMB);
                setThreadsCount(res.data.threadsCount);
                setUptimeSeconds(res.data.uptimeSeconds);
            }
        };

        fetchMetrics();
        const interval = setInterval(fetchMetrics, 1000);

        return () => clearInterval(interval);
    }, []);

    const handleSelectFolder = async (folder) => {
        setSelectedFolder(folder);
        setSelectedFile(null);
        setFileContent('Selecciona un archivo para ver su contenido');

        const res = await getLogFiles(folder);
        if (res.success) {
            setFiles(res.data);
        } else {
            setFiles([]);
        }
    };

    const handleSelectFile = async (file) => {
        setSelectedFile(file);
        const res = await getLogFileContent(selectedFolder, file);
        if (res.success) {
            setFileContent(res.data);
        } else {
            setFileContent('Error al cargar el archivo');
        }
    };

    const handleDownloadFile = (file) => {
        downloadLogFile(selectedFolder, file).then(({ success, error }) => {
            if (!success) {
                alert('Error al descargar el archivo: ' + error.message);
            }
        });
    };

    return (
        <Container className="container mt-4 position-relative">
            <h3 className="text-center mb-5">Estadísticas del Servidor</h3>
            <div className="position-absolute top-0 start-0">
                <BackButton back="/cultura-admin/dashboard" />
            </div>
            <Row className="mb-3 text-center g-2">
                <Col md={3}>
                    <Card className="border-warning shadow-sm ">
                        <CardBody>
                            <CardTitle tag="h6">CPU Usage (%)</CardTitle>
                            <CardText className="fs-4 fw-bold">
                                {typeof cpuUsage === 'number' ? `${cpuUsage.toFixed(2)}%` : 'Cargando...'}
                            </CardText>
                        </CardBody>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="border-warning shadow-sm ">
                        <CardBody>
                            <CardTitle tag="h6">Memoria Usada (MB)</CardTitle>
                            <CardText className="fs-4 fw-bold">
                                {typeof memoryUsed === 'number' ? memoryUsed.toFixed(2) : 'Cargando...'}
                            </CardText>
                        </CardBody>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="border-info shadow-sm ">
                        <CardBody>
                            <CardTitle tag="h6">Threads Activos</CardTitle>
                            <CardText className="fs-4 fw-bold">
                                {threadsCount !== null ? threadsCount : 'Cargando...'}
                            </CardText>
                        </CardBody>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="border-primary shadow-sm ">
                        <CardBody>
                            <CardTitle tag="h6">Uptime</CardTitle>
                            <CardText className="fs-4 fw-bold">
                                {uptimeSeconds !== null ? formatUptime(uptimeSeconds) : 'Cargando...'}
                            </CardText>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
            <Row className="mt-5 mb-3 h-100 d-none d-lg-flex" style={{ height: '60vh' }}>
                <Col lg="2" className="border-end overflow-auto">
                    <FolderTree
                        folders={folders}
                        selectedFolder={selectedFolder}
                        onSelectFolder={handleSelectFolder}
                    />
                </Col>
                <Col lg="3" className="border-end overflow-auto">
                    <FileList
                        files={files}
                        selectedFile={selectedFile}
                        onSelectFile={handleSelectFile}
                        onDownloadFile={handleDownloadFile}
                    />
                </Col>
                <Col lg="7" >
                    <FileViewer content={fileContent} />
                </Col>
            </Row>
            <Row className="d-flex d-lg-none flex-column">
                <Col xs="12" className="mb-3" style={{ maxHeight: '80vh', overflowY: 'auto', width: '100%' }}>
                    <FileViewer content={fileContent} />
                </Col>
                <Row xs="12" className="w-100 mb-3" >
                    <Col xs="5">
                        <FolderTree
                            folders={folders}
                            selectedFolder={selectedFolder}
                            onSelectFolder={handleSelectFolder}
                        />
                    </Col>
                    <Col xs="7">
                        <FileList
                            files={files}
                            selectedFile={selectedFile}
                            onSelectFile={handleSelectFile}
                        />
                    </Col>
                </Row>
            </Row>
        </Container>
    );
}
