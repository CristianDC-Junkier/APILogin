import { useState, useRef, useEffect } from "react";
import { Tooltip } from "reactstrap";

/**
 * Componente que muestra el nombre de un departamento
 * y, si el texto se trunca (por el tamaño de pantalla o columna), 
 * muestra un tooltip con el nombre completo al pasar el cursor.
 *
 * @component
 * @param {Object} props - Propiedades del componente.
 * @param {Object} props.depItem - Objeto con la información del departamento.
 * @param {number|string} props.depItem.id - ID único del departamento (usado para generar el identificador del tooltip).
 * @param {string} props.depItem.name - Nombre del departamento.
 * @param {boolean} props.isSmallScreen_v1 - Indica si es pantalla pequeña.
 * @param {boolean} props.isSmallScreen_v0 - Indica si es pantalla muy pequeña.
 * @returns {JSX.Element} Celda de tabla con el nombre del departamento y tooltip si el texto está truncado.
 */
const DepartmentNameToolTipComponent = ({ depItem, isSmallScreen_v0, isSmallScreen_v1 }) => {
    const tdRef = useRef(null);
    const [isTruncated, setIsTruncated] = useState(false);
    const [tooltipOpen, setTooltipOpen] = useState(false);

    const toggleTooltip = () => setTooltipOpen(!tooltipOpen);

    useEffect(() => {
        const el = tdRef.current;
        if (el) {
            setIsTruncated(el.scrollWidth > el.clientWidth);
        }
    }, [depItem.name, isSmallScreen_v0, isSmallScreen_v1]);

    const elementId = `department-${depItem.id}`;

    return (
            <td
                id={elementId}
                ref={tdRef}
                style={{
                    color: depItem.id === 1 ? "#0d6efd" : undefined,
                    fontWeight: 500,
                    maxWidth: isSmallScreen_v1
                        ? "120px"
                        : isSmallScreen_v0
                            ? "130px"
                                : "180px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    cursor: isTruncated ? "help" : "default",
                }}
            >
                {depItem.name}

            {isTruncated && (
                <Tooltip
                    isOpen={tooltipOpen}
                    toggle={toggleTooltip}
                    target={elementId}
                    placement="top"
                >
                    {depItem.name}
                </Tooltip>
            )}
        </td>
    );
};

export default DepartmentNameToolTipComponent;