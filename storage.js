const STORAGE_KEY = 'nico_chat_history';

export const StorageManager = {
    getHistory() {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error('Geçmiş okunamadı:', e);
            return [];
        }
    },

    saveHistory(history) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
        } catch (e) {
            console.error('Geçmiş kaydedilemedi:', e);
        }
    },

    clearHistory() {
        try {
            localStorage.removeItem(STORAGE_KEY);
        } catch (e) {
            console.error('Geçmiş temizlenemedi:', e);
        }
    }
};
