import Swal from "sweetalert2";
import { getAllLinks } from "../../services/LinkService";


/**
 * Componente que permite crear o modificar un usuario mediante un modal de SweetAlert2.
 * 
 * @param {Object} props
 * @param {string} props.token - Token de autenticación del usuario actual.
 * @param {Object} [props.userItem] - Usuario a modificar (si action === "modify").
 * @param {Object} props.currentUser - Usuario que está realizando la acción.
 * @param {string} props.action - "create" o "modify".
 * @param {Function} props.onConfirm - Callback que se ejecuta al confirmar los datos, recibe { userAccount, userData, userAccountId? }.
 */
const AddDeleteLinkToDepartmentComponent = async ({ token, depItem, currentUser, action, onConfirm }) => {

    const lResp = await getAllLinks(token);

    let links = [];
    if (lResp.success) {
        links = lResp.data.links;
        links.unshift({ id: null, name: "-- Seleccionar --" });
    }

    const linkOptions = links.map(l => `<option value="${l.id}" >${l.name}</option>`).join("");

    // Estilos
    const rowStyle = 'display:flex; align-items:center; margin-bottom:1rem; font-size:1rem;';
    const labelStyle = 'width:180px; font-weight:bold; text-align:left;';
    const inputStyle = 'flex:1; padding:0.35rem; font-size:1rem; border:1px solid #ccc; border-radius:4px;';

    const stepHtml = `
    <div>
        <div style="${rowStyle}">
            <label style="${labelStyle}">Enlaces</label>
            <select id="swal-link" style="${inputStyle}">${linkOptions}</select>
        </div>
        <div style="font-size:0.75rem; color:red; text-align:right;">* Campos obligatorios</div>
    </div>`;

    const swalStep = await Swal.fire({
        title: action === "delete" ? "Elminar Enlace" : "Añadir Enlace",
        html: stepHtml,
        focusConfirm: false,
        width: '600px',
        showCancelButton: true,
        cancelButtonText: "Cancelar",
        confirmButtonText: "Confirmar",
        preConfirm: () => {
            const linkIdRaw = document.getElementById("swal-link").value;
            const linkId = linkIdRaw === "null" ? null : parseInt(linkIdRaw, 10);

            return { linkId };
        }
    });

    if (!swalStep.value) return;
    const stepValues = swalStep.value;

    onConfirm(stepValues);
};

export default AddDeleteLinkToDepartmentComponent;