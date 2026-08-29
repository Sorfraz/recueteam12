/* =========================================================
   SENTINELMESH DASHBOARD JAVASCRIPT
   ========================================================= */


/* =========================================================
   SIDEBAR NAVIGATION
   ========================================================= */

const navItems = document.querySelectorAll(".nav-item");

navItems.forEach(item => {

    item.addEventListener("click", event => {

        const targetSelector = item.getAttribute("href");

        if (targetSelector && targetSelector.startsWith("#")) {
            const target = document.querySelector(targetSelector);

            if (target) {
                event.preventDefault();
                target.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        }

        navItems.forEach(nav => {
            nav.classList.remove("active");
        });

        item.classList.add("active");

    });

});


/* =========================================================
   INCIDENT TABS
   ========================================================= */

const tabs = document.querySelectorAll(".tab");

tabs.forEach(tab => {

    tab.addEventListener("click", () => {

        tabs.forEach(t => {
            t.classList.remove("active");
        });

        tab.classList.add("active");

    });

});


/* =========================================================
   MAP FILTER BUTTONS
   ========================================================= */

const mapFilters = document.querySelectorAll(".map-filter[data-type]");

mapFilters.forEach(button => {

    button.addEventListener("click", () => {

        mapFilters.forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        if (window.filterLiveMap) {
            window.filterLiveMap(button.dataset.type || "all");
        }

    });

});


/* =========================================================
   AI APPROVE BUTTON
   ========================================================= */

const approveButton = document.querySelector(".approve");

approveButton.addEventListener("click", () => {

    approveButton.innerHTML =
        '<i class="fa-solid fa-check"></i> Approved';

    approveButton.style.background = "#158447";

    alert(
        "AI recommendation approved. Rescue teams have been notified."
    );

});


/* =========================================================
   LIVE TEMPERATURE
   ========================================================= */

function setTemperature(temperature) {

    const mainTemp =
        document.getElementById("temperature");

    const sensorTemp =
        document.getElementById("tempSensor");

    if (mainTemp) {
        mainTemp.textContent =
            temperature + "°C";
    }

    if (sensorTemp) {
        sensorTemp.textContent =
            temperature + "°C";
    }

}

async function updateTemperature() {

    try {
        const response = await fetch(
            "https://api.open-meteo.com/v1/forecast?latitude=26.7271&longitude=88.3953&current=temperature_2m&timezone=Asia%2FKolkata",
            { cache: "no-store" }
        );

        if (!response.ok) {
            throw new Error("Weather request failed");
        }

        const weather = await response.json();
        const temperature = Number(weather.current.temperature_2m).toFixed(1);

        setTemperature(temperature);
    } catch (error) {
        const fallbackTemperature = (23 + Math.random() * 3).toFixed(1);

        setTemperature(fallbackTemperature);
    }
}

updateTemperature();
setInterval(updateTemperature, 600000);


/* =========================================================
   LIVE TIME
   ========================================================= */

function updateTime() {

    const now = new Date();

    const time =
        now.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        });

    const element =
        document.getElementById("lastUpdated");

    if (element) {
        element.textContent = time;
    }

}

updateTime();

setInterval(updateTime, 1000);


/* =========================================================
   LIVE DASHBOARD METRICS
   ========================================================= */

function setMetric(id, value) {
    const element = document.getElementById(id);

    if (element) {
        element.textContent = value;
    }
}

function updateLiveMetrics() {
    const waterLevel = (2.2 + Math.random() * .5).toFixed(1);
    const rainfall = Math.round(76 + Math.random() * 12);
    const windSpeed = Math.round(24 + Math.random() * 9);
    const gasLevel = Math.round(Math.random() * 4);
    const aqi = Math.round(10 + Math.random() * 8);
    const activeIncidents = 22 + Math.round(Math.random() * 5);
    const peopleAffected = 18100 + Math.round(Math.random() * 650);
    const availableShelters = 116 + Math.round(Math.random() * 8);
    const connectedSensors = 1268 + Math.round(Math.random() * 20);
    const riskPercent = Math.round(78 + Math.random() * 14);

    setMetric("activeIncidents", activeIncidents);
    setMetric("peopleAffected", peopleAffected.toLocaleString());
    setMetric("availableShelters", availableShelters);
    setMetric("connectedSensors", connectedSensors.toLocaleString());

    setMetric("mapWaterLevel", waterLevel + " m");
    setMetric("mapRainfall", rainfall + " mm");
    setMetric("mapWindSpeed", windSpeed + " km/h");

    setMetric("sensorWaterLevel", waterLevel + " m");
    setMetric("sensorRainfall", rainfall + " mm");
    setMetric("sensorGas", gasLevel + " ppm");
    setMetric("sensorAqi", aqi + " AQI");
    setMetric("sensorWindSpeed", windSpeed + " km/h");

    setMetric("riskScore", (riskPercent / 10).toFixed(1));
    setMetric("riskPercent", riskPercent + "%");
}

function sensorPulse() {
    const sensorCards = document.querySelectorAll(".sensor-card");

    sensorCards.forEach(card => {
        card.style.borderColor = "#2b5564";

        setTimeout(() => {
            card.style.borderColor = "#172833";
        }, 400);
    });
}

updateLiveMetrics();
setInterval(updateLiveMetrics, 5000);
setInterval(sensorPulse, 3000);


/* =========================================================
   NOTIFICATION
   ========================================================= */

const notification =
    document.querySelector(".icon-button");

notification.addEventListener("click", () => {

    alert(
        "4 new disaster alerts:\n\n" +
        "• Flood warning - Hooghly\n" +
        "• Fire incident - City Center\n" +
        "• Shelter capacity warning\n" +
        "• Heavy rainfall detected"
    );

});