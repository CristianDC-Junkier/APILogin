import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import {
    Row, Col, Card, CardBody, CardTitle, CardText,
    Button, Table
} from "reactstrap";
import Swal from 'sweetalert2';
import { getUsersDashboard, deleteUser, toggleLockUser } from "../../services/DashboardService";
import { generateToken } from "../../services/SecurityService";
import { useAuth } from "../../hooks/useAuth";
import BackButton from "../../components/utils/BackButtonComponent";
import Spinner from '../../components/utils/Spinner';
import Pagination from "../../components/PaginationComponent";
import { renderCaptchaSlider } from "../../components/utils/RenderCaptchaFunction";

const UserList = () => {
    const navigate = useNavigate();
    const { user: currentUser } = useAuth();

    const [loading, setLoading] = useState(true);
    const [amountStats, setAmountStats] = useState(null);
    const [allUsers, setAllUsers] = useState([]);
    const [selectedRole, setSelectedRole] = useState("All");
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;

    const token = currentUser?.token;

    // Filtrado y paginación
    // console.log(allUsers.map(u => u.rol?.name));

    const filteredUsers = selectedRole === "All"
        ? allUsers
        : allUsers.filter(user => user.rol?.name === selectedRole);
    const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);
    const currentUsers = filteredUsers.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

    useEffect(() => {
        const fetchData = async () => {
            const response = await getUsersDashboard(token);
            if (response.success) {
                const { counts = {}, lists = {} } = response.data ?? {};
                setAmountStats({
                    accountsClients: counts.clients ?? "N/A",
                    accountsPublishers: counts.publishers ?? "N/A",
                    accountsAdmins: counts.admins ?? "N/A",
                    accountsTotal: counts.total ?? "N/A",
                });
                setAllUsers(lists.all ?? []);
            }
            setLoading(false);
            console.log(response);
        };
        fetchData();
    }, [token]);

    const handleCardClick = (rol) => {
        setSelectedRole(rol);
        setCurrentPage(1);
    };

    const openActionModal = (action, user) => {
        const { html, didOpen } = renderCaptchaSlider(async () => {
            const token = await generateToken(`${action.toUpperCase()}_USER`);
            await confirmAction(action, user, token);
        });

        Swal.fire({
            title: `${action} Usuario`,
            html,
            showCancelButton: true,
            showConfirmButton: false,
            cancelButtonText: 'Cancelar',
            allowOutsideClick: false,
            didOpen
        });
    };

    const confirmAction = async (action, user, token) => {
        try {
            let success = false;
            if (action === "Delete") {
                await deleteUser(user.id, user.rol.name, user.securityStamp, token);
                success = true;
            } else if (action === "Lock" || action === "Unlock") {
                await toggleLockUser(user.id, user.securityStamp, user.username, user.email, token);
                success = true;
            } else if (action === "Modify") {
                navigate(`/cultura-admin/dashboard/users/modify/${user.id}`);
                return;
            }

            Swal.fire(
                success ? 'Perfecto' : 'Error',
                success ? `La acción "${action}" se realizó correctamente` : `La acción "${action}" ha fallado`,
                success ? 'success' : 'error'
            );

            // Recargar
            const response = await getUsersDashboard(token);
            if (response.success) {
                const { counts = {}, lists = {} } = response.data ?? {};
                setAmountStats({
                    accountsClients: counts.clients ?? "N/A",
                    accountsPublishers: counts.publishers ?? "N/A",
                    accountsAdmins: counts.admins ?? "N/A",
                    accountsTotal: counts.total ?? "N/A",
                });
                setAllUsers(lists.all ?? []);
            }
        } catch {
            alert("Error al ejecutar la acción");
        }
    };

    const renderUserTable = () => (
        <div className="mt-5">
            <h5 className="mb-3 text-center">Usuarios - {selectedRole}</h5>
            <Table striped responsive>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Usuario</th>
                        <th>Email</th>
                        {selectedRole === "All" && <th>Rol</th>}
                        <th>Bloqueado</th>
                        <th className="text-center">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {currentUsers.map((user, idx) => {
                        const isCurrentUser = user?.userName === currentUser?.username;

                        return (
                            <tr key={idx}>
                                <td>{user?.id || '\u00A0'}</td>
                                <td>{user?.userName || '\u00A0'}</td>
                                <td>{user?.email || '\u00A0'}</td>
                                {selectedRole === "All" && <td>{user?.rol?.name || " "}</td>}
                                <td>{user?.lockoutEnabled === true ? "Sí" : user?.lockoutEnabled === false ? "No" : '\u00A0'}</td>
                                <td className="text-center">
                                    {user?.id ? (
                                        isCurrentUser ? (
                                            <Button color="info" size="sm" onClick={() => navigate('/cultura-admin/profile')}>
                                                👤 Mi Perfil
                                            </Button>
                                        ) : (
                                            <div className="d-flex justify-content-center flex-wrap gap-1">
                                                <Button color="warning" size="sm" onClick={() => openActionModal("Modify", user)}>✏️</Button>
                                                <Button
                                                    color={user.lockoutEnabled ? "success" : "danger"}
                                                    size="sm"
                                                    onClick={() => openActionModal(user.lockoutEnabled ? "Unlock" : "Lock", user)}
                                                >
                                                    {user.lockoutEnabled ? "🔓" : "🔒"}
                                                </Button>
                                                {user?.rol?.name !== "Admin" && (
                                                    <Button color="primary" size="sm" onClick={() => openActionModal("Delete", user)}>
                                                        🗑️
                                                    </Button>
                                                )}
                                            </div>
                                        )
                                    ) : <span className="text-muted">&nbsp;</span>}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </Table>
            {totalPages > 1 && (
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            )}
        </div>
    );

    if (loading) return <Spinner />;

    return (
        <div className="container mt-4 position-relative mb-3" style={{ minHeight: "100vh" }}>
            <div className="position-absolute top-0 start-0">
                <BackButton back="/cultura-admin/dashboard" />
            </div>
            <h3 className="text-center mb-5">Estadísticas de Usuarios</h3>

            {amountStats && (
                <Row className="mb-4 text-center">
                    {[
                        { title: "Total de Cuentas", count: amountStats.accountsTotal, role: "All", border: "primary" },
                        { title: "Administradores", count: amountStats.accountsAdmins, role: "Admin", border: "warning" },
                        { title: "Publicadores", count: amountStats.accountsPublishers, role: "Publisher", border: "info" },
                        { title: "Clientes", count: amountStats.accountsClients, role: "Client", border: "info" },
                    ].map(({ title, count, role, border }) => (
                        <Col md={3} key={role}>
                            <Card className={`border-${border} shadow-sm`} onClick={() => handleCardClick(role)} style={{ cursor: "pointer" }}>
                                <CardBody>
                                    <CardTitle tag="h6">{title}</CardTitle>
                                    <CardText className="fs-4 fw-bold">{count}</CardText>
                                </CardBody>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}

            {renderUserTable()}
        </div>
    );
};

export default UserList;