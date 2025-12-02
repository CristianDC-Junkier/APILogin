import React, { useState, useEffect, useMemo } from "react";
import { Table, Button } from "reactstrap";
import Swal from "sweetalert2";
import { createRoot } from "react-dom/client";

import { getDepartmentList, modifyDepartment, deleteDepartment, addLinkToDepartment, deleteLinkToDepartment } from "../../services/DepartmentService";
import { getAllLinks } from "../../services/LinkService";
import { useTheme } from '../../hooks/UseTheme';

import PaginationComponent from "../../components/PaginationComponent";
import CaptchaSliderComponent from '../utils/CaptchaSliderComponent';
import SpinnerComponent from "../utils/SpinnerComponent";

import AddModifyDepartmentComponent from "./AddModifyDepartmentComponent";

import DepartmentNameToolTipComponent from "../tooltip/DepartmentNameToolTipComponent";

import BadgeComponent from "../badge/BadgeComponent";
import AddBadgeComponent from "../badge/AddBadgeComponent";
import RemovableBadgeComponent from "../badge/RemovableBadgeComponent";
import ShowMoreBadgeComponent from "../badge/ShowMoreBadgeComponent";

/**
 * Componente que muestra la tabla de departamentos del sistema.
 * 
 * @component
 * @param {Object} props - Propiedades del componente.
 * @param {string} props.search - Filtro de búsqueda por nombre de departamento.
 * @param {number} props.rowsPerPage - Número de filas mostradas por página.
 * @param {number} props.currentPage - Página actual de la tabla.
 * @param {function} props.setCurrentPage - Función para cambiar la página actual.
 * @param {Object} props.currentUser - Información del usuario autenticado.
 * @param {function} props.onStatsDepartsUpdate - Callback para actualizar estadísticas de departamentos.
 * @param {function} props.onStatsLinksUpdate - Callback para actualizar estadísticas de enlaces.
 * @returns {JSX.Element} Tabla interactiva de departamentos.
 */
const TableDepartmentComponent = ({ search, rowsPerPage, currentPage, setCurrentPage, currentUser, onStatsDepartsUpdate, onStatsLinksUpdate, sortBy }) => {
    const [departments, setDepartments] = useState([]);
    const [links, setLinks] = useState([]);
    const [loading, setLoading] = useState(true);

    const { darkMode } = useTheme();

    /** Detectar pantallas pequeñas */
    const useIsSmallScreen = (breakpoint) => {
        const [isSmall, setIsSmall] = useState(window.innerWidth <= breakpoint);
        useEffect(() => {
            const handleResize = () => setIsSmall(window.innerWidth <= breakpoint);
            window.addEventListener("resize", handleResize);
            return () => window.removeEventListener("resize", handleResize);
        }, [breakpoint]);
        return isSmall;
    };

    const isSmallScreen_v0 = useIsSmallScreen(991);
    const isSmallScreen_v1 = useIsSmallScreen(767);

    /** Cargar departamentos **/
    useEffect(() => {
        const fetchAll = async () => {
            setLoading(true);
            try {
                const [depRes, linkRes] = await Promise.all([
                    getDepartmentList(),
                    getAllLinks()
                ]);

                if (depRes.success) {
                    let depts = depRes.data.departments ?? [];

                    // Orden dinámico
                    depts = depts.sort((a, b) => {
                        if (sortBy === "name") return a.name.localeCompare(b.name);
                        return a.id - b.id;
                    });

                    setDepartments(depts);

                    if (onStatsDepartsUpdate) {
                        onStatsDepartsUpdate(depRes.data.departments.length);
                    }
                }

                if (linkRes.success) {
                    setLinks(linkRes.data.links ?? []);
                    if (onStatsLinksUpdate) {
                        onStatsLinksUpdate(linkRes.data.links.length);
                    }
                }
                
            } catch {
                Swal.fire({ title: "Error", text: "No se pudieron cargar los datos", icon: "error", theme: darkMode ? "dark" : "" });
            } finally {
                setLoading(false);
            }
        };

        fetchAll();
        const handler = () => fetchAll();
        window.addEventListener("refresh-departments", handler);
        return () => window.removeEventListener("refresh-departments", handler);
    }, [onStatsDepartsUpdate, onStatsLinksUpdate, sortBy, darkMode]);

    /** Filtrado por búsqueda **/
    const filteredDepartments = useMemo(
        () => departments.filter(l => l.name.toLowerCase().includes(search.toLowerCase())),
        [departments, search]
    );

    const totalPages = Math.ceil(filteredDepartments.length / rowsPerPage);
    const currentDepartments = useMemo(
        () => filteredDepartments.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage),
        [filteredDepartments, currentPage, rowsPerPage]
    );

    /** Captcha antes de eliminar **/
    const showCaptcha = () => new Promise((resolve) => {
        const container = document.createElement('div');
        const reactRoot = createRoot(container);
        let completed = false;

        reactRoot.render(
            <CaptchaSliderComponent
                darkMode={darkMode}
                onSuccess={() => {
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
            theme: darkMode ? "dark" : "",
            preConfirm: () => {
                if (!completed) Swal.showValidationMessage('Debes completar el captcha');
            }
        });
    });

    /** Modificar departamento **/
    const handleModify = async (depItem) => {
        if (depItem.id === 1) {
            Swal.fire({ title: "Error", text: "Este departamento no se puede eliminar", icon: "error", theme: darkMode ? "dark" : "" });
            return;
        }

        await AddModifyDepartmentComponent({
            depItem,
            action: "modify",
            darkMode: darkMode,
            onConfirm: async (formValues) => {
                const result = await modifyDepartment(depItem.id, formValues);
                if (result.success) {
                    Swal.fire({ title: "Éxito", text: "Departamento modificado correctamente", icon: "success", theme: darkMode ? "dark" : "" });
                    window.dispatchEvent(new Event("refresh-departments"));
                } else {
                    Swal.fire({ title: "Error", text: result.error || "No se pudo modificar el departamento", icon: "error", theme: darkMode ? "dark" : "" });
                }
            }
        });
    };

    /** Eliminar departamento **/
    const handleDelete = async (depItem) => {
        try { await showCaptcha(); }
        catch { return; }

        if (depItem.id === 1) {
            Swal.fire({ title: "Error", text: "Este departamento no se puede eliminar", icon: "error", theme: darkMode ? "dark" : "" });
            return;
        }

        const result = await deleteDepartment(depItem.id);
        if (result.success) {
            Swal.fire({ title: "Éxito", text: "Departamento eliminado correctamente", icon: "success", theme: darkMode ? "dark" : "" });

            // Calculamos si era el último elemento de la página
            const newFilteredLength = filteredDepartments.length - 1;
            const newTotalPages = Math.ceil(newFilteredLength / rowsPerPage);

            // Si la página actual queda vacía, ir a la anterior o a la 1
            const newPage = currentPage > newTotalPages ? Math.max(newTotalPages, 1) : currentPage;
            setCurrentPage(newPage);

            window.dispatchEvent(new Event("refresh-departments"));
        } else {
            Swal.fire({ title: "Error", text: result.error || "No se pudo eliminar el departamento", icon: "error", theme: darkMode ? "dark" : "" });
        }
    };

    if (loading) return <SpinnerComponent />;

    return (
        <>
            <Table dark={darkMode} striped responsive>
                <thead>
                    <tr>
                        <th style={{ width: "5%" }}> ID</th>
                        <th style={{ width: isSmallScreen_v1 ? "40%" : isSmallScreen_v0 ? "10%" : "10%" }}> Nombre</th>
                        <th className="text-center" style={{ width: isSmallScreen_v1 ? "25%" : isSmallScreen_v0 ? "50%" : "60%" }}>Enlaces</th>
                        <th className="text-center" style={{ width: isSmallScreen_v1 ? "20%" : isSmallScreen_v0 ? "15%" : "10%" }}>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {currentDepartments.map((depItem, idx) => {
                        const canModifyLinks = ["ADMIN", "SUPERADMIN"].includes(currentUser.usertype);
                        const canModifyorDelete = ["ADMIN", "SUPERADMIN"].includes(currentUser.usertype) && depItem.id !== 1;
                        const depLinks = depItem.links || [];
                        const depAvailableLinks = links.filter(l => !depLinks.some(dl => dl.id === l.id));
                        return (
                            <tr key={idx}>
                                <td style={{
                                    color: depItem.id === 1 ? "#0d6efd" : undefined,
                                    fontWeight: 500
                                }}> {depItem.id} </td>
                                <DepartmentNameToolTipComponent
                                    depItem={depItem}
                                    isSmallScreen_v0={isSmallScreen_v0}
                                    isSmallScreen_v1={isSmallScreen_v1}
                                />
                                <td>
                                    {isSmallScreen_v1 ? (
                                        depLinks?.length > 0 ? (
                                            <ShowMoreBadgeComponent
                                                currentUser={currentUser}
                                                user={depItem}
                                                canModify={canModifyLinks}
                                                objType="enlace"
                                                userObjects={depLinks}
                                                availableObjs={depAvailableLinks}
                                                onAdded={async l => {
                                                    await addLinkToDepartment(depItem.id, l.id);
                                                    window.dispatchEvent(new Event("refresh-departments"));
                                                }}
                                                onDeleted={async l => {
                                                    await deleteLinkToDepartment(depItem.id, l.id);
                                                    window.dispatchEvent(new Event("refresh-departments"));
                                                }}
                                            />
                                        ) : canModifyLinks ? (
                                            <AddBadgeComponent
                                                availableObjs={depAvailableLinks}
                                                objType="enlace"
                                                darkMode={darkMode}
                                                onAdded={async l => {
                                                    await addLinkToDepartment(depItem.id, l.id);
                                                    window.dispatchEvent(new Event("refresh-departments"));
                                                }}
                                            />
                                        ) : null
                                    ) : (
                                        <>
                                            {depLinks.slice(0, 3).map(l => canModifyLinks
                                                ? <RemovableBadgeComponent key={l.id} objName={l.name} objType="enlace" darkMode={darkMode} onDelete={async () => {
                                                    await deleteLinkToDepartment(depItem.id, l.id);
                                                    window.dispatchEvent(new Event("refresh-departments"));
                                                }} />
                                                : <BadgeComponent key={l.id} objName={l.name} />
                                            )}
                                            {depLinks.length > 3 && (
                                                <ShowMoreBadgeComponent
                                                    currentUser={currentUser}
                                                    user={depItem}
                                                    canModify={canModifyLinks}
                                                    objType="enlace"
                                                    userObjects={depLinks}
                                                    availableObjs={depAvailableLinks}
                                                    onAdded={async l => {
                                                        await addLinkToDepartment(depItem.id, l.id);
                                                        window.dispatchEvent(new Event("refresh-departments"));
                                                    }}
                                                    onDeleted={async l => {
                                                        await deleteLinkToDepartment(depItem.id, l.id);
                                                        window.dispatchEvent(new Event("refresh-departments"));
                                                    }}
                                                />
                                            )}
                                                {depLinks?.length <= 3 && canModifyLinks && (
                                                    <AddBadgeComponent availableObjs={depAvailableLinks} objType="enlace" darkMode={darkMode} onAdded={async l => {
                                                    await addLinkToDepartment(depItem.id, l.id);
                                                    window.dispatchEvent(new Event("refresh-departments"));
                                                }} />
                                            )}
                                        </>
                                    )}
                                </td>
                                <td className="text-center">
                                    <div className="d-flex justify-content-center flex-wrap gap-1">
                                        {canModifyorDelete && (
                                            <>
                                                <Button color="warning" size="sm"
                                                    style={{
                                                        padding: isSmallScreen_v0 ? "0.25rem 0.45rem" : "",
                                                        fontSize: isSmallScreen_v0 ? "0.65rem" : "",
                                                    }}
                                                    onClick={() => handleModify(depItem)}>✏️
                                                </Button>
                                                <Button color="danger" size="sm"
                                                    style={{
                                                        padding: isSmallScreen_v0 ? "0.25rem 0.45rem" : "",
                                                        fontSize: isSmallScreen_v0 ? "0.65rem" : "",
                                                    }}
                                                    onClick={() => handleDelete(depItem)}>🗑️
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        )
                    })}
                    {[...Array(rowsPerPage - currentDepartments.length)].map((_, i) => <tr key={"empty-" + i} style={{ height: "50px" }}><td colSpan={4}></td></tr>)}
                </tbody>
            </Table>
            {totalPages > 1 && <PaginationComponent currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />}
        </>
    );
};

export default TableDepartmentComponent;
