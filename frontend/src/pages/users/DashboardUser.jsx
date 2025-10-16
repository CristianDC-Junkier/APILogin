import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, CardBody, CardTitle, CardText, Button, Input } from "reactstrap";
import Swal from 'sweetalert2';

import { getUsersList, createUser } from "../../services/UserService";
import { getDepartmentList } from "../../services/DepartmentService";
import { useAuth } from "../../hooks/useAuth";

import BackButton from "../../components/utils/BackButtonComponent";
import Spinner from '../../components/utils/SpinnerComponent';
import TableUserComponent from "../../components/user/TableUserComponent";
import AddModifyUserCommponent from "../../components/user/AddModifyUserComponent";

/**
 * Página encargada de mostrar la tabla de usuario y las acciones asociadas a la gestión de los mismos
 */

const DashBoardUser = () => {
    const { user: currentUser, token, logout } = useAuth();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);

    const [users, setUsers] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [usersShow, setUsersShow] = useState([]);
    const [selectedType, setSelectedType] = useState("All");

    const [selectedUser, setSelectedUser] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(8);

    // Función encargada de obtener la información para la tabla
    useEffect(() => {
        const updateRows = () => {
            const vh = window.innerHeight;
            const headerHeight = 220;
            const rowHeight = 50;
            const footerHeight = 150;
            setRowsPerPage(Math.max(3, Math.floor((vh - headerHeight - footerHeight) / rowHeight)));
        };
        updateRows();
        window.addEventListener("resize", updateRows);
        return () => window.removeEventListener("resize", updateRows);
    }, []);



    const fetchUsers = async () => {
        if (!token) return;
        setLoading(true);
        try {
            const responseUserList = await getUsersList(token);
            if (responseUserList.success) {
                setUsers(responseUserList.data.users ?? []);
            }
        } catch {
            Swal.fire("Error", "No se pudo obtener la lista de usuarios", 'error');
        }
        setLoading(false);
    };

    const fetchDepartments = async () => {
        if (!token) return;
        setLoading(true);
        try {
            const responseDepartmentList = await getDepartmentList(token);
            if (responseDepartmentList.success) {
                setDepartments(responseDepartmentList.data.departments ?? []);
            }
        } catch {
            Swal.fire("Error", "No se pudo obtener la lista de departamentos", 'error');
        }
        setLoading(false);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => { fetchUsers(); fetchDepartments(); }, [token, currentUser, logout, navigate]);


    useEffect(() => {
        let filtered = [...users];
        if (selectedType === "Admin") {
            filtered = filtered.filter(u => u.user.usertype === "ADMIN" || u.user.usertype === "SUPERADMIN");
        } else if (selectedType === "User") {
            filtered = filtered.filter(u => u.user.usertype === "USER");
        }
        setUsersShow(filtered);
        setCurrentPage(1);
    }, [selectedType, users]);

    // Estadísticas
    const stats = {
        total: users.length,
        admin: users.filter(u => u.user.usertype === "ADMIN" || u.user.usertype === "SUPERADMIN").length,
        user: users.filter(u => u.user.usertype === "USER").length,
    };


    //Función que gestiona la creación de un usuario
    const handleCreate = async () => {
        await AddModifyUserCommponent({
            currentUser,
            action: "create",
            onConfirm: async (formValues) => {
                const result = await createUser(formValues, token);
                if (result.success) {
                    Swal.fire("Éxito", "Usuario creado correctamente", "success");
                    const response = await getUsersList(token);
                    if (response.success) fetchUsers();
                } else {
                    Swal.fire("Error", result.error || "No se pudo crear el usuario", "error");
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
                    onClick={handleCreate}
                >
                    ➕ Crear Usuario
                </Button>
            </div>

            {/* Tarjetas de estadísticas */}
            <Row className="mb-1 mt-4 justify-content-center g-2">
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
            <div className="d-flex flex-column flex-md-row justify-content-between mb-2 align-items-start align-items-md-center">
                {/* título */}
                <div className="fw-bold fs-6 mb-2 mb-md-0">
                    {selectedType === "All" ? "Todos los usuarios" : selectedType === "Admin" ? "Administradores" : "Usuarios"}
                </div>

                {/* contenedor de inputs */}
                <div className="d-flex gap-2">
                    <Input
                        type="text"
                        placeholder="Buscar por usuario..."
                        value={selectedUser}
                        onChange={e => setSelectedUser(e.target.value)}
                        style={{ minWidth: "200px" }}
                    />
                </div>
            </div>

            {/* Tabla de usuarios */}
            <TableUserComponent
                users={usersShow}
                departments={departments}
                currentUser={currentUser}
                token={token}
                search={selectedUser}
                setSearch={setSelectedUser}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                rowsPerPage={rowsPerPage}
                refreshData={fetchUsers}
            />
        </Container>
    );
};

export default DashBoardUser;
