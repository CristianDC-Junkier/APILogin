import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, CardBody, CardTitle, CardText, Button, Input } from "reactstrap";
import { useAuth } from "../../hooks/useAuth";
import Swal from "sweetalert2";

import { createDepartment } from "../../services/DepartmentService";
import { createLink } from "../../services/LinkService";

import BackButtonComponent from "../../components/utils/BackButtonComponent";
import TableDepartmentComponent from "../../components/department/TableDepartmentComponent";
import TableLinkComponent from "../../components/link/TableLinkComponent";
import AddModifyDepartmentComponent from "../../components/department/AddModifyDepartmentComponent";
import AddModifyLinkComponent from "../../components/link/AddModifyLinkComponent";

/**
 * Página encargada de mostrar la tabla de departamentos y de enlaces y las acciones asociadas a la gestión de los mismos
 */
const DepartmentList = () => {
    const { user: currentUser } = useAuth();
    const [currentView, setCurrentView] = useState("departments"); // "departments" | "links"
    const [rowsPerPage, setRowsPerPage] = useState(8);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");

    useEffect(() => {
        document.title = "Panel de control de Departamentos - IDEE Almonte";
    }, []);

    // Estado de estadísticas
    const [statsDepart, setStatsDepart] = useState(0);
    const [statsLink, setStatsLink] = useState(0);

    useEffect(() => {
        setCurrentPage(1);
    }, [search, setSearch]);


    // Ajuste dinámico de filas según ventana
    useEffect(() => {
        const updateRows = () => {
            const vh = window.innerHeight;
            const headerHeight = 220;
            const rowHeight = 50;
            const footerHeight = 150;
            setRowsPerPage(Math.max(3, Math.floor((vh - headerHeight - footerHeight) / rowHeight)));
            setCurrentPage(1);
        };
        updateRows();
        window.addEventListener("resize", updateRows);
        return () => window.removeEventListener("resize", updateRows);
    }, []);

    //Función que gestiona la creación de un departamento
    const handleCreateDepartment = async () => {
        await AddModifyDepartmentComponent({
            action: "create",
            onConfirm: async (formValues) => {
                const result = await createDepartment(formValues);
                if (result.success) {
                    Swal.fire("Éxito", "Departamento creado correctamente", "success");
                    window.dispatchEvent(new Event("refresh-departments"));
                } else {
                    Swal.fire("Error", result.error || "No se pudo crear el departamento", "error");
                }
            }
        });
    };

    //Función que gestiona la creación de un enlace
    const handleCreateLink = async () => {
        await AddModifyLinkComponent({
            action: "create",
            onConfirm: async (formValues) => {
                const result = await createLink(formValues);
                if (result.success) {
                    Swal.fire("Éxito", "Enlace creado correctamente", "success");
                    window.dispatchEvent(new Event("refresh-links"));
                } else {
                    Swal.fire("Error", result.error || "No se pudo crear el enlace", "error");
                }
            }
        });
    };

    return (
        <Container className="mt-4 d-flex flex-column" style={{ minHeight: "80vh" }}>
            {/* Botón Volver arriba a la izquierda */}
            <div className="position-absolute top-0 start-0">
                <BackButtonComponent back="/home" />
            </div>

            {/* Botón Crear Departamento/Enlace arriba a la derecha */}
            <div className="position-absolute top-0 end-0 p-3">
                <Button
                    color="transparent"
                    style={{ color: 'black', border: 'none', padding: 0, fontWeight: 'bold' }}
                    onClick={currentView === "departments" ? handleCreateDepartment : handleCreateLink}
                >
                    ➕ {currentView === "departments" ? "Crear Departamento" : "Crear Enlace"}
                </Button>
            </div>

            {/* Tarjetas de stats */}
            <Row className="mb-3 mt-4 justify-content-center g-3">
                <Col xs={6} sm={6} md={4} l={3} xl={3}>
                    <Card
                        className={`shadow-lg mb-2 border-2 ${currentView === "departments" ? "border-primary" : ""}`}
                        style={{ cursor: 'pointer' }}
                        onClick={() => setCurrentView("departments")}
                    >
                        <CardBody className="text-center pt-3">
                            <CardTitle tag="h6">Departamentos</CardTitle>
                            <CardText className="fs-4 fw-bold">{statsDepart}</CardText>
                        </CardBody>
                    </Card>
                </Col>
                <Col xs={6} sm={6} md={4} l={3} xl={3}>
                    <Card
                        className={`shadow-lg mb-2 border-2 ${currentView === "links" ? "border-primary" : ""}`}
                        style={{ cursor: 'pointer' }}
                        onClick={() => setCurrentView("links")}
                    >
                        <CardBody className="text-center pt-3">
                            <CardTitle tag="h6">Enlaces</CardTitle>
                            <CardText className="fs-4 fw-bold">{statsLink}</CardText>
                        </CardBody>
                    </Card>
                </Col>
            </Row>

            <div className="d-flex justify-content-between mb-2 align-items-center">
                {/* Título */}
                <div className="fw-bold fs-6 d-flex justify-content-between mb-2 align-items-center">
                    {currentView === "links" ? "Enlaces" : "Departamentos"}
                </div>
                <div className="d-flex  gap-2">

                    {/* Input de búsqueda siempre visible */}
                    <Input
                        type="text"
                        placeholder="Buscar por nombre..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={{ minWidth: "200px" }}
                    />
                </div>
            </div>

            {/* Tabla */}
            {currentView === "departments" ? (
                <TableDepartmentComponent
                    search={search}
                    rowsPerPage={rowsPerPage}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    currentUser={currentUser}
                    onStatsDepartsUpdate={setStatsDepart}
                    onStatsLinksUpdate={setStatsLink}
                />
            ) : (
                <TableLinkComponent
                    search={search}
                    rowsPerPage={rowsPerPage}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    onStatsUpdate={setStatsLink}
                />
            )}
        </Container>
    );
};

export default DepartmentList;
