import React from "react";

/**
 * Componente encargado de crear los objetos que populan el menú lateral de la página Home
 * 
 * @param {Object} props - Propiedades del componente.
 * @param {Object} props.icon - Icono de FontAwesomeIcon para el objeto
 * @param {string} props.text - Texto para el objeto
 * @param {function} props.onClick - Callback que determina el comportamiento del objeto al hacerle click
 * @param {boolean} props.expanded - Booleano que determina el estado del menú lateral
 * @param {boolean} props.darkMode - booleano que indica si el Modo Oscuro está activo
 * @returns
 */
const SidebarItem = ({ icon, text, onClick, expanded, darkMode }) => {
    return (
        <div
            onClick={onClick}
            style={{
                padding: "10px",
                marginBottom: "10px",
                borderRadius: "8px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                background: darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
                justifyContent: expanded ? "flex-start" : "center",
                height: "45px",
                transition: "all 0.3s",
            }}
            className="animated-side"
        >
            <span style={{ fontSize: "18px" }}>{icon}</span>
            <span style={{ display: expanded ? "inline-block" : "none", maxWidth: "150px" }}>{text}</span>

            <style jsx>{`
                .animated-side {
                  transform: scale(0.99);
                }
                .animated-side:hover  {
                  transform: scale(1);
                  box-shadow: 0 8px 20px rgba(0,0,0,0.2);
                }
            `}</style>
        </div>
    );
}

export default SidebarItem;
