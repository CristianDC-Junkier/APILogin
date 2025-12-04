import Swal from "sweetalert2";
import '../../styles/component/ComponentsDark.css';

/**
 * Componente que permite crear o modificar un enlace mediante un modal de SweetAlert2.
 * 
 * @param {Object} props - Propiedades del componente.
 * @param {Object} [props.linkItem] - Objeto enlace a modificar (si action === "modify")
 * @param {string} props.action - create o modify
 * @param {boolean} props.darkMode - booleano que indica si el Modo Oscuro está activo
 * @param {Function} props.onConfirm - Callback que se ejecuta al confirmar los datos, recibe { formValues }.
 * @returns
 */
const AddModifyLinkComponent = async ({ linkItem, action, darkMode, onConfirm }) => {

    const swalHtml = `
        <style>
            .swal-grid {
                display: flex;
                flex-direction: column;
                gap: 1rem;
                width: 100%;
            }

            .swal-row-first {
                    display: grid;
                    grid-template-columns: 25% 75%;
                    gap: 1rem;
                    width: 96%;

                    align-content: center;
                    justify-items: start;
                    align-items: baseline;
                    justify-content: space-evenly;
            }

            .swal-row-second {
                display: grid;
                grid-template-columns: 25% 75%;
                gap: 1rem;
                width: 100%;
            }

            @media(max-width: 500px){
                .swal-row-first {
                    grid-template-columns: 1fr;
                }
                .swal-row-second {
                    grid-template-columns: 1fr;
                }
            }

            .swal-label {
                font-weight: 600;
                margin-top: 8px;
                display: block;
            }

            .swal-input, .swal-textarea {
                width: 100%;
                padding: 0.45rem;
                border: 1px solid #ccc;
                border-radius: 6px;
                font-size: 0.95rem;
            }

            .swal-textarea {
                height: 90px;
                resize: vertical;
            }

            #img-preview {
                max-width: 140px;
                max-height: 100px;
                border-radius: 6px;
                margin-top: 8px;
                object-fit: cover;
                display: block;
            }

            .img-wrapper {
                display: flex;
                justify-content: center;
                width: 100%;
            }

            .swal-small {
                font-size: 0.75rem;
                text-align: right;
                color: #555;
            }
        </style>


            <div class="swal-grid">

            <!-- Fila Nombre -->
            <div class="swal-row-first">
                <label class="swal-label">Nombre <span style="color:red">*</span></label>
                <input id="swal-name" class="swal-input ${darkMode ? "input_dark" : ""}" type="text" placeholder="Nombre" value="${linkItem?.name || ''}" />
            </div>

            <!-- Fila Dirección -->
            <div class="swal-row-first">
                <label class="swal-label">Dirección <span style="color:red">*</span></label>
                <input id="swal-web" class="swal-input ${darkMode ? "input_dark" : ""}" type="text" placeholder="Dirección web" value="${linkItem?.web || ''}" />
            </div>

            <!-- Imagen -->
            <div class="swal-row-second" style="grid-template-columns: 1fr;">
                <div>
                    <label class="swal-label">Imagen</label>
                    <button id="btn-img" class="swal-input ${darkMode ? "button_dark" : ""}" style="cursor:pointer;">Seleccionar Imagen</button>
                    <input id="swal-img" type="file" accept="image/*" style="display:none;">

                    <div class="img-wrapper">
                        <img id="img-preview" 
                            src="${linkItem?.image ? `/IDEE-Almonte/i-links/${linkItem.image}` : ''}" 
                            style="${linkItem?.image ? '' : 'display:none;'}" />
                    </div>
                </div>
            </div>

            <!-- Descripción -->
            <div class="swal-row-second" style="grid-template-columns: 1fr;">
                <div>
                    <label class="swal-label">Descripción</label>
                    <textarea id="swal-desc" class="swal-textarea ${darkMode ? "input_dark" : ""}">${linkItem?.description || ''}</textarea>
                    <div id="char-counter" class="swal-small">${(linkItem?.description?.length || 0)}/128</div>
                </div>
            </div>

        </div>`;

    const swal = await Swal.fire({
        title: action === "create" ? "Crear Enlace" : "Modificar Enlace",
        html: swalHtml,
        width: "600px",
        showCancelButton: true,
        confirmButtonText: action === "create" ? "Crear" : "Modificar",
        theme: darkMode ? "dark" : "",
        didRender: () => {
            const fileInput = document.getElementById("swal-img");
            const btnImg = document.getElementById("btn-img");
            const preview = document.getElementById("img-preview");
            const textarea = document.getElementById("swal-desc");
            const counter = document.getElementById("char-counter");

            // imagen
            btnImg.onclick = () => fileInput.click();
            fileInput.onchange = () => {
                const file = fileInput.files[0];
                if (!file) return;
                preview.src = URL.createObjectURL(file);
                preview.style.display = "block";
            };

            // contador
            textarea.oninput = () => {
                counter.innerText = `${textarea.value.length}/128`;
                counter.style.color = textarea.value.length > 128 ? "red" : "";
            };
        },
        preConfirm: () => {
            const name = document.getElementById("swal-name").value.trim();
            const web = document.getElementById("swal-web").value.trim();
            const description = document.getElementById("swal-desc").value.trim();
            const image = document.getElementById("swal-img").files[0] || null;

            if (!name) return Swal.showValidationMessage("El nombre es obligatorio");
            if (!web) return Swal.showValidationMessage("La dirección es obligatoria");
            if (description.length > 128) return Swal.showValidationMessage("Máximo 128 caracteres en descripción");

            return { name, web, description, imageFile: image };
        }
    });

    if (!swal.value) return;
    onConfirm(swal.value);
};

export default AddModifyLinkComponent;
