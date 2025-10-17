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
* @param {String} objType Cadena para aplicar en los menús
* @param {Array} objList Lista completa de objetos // departamento -> [{id, name}] || enlace -> [{id, name, web}]
* @param {Array} userObjects Lista de objetos del usuario // departamento -> [{id, name}] || enlace -> [{id, name, web}]
* @param {Function} onAdded Callback cuando se agrega un departamento
* @param {Function} onDeleted Callback cuando se elimina un departamento
*/
const ShowMoreDepartmentBadgeComponent = ({
    currentUser,
    user,
    canModify,
    objType,
    objList = [],
    userObjects = [],
    onAdded,
    onDeleted,
}) => {
    const navigate = useNavigate();


    let availableObjects = objList.filter(
        o => !userObjects.some(uo => uo.id === o.id)
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
                                        {userObjects.map(obj => (
                                            <RemovableBadgeComponent
                                                key={obj.id}
                                                objName={obj.name}
                                                objType={objType}
                                                onDelete={async () => {
                                                    await onDeleted(obj);
                                                    userObjects = userObjects.filter(o => o.id !== obj.id);
                                                    availableObjects = [...availableObjects, obj];
                                                    handleShowMore();       
                                                }}
                                            />
                                        ))}
                                        <AddBadgeComponent
                                            availableObjs={availableObjects}
                                            objType={objType}
                                            onAdded={async (objId) => {
                                                await onAdded(objId); 
                                                const addedObj = objList.find(o => o.id === Number(objId));
                                                availableObjects = availableObjects.filter(d => d.id !== objId);
                                                userObjects = [...userObjects, addedObj];
                                                handleShowMore();       
                                            }}
                                        />
                                    </>
                                ) : (
                                    userObjects.map(obj => (
                                        <BadgeComponent key={obj.id} objName={obj.name} />
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
