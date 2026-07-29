// NICO Hafıza ve Depolama Yönetimi

const StorageManager = {
    // Kullanıcı oturum bilgisini kaydetme
    saveUserSession(userIdentifier) {
        localStorage.setItem('nico_active_user', userIdentifier);
        localStorage.setItem('nico_login_time', new Date().toISOString());
    },

    // Aktif kullanıcıyı alma
    getActiveUser() {
        return localStorage.getItem('nico_active_user');
    },

    // Sohbet geçmişini yerel hafızaya (Local Storage) kaydetme
    saveMessage(user, sender, text) {
        const historyKey = `nico_chat_${user}`;
        let history = JSON.parse(localStorage.getItem(historyKey)) || [];
        
        history.push({
            sender: sender,
            text: text,
            timestamp: new Date().toLocaleTimeString()
        });

        localStorage.setItem(historyKey, JSON.stringify(history));
    },

    // Kayıtlı sohbet geçmişini yükleme
    loadHistory(user) {
        const historyKey = `nico_chat_${user}`;
        return JSON.parse(localStorage.getItem(historyKey)) || [];
    },

    // Oturumu kapatma / verileri temizleme
    clearSession() {
        const user = this.getActiveUser();
        if(user) {
            localStorage.removeItem(`nico_chat_${user}`);
        }
        localStorage.removeItem('nico_active_user');
        localStorage.removeItem('nico_login_time');
    }
};

export default StorageManager;
            
