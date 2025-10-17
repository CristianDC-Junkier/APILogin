import React from "react";
import ReactDOM from "react-dom/client";
import Swal from "sweetalert2";

import BadgeComponent from "./BadgeComponent";
import AddBadgeComponent from "./AddBadgeComponent";
import RemovableBadgeComponent from "./RemovableBadgeComponent";
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
            Swal.fire({
                title: `<strong>Departamentos de ${user.username}</strong>`,
                html: `<div id="departments-container"></div>`,
                didOpen: () => {
                    const container = document.getElementById('departments-container');
                    if (container) {
                        const root = ReactDOM.createRoot(container);
                        root.render(
                            <div
                                style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: '4px',
                                    maxHeight: '300px',
                                    overflowY: 'auto',
                                    minHeight: '200px',  
                                    padding: '12px',
                                    borderRadius: '12px',
                                    backgroundColor: '#f9f9f9',
                                    alignItems: 'flex-start',
                                    boxShadow: 'inset 0 0 10px rgba(0,0,0,0.05)',
                                }}
                            >
                                {canModify ? (
                                    <>
                                        {userDepartments.map(dep => (
                                            <RemovableBadgeComponent
                                                key={dep.id}
                                                objName={dep.name}
                                                objType="departamento"
                                                onDelete={async () => {
                                                    await onDeleted(dep);
                                                    userDepartments = userDepartments.filter(d => d.id !== dep.id);
                                                    availableDepartments = [...availableDepartments, dep];
                                                    handleShowMore(); 
                                                }}
                                            />
                                        ))}
                                        <AddBadgeComponent
                                            availableObjs={availableDepartments}
                                            objType="departamento"
                                            onAdded={async (dep) => {
                                                await onAdded(dep);
                                                const addedDep = departments.find(d => d.id === Number(dep.id));
                                                availableDepartments = availableDepartments.filter(d => d.id !== dep.id);
                                                userDepartments = [...userDepartments, addedDep];
                                                handleShowMore(); 
                                            }}
                                        />
                                    </>
                                ) : (
                                    userDepartments.map(dep => (
                                        <BadgeComponent key={dep.id} objName={dep.name} />
                                    ))
                                )}
                            </div>
                        );
                    }
                },
                showConfirmButton: true,
                confirmButtonText: 'Cerrar',
                width: '600px',
                buttonsStyling: true,
            });
        }
        else {
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
