import Swal from "sweetalert2";
import "../../styles/component/ComponentsDark.css"

/**
 * Componente para modificar usuario: solo permite cambiar username, password y usertype.
 *
 * @param {Object} props
 * @param {Object} props.profile - Usuario a modificar
 * @param {Function} props.onConfirm - Callback que recibe { username, oldPassword, newPassword, usertype }
 */
const ModifyUserAccountComponent = async ({ profile, darkMode, onConfirm }) => {
    const isAdmin = ["ADMIN", "SUPERADMIN"].includes(profile?.usertype);

    // Estilos inline
    const rowStyle = "display:flex; align-items:center; margin-bottom:1rem; font-size:1rem;";
    const labelStyle = "width:180px; font-weight:bold; text-align:left;";
    const inputStyle = "flex:1; padding:0.35rem; font-size:1rem; border:1px solid #ccc; border-radius:4px;";

    // Opciones de usertype
    const usertypeOptions = `
    <option value="USER" ${profile?.usertype === "USER" ? "selected" : ""}>Usuario</option>
    <option value="DEPARTMENT" ${profile?.usertype === "DEPARTMENT" ? "selected" : ""}>Jefe de departamento</option>
    <option value="ADMIN" ${profile?.usertype === "ADMIN" ? "selected" : ""}>Admin</option>
    ${profile?.usertype === "SUPERADMIN" ? `<option value="SUPERADMIN" selected>Superadmin</option>` : ""}
  `;

    const stepHtml = `
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" rel="stylesheet">
    <div style="margin-top:5vh">
      <div style="${rowStyle}">
        <label style="${labelStyle}">Usuario <span style="color:red">*</span></label>
        <input id="swal-username" style="${inputStyle}" class="${darkMode ? "input_dark" : ""}" placeholder="Usuario" value="${profile?.username || ""}">
      </div>

      <div style="${rowStyle}">
        <label style="${labelStyle}">Contraseña actual <span style="color:red">*</span></label>
        <div style="flex:1; display:flex; align-items:center;">
          <input id="swal-oldpassword" type="password" style="flex:1; ${inputStyle}" class="${darkMode ? "input_dark" : ""}" placeholder="Contraseña actual">
          <button type="button" id="toggle-old" style="margin-left:4px; border:none; background:transparent; cursor:pointer; width:36px; display:flex; justify-content:center; align-items:center;">
            <i id="icon-old" class="fas fa-eye-slash" ${darkMode ? 'style="color:white;"' : ''}></i>
          </button>
        </div>
      </div>

      <div style="${rowStyle}">
        <label style="${labelStyle}">Nueva contraseña <span style="color:red">*</span></label>
        <div style="flex:1; display:flex; align-items:center;">
          <input id="swal-newpassword" type="password" style="flex:1; ${inputStyle}" class="${darkMode ? "input_dark" : ""}" placeholder="Nueva contraseña">
          <button type="button" id="toggle-new" style="margin-left:4px; border:none; background:transparent; cursor:pointer; width:36px; display:flex; justify-content:center; align-items:center;">
            <i id="icon-new" class="fas fa-eye-slash" ${darkMode ? 'style="color:white;"' : ''}></i>
          </button>
        </div>
      </div>

      ${isAdmin ? `
        <div style="${rowStyle}">
          <label style="${labelStyle}">Tipo de Usuario <span style="color:red">*</span></label>
          <select id="swal-usertype" style="${inputStyle}" ${profile?.id === 1 ? "disabled" : ""} class="${darkMode ? "input_dark" : ""}">
            ${usertypeOptions}
          </select>
        </div>
      ` : ""}

      <div style="font-size:0.75rem; color:red; text-align:right;">* Campos obligatorios</div>
    </div>
  `;

    const swalStep = await Swal.fire({
        title: "Modificar Perfil",
        html: stepHtml,
        focusConfirm: false,
        width: "600px",
        showCancelButton: true,
        cancelButtonText: "Cancelar",
        confirmButtonText: "Aceptar",
        theme: darkMode ? "dark" : "",
        didOpen: () => {
            const oldPwdInput = document.getElementById("swal-oldpassword");
            const newPwdInput = document.getElementById("swal-newpassword");
            const toggleOld = document.getElementById("toggle-old");
            const toggleNew = document.getElementById("toggle-new");
            const iconOld = document.getElementById("icon-old");
            const iconNew = document.getElementById("icon-new");

            toggleOld.addEventListener("click", () => {
                const isHidden = oldPwdInput.type === "password";
                oldPwdInput.type = isHidden ? "text" : "password";
                iconOld.className = isHidden ? "fas fa-eye" : "fas fa-eye-slash";
            });
            toggleNew.addEventListener("click", () => {
                const isHidden = newPwdInput.type === "password";
                newPwdInput.type = isHidden ? "text" : "password";
                iconNew.className = isHidden ? "fas fa-eye" : "fas fa-eye-slash";
            });
        },
        preConfirm: () => {
            const username = document.getElementById("swal-username").value.trim();
            const oldPassword = document.getElementById("swal-oldpassword").value.trim();
            const newPassword = document.getElementById("swal-newpassword").value.trim();
            const result = { username, oldPassword, newPassword };

            if (!username) Swal.showValidationMessage("El nombre de usuario es obligatorio");
            else if (!oldPassword) Swal.showValidationMessage("La contraseña actual es obligatoria");
            else if (!newPassword) Swal.showValidationMessage("La nueva contraseña es obligatoria");

            if (isAdmin) {
                const usertype = document.getElementById("swal-usertype")?.value;
                if (!usertype) Swal.showValidationMessage("El tipo de usuario es obligatorio");
                result.usertype = usertype;
            }

            return result;
        }
    });

    if (!swalStep.value) return;

    onConfirm(swalStep.value);
};

export default ModifyUserAccountComponent;
