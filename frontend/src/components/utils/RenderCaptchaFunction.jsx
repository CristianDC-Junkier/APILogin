import { createRoot } from "react-dom/client";
import Swal from 'sweetalert2';
import CaptchaSlider from './CaptchaSliderComponent'; // ✅ asegúrate de ajustar la ruta

export const renderCaptchaSlider = (onSuccess) => {
    const container = document.createElement("div");
    const reactRoot = createRoot(container);

    // Renderiza el CaptchaSlider y cierra el modal al completar
    reactRoot.render(
        <CaptchaSlider
            onSuccess={() => {
                onSuccess();       // Acción del captcha
                Swal.close();      // Cierra el modal
                setTimeout(() => {
                    reactRoot.unmount(); // Limpia el DOM si es necesario
                }, 0);
            }}
        />
    );

    return {
        html: container,
        didOpen: () => {
            // Se puede usar para animaciones, foco, etc.
        }
    };
};