import Swal from "sweetalert2";
/**
 * Componente que permite crear o modificar un departameto mediante un modal de SweetAlert2.
 * 
 * @param {Object} props
 * @param {string} props.token - Token de autenticación del usuario actual.
 * @param {Object} [props.userItem] - Usuario a modificar (si action === "modify").
 * @param {Object} props.currentUser - Usuario que está realizando la acción.
 * @param {string} props.action - "create" o "modify".
 * @param {Function} props.onConfirm - Callback que se ejecuta al confirmar los datos, recibe { userAccount, userData, userAccountId? }.
 */
const AddModifyDepartmentComponent = async ({ depItem, action, onConfirm }) => {

    const rowStyle = "display:flex; align-items:center; margin-top:1rem; margin-bottom:1rem; font-size:1rem;";
    const labelStyle = "width:150px; font-weight:bold; text-align:left;";
    const inputStyle = "flex:1; padding:0.35rem; font-size:1rem; border:1px solid #ccc; border-radius:4px;";

    const stepHtml = `
            <div style="${rowStyle}">
               <label style="${labelStyle}">Nombre del Departamento</label>
                <div style="flex:1; display:flex; align-items:center;">
                    <input id="swal-name" type="text" style="${inputStyle}" placeholder="Nombre" value="${depItem?.name}"/>
                </div>
            </div>
        `;

    const swalStep = await Swal.fire({
        title: action === "create" ? "Crear Departamento" : "Modificar Departamento",
        html: stepHtml,
        focusConfirm: false,
        width: '600px',
        showCancelButton: true,
        cancelButtonText: "Cancelar",
        confirmButtonText: action === "create" ? "Crear" : "Modificar",
        preConfirm: () => {
            const name = document.getElementById("swal-name").value.trim();
            if (!name) {
                Swal.showValidationMessage("El nombre no puede estar vacío");
                return false;
            }
            return { name };
        }
    });

    if (!swalStep.value) return;
    const formValues = swalStep.value;

    if (action === "modify") {
        onConfirm( formValues );
    } else {
        onConfirm( formValues );
    }
};

export default AddModifyDepartmentComponent;
