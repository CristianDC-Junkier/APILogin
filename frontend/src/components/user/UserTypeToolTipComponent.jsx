import React, { useState } from "react";
import { Tooltip } from "reactstrap";

/**
 * Componente que muestra el tipo de usuario (Usuario, Administrador, Super Administrador)
 * y, en pantallas pequeñas, lo abrevia con un tooltip descriptivo al pasar el cursor.
 *
 * @component
 * @param {Object} props - Propiedades del componente.
 * @param {Object} props.user - Objeto con la información del usuario.
 * @param {number|string} props.user.id - ID único del usuario (usado para generar el identificador del tooltip).
 * @param {string} props.user.usertype - Tipo de usuario. Puede ser "USER", "ADMIN" o "SUPERADMIN".
 * @param {boolean} props.isSmallScreen - Indica si el componente se está mostrando en una pantalla pequeña.
 * @param {boolean} props.isCurrentUser - Indica si el usuario mostrado es el usuario actualmente autenticado.
 * @returns {JSX.Element} Elemento visual que muestra el tipo de usuario con o sin tooltip según el tamaño de la pantalla.
 */
const UserTypeTooltipComponent = ({ user, isSmallScreen, isCurrentUser }) => {
    const [tooltipOpen, setTooltipOpen] = useState(false);
    const tooltipId = `type-${user.id}`;

    const typeLabels = {
        USER: "Usuario",
        ADMIN: "Administrador",
        SUPERADMIN: "Super Administrador"
    };

    const typeShort = {
        USER: "U",
        ADMIN: "A",
        SUPERADMIN: "SA"
    };

    const displayText = isSmallScreen ? typeShort[user.usertype] : typeLabels[user.usertype];

    return (
        <span
            id={tooltipId}
            style={{
                maxWidth: isSmallScreen ? "100px" : "auto",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                color: isCurrentUser ? "blue" : "inherit",
                fontWeight: isCurrentUser ? "bold" : "normal"
            }}
        >
            {displayText}
            {isSmallScreen && (
                <Tooltip
                    placement="top"
                    isOpen={tooltipOpen}
                    target={tooltipId}
                    toggle={() => setTooltipOpen(!tooltipOpen)}
                >
                    {typeLabels[user.usertype]}
                </Tooltip>
            )}
        </span>
    );
};


export default UserTypeTooltipComponent;