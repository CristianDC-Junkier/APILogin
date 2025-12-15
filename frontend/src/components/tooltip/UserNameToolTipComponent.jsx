import { useState, useRef, useEffect } from "react";
import { Tooltip } from "reactstrap";
import { useTheme } from '../../hooks/UseTheme';

/**
 * Componente que muestra el nombre del usuario
 * y, en pantallas pequeñas, lo abrevia con un tooltip descriptivo al pasar el cursor.
 *
 * @component
 * @param {Object} props - Propiedades del componente.
 * @param {Object} props.user - Objeto con la información del usuario.
 * @param {number|string} props.user.id - ID único del usuario (usado para generar el identificador del tooltip).
 * @param {string} props.user.username - Nombre del usuario.
 * @param {boolean} props.isSmallScreen_v2 - Indica si el componente se está mostrando en una pantalla mediana.
 * @param {boolean} props.isSmallScreen_v1 - Indica si el componente se está mostrando en una pantalla pequeña.
 * @param {boolean} props.isSmallScreen_v0 - Indica si el componente se está mostrando en una pantalla muy pequeña
 * @param {boolean} props.isCurrentUser - Indica si el usuario mostrado es el usuario actualmente autenticado.
 * @returns {JSX.Element} Elemento visual que muestra el tipo de usuario con o sin tooltip según el tamaño de la pantalla.
 */
const UserNameToolTipComponent = ({ user, isSmallScreen_v0, isSmallScreen_v1, isSmallScreen_v2, isCurrentUser }) => {
    const tdRef = useRef(null);
    const [isTruncated, setIsTruncated] = useState(false);
    const [tooltipOpen, setTooltipOpen] = useState(false);
    const { darkMode } = useTheme();

    const toggleTooltip = () => setTooltipOpen(!tooltipOpen);

    useEffect(() => {
        const el = tdRef.current;
        if (el) {
            setIsTruncated(el.scrollWidth > el.clientWidth);
        }
    }, [user.username, isSmallScreen_v0, isSmallScreen_v1, isSmallScreen_v2]);

    const elementId = `username-${user.id}`;

    return (
        <td
                id={elementId}
                ref={tdRef}
                style={{
                    maxWidth: isSmallScreen_v2 ? "90px" : isSmallScreen_v1 ? "120px" : isSmallScreen_v0 ? "130px" : "300px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    color: isCurrentUser ? darkMode ? "#237bdb" : "blue" : "inherit",
                    fontWeight: isCurrentUser ? "bold" : "normal",
                    cursor: isTruncated ? "help" : "default",
                }}
            >
                {user.username}


            {isTruncated && (
                <Tooltip
                    isOpen={tooltipOpen}
                    toggle={toggleTooltip}
                    target={elementId}
                    placement="top"
                >
                    {user.username}
                </Tooltip>
            )}
        </td>
    );
}


export default UserNameToolTipComponent;