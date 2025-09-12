/* eslint-disable no-unused-vars */
import { createRoot } from "react-dom/client";
import Swal from 'sweetalert2';
import CaptchaSlider from './CaptchaSliderComponent'; // ✅ ajusta la ruta

export const renderCaptchaSlider = () => {
    return new Promise((resolve, reject) => {
        const container = document.createElement("div");
        const reactRoot = createRoot(container);

        let completed = false; // bandera para saber si completó

        reactRoot.render(
            <CaptchaSlider
                onSuccess={() => {
                    completed = true;
                    resolve();       // acción del captcha
                    Swal.close();    // cierra el modal
                    setTimeout(() => reactRoot.unmount(), 0);
                }}
            />
        );

        Swal.fire({
            title: 'Completa el captcha',
            html: container,
            showConfirmButton: true,
            allowOutsideClick: false,
            preConfirm: () => {
                if (!completed) {
                    Swal.showValidationMessage('Debes completar el captcha antes de continuar');
                    return false;
                }
            }
        }).then((result) => {
            if (!completed) {
                reject(new Error('Captcha no completado'));
            }
        });
    });
};
