import Swal from "sweetalert2";
/**
 * Componente que permite crear o modificar un link mediante un modal de SweetAlert2.
 * 
 * @param {Object} props
 * @param {Object} [props.linkItem] - Enlace a modificar (si action === "modify").
 * @param {string} props.action - "create" o "modify".
 * @param {Function} props.onConfirm - Callback que se ejecuta al confirmar los datos, recibe { formValues }.
 */
const AddModifyLinkComponent = async ({ linkItem, action, onConfirm }) => {

    const rowStyle = "display:flex; align-items:center; margin-top:1rem; margin-bottom:1rem; font-size:1rem;";
    const labelStyle = "width:150px; font-weight:bold; text-align:left;";
    const inputStyle = "flex:1; padding:0.35rem; font-size:1rem; border:1px solid #ccc; border-radius:4px;";

    const stepHtml = `
            <div style="${rowStyle}">
               <label style="${labelStyle}">Nombre del Enlace</label>
                <div style="flex:1; display:flex; align-items:center;">
                    <input id="swal-name" type="text" style="${inputStyle}" placeholder="Nombre" value="${linkItem?.name ? linkItem?.name : ""}"/>
                </div>
            </div>
            <div style="${rowStyle}">
               <label style="${labelStyle}">Dirección del Enlace</label>
                <div style="flex:1; display:flex; align-items:center;">
                    <input id="swal-web" type="text" style="${inputStyle}" placeholder="Dirección Web" value="${linkItem?.web ? linkItem?.web : ""}"/>
                </div>
            </div>
        `;

    const swalStep = await Swal.fire({
        title: action === "create" ? "Crear Enlace" : "Modificar Enlace",
        html: stepHtml,
        focusConfirm: false,
        width: '600px',
        showCancelButton: true,
        cancelButtonText: "Cancelar",
        confirmButtonText: action === "create" ? "Crear" : "Modificar",
        preConfirm: () => {
            const name = document.getElementById("swal-name").value.trim();
            const web = document.getElementById("swal-web").value.trim();
            if (!name) { Swal.showValidationMessage("El nombre no puede estar vacío"); return false; }
            if (!web) { Swal.showValidationMessage("La dirección no puede estar vacía"); return false; }

            return { name, web };
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

export default AddModifyLinkComponent;
