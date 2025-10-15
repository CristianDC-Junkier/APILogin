import React from "react";
import Swal from "sweetalert2";
import { addDepartmentProfile } from "../../services/UserService";

/**
 * Badge para añadir un departamento (solo para admins/superadmins)
 * @param {Object} props
 * @param {Array} props.availableDepartments Lista de departamentos disponibles [{id, name}]
 * @param {Function} props.onAdded Callback que recibe el resultado de la operación
 */
const AddDepartmentBadgeComponent = ({ availableDepartments = [], onAdded }) => {
    const handleAddClick = async () => {
        if (!availableDepartments.length) {
            return Swal.fire("Info", "No hay departamentos disponibles para añadir", "info");
        }

        const { value: depId } = await Swal.fire({
            title: "Selecciona un departamento",
            input: "select",
            inputOptions: Object.fromEntries(availableDepartments.map(d => [d.id, d.name])),
            inputPlaceholder: "Selecciona un departamento",
            showCancelButton: true,
        });

        if (!depId) return;
        await onAdded(depId); 

    };

    return (
        <span
            onClick={handleAddClick}
            style={{
                display: "inline-block",
                padding: "4px 12px",
                borderRadius: "50px",
                backgroundColor: "#e0e0e0",
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

export default AddDepartmentBadgeComponent;
