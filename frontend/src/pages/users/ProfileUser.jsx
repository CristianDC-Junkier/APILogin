/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Container, Row, Col, Card, CardBody, Button } from "reactstrap";
import { FaUser, FaEdit, FaTrash, FaCalendarAlt } from 'react-icons/fa';

import { useAuth } from "../../hooks/useAuth";
import { useTheme } from '../../hooks/UseTheme';
import { getProfile, modifyProfile, deleteProfile, addDepartmentProfile, deleteDepartmentProfile } from "../../services/UserService";
import { getDepartmentList } from "../../services/DepartmentService";

import SpinnerComponent from '../../components/utils/SpinnerComponent';
import BackButtonComponent from "../../components/utils/BackButtonComponent";
import BadgeComponent from "../../components/badge/BadgeComponent";
import AddBadgeComponent from "../../components/badge/AddBadgeComponent";
import RemovableBadgeComponent from "../../components/badge/RemovableBadgeComponent";
import ModifyUserAccountComponent from '../../components/user/ModifyUserAccountComponent';

/**
 * Página del perfil de usuario
 */
const ProfileUser = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [availableDepartments, setAvailableDepartments] = useState([]);
    const navigate = useNavigate();
    const { darkMode } = useTheme();

    useEffect(() => {
        document.title = "Mi Perfil - IDEE Almonte";
    }, []);

    // Desde el AuthContext
    const { version, logout, update } = useAuth();

    /**
     * Cargar perfil del usuario
     */
    const fetchData = async () => {
        setLoading(true);
        try {
            let profileResp = await getProfile(version);

            if (profileResp.success && profileResp.data) {
                const sortedDepartments = [...profileResp.data.departments].sort((a, b) =>
                    a.name.localeCompare(b.name)
                );
                const fullProfile = { ...profileResp.data, departments: sortedDepartments };
                setProfile(fullProfile);

                if (fullProfile.user.usertype !== "USER") {
                    const deptResp = await getDepartmentList();
                    if (deptResp.success) {
                        const availableDepartmentsAux = deptResp.data.departments
                            .filter(d => !fullProfile.departments.some(pd => pd.id === d.id) && d.id !== 1)
                            .sort((a, b) => a.name.localeCompare(b.name));
                        setAvailableDepartments(availableDepartmentsAux);
                    }
                }
            }
        } finally {
            setLoading(false);
        }
    };

    /**
     * Recargar perfil cuando cambia la versión del usuario globalmente
     */
    useEffect(() => {
        if (version === null || version === undefined) return;
        fetchData(version);
    }, [version]);

    if (loading || !profile?.user) return <SpinnerComponent />;

    /**
     * Modificar Perfil
     */
    const handleModify = async () => {
        try {
            await ModifyUserAccountComponent({
                profile: profile.user,
                darkMode: darkMode,
                action: "modify",
                onConfirm: async (formValues) => {
                    const result = await modifyProfile(formValues, version);
                    if (result.success) {
                        Swal.fire({ title: "Éxito", text: "Datos modificados correctamente", icon: "success", theme: darkMode ? "dark" : "" });
                        update(result.data.user);
                    } else {
                        Swal.fire({ title: "Error", text: result.error || "No se pudo modificar el perfil, reintentelo de nuevo", icon: "error", theme: darkMode ? "dark" : "" });
                    }
                }
            });
        } catch (err) {
            Swal.fire({ title: "Error", text: err.message || "Error al modificar perfil", icon: "error", theme: darkMode ? "dark" : "" });
        }
    };

    /**
     * Eliminar el Perfil
     */
    const handleDelete = async () => {
        const swal = await Swal.fire({
            title: "Eliminar su Cuenta",
            html: "¿Está seguro de que quiere eliminar su usuario?<br>Esta acción no se podrá deshacer",
            icon: 'warning',
            iconColor: '#FF3131',
            showCancelButton: true,
            confirmButtonText: "Aceptar",
            cancelButtonText: "Cancelar",
            theme: darkMode ? "dark" : ""
        });

        if (swal.isConfirmed) {
            const response = await deleteProfile(version);
            if (response.success) {
                Swal.fire({ title: "Éxito", text: "Cuenta eliminada correctamente. Cerrando sesión", icon: "success", theme: darkMode ? "dark" : "" });
                logout();
                navigate('/');
            } else {
                Swal.fire({ title: "Error", text: response.error || "No se eliminó el usuario", icon: "error", theme: darkMode ? "dark" : "" });
            }
        }
    };

    /**
     * Formatear fecha
     */
    const formatDate = (dateString) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        return date.toLocaleDateString() + " " + date.toLocaleTimeString();
    };

    return (
        <Container fluid className="mt-4 d-flex flex-column" style={{ minHeight: "80vh" }}>
            {/* Botón Volver */}
            <div className="position-absolute top-0 start-0">
                <BackButtonComponent back="/home" />
            </div>

            {/* Contenedor para centrar verticalmente */}
            <div className="d-flex flex-grow-1 align-items-center">
                <Row className="mb-3 mt-4 justify-content-center g-2 w-100">
                    {/* BLOQUE 1: Información de la cuenta */}
                    <Col xs="12" md="8" lg="6" xl="6" xxl="5" className="d-flex justify-content-center">
                        <Card
                            className={`h-100 shadow-lg rounded-4 ${darkMode ? "bg-dark" : "bg-light"} border-0 mx-auto w-100`}
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
                                        <Col md="5" style={{ color: darkMode ? "#fff" : "#000" }}><strong>Usuario:</strong></Col>
                                        <Col md="7">
                                            <span style={{ marginLeft: "3px", fontWeight: "700", color: darkMode ? "#fff" : "#000" }}>{profile.user.username || "-"}</span>
                                        </Col>
                                    </Row>

                                    <Row className="mb-2">
                                        <Col md="5" style={{ color: darkMode ? "#fff" : "#000" }}><strong>Departamentos:</strong></Col>
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
                                                                darkMode={darkMode}
                                                                onDelete={async () => {
                                                                    const result = await deleteDepartmentProfile(dep.id, version);

                                                                    if (result.success) {
                                                                        update(result.data.user);
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
                                                        darkMode={darkMode}
                                                        onAdded={async (dep) => {
                                                            const result = await addDepartmentProfile(dep.id, version);

                                                            if (result.success) {
                                                                update(result.data.user);
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
                                        <Col md="5" className="d-flex align-items-center" style={{ color: darkMode ? "#fff" : "#000" }}>
                                            <FaCalendarAlt className="me-2" /> Fecha de creación:
                                        </Col>
                                        <Col md="7">
                                            <span style={{ fontWeight: "600", color: "#0d6efd" }}>{formatDate(profile.user.createdAt)}</span>
                                        </Col>
                                    </Row>

                                    <Row className="mb-2">
                                        <Col md="5" className="d-flex align-items-center" style={{ color: darkMode ? "#fff" : "#000" }}>
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
                                    {profile.user.usertype !== "USER" && <Button color="danger" className="rounded-pill px-3 d-flex align-items-center" disabled={profile.user.id === 1} onClick={handleDelete}>
                                        <FaTrash className="me-1 mb-1" /> Eliminar
                                    </Button>
                                    }
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
