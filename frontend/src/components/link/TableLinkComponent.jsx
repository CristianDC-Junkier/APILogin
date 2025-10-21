import React, { useEffect, useState, useMemo } from "react";
import { Table, Button } from "reactstrap";
import { createRoot } from "react-dom/client";
import Swal from "sweetalert2";
import CaptchaSlider from '../utils/CaptchaSliderComponent';
import AddModifyLinkComponent from "./AddModifyLinkComponent";
import { getAllLinks, modifyLink, deleteLink } from "../../services/LinkService";
import Pagination from "../../components/PaginationComponent";

const TableLinkComponent = ({ token, search, rowsPerPage, currentPage, setCurrentPage, onStatsUpdate }) => {
    const [links, setLinks] = useState([]);
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

    /** Cargar links **/
    useEffect(() => {
        const fetchAll = async () => {
            if (!token) return;
            setLoading(true);
            try {
                const res = await getAllLinks(token);
                if (res.success) {
                    setLinks(res.data.links || []);

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
    }, [token, onStatsUpdate]);

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
                const result = await modifyLink(linkItem.id, formValues, token);
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
        const result = await deleteLink(linkItem.id, token);
        if (result.success) {
            Swal.fire("Éxito", "Enlace eliminado correctamente", "success");
            window.dispatchEvent(new Event("refresh-links"));
        } else {
            Swal.fire("Error", result.error || "No se pudo eliminar el enlace", "error");
        }
    };

    if (loading) return <div><p colSpan={4}>Cargando...</p></div>;

    return (
        <>
            <Table striped responsive>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th style={{ width: isSmallScreen ? "15%" : "45%" }}>Dirección Web</th>
                        <th style={{ width: isSmallScreen ? "45%" : "15%" }}>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {currentLinks.map((linkItem, idx) => (
                        <tr key={idx}>
                            <td>{linkItem.id}</td>
                            <td style={{
                                maxWidth: isSmallScreen ? "180px" : "auto",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                            }}>
                                {linkItem.name}
                            </td>
                            <td>
                                <a href={linkItem.web} target="_blank" rel="noopener noreferrer">
                                    {isSmallScreen ? "Enlace" : linkItem.web}
                                </a>
                            </td>
                            <td>
                                <div className="d-flex justify-content-center flex-wrap gap-1">
                                    <Button color="warning" size="sm" onClick={() => handleModify(linkItem)}>✏️</Button>
                                    <Button color="danger" size="sm" onClick={() => handleDelete(linkItem)}>🗑️</Button>
                                </div>
                            </td>
                        </tr>
                    ))}

                    {[...Array(rowsPerPage - currentLinks.length)].map((_, i) => (
                        <tr key={"empty-" + i} style={{ height: "50px" }}><td colSpan={4}></td></tr>
                    ))}
                </tbody>
            </Table>
            {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />}
        </>
    );
};

export default TableLinkComponent;
