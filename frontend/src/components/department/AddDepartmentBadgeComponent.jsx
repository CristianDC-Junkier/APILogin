import React from "react";
import Swal from "sweetalert2";

/**
 * Badge para añadir un departamento (solo para admins/superadmins)
 * @param {Object} props
 * @param {Function} props.onAdd Callback al pulsar añadir
 */
const AddDepartmentBadge = ({ onAdd }) => {
    return (
        <span
            onClick={async () => {
                const { value: departmentName } = await Swal.fire({
                    title: "Añadir departamento",
                    input: "text",
                    inputLabel: "Nombre del departamento",
                    inputPlaceholder: "Escribe el nombre",
                    showCancelButton: true,
                });
                if (departmentName) onAdd(departmentName);
            }}
            style={{
                display: "inline-block",
                padding: "4px 12px",
                borderRadius: "50px",
                backgroundColor: "#dcdcdc",
                color: "#333",
                fontWeight: 500,
                fontSize: "0.8rem",
                whiteSpace: "nowrap",
                cursor: "pointer",
            }}
        >
            + Añadir
        </span>
    );
};

export default AddDepartmentBadge;
