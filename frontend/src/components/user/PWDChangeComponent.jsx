import React, { useEffect } from "react";
import Swal from "sweetalert2";
import { changePasswordPWD } from "../../services/UserService";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useTheme } from '../../hooks/UseTheme';

import "../../styles/component/ComponentsDark.css"

/**
 * Componente encargado de mostrar y gestionar el marcar a un usuario para cambio de contraseña
 * @param {Object} user - Usuario que va a ser marcado
 * @returns
 */
const PWDChangeComponent = ({ user }) => {
    const { update, logout } = useAuth();
    const navigate = useNavigate();
    const { darkMode } = useTheme();

    useEffect(() => {
        const askPassword = async () => {
            const rowStyle = "display:flex; align-items:center; margin-bottom:1rem; font-size:1rem;";
            const labelStyle = "width:150px; font-weight:bold; text-align:left;";
            const inputStyle = "flex:1; padding:0.35rem; font-size:1rem; border:1px solid #ccc; border-radius:4px;";

            const { value: password } = await Swal.fire({
                title: "Cambio de contraseña",
                html: `
                    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" rel="stylesheet">
                    <p style="margin-bottom:1rem;">Ingrese la nueva contraseña para <strong>${user.username}</strong>:</p>
                    <div style="${rowStyle}">
                        <label style="${labelStyle}">Contraseña</label>
                        <div style="flex:1; display:flex; align-items:center;">
                            <input id="swal-password" type="password" style="${inputStyle}" class="${darkMode ? "input_dark" : ""}" placeholder="Nueva contraseña" />
                            <button id="toggle-pass" type="button" style="margin-left:4px; border:none; background:transparent; cursor:pointer; display:flex; align-items:center; justify-content:center; width:32px; height:32px;">
                                <i id="icon-pass" class="fas fa-eye-slash" style="font-size:1rem; ${darkMode ? "color: white;" : ""}"></i>
                            </button>
                        </div>
                    </div>
                `,
                showCancelButton: false, 
                confirmButtonText: "Confirmar",
                width: 500,
                focusConfirm: false,
                allowOutsideClick: false,
                allowEscapeKey: false,
                allowEnterKey: true,
                showCloseButton: false,
                theme: darkMode ? "dark" : "",
                preConfirm: () => {
                    const input = document.getElementById("swal-password");
                    const value = input.value.trim();
                    if (!value) Swal.showValidationMessage("La contraseña no puede estar vacía");
                    return value || false;
                },
                didOpen: () => {
                    const input = document.getElementById("swal-password");
                    const toggle = document.getElementById("toggle-pass");
                    const icon = document.getElementById("icon-pass");
                    toggle.addEventListener("click", () => {
                        const isHidden = input.type === "password";
                        input.type = isHidden ? "text" : "password";
                        icon.className = isHidden ? "fas fa-eye" : "fas fa-eye-slash";
                    });
                    input.focus();
                },
            });

            if (password) {
                const res = await changePasswordPWD({ newPassword: password }, user.version);

                if (res.success) {
                    update({ ...user, forcePwdChange: false });
                    await Swal.fire({ title: "¡Éxito!", text: "Contraseña actualizada correctamente", icon: "success", theme: darkMode ? "dark" : "" });
                } else {
                    await Swal.fire({ title: "Error", text: res.error || "No se pudo cambiar la contraseña", icon: "error", theme: darkMode ? "dark" : "" });
                    await logout();
                    navigate("/login", { replace: true });
                }
            }
        };

        askPassword();
    }, [user, update, logout, navigate, darkMode]);

    return null; // No renderiza nada
};

export default PWDChangeComponent;
