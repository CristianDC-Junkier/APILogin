import React from "react";
import Swal from "sweetalert2";

/**
 * Badge para añadir un objeto (solo para admins/superadmins)
 * @param {Object} props
 * @param {String} props.objType Cadena de texto para aplicar en los menús
 * @param {Array} props.availableObjs Lista de objetos disponibles // departamento -> [{id, name}] - enlace -> [{id, name, web}]
 * @param {Function} props.onAdded Callback que recibe el resultado de la operación
 */
const AddBadgeComponent = ({ objType, availableObjs = [], onAdded }) => {
    const handleAddClick = async () => {
        if (!availableObjs.length) {
            return Swal.fire("Info", `No hay ${objType}s disponibles para añadir`, "info");
        }

        const { value: depId } = await Swal.fire({
            title: `Selecciona un ${objType}`,
            input: "select",
            inputOptions: Object.fromEntries(availableObjs.map(d => [d.id, d.name])),
            inputPlaceholder: `Selecciona un ${objType}`,
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

export default AddBadgeComponent;
