import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, CardBody, CardTitle, CardText, Button, Table, Input } from "reactstrap";
import Swal from 'sweetalert2';

import { getDepartmentList, createDepartment } from "../../services/DepartmentService";
import { getAllLinks, createLink } from "../../services/LinkService";
import { useAuth } from "../../hooks/useAuth";

import BackButton from "../../components/utils/BackButtonComponent";
import Spinner from '../../components/utils/SpinnerComponent';
import AddModifyDepartmentComponent from "../../components/department/AddModifyDepartmentComponent";
import AddModifyLinkComponent from "../../components/link/AddModifyLinkComponent";
import TableDepartmentComponent from "../../components/department/TableDepartmentComponent";
import TableLinkComponent from "../../components/link/TableLinkComponent";

/**
 * Página encargada de mostrar la tabla de usuario y las acciones asociadas a la gestión de los mismos
 */

const DepartmentList = () => {
    const { user: currentUser, token } = useAuth();

    const [currentView, setCurrentView] = useState("departments"); // "departments" | "links"
    const [loading, setLoading] = useState(false);
    const [allDeprts, setallDeprts] = useState([]);
    const [allLinks, setallLinks] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(8);
    const [search, setSearch] = useState("");


    /** Ajusta el número de filas según altura de ventana */
    useEffect(() => {
        const updateRows = () => {
            const vh = window.innerHeight;
            const headerHeight = 220;
            const rowHeight = 50;
            const footerHeight = 150;
            const availableHeight = vh - headerHeight - footerHeight;
            const rows = Math.max(3, Math.floor(availableHeight / rowHeight));
            setRowsPerPage(rows);
        };
        updateRows();
        window.addEventListener("resize", updateRows);
        return () => window.removeEventListener("resize", updateRows);
    }, []);

    //Función encargada de obtener la información para la tabla
    const fetchDeps = async (init) => {
        if (!token) return;
        if (!init) setLoading(true);
        try {
            const response = await getDepartmentList(token);
            if (response.success) {
                const dept = response.data.departments ?? [];
                setallDeprts(dept);
                const totalPages = Math.ceil(dept.length / rowsPerPage);
                if (currentPage > totalPages && totalPages > 0) {
                    setCurrentPage(totalPages);
                }
            }
        } catch (err) {
            Swal.fire("Error", "No se pudo obtener la lista de departamentos", err);
        }
        if (!init) setLoading(false);
    };

    const fetchLinks = async (init) => {
        if (!token) return;
        if (!init) setLoading(true);
        try {
            const response = await getAllLinks(token);
            if (response.success) {
                const links = response.data.links ?? [];
                setallLinks(links);
                const totalPages = Math.ceil(links.length / rowsPerPage);
                if (currentPage > totalPages && totalPages > 0) {
                    setCurrentPage(totalPages);
                }
            }
        } catch (err) {
            Swal.fire("Error", "No se pudo obtener la lista de enlaces", err);
        }
        if (!init) setLoading(false);
    };

    useEffect(() => {
        setLoading(true);
        fetchDeps(true);
        fetchLinks(true);
        setLoading(false);
    }, []);

    //Función que gestiona la creación de un usuario
    const handleCreateDepartment = async () => {
        await AddModifyDepartmentComponent({
            action: "create",
            onConfirm: async (formValues) => {
                const result = await createDepartment(formValues, token);
                if (result.success) {
                    Swal.fire("Éxito", "Departamento creado correctamente", "success");
                    await fetchDeps(false);
                } else {
                    Swal.fire("Error", result.error || "No se pudo crear el departamento", "error");
                }
            }
        });
    };

    const handleCreateLink = async () => {
        await AddModifyLinkComponent({
            action: "create",
            onConfirm: async (formValues) => {
                const result = await createLink(formValues, token);
                if (result.success) {
                    Swal.fire("Éxito", "Enlace creado correctamente", "success");
                    await fetchLinks(false);
                } else {
                    Swal.fire("Error", result.error || "No se pudo crear el enlace", "error");
                }
            }
        });
    };

    if (loading) return <Spinner />;

    return (
        <Container className="mt-4 d-flex flex-column" style={{ minHeight: "80vh" }}>
            {/* Botón Volver arriba a la izquierda */}
            <div className="position-absolute top-0 start-0">
                <BackButton back="/home" />
            </div>

            {/* Botón Crear Usuario arriba a la derecha */}
            <div className="position-absolute top-0 end-0 p-3">
                <Button
                    color="transparent"
                    style={{ color: 'black', border: 'none', padding: 0, fontWeight: 'bold' }}
                    onClick={currentView === "departments" ? handleCreateDepartment : handleCreateLink}
                >
                    ➕ {currentView === "departments" ? "Crear Departamento" : "Crear Enlace"}
                </Button>
            </div>

            {/* Tarjetas para cambiar de vista solo para ADMIN/SUPERADMIN */}
            <Row className="mb-3 mt-4 justify-content-center g-3">
                {currentUser?.usertype !== "DEPARTMENT" && (
                    <Col xs={6} sm={6} md={4} l={3} xl={3}>
                        <Card
                            className={`shadow-lg mb-2 border-2 ${currentView === "departments" ? "border-primary" : ""}`}
                            style={{ cursor: 'pointer' }}
                            onClick={() => setCurrentView("departments")}
                        >
                            <CardBody className="text-center pt-3">
                                <CardTitle tag="h6">Departamentos</CardTitle>
                                <CardText className="fs-4 fw-bold">{allDeprts.length}</CardText>
                            </CardBody>
                        </Card>
                    </Col>
                )}
                <Col xs={6} sm={6} md={4} l={3} xl={3}>
                    <Card
                        className={`shadow-lg mb-2 border-2 ${currentView === "links" ? "border-primary" : ""}`}
                        style={{ cursor: 'pointer' }}
                        onClick={() => setCurrentView("links")}
                    >
                        <CardBody className="text-center pt-3">
                            <CardTitle tag="h6">Enlaces</CardTitle>
                            <CardText className="fs-4 fw-bold">{allLinks.length}</CardText>
                        </CardBody>
                    </Card>
                </Col>
            </Row>

            <div className="d-flex flex-column flex-md-row justify-content-between mb-2 align-items-start align-items-md-center">
                {/* título */}
                <div className="fw-bold fs-6 mb-2 mb-md-0">
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

            {/* Tabla de departamentos */}
            {currentView === "departments" && (
                <TableDepartmentComponent
                    token={token}
                    departments={allDeprts ?? []}
                    links={allLinks ?? []}
                    search={search}
                    rowsPerPage={rowsPerPage}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    refreshData={fetchDeps}
                    currentUser={currentUser}
                />
            )}
            {/* Tabla de enlaces */}
            {currentView === "links" && (
                <TableLinkComponent
                    token={token}
                    links={allLinks ?? []}
                    search={search}
                    rowsPerPage={rowsPerPage}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    refreshData={fetchLinks}
                />
            )}
        </Container>
    );
};

export default DepartmentList;
