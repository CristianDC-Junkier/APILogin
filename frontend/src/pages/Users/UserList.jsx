import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import {
    Row, Col, Card, CardBody, CardTitle, CardText,
    Button, Table
} from "reactstrap";
import Swal from 'sweetalert2';
import { getUsersDashboard, deleteUser } from "../../services/DashboardService";
import { generateToken } from "../../services/SecurityService";
import { useAuth } from "../../hooks/useAuth";
import BackButton from "../../components/utils/BackButtonComponent";
import Spinner from '../../components/utils/Spinner';
import Pagination from "../../components/PaginationComponent";
import { renderCaptchaSlider } from "../../components/utils/RenderCaptchaFunction";

const UserList = () => {
    const navigate = useNavigate();
    const { getuser } = useAuth();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [allUsers, setAllUsers] = useState([]);
    const [selectedRole, setSelectedRole] = useState("All");
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;

    const token = currentUser?.token;

    // Filtrado y paginación
    // console.log(allUsers.map(u => u.rol?.name));

    const filteredUsers = selectedRole === "All"
        ? allUsers
        : allUsers.filter(user => user.usertype?.name === selectedRole);
    const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);
    const currentUsers = filteredUsers.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

    useEffect(() => {
        setUser(getuser());
        //console.log(user);
    }, [getuser]);

    useEffect(() => {
        const fetchData = async () => {
            const response = await getUsersDashboard(token);
            if (response.success) {
                const lists  = response.data ?? {};
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
                //await toggleLockUser(user.id, user.securityStamp, user.username, user.email, token);
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
                const lists = response.data ?? {};
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
                                <td>{user?.username || '\u00A0'}</td>
                                {selectedRole === "All" && <td>{user?.usertype?.name || " "}</td>}
                                <td className="text-center">
                                    {user?.id ? (
                                        isCurrentUser ? (
                                            <Button color="info" size="sm" onClick={() => navigate('/cultura-admin/profile')}>
                                                👤 Mi Perfil
                                            </Button>
                                        ) : (
                                            <div className="d-flex justify-content-center flex-wrap gap-1">
                                                <Button color="warning" size="sm" onClick={() => openActionModal("Modify", user)}>✏️</Button>
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
                <BackButton back="/home" />
            </div>
            <h3 className="text-center mb-5">Estadísticas de Usuarios</h3>
            
            {renderUserTable()}
        </div>
    );
};

export default UserList;