import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: 'index.html',
                admin: 'admin.html',
                academy: 'academy.html',
                agency: 'agency.html',
                talentos: 'talentos.html',
                contacto: 'contacto.html',
            },
        },
    },
});
