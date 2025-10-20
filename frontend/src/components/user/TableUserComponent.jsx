import React, { useMemo, useState, useEffect } from "react";
import { Table, Button } from "reactstrap";
import { createRoot } from "react-dom/client";
import Swal from "sweetalert2";
import { modifyUser, deleteUser, markPWDCUser, addDepartment, deleteDepartment } from "../../services/UserService";

import CaptchaSlider from '../utils/CaptchaSliderComponent';
import ResponsiveTextComponent from "../utils/ResponsiveTextComponent";

import PaginationComponent from "../PaginationComponent";
import AddModifyUserCommponent from "./AddModifyUserComponent";
import PWDAskComponent from "./PWDAskComponent";

import BadgeComponent from "../badge/BadgeComponent";
import AddBadgeComponent from "../badge/AddBadgeComponent";
import RemovableBadgeComponent from "../badge/RemovableBadgeComponent";
import ShowMoreBadgeComponent from "../badge/ShowMoreBadgeComponent";

/**
 * Componente encargado de mostrar la tabla de usuarios
 * @param {Array} users - Lista con todos los usuarios
 * @param {Array} departments - Lista con todo los departamentos
 * @param {Int} rowsPerPage - Número de filas de la tabla por página
 * @param {Int} currentPage - Número de la página actual
 * @param {Function} setCurrentPage - Función que actualiza la página actual
 * @param {Object} currentUser - Información del usuario conectado
 * @param {Function} refreshData - Función encargada de actualizar la información de la tabla
 * @param {String} token - Token asociado al usuario conectado
 * @returns
 */

const TableUserComponent = ({
    users,
    departments,
    search,
    rowsPerPage,
    currentPage,
    setCurrentPage,
    currentUser,
    refreshData,
    token
}) => {

    // Hook para detectar pantalla pequeña
    const useIsSmallScreen = (breakpoint = 500) => {
        const [isSmall, setIsSmall] = useState(window.innerWidth < breakpoint);

        useEffect(() => {
            const handleResize = () => setIsSmall(window.innerWidth < breakpoint);
            window.addEventListener("resize", handleResize);
            return () => window.removeEventListener("resize", handleResize);
        }, [breakpoint]);

        return isSmall;
    };

    //Filtro de Usuarios
    const filteredUsers = useMemo(() => {
        return users.filter(u => {
            const matchesName = u.user.username.toLowerCase().includes(search.toLowerCase());
            return matchesName;
        });
    }, [users, search]);

    const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);
    const currentUsers = filteredUsers.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

    //Función encargada de enseñar un captcha
    const showCaptcha = () => new Promise((resolve, reject) => {
        const container = document.createElement('div');
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
            confirmButtonText: 'Continuar',
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            allowOutsideClick: false,
            preConfirm: () => {
                if (!completed) Swal.showValidationMessage('Debes completar el captcha');
            }
        })
    });

    //Función para modificar un usuario
    const handleModify = async (userItem) => {
        await AddModifyUserCommponent({
            token,
            userItem,
            currentUser,
            action: "modify",
            onConfirm: async (formValues) => {
                const result = await modifyUser(userItem.id, formValues, token);
                if (result.success) {
                    Swal.fire("Éxito", "Usuario modificado correctamente", "success");
                    await refreshData();
                } else {
                    Swal.fire("Error", result.error || "No se pudo modificar el usuario", "error");
                }
            }
        });
    };

    // Función para eliminar un usuario
    const handleDelete = async (userItem) => {
        await showCaptcha();
        const result = await deleteUser(userItem.id, token, userItem.version);

        if (result.success) {
            Swal.fire('Éxito', 'Usuario eliminado correctamente', 'success');

            const remainingUsers = filteredUsers.length - 1;
            const totalPagesAfterDelete = Math.ceil(remainingUsers / rowsPerPage);

            if (currentPage > totalPagesAfterDelete && totalPagesAfterDelete > 0) {
                setCurrentPage(totalPagesAfterDelete);
            }

            await refreshData();

        } else {
            Swal.fire('Error', result.error || 'No se pudo eliminar el usuario', 'error');
        }
    };

    // Función encargada de marcar un usuario para cambio de contraseña
    const handlePWDC = async (userItem) => {
        try {
            const password = await PWDAskComponent({ userItem });
            if (!password) return;

            const result = await markPWDCUser(userItem.id, { password }, token, userItem.version);
            if (result.success) {
                await Swal.fire({
                    icon: 'success',
                    title: '¡Éxito!',
                    text: 'Contraseña reiniciada correctamente',
                    confirmButtonColor: '#3085d6',
                });
                await refreshData();
            } else {
                await Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: result.error || 'No se pudo reiniciar la contraseña al usuario',
                    confirmButtonColor: '#d33',
                });
            }
        } catch (err) {
            Swal.fire("Error", err.message || "No se pudo marcar contraseña temporal", "error");
        }
    };

    const tipoLabels = {
        USER: "Usuario",
        ADMIN: "Administrador",
        SUPERADMIN: "Super Administrador"
    };

    const isSmallScreen = useIsSmallScreen(770);

    return (
        <>
            <Table striped responsive >
                <thead>
                    <tr>
                        <th style={{whiteSpace: "nowrap" }}>ID</th>
                        <th>Usuario</th>
                        <th>Tipo</th>
                        <th
                            className="text-center"
                            style={{ width: isSmallScreen ? "15%" : "55%" }}
                        >Departamentos</th>
                        <th
                            className="text-center"
                            style={{ width: isSmallScreen ? "55%" : "15%" }}
                        >
                            <ResponsiveTextComponent fullText="Acciones" shortText="Accs" breakpoint={525} />
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {currentUsers.map((userItem, idx) => {
                        const isSuperAdminUser = userItem.user.usertype === "SUPERADMIN";
                        const canModify = ((userItem.user.usertype !== "SUPERADMIN") ||
                            (userItem.user.usertype === "SUPERADMIN" && currentUser.usertype === "SUPERADMIN"));
                        const isCurrentUser = userItem.user.id === currentUser.id;

                        return (
                            <tr key={idx}>
                                <td style={isCurrentUser ? { color: "blue", fontWeight: "bold" } : {}}>
                                    {userItem?.user.id || "\u00A0"}
                                </td>
                                <td style={isCurrentUser ? { color: "blue", fontWeight: "bold" } : {}}>
                                    {userItem?.user.username || "\u00A0"}
                                </td>
                                <td style={isCurrentUser ? { color: "blue", fontWeight: "bold" } : {}}>
                                    {tipoLabels[userItem?.user.usertype] || "\u00A0"}
                                </td>
                                <td>
                                    <div className="d-flex flex-wrap m" style={{ gap: "0.1rem" }}>
                                        {isSmallScreen ? (
                                            // Pantalla pequeña: solo mostrar botón "Mostrar más" o "+ Añadir"
                                            userItem.departments && userItem.departments.length > 0 ? (
                                                <ShowMoreBadgeComponent
                                                    currentUser={currentUser}
                                                    user={userItem.user}
                                                    canModify={canModify}
                                                    objList={departments}
                                                    objType="departamento"
                                                    userObjects={userItem.departments}
                                                    onAdded={async (dep) => {
                                                        await addDepartment(userItem.user.id, dep.id, token, userItem.user.version);
                                                        await refreshData();
                                                    }}
                                                    onDeleted={async (dep) => {
                                                        await deleteDepartment(userItem.user.id, dep.id, token, userItem.user.version);
                                                        await refreshData();
                                                    }}
                                                />
                                            ) : canModify ? (
                                                <AddBadgeComponent
                                                    availableObjs={departments}
                                                    objType="departamento"
                                                    onAdded={async (dep) => {
                                                        await addDepartment(userItem.user.id, dep.id, token, userItem.user.version);
                                                        await refreshData();
                                                    }}
                                                />
                                            ) : null
                                        ) : (
                                            // Pantalla normal: mostrar badges + "Mostrar más" o "+ Añadir"
                                            <>
                                                {userItem.departments && userItem.departments.length > 0 && userItem.departments.slice(0, 3).map(dep =>
                                                    canModify && !isCurrentUser ? (
                                                        <RemovableBadgeComponent
                                                            key={dep.id}
                                                            objName={dep.name}
                                                            objType="departamento"
                                                            onDelete={async () => {
                                                                await deleteDepartment(userItem.user.id, dep.id, token, userItem.user.version);
                                                                await refreshData();
                                                            }}
                                                        />
                                                    ) : (
                                                        <BadgeComponent key={dep.id} objName={dep.name} />
                                                    )
                                                )}

                                                {userItem.departments.length > 3 ? (
                                                    <ShowMoreBadgeComponent
                                                        currentUser={currentUser}
                                                        user={userItem.user}
                                                        canModify={canModify}
                                                        objList={departments}
                                                        objType="departamento"
                                                        userObjects={userItem.departments}
                                                        onAdded={async (dep) => {
                                                            await addDepartment(userItem.user.id, dep.id, token, userItem.user.version);
                                                            await refreshData();
                                                        }}
                                                        onDeleted={async (dep) => {
                                                            await deleteDepartment(userItem.user.id, dep.id, token, userItem.user.version);
                                                            await refreshData();
                                                        }}
                                                    />
                                                ) : (
                                                    <AddBadgeComponent
                                                        availableObjs={departments.filter(d => !userItem.departments.some(ud => ud.id === d.id))}
                                                        objType="departamento"
                                                        onAdded={async (dep) => {
                                                            await addDepartment(userItem.user.id, dep.id, token, userItem.user.version);
                                                            await refreshData();
                                                        }}
                                                    />
                                                )}
                                            </>
                                        )}
                                    </div>
                                </td>

                                <td className="text-center">
                                    <div className="d-flex justify-content-center flex-wrap m " style={{ gap: "0.25rem" }}>
                                        {!isCurrentUser && (
                                            <>
                                                {/* Botón Marcar para cambio de contraseña */}
                                                {(canModify && !isSuperAdminUser) && (
                                                    <Button
                                                        color="info"
                                                        size="sm"
                                                        style={{ padding: "0.2rem 0.4rem", fontSize: "0.8rem" }}
                                                        onClick={() => handlePWDC(userItem.user)}
                                                    >
                                                        🔑
                                                    </Button>
                                                )}
                                                {/* Botón Modificar Usuario */}
                                                {(canModify && !isSuperAdminUser) && (
                                                    <Button
                                                        color="warning"
                                                        size="sm"
                                                        style={{ padding: "0.2rem 0.4rem", fontSize: "0.8rem" }}
                                                        onClick={() => handleModify(userItem.user)}
                                                    >
                                                        ✏️
                                                    </Button>
                                                )}
                                                {/* Botón Eliminar Usuario */}
                                                {!isSuperAdminUser && (
                                                    <Button
                                                        color="danger"
                                                        size="sm"
                                                        style={{ padding: "0.2rem 0.4rem", fontSize: "0.8rem" }}
                                                        onClick={() => handleDelete(userItem.user)}
                                                    >
                                                        🗑️
                                                    </Button>
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
                            <tr key={`empty-${idx}`} style={{ height: '50px' }}>
                                <td colSpan={5}></td>
                            </tr>
                        ))
                    }
                </tbody>
            </Table>
            {/* Botones para navegar entre páginas */}
            {totalPages > 1 && (
                <div className="mt-auto" style={{ minHeight: '40px' }}>
                    <PaginationComponent currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                </div>
            )}
        </>
    );
};

export default TableUserComponent;
