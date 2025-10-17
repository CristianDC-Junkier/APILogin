/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Container, Row, Col, Card, CardBody, Button } from "reactstrap";
import { FaUser, FaEdit, FaTrash, FaCalendarAlt } from 'react-icons/fa';
import Spinner from '../../components/utils/SpinnerComponent';
import { useAuth } from "../../hooks/useAuth";

import { getProfile, modifyProfile, deleteProfile, addDepartmentProfile, deleteDepartmentProfile } from "../../services/UserService";
import { getDepartmentList } from "../../services/DepartmentService";

import BackButton from "../../components/utils/BackButtonComponent";
import BadgeComponent from "../../components/badge/BadgeComponent";
import AddBadgeComponent from "../../components/badge/AddBadgeComponent";
import RemovableBadgeComponent from "../../components/badge/RemovableBadgeComponent";
import ModifyUserAccountComponent from '../../components/user/ModifyUserAccountComponent';

const ProfileUser = () => {
    const [profile, setProfile] = useState();
    const [loading, setLoading] = useState(true);
    const [availableDepartments, setAvailableDepartments] = useState([]);
    const navigate = useNavigate();
    const { token, version, logout, update } = useAuth();

    const fetchData = async (updatedVersion) => {

        if (!token) return;
        setLoading(true);

        try {
            const profileResp = await getProfile(token, updatedVersion || version);
            if (profileResp.success) {
                profileResp.data.departments = [...profileResp.data.departments].sort((a, b) =>
                    a.name.localeCompare(b.name)
                );
                setProfile(profileResp.data);
            }

            // Traer todos los departamentos disponibles
            const deptResp = await getDepartmentList(token);
            if (deptResp.success) {
                const availableDepartmentsAux = deptResp.data.departments
                    .filter(d => !profileResp.data.departments.some(pd => pd.id === d.id))
                    .sort((a, b) => a.name.localeCompare(b.name));

                setAvailableDepartments(availableDepartmentsAux);
            }


        } catch (err) {
            Swal.fire('Error', err.message || 'Error al obtener perfil', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Recuperar usuario
    useEffect(() => {
        fetchData();
    }, [logout, navigate, token, version]);

    if (loading) return <Spinner />;

    // Modify profile
    const handleModify = async () => {
        try {
            await ModifyUserAccountComponent({
                token,
                profile: profile.user,
                action: "modify",
                onConfirm: async (formValues) => {
                    const result = await modifyProfile(formValues, token, version);
                    if (result.success) {
                        Swal.fire("Éxito", "Datos de la cuenta modificados correctamente", "success");
                        update(result.data.user, result.data.token);
                    } else {
                        Swal.fire("Error", result.error || "No se pudo modificar el perfil", "error");
                    }
                }
            });
        } catch (err) {
            Swal.fire("Error", err.message || "Error al modificar perfil", "error");
        }
    };

    // Eliminar el Usuario 
    const handleDelete = async () => {
        try {
            const swal = await Swal.fire({
                title: "Eliminar su Cuenta",
                html: "¿Está seguro de que quiere eliminar su usuario?<br>Esta acción no se podrá deshacer",
                icon: 'warning',
                iconColor: '#FF3131',
                showCancelButton: true,
                confirmButtonText: "Aceptar",
                cancelButtonText: "Cancelar"
            });

            if (swal.isConfirmed) {
                const response = await deleteProfile(token, version);
                if (response.success) {
                    Swal.fire("Éxito", "Cuenta eliminada correctamente. Cerrando sesión", "success");
                    logout();
                    navigate('/');
                } else {
                    Swal.fire("Error", response.error || "No se eliminó el usuario", "error");
                }
            }
        } catch (err) {
            Swal.fire("Error", err.message || "Error al eliminar usuario", "error");
        }
    };

    // Función para formatear fecha
    const formatDate = (dateString) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        return date.toLocaleDateString() + " " + date.toLocaleTimeString();
    };



    return (
        <Container fluid className="mt-4 d-flex flex-column" style={{ minHeight: "80vh" }}>
            {/* Botón Volver */}
            <div className="position-absolute top-0 start-0">
                <BackButton back="/home" />
            </div>

            {/* Contenedor para centrar verticalmente */}
            <div className="d-flex flex-grow-1 align-items-center">
                <Row className="mb-3 mt-4 justify-content-center g-2 w-100">
                    {/* BLOQUE 1: Información de la cuenta */}
                    <Col xs="12" md="8" lg="6" xl="6" xxl="5" className="d-flex justify-content-center">
                        <Card
                            className="h-100 shadow-lg rounded-4 bg-light border-0 mx-auto w-100"
                        >
                            <CardBody className="d-flex flex-column justify-content-between p-4"
                                style={{
                                    border: "2px solid #5aa0fd",
                                    borderRadius: "1rem"
                                }}
                            >
                                <div>
                                    <h4 className="mb-4 text-primary d-flex align-items-center">
                                        <FaUser className="me-2" size={28} /> Cuenta
                                    </h4>

                                    <Row className="mb-2">
                                        <Col md="5"><strong>Usuario:</strong></Col>
                                        <Col md="7">
                                            <span style={{ marginLeft: "3px", fontWeight: "700", color: "#000" }}>{profile.user.username || "-"}</span>
                                        </Col>
                                    </Row>

                                    <Row className="mb-2">
                                        <Col md="5"><strong>Departamentos:</strong></Col>
                                        <Col md="7" className="d-flex flex-wrap gap-1 mt-1 mb-1">
                                            {profile.user.usertype === "USER" ? (
                                                // Solo badges normales
                                                profile.departments && profile.departments.length > 0
                                                    ? profile.departments.map(dep => (
                                                        <BadgeComponent key={dep.id} objName={dep.name} />
                                                    ))
                                                    : null
                                            ) : (
                                                <>
                                                    {profile.departments && profile.departments.length > 0
                                                        ? profile.departments.map(dep => (
                                                            <RemovableBadgeComponent
                                                                key={dep.id}
                                                                objName={dep.name}
                                                                objType="departamento"
                                                                onDelete={async () => {
                                                                    const result = await deleteDepartmentProfile(dep.id, token, version);

                                                                    if (result.success) {
                                                                        update(result.data.user, token);
                                                                        fetchData(result.data.user.version);
                                                                    } else {
                                                                        Swal.fire("Error", result.error || "No se pudo eliminar", "error");
                                                                    }
                                                                }}
                                                            />

                                                        ))
                                                        : null
                                                    }
                                                    {/* Badge para añadir departamento */}
                                                    <AddBadgeComponent
                                                        availableObjs={availableDepartments}
                                                        objType="departamento"
                                                        onAdded={async (dep) => {
                                                            const result = await addDepartmentProfile(dep.id, token, version);

                                                            if (result.success) {
                                                                update(result.data.user, token);
                                                                fetchData(result.data.user.version);
                                                            } else {
                                                                Swal.fire("Error", result.error || "No se pudo eliminar", "error");
                                                            }
                                                        }}
                                                    />

                                                </>
                                            )}
                                        </Col>
                                    </Row>


                                    <Row className="mb-2">
                                        <Col md="5" className="d-flex align-items-center">
                                            <FaCalendarAlt className="me-2" /> Fecha de creación:
                                        </Col>
                                        <Col md="7">
                                            <span style={{ fontWeight: "600", color: "#0d6efd" }}>{formatDate(profile.user.createdAt)}</span>
                                        </Col>
                                    </Row>

                                    <Row className="mb-2">
                                        <Col md="5" className="d-flex align-items-center">
                                            <FaCalendarAlt className="me-2" /> Última modificación:
                                        </Col>
                                        <Col md="7">
                                            <span style={{ fontWeight: "600", color: "#0d6efd" }}>{formatDate(profile.user.updatedAt)}</span>
                                        </Col>
                                    </Row>
                                </div>

                                <div className="d-flex justify-content-between mt-4 flex-wrap">
                                    <Button color="primary" className="rounded-pill px-3 d-flex align-items-center" onClick={handleModify}>
                                        <FaEdit className="me-1 mb-1" /> Modificar
                                    </Button>
                                    <Button color="danger" className="rounded-pill px-3 d-flex align-items-center" disabled={profile.user.id === 1} onClick={handleDelete}>
                                        <FaTrash className="me-1 mb-1" /> Eliminar
                                    </Button>
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        </Container>
    );
};

export default ProfileUser;
