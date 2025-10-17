import React, { useMemo, useEffect, useState } from "react";
import { Table, Button } from "reactstrap";
import { createRoot } from "react-dom/client";
import Swal from "sweetalert2";
import CaptchaSlider from '../utils/CaptchaSliderComponent';
import AddModifyLinkComponent from "./AddModifyLinkComponent";
import { modifyLink, deleteLink } from "../../services/LinkService";
import Pagination from "../../components/PaginationComponent";


/**
 * Componente para mostrar la tabla de departamentos
 * @param {Object} props
 * @param {Array} props.links - Lista de departamentos
 * @param {String} props.search - Filtro de búsqueda por nombre
 * @param {Number} props.rowsPerPage - Número de filas por página
 * @param {Number} props.currentPage - Página actual
 * @param {Function} props.setCurrentPage - Función para cambiar la página
 * @param {Function} props.refreshData - Función para recargar los datos
 */
const TableLinkComponent = ({ token, links, search, rowsPerPage, currentPage, setCurrentPage, refreshData }) => {

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

    const filteredLinks = useMemo(
        () => links?.filter(d => d.name.toLowerCase().includes(search.toLowerCase())),
        [links, search]
    );

    const totalPages = Math.ceil(filteredLinks?.length / rowsPerPage);
    const currentLinks = filteredLinks?.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

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
            title: `Eliminar Enlace`,
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

    const handleModify = async (linkItem) => {
        await AddModifyLinkComponent({
            linkItem,
            action: "modify",
            onConfirm: async (formValues) => {
                const result = await modifyLink(linkItem.id, formValues, token);
                if (result.success) {
                    Swal.fire("Éxito", "Enlace modificado correctamente", "success");
                    await refreshData(false);
                } else {
                    Swal.fire("Error", result.error || "No se pudo modificar el enlace", "error");
                }
            }
        });
    };

    const handleDelete = async (linkItem) => {
        try { await showCaptcha(linkItem.id); }
        catch (err) { Swal.fire('Atención', err.message || 'Captcha no completado', 'warning'); return; }

        const result = await deleteLink(linkItem.id, token);
        if (result.success) {
            Swal.fire('Éxito', 'Enlace eliminado correctamente', 'success');
            await refreshData(false);
        } else {
            Swal.fire('Error', result.error || 'No se pudo eliminar el enlace', 'error');
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
                            Dirección Web
                        </th>
                        <th
                            className="text-center"
                            style={{ width: isSmallScreen ? "55%" : "15%" }}>
                            Acciones
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {currentLinks?.map((linkItem, idx) => {

                        return (
                            <tr key={idx}>
                                <td> {linkItem?.id || "\u00A0"} </td>
                                <td> {linkItem?.name || "\u00A0"} </td>
                                <td> {<a href={linkItem?.web} target="_blank"> {isSmallScreen ? "Enlace" : linkItem?.web } </a> || "\u00A0"} </td>
                                <td className="text-center">
                                    <div className="d-flex justify-content-center flex-wrap m">
                                        <Button color="warning" size="sm" className="me-1 mb-1" onClick={() => handleModify(linkItem)}> ✏️ </Button>
                                        <Button color="danger" size="sm" className="me-1 mb-1" onClick={() => handleDelete(linkItem)}> 🗑️ </Button>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}

                    {/* Filas vacías */}
                    {rowsPerPage - currentLinks?.length > 0 &&
                        [...Array(rowsPerPage - currentLinks?.length)].map((_, idx) => (
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

export default TableLinkComponent;
