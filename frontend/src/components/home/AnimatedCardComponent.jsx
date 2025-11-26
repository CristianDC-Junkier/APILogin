import React from "react";
import { CardBody, Button } from "reactstrap";
import logo from "../../assets/ayto_almonte_notext.png";
import { useNavigate } from "react-router-dom";

const CARD_HEIGHT = 365; // Altura total de la tarjeta
const IMG_HEIGHT = 175;  // Altura del contenedor de la imagen

const AnimatedCard = ({ title, web, desc, img, darkMode }) => {
    const navigate = useNavigate();

    return (
        <div
            style={{
                height: `${CARD_HEIGHT}px`,
                width: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                padding: "15px",
                background: darkMode ? "rgba(30,30,30,0.8)" : "rgba(255,255,255,0.8)",
                borderRadius: "12px",
                border: darkMode ? "1px solid rgba(205,205,205,0.1)" : "1px solid rgba(0,0,0,0.1)",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                overflow: "hidden",
            }}
            className= "animated-card">
            {/* Contenedor de la imagen */}
            <div
                style={{
                    height: `${IMG_HEIGHT}px`,
                    overflow: "hidden",
                    borderRadius: "8px 8px 0px 0px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderBottom: darkMode ? "1px solid rgba(256,256,256,0.5)" : "1px solid rgba(0,0,0,0.5)", 
                    marginBottom: "10px",
                }}
            >
                <img
                    src={img ? `/IDEE-Almonte/i-links/${img}` : logo}
                    alt={title}
                    style={{
                        maxHeight: "92%",
                        with: "auto",
                        objectFit: "contain",
                    }}
                />
            </div>

            {/* Contenido */}
            <CardBody style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                <h5 style={{ color: darkMode ? "white" : "#222", marginBottom: "5px" }}><strong>{title}</strong></h5>
                {desc && (
                    <p style={{ opacity: 0.8, color: darkMode ? "white" : "#222", fontSize: "0.85rem", marginBottom: "10px" }}>
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
                        navigate("/web", { state: { url: web } });
                    }}
                >
                    Entrar
                </Button>
            </CardBody>

            <style jsx>{`
                .animated-card {
                  transform: scale(0.98);
                }
                .animated-card:hover  {
                  transform: scale(1);
                  box-shadow: 0 8px 20px rgba(0,0,0,0.2);
                }
            `}</style>
        </div>
    );
};

export default AnimatedCard;
