import Swal from "sweetalert2";
import '../../styles/component/ComponentsDark.css';

/**
 * Componente que permite crear o modificar un departamento mediante un modal de SweetAlert2.
 * 
 * @param {Object} props
 * @param {Object} [props.depItem] - Departamento a modificar (si action === "modify").
 * @param {string} props.action - "create" o "modify".
 * @param {boolean} props.darkMode - booleano que indica si el Modo Oscuro está activo
 * @param {Function} props.onConfirm - Callback que se ejecuta al confirmar los datos, recibe { formValues }.
 */
const AddModifyDepartmentComponent = async ({ depItem, action, darkMode, onConfirm }) => {

    const rowStyle = "display:flex; align-items:center; margin-top:1rem; margin-bottom:1rem; font-size:1rem;";
    const labelStyle = "width:150px; font-weight:bold; text-align:left;";
    const inputStyle = "flex:1; padding:0.35rem; font-size:1rem; border:1px solid #ccc; border-radius:4px;";

    const stepHtml = `
            <div style="${rowStyle}">
               <label style="${labelStyle}">Nombre del Departamento</label>
                <div style="flex:1; display:flex; align-items:center;">
                    <input id="swal-name" type="text" style="${inputStyle}" class="${darkMode ? "input_dark" : ""}" placeholder="Nombre" value="${depItem?.name ? depItem?.name : ""}"/>
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
        theme: darkMode ? "dark" : "",
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
