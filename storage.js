const STORAGE_KEY = "nico_chat_history_v2";

function saveData(value){
    let history = getHistory();
    history.push({ value: value, time: new Date().toLocaleString() });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

function getHistory(){
    let data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
}

function clearHistory(){
    localStorage.removeItem(STORAGE_KEY);
}
