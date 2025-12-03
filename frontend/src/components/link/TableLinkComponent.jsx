import React, { useEffect, useState, useMemo } from "react";
import { Table, Button } from "reactstrap";
import Swal from "sweetalert2";
import { createRoot } from "react-dom/client";

import { getAllLinks, modifyLink, deleteLink } from "../../services/LinkService";

import CaptchaSlider from '../utils/CaptchaSliderComponent';
import AddModifyLinkComponent from "./AddModifyLinkComponent";

import SpinnerComponent from "../utils/SpinnerComponent";
import LinkNameToolTipComponent from "../tooltip/LinkNameToolTipComponent";

import PaginationComponent from "../PaginationComponent";

/**
 * Componente que muestra la tabla de links del sistema.
 * 
 * @component
 * @param {Object} props - Propiedades del componente.
 * @param {string} props.search - Filtro de búsqueda por nombre del link.
 * @param {number} props.rowsPerPage - Número de filas mostradas por página.
 * @param {number} props.currentPage - Página actual de la tabla.
 * @param {function} props.setCurrentPage - Función para cambiar la página actual.
 * @param {function} props.onStatsUpdate - Callback para actualizar estadísticas de links.
 * @returns {JSX.Element} Tabla interactiva de departamentos.
 */
const TableLinkComponent = ({ search, rowsPerPage, currentPage, setCurrentPage, onStatsUpdate, sortBy }) => {
    const [links, setLinks] = useState([]);
    const [loading, setLoading] = useState(true);

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

    const isSmallScreen_v_1 = useIsSmallScreen(1199);
    const isSmallScreen_v0 = useIsSmallScreen(991);
    const isSmallScreen_v1 = useIsSmallScreen(767);

    /** Cargar links **/
    useEffect(() => {
        const fetchAll = async () => {
            setLoading(true);
            try {
                const res = await getAllLinks();
                if (res.success) {

                    let links = res.data.links ?? [];

                    // Orden dinámico
                    links = links.sort((a, b) => {
                        if (sortBy === "name") return a.name.localeCompare(b.name);
                        return a.id - b.id;
                    });

                    setLinks(links);

                    if (onStatsUpdate) {
                        onStatsUpdate(res.data.links.length);
                    }
                }
            } catch {
                Swal.fire("Error", "No se pudieron cargar los datos", "error");
            } finally {
                setLoading(false);
            }
        };

        fetchAll();
        const handler = () => fetchAll();
        window.addEventListener("refresh-links", handler);
        return () => window.removeEventListener("refresh-links", handler);
    }, [onStatsUpdate, sortBy]);

    /** Filtrado por búsqueda **/
    const filteredLinks = useMemo(
        () => links.filter(l => l.name.toLowerCase().includes(search.toLowerCase())),
        [links, search]
    );

    const totalPages = Math.ceil(filteredLinks.length / rowsPerPage);
    const currentLinks = useMemo(
        () => filteredLinks.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage),
        [filteredLinks, currentPage, rowsPerPage]
    );
    /** Captcha antes de eliminar **/
    const showCaptcha = () => new Promise(resolve => {
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
                if (!completed) Swal.showValidationMessage('Debes completar el captcha');
            }
        });
    });

    /** Modificar enlace **/
    const handleModify = async linkItem => {
        await AddModifyLinkComponent({
            linkItem,
            action: "modify",
            onConfirm: async formValues => {
                const result = await modifyLink(linkItem.id, formValues);
                if (result.success) {
                    Swal.fire("Éxito", "Enlace modificado correctamente", "success");
                    window.dispatchEvent(new Event("refresh-links"));
                } else {
                    Swal.fire("Error", result.error || "No se pudo modificar el enlace", "error");
                }
            }
        });
    };

    /** Eliminar enlace **/
    const handleDelete = async linkItem => {
        await showCaptcha();
        const result = await deleteLink(linkItem.id);
        if (result.success) {
            Swal.fire("Éxito", "Enlace eliminado correctamente", "success");

            // Calculamos si era el último elemento de la página
            const newFilteredLength = filteredLinks.length - 1;
            const newTotalPages = Math.ceil(newFilteredLength / rowsPerPage);

            // Si la página actual queda vacía, ir a la anterior o a la 1
            const newPage = currentPage > newTotalPages ? Math.max(newTotalPages, 1) : currentPage;
            setCurrentPage(newPage);

            window.dispatchEvent(new Event("refresh-links"));
        } else {
            Swal.fire("Error", result.error || "No se pudo eliminar el enlace", "error");
        }
    };

    if (loading) return <SpinnerComponent />;

    return (
        <>
            <Table striped responsive>
                <thead>
                    <tr>
                        <th style={{ width: "5%" }}>ID</th>
                        <th style={{ width: isSmallScreen_v1 ? "10%" : isSmallScreen_v0 ? "10%" : isSmallScreen_v_1 ? "15%" : "15%" }}>Nombre</th>
                        <th className="text-center" style={{ width: isSmallScreen_v1 ? "55%" : isSmallScreen_v0 ? "65%" : isSmallScreen_v_1 ? "55%" : "70%" }}>Dirección Web</th>
                        <th className="text-center" style={{ width: isSmallScreen_v1 ? "15%" : isSmallScreen_v0 ? "10%" : isSmallScreen_v_1 ? "10%" : "15%" }}>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {currentLinks.map((linkItem, idx) => (
                        <tr key={idx}>
                            <td>{linkItem.id}</td>
                            <LinkNameToolTipComponent
                                linkItem={linkItem}
                                isSmallScreen_v0={isSmallScreen_v0}
                                isSmallScreen_v1={isSmallScreen_v1}
                            />
                            <td style={{
                                maxWidth: isSmallScreen_v1 ? "100px" : isSmallScreen_v0 ? "160px" : isSmallScreen_v_1 ? "160px" : "400px",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                            }}>
                                <a href={linkItem.web} target="_blank" rel="noopener noreferrer">
                                    {linkItem.web}
                                </a>
                            </td>
                            <td className="text-center">
                                <div className="d-flex justify-content-center flex-wrap gap-1">
                                    <Button color="warning" size="sm"
                                        style={{
                                            padding: isSmallScreen_v0 ? "0.25rem 0.45rem" : "",
                                            fontSize: isSmallScreen_v0 ? "0.65rem" : "",
                                        }}
                                        onClick={() => handleModify(linkItem)}>✏️
                                    </Button>
                                    <Button color="danger" size="sm" style={{
                                        padding: isSmallScreen_v0 ? "0.25rem 0.45rem" : "",
                                        fontSize: isSmallScreen_v0 ? "0.65rem" : "",
                                    }}
                                        onClick={() => handleDelete(linkItem)}>🗑️
                                    </Button>
                                </div>
                            </td>
                        </tr>
                    ))}

                    {[...Array(rowsPerPage - currentLinks.length)].map((_, i) => (
                        <tr key={"empty-" + i} style={{ height: "50px" }}><td colSpan={4}></td></tr>
                    ))}
                </tbody>
            </Table>
            {totalPages > 1 && <PaginationComponent currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />}
        </>
    );
};

export default TableLinkComponent;
