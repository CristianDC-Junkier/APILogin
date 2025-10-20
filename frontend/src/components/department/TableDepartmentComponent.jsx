import React, { useMemo, useState, useEffect } from "react";
import { Table, Button } from "reactstrap";
import { createRoot } from "react-dom/client";
import Swal from "sweetalert2";

import { modifyDepartment, deleteDepartment, addLinkToDepartment, deleteLinkToDepartment } from "../../services/DepartmentService";

import Pagination from "../../components/PaginationComponent";
import CaptchaSlider from '../utils/CaptchaSliderComponent';
import AddModifyDepartmentComponent from "./AddModifyDepartmentComponent";
import BadgeComponent from "../badge/BadgeComponent";
import AddBadgeComponent from "../badge/AddBadgeComponent";
import RemovableBadgeComponent from "../badge/RemovableBadgeComponent";
import ShowMoreBadgeComponent from "../badge/ShowMoreBadgeComponent"

/**
 * Componente para mostrar la tabla de departamentos
 * @param {Object} props
 * @param {Array} props.departments - Lista de departamentos
 * @param {Array} props.links - Lista de enlaces
 * @param {String} props.search - Filtro de búsqueda por nombre
 * @param {Number} props.rowsPerPage - Número de filas por página
 * @param {Number} props.currentPage - Página actual
 * @param {Function} props.setCurrentPage - Función para cambiar la página
 * @param {Function} props.refreshData - Función para recargar los datos
 * @param {Object} props.currentUser - Objeto con la información del usuario conectado
 */
const TableDepartmentComponent = ({ token, departments, links, search, rowsPerPage, currentPage, setCurrentPage, refreshData, currentUser }) => {

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

    const filteredDepartments = useMemo(
        () => departments.filter(d => d.name.toLowerCase().includes(search.toLowerCase())),
        [departments, search]
    );

    const totalPages = Math.ceil(filteredDepartments.length / rowsPerPage);
    const currentDepartments = filteredDepartments.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

    const showCaptcha = () => new Promise((resolve) => {
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
            title: `Eliminar Departamento`,
            html: container,
            showConfirmButton: true,
            confirmButtonText: 'Continuar',
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            allowOutsideClick: false,
            preConfirm: () => {
                if (!completed) {
                    Swal.showValidationMessage('Debes completar el captcha');
                    return false;
                }
            }
        });
    });

    const handleModify = async (depItem) => {
        await AddModifyDepartmentComponent({
            depItem,
            action: "modify",
            onConfirm: async (formValues) => {
                const result = await modifyDepartment(depItem.id, formValues, token);
                if (result.success) {
                    Swal.fire("Éxito", "Departamento modificado correctamente", "success");
                    await refreshData(false);
                } else {
                    Swal.fire("Error", result.error || "No se pudo modificar el departamento", "error");
                }
            }
        });
    };

    const handleDelete = async (depItem) => {
        try { await showCaptcha(depItem.id); }
        catch (err) { Swal.fire('Atención', err.message || 'Captcha no completado', 'warning'); return; }

        const result = await deleteDepartment(depItem.id, token);
        if (result.success) {
            Swal.fire('Éxito', 'Departamento eliminado correctamente', 'success');
            await refreshData(false);
        } else {
            Swal.fire('Error', result.error || 'No se pudo eliminar el departamento', 'error');
        }
    };

    const isSmallScreen = useIsSmallScreen(770);

    return (
        <>
            <Table striped responsive>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th
                            className="text-center"
                            style={{ width: isSmallScreen ? "15%" : "55%" }}>
                            Departamentos
                        </th>
                        <th
                            className="text-center"
                            style={{ width: isSmallScreen ? "55%" : "15%" }}>
                            Acciones
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {currentDepartments.map((depItem, idx) => {
                        const canModify = (currentUser.usertype === "SUPERADMIN" || currentUser.usertype === "ADMIN");

                        return (
                            <tr key={idx}>
                                <td> {depItem?.id || "\u00A0"} </td>
                                <td> {depItem?.name || "\u00A0"} </td>
                                <td>
                                    {isSmallScreen ? (
                                        // Pantalla pequeña: solo mostrar botón "Mostrar más" o "+ Añadir"
                                        depItem.links && depItem.links.length > 0 ? (
                                            <ShowMoreBadgeComponent
                                                currentUser={currentUser}
                                                user={depItem}
                                                canModify={canModify}
                                                objList={links}
                                                objType="enlace"
                                                userObjects={depItem.links}
                                                onAdded={async (link) => {
                                                    await addLinkToDepartment(depItem.id, link.id, token);
                                                    await refreshData(false);
                                                }}
                                                onDeleted={async (link) => {
                                                    await deleteLinkToDepartment(depItem.id, link.id, token);
                                                    await refreshData(false);
                                                }}
                                            />
                                        ) : canModify ? (
                                                <AddBadgeComponent
                                                    availableObjs={links}
                                                    objType="enlace"
                                                    onAdded={async (link) => {
                                                        await addLinkToDepartment(depItem.id, link.id, token);
                                                        await refreshData(false);
                                                    }}
                                                />
                                        ) : null
                                    ) : (
                                        // Pantalla normal: mostrar badges + "Mostrar más" o "+ Añadir"
                                        <>
                                            {/* Mostrar los primeros dos departamentos */}
                                            {depItem.links && depItem.links.length > 0 && depItem.links.slice(0, 3).map(link => (
                                                canModify
                                                    ? <RemovableBadgeComponent
                                                        key={link.id}
                                                        objName={link.name}
                                                        objType="enlace"
                                                        onDelete={async () => {
                                                            await deleteLinkToDepartment(depItem.id, link.id, token);
                                                            await refreshData(false);
                                                        }}
                                                    />
                                                    : <BadgeComponent
                                                        key={link.id}
                                                        objName={link.name}
                                                    />
                                            ))}

                                            {/* Si hay más de 2 departamentos, mostramos el botón "Mostrar más" */}
                                            {depItem.links.length > 3 ? (
                                                <ShowMoreBadgeComponent
                                                    currentUser={currentUser}
                                                    user={depItem}
                                                    canModify={canModify}
                                                    objList={links}
                                                    objType="enlace"
                                                    userObjects={depItem.links}
                                                    onAdded={async (link) => {
                                                        await addLinkToDepartment(depItem.id, link.id, token);
                                                        await refreshData(false);
                                                    }}
                                                    onDeleted={async (link) => {
                                                        await deleteLinkToDepartment(depItem.id, link.id, token);
                                                        await refreshData(false);
                                                    }}
                                                />
                                            ) : <AddBadgeComponent
                                                availableObjs={links}
                                                objType="enlace"
                                                onAdded={async (link) => {
                                                    await addLinkToDepartment(depItem.id, link.id, token);
                                                    await refreshData(false);
                                                }}
                                            />
                                            }
                                        </>
                                    )}
                                    

                                </td>
                                <td className="text-center">
                                    <div className="d-flex justify-content-center flex-wrap m">
                                        <Button color="warning" size="sm" className="me-1 mb-1" onClick={() => handleModify(depItem)}> ✏️ </Button>
                                        <Button color="danger" size="sm" className="me-1 mb-1" onClick={() => handleDelete(depItem)}> 🗑️ </Button>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}

                    {/* Filas vacías */}
                    {rowsPerPage - currentDepartments.length > 0 &&
                        [...Array(rowsPerPage - currentDepartments.length)].map((_, idx) => (
                            <tr key={`empty-${idx}`} style={{ height: '50px' }}>
                                <td colSpan={4}></td>
                            </tr>
                        ))
                    }
                </tbody>
            </Table>

            <div className="mt-auto" style={{ minHeight: '40px' }}>
                {totalPages > 1 ? (
                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                ) : (
                    <div style={{ height: '40px' }}></div>
                )}
            </div>
        </>
    );
};

export default TableDepartmentComponent;
