import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default () => {

    return defineConfig({
        plugins: [react()],
        server: {
            port: 61939,
            proxy: {
                '/IDEE-Almonte/api': {
                    target: 'http://localhost:5000',
                    changeOrigin: true,
                    secure: false,
                },
                '/IDEE-Almonte/i-links': {
                    target: 'http://localhost:5000',
                    changeOrigin: true,
                    secure: false,
                },
            },
        },
        base: '/IDEE-Almonte',
    });
};
