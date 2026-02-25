// Admin JS for IMPERIA
import { db } from './modules/db.js';

document.addEventListener('DOMContentLoaded', () => {
    const loginScreen = document.getElementById('login-screen');
    const loginBtn = document.getElementById('login-btn');
    const adminPass = document.getElementById('admin-pass');
    const loginError = document.getElementById('login-error');
    const adminTbody = document.getElementById('admin-tbody');

    // Simple password check (for demo purposes)
    const ADMIN_PASSWORD = 'admin';

    loginBtn.addEventListener('click', () => {
        if (adminPass.value === ADMIN_PASSWORD) {
            loginScreen.style.display = 'none';
            renderApplications();
        } else {
            loginError.style.display = 'block';
        }
    });

    function renderApplications() {
        const artists = db.getArtists();

        if (artists.length === 0) {
            adminTbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: #666;">No hay postulaciones registradas.</td></tr>';
            return;
        }

        adminTbody.innerHTML = artists.map(artist => `
            <tr>
                <td><strong>${artist.artistName}</strong></td>
                <td>${artist.realName}</td>
                <td>${artist.specialty}</td>
                <td>
                    <span class="status-badge status-${artist.status}">
                        ${artist.status.toUpperCase()}
                    </span>
                </td>
                <td class="admin-actions">
                    ${artist.status === 'pendiente' ? `
                        <button class="btn-sm btn-approve" onclick="window.updateStatus(${artist.id}, 'aprobado', 'Academy')">Aprobar</button>
                        <button class="btn-sm btn-reject" onclick="window.updateStatus(${artist.id}, 'rechazado')">Rechazar</button>
                    ` : ''}
                    <button class="btn-sm btn-delete" onclick="window.deleteArtist(${artist.id})">Eliminar</button>
                </td>
            </tr>
        `).join('');
    }

    // Expose functions to window for onclick handlers
    window.updateStatus = (id, status, category) => {
        db.updateArtistStatus(id, status, category);
        renderApplications();
    };

    window.deleteArtist = (id) => {
        if (confirm('¿Estás seguro de eliminar esta postulación?')) {
            db.deleteArtist(id);
            renderApplications();
        }
    };
});
