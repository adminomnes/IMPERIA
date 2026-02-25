// DB Module for IMPERIA
// Uses LocalStorage to simulate a persistence layer

const STORAGE_KEY = 'imperia_artists';

export const db = {
    getArtists: () => {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    },

    saveArtist: (artist) => {
        const artists = db.getArtists();
        const newArtist = {
            id: Date.now(),
            ...artist,
            status: 'pendiente', // Initial state
            category: 'none',   // None assigned yet
            createdAt: new Date().toISOString()
        };
        artists.push(newArtist);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(artists));
        return newArtist;
    },

    updateArtistStatus: (id, status, category) => {
        const artists = db.getArtists();
        const index = artists.findIndex(a => a.id === id);
        if (index !== -1) {
            artists[index].status = status;
            if (category) artists[index].category = category;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(artists));
            return true;
        }
        return false;
    },

    getPublicArtists: () => {
        return db.getArtists().filter(a => a.status === 'aprobado');
    },

    deleteArtist: (id) => {
        const artists = db.getArtists();
        const filtered = artists.filter(a => a.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    }
};
