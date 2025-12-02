import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, CardBody, CardTitle, CardText, Button, Input } from "reactstrap";
import Swal from "sweetalert2";

import { useAuth } from "../../hooks/useAuth";
import { createUser } from "../../services/UserService";

import BackButtonComponent from "../../components/utils/BackButtonComponent";
import TableUserComponent from "../../components/user/TableUserComponent";
import AddModifyUserComponent from "../../components/user/AddModifyUserComponent"; 

/**
 * Página encargada de mostrar la tabla de usuario y las acciones asociadas a la gestión de los mismos
 */
const DashBoardUser = () => {
    const { user: currentUser } = useAuth();

    const [selectedType, setSelectedType] = useState("All");
    const [selectedUser, setSelectedUser] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(8);
    const [sortBy, setSortBy] = useState("name");


    useEffect(() => {
        document.title = "Panel de control de Usuarios - IDEE Almonte";
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [selectedUser, setSelectedUser]);

    // Estado de estadísticas
    const [stats, setStats] = useState({ total: 0, admin: 0, user: 0 });

    // Ajusta el número de filas según altura de ventana
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

    // Crear usuario (solo refresca la tabla)
    const handleCreate = async () => {
        await AddModifyUserComponent({
            currentUser,
            action: "create",
            onConfirm: async (formValues) => {
                const result = await createUser(formValues);
                if (result.success) {
                    Swal.fire("Éxito", "Usuario creado correctamente", "success");
                    window.dispatchEvent(new Event("refresh-users"));
                } else {
                    Swal.fire("Error", result.error || "No se pudo crear el usuario", "error");
                }
            }
        });
    };

    return (
        <Container className="mt-4 d-flex flex-column" >
            {/* Botón Volver arriba a la izquierda */}
            <div className="position-absolute top-0 start-0">
                <BackButtonComponent back="/home" />
            </div>

            {/* Botón Crear Usuario arriba a la derecha */}
            <div className="position-absolute top-0 end-0 p-3">
                <Button
                    color="transparent"
                    style={{ color: 'black', border: 'none', padding: 0, fontWeight: 'bold' }}
                    onClick={handleCreate}
                >
                    ➕ Crear Usuario
                </Button>
            </div>

            {/* Tarjetas de estadísticas */}
            <Row className="mb-3 mt-4 justify-content-center g-3">
                {[
                    { label: "Total", value: stats.total, type: "All" },
                    { label: "Administradores", value: stats.admin, type: "Admin" },
                    { label: "Usuarios", value: stats.user, type: "User" }
                ].map((metric, idx) => (
                    <Col key={idx} xs={6} sm={4} md={4} l={4} xl={3}>
                        <Card
                            className={`shadow-lg mb-2 border-2 ${selectedType === metric.type ? "border-primary" : "border-light"}`}
                            style={{
                                cursor: 'pointer',
                                backgroundColor: selectedType === metric.type ? "#e9f3ff" : "#fff",
                                transition: "all 0.2s ease-in-out"
                            }}
                            onClick={() => { setSelectedType(metric.type); setCurrentPage(1); }}
                        >
                            <CardBody className="text-center pt-3">
                                <CardTitle tag="h6">{metric.label}</CardTitle>
                                <CardText className="fs-4 fw-bold">{metric.value}</CardText>
                            </CardBody>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* Fila con tipo de usuario seleccionado + búsqueda */}
            <div className="d-flex flex-column flex-md-row justify-content-between mb-2 align-items-start align-items-md-center gap-2">

                {/* Título */}
                <div className="fw-bold fs-6 text-center text-md-start w-100 w-md-auto">
                    {selectedType === "All" ? "Todos los usuarios" : selectedType === "Admin" ? "Administradores" : "Usuarios"}
                </div>

                {/* Contenedor inputs + botón */}
                <div className="d-flex flex-column flex-md-row gap-2 w-100 w-md-auto">
                    <Input
                        type="text"
                        placeholder="Buscar por usuario..."
                        value={selectedUser}
                        onChange={e => setSelectedUser(e.target.value)}
                        style={{ minWidth: "200px" }}
                    />
                </div>
                {/* Botón Ordenación */}
                <Button
                    color="secondary"
                    className="w-100 w-md-auto"
                    onClick={() => setSortBy(sortBy === "name" ? "id" : "name")}
                >
                    {sortBy === "name" ? "Identificador" : "Nombre"}
                </Button>
            </div>

            {/* Tabla de usuarios */}
            <TableUserComponent
                currentUser={currentUser}
                search={selectedUser}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                rowsPerPage={rowsPerPage}
                filterType={selectedType}
                onStatsUpdate={setStats}
                sortBy={sortBy}
            />
        </Container>
    );
};

export default DashBoardUser;
