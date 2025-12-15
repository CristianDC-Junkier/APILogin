import React from "react";
import { CardBody, Button } from "reactstrap";
import logo from "../../assets/ayto_almonte_notext.png";
import { useNavigate } from "react-router-dom";

const MIN_CARD_HEIGHT = 300;
const IMG_HEIGHT = 125;

/**
 * Componente para crear una Card animada para representar los enlaces
 * 
 * @param {Object} props - Propiedades del componente.
 * @param {string} props.title - Nombre del enlace
 * @param {string} props.web - Dirección del enlace
 * @param {string} props.desc - Descripción de la página web del enlace
 * @param {string} props.img - Nombre del archivo de imagen asociado al enlace
 * @param {boolean} props.darkMode - booleano que indica si el Modo Oscuro está activo
 * @returns
 */
const AnimatedCard = ({ title, web, desc, img, darkMode }) => {
    const navigate = useNavigate();

    return (
        <div
            className="animated-card"
            style={{
                width: "100%",
                minHeight: `${MIN_CARD_HEIGHT}px`,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                padding: "15px",
                background: darkMode ? "rgba(30,30,30,0.8)" : "rgba(255,255,255,0.8)",
                borderRadius: "12px",
                border: darkMode ? "1px solid rgba(205,205,205,0.1)" : "1px solid rgba(0,0,0,0.1)",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                overflow: "hidden",
            }}
        >

            {/* Imagen */}
            <div
                style={{
                    height: `${IMG_HEIGHT}px`,
                    overflow: "hidden",
                    borderRadius: "8px 8px 0 0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderBottom: darkMode
                        ? "1px solid rgba(255,255,255,0.4)"
                        : "1px solid rgba(0,0,0,0.3)",
                    marginBottom: "10px",
                }}
            >
                <img
                    src={img ? `/IDEE-Almonte/i-links/${img}` : logo}
                    alt={title}
                    style={{
                        maxHeight: "92%",
                        width: "auto",
                        objectFit: "contain",
                    }}
                />
            </div>

            {/* Contenido */}
            <CardBody style={{ flex: 1, display: "flex", flexDirection: "column",  }}>
                <h5 style={{ color: darkMode ? "white" : "#222", marginBottom: "5px", fontWeight: 700, margin: 0, fontSize: "clamp(0.9rem, 1.9vw, 1.25rem)" }}>
                    {title}
                </h5>

                {desc && (
                    <p style={{
                        opacity: 0.8,
                        color: darkMode ? "white" : "#222",
                        fontSize: "clamp(0.75rem, 1.00vw, 1.0rem)",
                        marginBottom: "10px",
                    }}>
                        {desc}
                    </p>
                )}

                <Button
                    size="sm"
                    color="primary"
                    style={{
                        width: "100%",
                        borderRadius: "8px",
                        fontWeight: "bold",
                        transition: "all 0.2s ease",
                        marginTop: "auto",
                    }}
                    onClick={(e) => {
                        e.stopPropagation();
                        navigate("/web", { state: { url: web, name: title } });
                    }}
                >
                    Entrar
                </Button>
            </CardBody>

            {/* Animación válida en React */}
            <style>
                {`
                .animated-card {
                    transform: scale(0.98);
                }
                .animated-card:hover {
                    transform: scale(1);
                    box-shadow: 0 8px 20px rgba(0,0,0,0.2);
                }
                `}
            </style>
        </div>
    );
};

export default AnimatedCard;
