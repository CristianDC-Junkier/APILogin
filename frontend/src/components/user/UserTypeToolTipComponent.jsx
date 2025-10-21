import React, { useState } from "react";
import { Tooltip } from "reactstrap";

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