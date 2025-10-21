import React, { useEffect, useState, useMemo } from "react";
import { Table, Button  } from "reactstrap";
import { createRoot } from "react-dom/client";
import Swal from "sweetalert2";
import {
    getUsersList,
    modifyUser,
    deleteUser,
    markPWDCUser,
    addDepartment,
    deleteDepartment
} from "../../services/UserService";
import { getDepartmentList } from "../../services/DepartmentService";

import CaptchaSlider from "../utils/CaptchaSliderComponent";
import ResponsiveTextComponent from "../utils/ResponsiveTextComponent";
import PaginationComponent from "../PaginationComponent";

import AddModifyUserComponent from "./AddModifyUserComponent";
import PWDAskComponent from "./PWDAskComponent";
import UserTypeTooltipComponent from "./UserTypeTooltipComponent";

import BadgeComponent from "../badge/BadgeComponent";
import AddBadgeComponent from "../badge/AddBadgeComponent";
import RemovableBadgeComponent from "../badge/RemovableBadgeComponent";
import ShowMoreBadgeComponent from "../badge/ShowMoreBadgeComponent";

/**
 * Componente encargado de mostrar la tabla de usuarios del sistema.
 *
 * @component
 * @param {Object} props - Propiedades del componente.
 * @param {string} props.token - Token JWT del usuario autenticado.
 * @param {Object} props.currentUser - Información del usuario actualmente conectado.
 * @param {string} props.search - Texto utilizado para filtrar usuarios por nombre o tipo.
 * @param {number} props.currentPage - Número de la página actualmente visible.
 * @param {function} props.setCurrentPage - Función para actualizar la página actual.
 * @param {number} props.rowsPerPage - Número de filas que se muestran por página.
 * @param {function} props.onStatsUpdate - Callback para actualizar las estadísticas generales de usuarios.
 * @param {string} [props.filterType="All"] - Tipo de usuario por el cual se filtran los resultados (ej. "USER", "ADMIN", "SUPERADMIN").
 * @returns {JSX.Element} Tabla interactiva con los usuarios del sistema.
 */
const TableUserComponent = ({
    token,
    currentUser,
    search,
    currentPage,
    setCurrentPage,
    rowsPerPage,
    onStatsUpdate,
    filterType = "All"
}) => {
    const [users, setUsers] = useState([]);

    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);

    /** Detectar pantallas pequeñas */
    const useIsSmallScreen = (breakpoint = 770) => {
        const [isSmall, setIsSmall] = useState(window.innerWidth < breakpoint);
        useEffect(() => {
            const handleResize = () => setIsSmall(window.innerWidth < breakpoint);
            window.addEventListener("resize", handleResize);
            return () => window.removeEventListener("resize", handleResize);
        }, [breakpoint]);
        return isSmall;
    };

    const isSmallScreen = useIsSmallScreen();

    /** Cargar usuarios y departamentos **/
    useEffect(() => {
        const fetchAll = async () => {
            if (!token) return;
            setLoading(true);
            try {
                const [userRes, depRes] = await Promise.all([
                    getUsersList(token),
                    getDepartmentList(token)
                ]);
                if (userRes.success) {
                    setUsers(userRes.data.users ?? []);

                    if (onStatsUpdate) {
                        const stats = {
                            total: userRes.data.users.length,
                            admin: userRes.data.users.filter(u => ["ADMIN", "SUPERADMIN"].includes(u.user.usertype)).length,
                            user: userRes.data.users.filter(u => u.user.usertype === "USER").length,
                        };
                        onStatsUpdate(stats);
                    }
                }
                if (depRes.success) setDepartments(depRes.data.departments ?? []);
            } catch {
                Swal.fire("Error", "No se pudieron cargar los datos", "error");
            } finally {
                setLoading(false);
            }
        };

        fetchAll();
        const handler = () => fetchAll();
        window.addEventListener("refresh-users", handler);
        return () => window.removeEventListener("refresh-users", handler);
    }, [token, onStatsUpdate]);


    /** Filtrado por búsqueda y tipo **/
    const filteredUsers = useMemo(() => {
        return users
            .filter(u => u.user.username.toLowerCase().includes(search.toLowerCase()))
            .filter(u => {
                if (filterType === "All") return true;
                if (filterType === "Admin") return ["ADMIN", "SUPERADMIN"].includes(u.user.usertype);
                if (filterType === "User") return u.user.usertype === "USER";
                return true;
            });
    }, [users, search, filterType]);

    const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);
    const currentUsers = useMemo(
        () => filteredUsers.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage),
        [filteredUsers, currentPage, rowsPerPage]
    );

    /** Captcha antes de eliminar **/
    const showCaptcha = () => new Promise(resolve => {
        const container = document.createElement("div");
        const reactRoot = createRoot(container);
        let completed = false;

        reactRoot.render(
            <CaptchaSlider onSuccess={() => {
                completed = true;
                Swal.close();
                resolve(true);
                setTimeout(() => reactRoot.unmount(), 0);
            }} />
        );

        Swal.fire({
            title: `Eliminar el Usuario`,
            html: container,
            showConfirmButton: true,
            confirmButtonText: "Continuar",
            showCancelButton: true,
            cancelButtonText: "Cancelar",
            allowOutsideClick: false,
            preConfirm: () => {
                if (!completed) Swal.showValidationMessage("Debes completar el captcha");
            }
        });
    });

    /** Modificar usuario */
    const handleModify = async userItem => {
        await AddModifyUserComponent({
            token,
            userItem,
            currentUser,
            action: "modify",
            onConfirm: async formValues => {
                const result = await modifyUser(userItem.id, formValues, token);
                if (result.success) {
                    Swal.fire("Éxito", "Usuario modificado correctamente", "success");
                    window.dispatchEvent(new Event("refresh-users"));
                } else {
                    Swal.fire("Error", result.error || "No se pudo modificar el usuario", "error");
                }
            }
        });
    };

    /** Eliminar usuario */
    const handleDelete = async userItem => {
        await showCaptcha();
        const result = await deleteUser(userItem.id, token, userItem.version);
        if (result.success) {
            Swal.fire("Éxito", "Usuario eliminado correctamente", "success");
            window.dispatchEvent(new Event("refresh-users"));
        } else {
            Swal.fire("Error", result.error || "No se pudo eliminar el usuario", "error");
        }
    };

    /** Cambio de contraseña */
    const handlePWDC = async userItem => {
        try {
            const password = await PWDAskComponent({ userItem });
            if (!password) return;
            const result = await markPWDCUser(userItem.id, { password }, token, userItem.version);
            if (result.success) {
                Swal.fire("¡Éxito!", "Contraseña reiniciada correctamente", "success");
                window.dispatchEvent(new Event("refresh-users"));
            } else {
                Swal.fire("Error", result.error || "No se pudo reiniciar la contraseña", "error");
            }
        } catch (err) {
            Swal.fire("Error", err.message || "No se pudo marcar contraseña temporal", "error");
        }
    };
   

    if (loading) return <div><p colSpan={5}>Cargando...</p></div>;

    return (
        <>
            <Table striped responsive>
                <thead>
                    <tr>
                        <th style={{ width: "5%" }}>ID</th>
                        <th style={{ width: "15%" }}>Usuario</th>
                        <th style={{ width: "15%" }}>Tipo</th>
                        <th className="text-center" style={{ width: isSmallScreen ? "25%" : "60%" }}>Departamentos</th>
                        <th className="text-center" style={{ width: isSmallScreen ? "25%" : "10%" }}>
                            <ResponsiveTextComponent fullText="Acciones" shortText="Accs" breakpoint={525} />
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {currentUsers.map((userItem, idx) => {
                        const { user, departments: userDeps } = userItem;
                        const isCurrentUser = user.id === currentUser.id;
                        const isSuperAdminUser = user.usertype === "SUPERADMIN";
                        const canModify =
                            user.usertype !== "SUPERADMIN" ||
                            (user.usertype === "SUPERADMIN" && currentUser.usertype === "SUPERADMIN");

                        const userAviableDeps = departments.filter(d => !userDeps.some(ud => ud.id === d.id));

                        return (
                            <tr key={idx}>
                                <td style={isCurrentUser ? { color: "blue", fontWeight: "bold" } : {}}>{user.id}</td>
                                <td
                                    style={{
                                        maxWidth: isSmallScreen ? "165px" : "auto",
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        color: isCurrentUser ? "blue" : "inherit",
                                        fontWeight: isCurrentUser ? "bold" : "normal"
                                    }}
                                >
                                    {user.username}
                                </td>
                                <td>
                                    <UserTypeTooltipComponent user={user} isSmallScreen={isSmallScreen} isCurrentUser={isCurrentUser} />
                                </td>
                                <td>
                                    <div className="d-flex flex-wrap m" style={{ gap: "0.1rem" }}>
                                        {isSmallScreen ? (
                                            userDeps?.length > 0 ? (
                                                <ShowMoreBadgeComponent
                                                    currentUser={currentUser}
                                                    user={user}
                                                    canModify={canModify}
                                                    objType="departamento"
                                                    userObjects={userDeps}
                                                    availableObjs={userAviableDeps}
                                                    onAdded={async dep => {
                                                        await addDepartment(user.id, dep.id, token, user.version);
                                                        window.dispatchEvent(new Event("refresh-users"));
                                                    }}
                                                    onDeleted={async dep => {
                                                        await deleteDepartment(user.id, dep.id, token, user.version);
                                                        window.dispatchEvent(new Event("refresh-users"));
                                                    }}
                                                />
                                            ) : canModify && !isCurrentUser ? (
                                                <AddBadgeComponent
                                                    availableObjs={userAviableDeps}
                                                    objType="departamento"
                                                    onAdded={async dep => {
                                                        await addDepartment(user.id, dep.id, token, user.version);
                                                        window.dispatchEvent(new Event("refresh-users"));
                                                    }}
                                                />
                                            ) : null
                                        ) : (
                                            <>
                                                {userDeps?.slice(0, 3).map(dep =>
                                                    canModify && !isCurrentUser ? (
                                                        <RemovableBadgeComponent
                                                            key={dep.id}
                                                            objName={dep.name}
                                                            objType="departamento"
                                                            onDelete={async () => {
                                                                await deleteDepartment(user.id, dep.id, token, user.version);
                                                                window.dispatchEvent(new Event("refresh-users"));
                                                            }}
                                                        />
                                                    ) : (
                                                        <BadgeComponent key={dep.id} objName={dep.name} />
                                                    )
                                                )}

                                                {userDeps?.length > 3 && (
                                                    <ShowMoreBadgeComponent
                                                        currentUser={currentUser}
                                                        user={user}
                                                        canModify={canModify}
                                                        objType="departamento"
                                                        userObjects={userDeps}
                                                        availableObjs={userAviableDeps}
                                                        onAdded={async dep => {
                                                            await addDepartment(user.id, dep.id, token, user.version);
                                                            window.dispatchEvent(new Event("refresh-users"));
                                                        }}
                                                        onDeleted={async dep => {
                                                            await deleteDepartment(user.id, dep.id, token, user.version);
                                                            window.dispatchEvent(new Event("refresh-users"));
                                                        }}
                                                    />
                                                )}

                                                {userDeps?.length <= 3 && canModify && !isCurrentUser && (
                                                    <AddBadgeComponent
                                                        availableObjs={userAviableDeps}
                                                        objType="departamento"
                                                        onAdded={async dep => {
                                                            await addDepartment(user.id, dep.id, token, user.version);
                                                            window.dispatchEvent(new Event("refresh-users"));
                                                        }}
                                                    />
                                                )}
                                            </>
                                        )}
                                    </div>
                                </td>
                                <td className="text-center">
                                    <div className="d-flex justify-content-center flex-wrap m" style={{ gap: "0.25rem" }}>
                                        {!isCurrentUser && (
                                            <>
                                                {canModify && !isSuperAdminUser && (
                                                    <Button color="info" size="sm" onClick={() => handlePWDC(user)}>🔑</Button>
                                                )}
                                                {canModify && !isSuperAdminUser && (
                                                    <Button color="warning" size="sm" onClick={() => handleModify(user)}>✏️</Button>
                                                )}
                                                {!isSuperAdminUser && (
                                                    <Button color="danger" size="sm" onClick={() => handleDelete(user)}>🗑️</Button>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        );
                    })}

                    {/* Filas vacías */}
                    {rowsPerPage - currentUsers.length > 0 &&
                        [...Array(rowsPerPage - currentUsers.length)].map((_, idx) => (
                            <tr key={`empty-${idx}`} style={{ height: "50px" }}>
                                <td colSpan={5}></td>
                            </tr>
                        ))
                    }
                </tbody>
            </Table>

            {totalPages > 1 && (
                <div className="mt-auto" style={{ minHeight: "40px" }}>
                    <PaginationComponent
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </div>
            )}
        </>
    );
};

export default TableUserComponent;
