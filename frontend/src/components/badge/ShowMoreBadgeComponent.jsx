import React from "react";
import ReactDOM from "react-dom/client";
import Swal from "sweetalert2";

import BadgeComponent from "./BadgeComponent";
import AddBadgeComponent from "./AddBadgeComponent";
import RemovableBadgeComponent from "./RemovableBadgeComponent";
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../hooks/UseTheme';

/**
* Badge para mostrar "Mostrar más" 
* @param {Object} currentUser usuario actual
* @param {Object} user usuario al que se le muestran los departamentos
* @param {boolean} canModify Indica si el usuario puede modificar
* @param {String} objType Cadena para aplicar en los menús
* @param {Array} userObjects Lista de objetos del usuario // departamento -> [{id, name}] || enlace -> [{id, name, web}]
* @param {Array} availableObjs Lista de objetos libres // departamento -> [{id, name}] || enlace -> [{id, name, web}]
* @param {Function} onAdded Callback cuando se agrega un departamento
* @param {Function} onDeleted Callback cuando se elimina un departamento
*/
const ShowMoreDepartmentBadgeComponent = ({
    currentUser,
    user,
    canModify,
    objType,
    userObjects = [],
    availableObjs = [],
    onAdded,
    onDeleted,
}) => {
    const navigate = useNavigate();
    const { darkMode } = useTheme();

    const handleShowMore = () => {
        if (currentUser.id !== user.id || objType === "enlace") {
            Swal.fire({
                title: objType === "departamento" ? `<strong>Departamentos de ${user.username}</strong>` : `<strong>Enlaces de ${user.name}</strong>`,
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
                                    backgroundColor: darkMode ? '#060606' : '#f9f9f9',
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
                                                darkMode={darkMode}
                                                onDelete={async () => {
                                                    await onDeleted(obj);
                                                    userObjects = userObjects.filter(o => o.id !== obj.id);
                                                    availableObjs = [...availableObjs, obj];
                                                    handleShowMore();       
                                                }}
                                            />
                                        ))}
                                        <AddBadgeComponent
                                            availableObjs={availableObjs}
                                            objType={objType}
                                            darkMode={darkMode}
                                            onAdded={async (obj) => {
                                                await onAdded(obj); 
                                                availableObjs = availableObjs.filter(d => d.id !== obj.id);
                                                userObjects = [...userObjects, obj];
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
                theme: darkMode ? "dark" : "",
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
                backgroundColor: "#9CC2CF",
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
