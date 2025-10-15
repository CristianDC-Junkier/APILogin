import React from "react";

/**
 * Muestra una insignia con el nombre del departamento del usuario.
 * @param {Object} props
 * @param {string} props.department Nombre del departamento.
 */
function stringToColor(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = "#";
    for (let i = 0; i < 3; i++) {
        const value = (hash >> (i * 8)) & 0xff;
        color += ("00" + value.toString(16)).substr(-2);
    }
    return color;
}

const DepartmentBadgeComponent = ({ department }) => {
    const bgColor = stringToColor(department);
    return (
        <span
            style={{
                display: "inline-block",
                padding: "4px 12px",
                borderRadius: "50px",
                backgroundColor: bgColor,
                color: "#fff",
                fontWeight: 500,
                fontSize: "0.8rem",
                whiteSpace: "nowrap",
            }}
        >
            {department}
        </span>
    );
};

export default DepartmentBadgeComponent;
