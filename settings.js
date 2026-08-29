const settingsForm = document.getElementById("settingsForm");
const saveMessage = document.getElementById("saveMessage");
const settingIds = [
    "mapMode",
    "liveLocation",
    "areaLabels",
    "criticalAlerts",
    "shelterAlerts",
    "alertSound",
    "density",
    "autoRefresh"
];

function loadSettings() {
    settingIds.forEach(id => {
        const input = document.getElementById(id);
        const savedValue = localStorage.getItem(`sentinelmesh-${id}`);

        if (!input || savedValue === null) return;

        if (input.type === "checkbox") {
            input.checked = savedValue === "true";
        } else {
            input.value = savedValue;
        }
    });
}

settingsForm?.addEventListener("submit", event => {
    event.preventDefault();

    settingIds.forEach(id => {
        const input = document.getElementById(id);
        if (!input) return;

        const value = input.type === "checkbox" ? input.checked : input.value;
        localStorage.setItem(`sentinelmesh-${id}`, value);
    });

    if (saveMessage) {
        saveMessage.textContent = "Settings saved";
        setTimeout(() => {
            saveMessage.textContent = "";
        }, 2500);
    }
});

loadSettings();
