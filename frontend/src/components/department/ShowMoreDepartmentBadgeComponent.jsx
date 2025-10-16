import React from "react";
import Swal from "sweetalert2";

import DepartmentBadgeComponent from "./DepartmentBadgeComponent";
import AddDepartmentBadgeComponent from "./AddDepartmentBadgeComponent";
import RemovableDepartmentBadgeComponent from "./RemovableDepartmentBadgeComponent";
import { useNavigate } from 'react-router-dom';

/**
* Badge para mostrar "Mostrar más" 
* @param {Object} currentUser usuario actual
* @param {Object} user usuario al que se le muestran los departamentos
* @param {boolean} canModify Indica si el usuario puede modificar
* @param {Array} departments Lista completa de departamentos [{id, name}]
* @param {Array} userDepartments Lista de departamentos del usuario [{id, name}]
* @param {Function} onAdded Callback cuando se agrega un departamento
* @param {Function} onDeleted Callback cuando se elimina un departamento
*/
const ShowMoreDepartmentBadgeComponent = ({
    currentUser,
    user,
    canModify,
    departments = [],
    userDepartments = [],
    onAdded,
    onDeleted,
}) => {
    const navigate = useNavigate();

    const availableDepartments = departments.filter(
        d => !userDepartments.some(ud => ud.id === d.id)
    );

    const handleShowMore = () => {
        console.log("Show more departments for user:", user);
        console.log("Current user:", currentUser);
        console.log("Can modify:", canModify);
        console.log("User departments:", userDepartments);
        if (currentUser.id !== user.id) {
            Swal.fire({
                title: 'Departamentos',
                html: (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {canModify ? (
                            <>
                            <p>HOLA</p>
                                {/* Departamentos actuales removibles */}
                                {userDepartments.map(dep => (
                                    <RemovableDepartmentBadgeComponent
                                        key={dep.id}
                                        department={dep.name}
                                        onDelete={() => onDeleted(dep)}
                                    />
                                ))}

                                {/* Departamentos disponibles para agregar */}
                                {availableDepartments.map(dep => (
                                    <AddDepartmentBadgeComponent
                                        key={dep.id}
                                        department={dep}
                                        onAdded={() => onAdded(dep)}
                                    />
                                ))}
                            </>
                        ) : (
                            // Solo lectura: mostrar todos los departamentos del usuario
                            userDepartments.map(dep => (
                                <DepartmentBadgeComponent key={dep.id} department={dep.name} />
                            ))
                        )}
                    </div>
                ),
                showConfirmButton: true,
                confirmButtonText: 'Cerrar',
                showCancelButton: false,
                width: '600px',
            });
        } else {
            navigate('/profile');
        }
    };

    return (
        <span
            onClick={handleShowMore}
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
            + Mostrar más
        </span>
    );
};

export default ShowMoreDepartmentBadgeComponent;
