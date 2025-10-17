import React from "react";
import ReactDOM from "react-dom/client";
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


    let availableDepartments = departments.filter(
        d => !userDepartments.some(ud => ud.id === d.id)
    );

    const handleShowMore = () => {
        if (currentUser.id !== user.id) {
            console.log("Show more departments for user:", user);
            console.log("Current user:", currentUser);
            console.log("Can modify:", canModify);
            console.log("User departments:", userDepartments);
            console.log("All departments:", departments);
            console.log("Available departments:", availableDepartments);
            Swal.fire({
                title: 'Departamentos',
                html: '<div id="departments-container"></div>',
                didOpen: () => {
                    const container = document.getElementById('departments-container');
                    if (container) {
                        const root = ReactDOM.createRoot(container);
                        root.render(
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                {canModify ? (
                                    <>
                                        {userDepartments.map(dep => (
                                            <RemovableDepartmentBadgeComponent
                                                key={dep.id}
                                                department={dep.name}
                                                onDelete={async () => {
                                                    await onDeleted(dep);
                                                    userDepartments = userDepartments.filter(d => d.id !== dep.id);
                                                    availableDepartments = [...availableDepartments, dep];
                                                    handleShowMore();       
                                                }}
                                            />
                                        ))}
                                        <AddDepartmentBadgeComponent
                                            availableDepartments={availableDepartments}
                                            onAdded={async (depId) => {
                                                await onAdded(depId); // PODRIAMOS CAMBIAR EL ADDED PARA QUE DEVUELVA EL DEPARTAMENTO COMPLETO
                                                const addedDep = departments.find(d => d.id === Number(depId));
                                                availableDepartments = availableDepartments.filter(d => d.id !== depId);
                                                userDepartments = [...userDepartments, addedDep];
                                                handleShowMore();       
                                            }}

                                        />
                                    </>
                                ) : (
                                    userDepartments.map(dep => (
                                        <DepartmentBadgeComponent key={dep.id} department={dep.name} />
                                    ))
                                )}
                            </div>
                        );
                    }
                },
                showConfirmButton: true,
                confirmButtonText: 'Cerrar',
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
