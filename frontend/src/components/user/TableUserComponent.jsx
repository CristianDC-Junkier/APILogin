import React, { useMemo } from "react";
import { Table, Button } from "reactstrap";
import { createRoot } from "react-dom/client";
import Swal from "sweetalert2";
import { modifyUser, deleteUser, markPWDCUser, addDepartment, deleteDepartment } from "../../services/UserService";

import CaptchaSlider from '../utils/CaptchaSliderComponent';
import PaginationComponent from "../PaginationComponent";
import AddModifyUserCommponent from "./AddModifyUserComponent";
import PWDAskComponent from "./PWDAskComponent";

import BadgeComponent from "../badge/BadgeComponent";
import AddBadgeComponent from "../badge/AddBadgeComponent";
import RemovableBadgeComponent from "../badge/RemovableBadgeComponent";
import ShowMoreBadgeComponent from "../badge/ShowMoreBadgeComponent";

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

    const filteredUsers = useMemo(() => {
        return users.filter(u => {
            const matchesName = u.user.username.toLowerCase().includes(search.toLowerCase());
            return matchesName;
        });
    }, [users, search]);

    const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);
    const currentUsers = filteredUsers.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

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

    return (
        <>
            <Table striped responsive style={{ tableLayout: "fixed" }}>
                <thead>
                    <tr>
                        <th style={{ width: "5%", whiteSpace: "nowrap" }}>ID</th>
                        <th style={{ width: "8%" }}>Usuario</th>
                        <th style={{ width: "15%" }}>Tipo</th>
                        <th style={{ width: "40%" }}>Departamentos</th>
                        <th style={{ width: "12%" }} className="text-center">Acciones</th>
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
                                <td style={isCurrentUser ? { color: "blue", fontWeight: "bold" } : {}}>

                                    {userItem.departments && userItem.departments.length > 0 ? (
                                        <>
                                            {/* Mostrar los primeros dos departamentos */}
                                            {userItem.departments.slice(0, 3).map(dep => (
                                                canModify && !isCurrentUser
                                                    ? <RemovableBadgeComponent
                                                        key={dep.id}
                                                        objName={dep.name}
                                                        objType="departamento"
                                                        onDelete={async () => {
                                                            await deleteDepartment(userItem.user.id, dep.id, token, userItem.user.version);
                                                            await refreshData();
                                                        }}
                                                    />
                                                    : <BadgeComponent
                                                        key={dep.id}
                                                        objName={dep.name}
                                                    />
                                            ))}

                                            {/* Si hay más de 2 departamentos, mostramos el botón "Mostrar más" */}
                                            {userItem.departments.length > 3 ? (
                                                <ShowMoreBadgeComponent
                                                    currentUser={currentUser}
                                                    user={userItem.user}
                                                    canModify={canModify}
                                                    departments={departments} 
                                                    userDepartments={userItem.departments}
                                                    onAdded={async (depId) => {
                                                        await addDepartment(userItem.user.id, depId, token, userItem.user.version);
                                                        await refreshData();
                                                    }}
                                                    onDeleted={async (dep) => {
                                                        await deleteDepartment(userItem.user.id, dep.id, token, userItem.user.version);
                                                        await refreshData();
                                                    }}
                                                />
                                            ) : <AddBadgeComponent
                                                    availableObjs={departments}
                                                    objType="departamento"
                                                    onAdded={async (depId) => {
                                                        await addDepartment(userItem.user.id, depId, token, userItem.user.version);
                                                        await refreshData();
                                                    }}
                                                />
                                        }
                                        </>
                                    ) : (
                                        // Usuario sin departamentos
                                            canModify ? (
                                            <AddBadgeComponent
                                                availableObjs={departments}
                                                objType="departamento"
                                                onAdded={async (depId) => {
                                                    await addDepartment(userItem.user.id, depId, token, userItem.user.version);
                                                    await refreshData();
                                                }}
                                            />
                                        ) : null
                                    )}

                                </td>

                                <td className="text-center">
                                    <div className="d-flex justify-content-center flex-wrap m">
                                        {!isCurrentUser && (
                                            <>
                                                {(canModify && !isSuperAdminUser) && (
                                                    <Button
                                                        color="info"
                                                        size="sm"
                                                        style={{ padding: "0.2rem 0.4rem", margin: "0 0.25rem", fontSize: "0.8rem" }}
                                                        onClick={() => handlePWDC(userItem.user)}
                                                    >
                                                        🔑
                                                    </Button>
                                                )}
                                                {(canModify && !isSuperAdminUser) && (
                                                    <Button
                                                        color="warning"
                                                        size="sm"
                                                        style={{ padding: "0.2rem 0.4rem", margin: "0 0.25rem", fontSize: "0.8rem" }}
                                                        onClick={() => handleModify(userItem.user)}
                                                    >
                                                        ✏️
                                                    </Button>
                                                )}
                                                {!isSuperAdminUser && (
                                                    <Button
                                                        color="danger"
                                                        size="sm"
                                                        style={{ padding: "0.2rem 0.4rem", margin: "0 0.25rem", fontSize: "0.8rem" }}
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

            {totalPages > 1 && (
                <div className="mt-auto" style={{ minHeight: '40px' }}>
                    <PaginationComponent currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                </div>
            )}
        </>
    );
};

export default TableUserComponent;
