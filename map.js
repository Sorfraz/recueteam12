const liveMapElement = document.getElementById("liveMap");

if (liveMapElement && window.L) {
    const liveMap = L.map(liveMapElement, {
        zoomControl: true,
        attributionControl: true
    }).setView([27.2, 87.8], 7);

    const CompassControl = L.Control.extend({
        options: { position: "topright" },

        onAdd() {
            const compass = L.DomUtil.create("button", "leaflet-control compass-control");
            compass.type = "button";
            compass.title = "Reset map north and regional view";
            compass.setAttribute("aria-label", "Reset map north and regional view");
            compass.innerHTML = '<span class="compass-north">N</span><span class="compass-needle"></span><span class="compass-reading">0° N</span>';

            L.DomEvent.disableClickPropagation(compass);
            L.DomEvent.on(compass, "click", () => {
                liveMap.flyTo([27.2, 87.8], 7, { duration: .7 });
            });

            return compass;
        }
    });

    new CompassControl().addTo(liveMap);

    const streetLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "&copy; OpenStreetMap contributors"
    });

    const satelliteLayer = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
        maxZoom: 19,
        attribution: "Tiles &copy; Esri"
    }).addTo(liveMap);

    const placeLabelsLayer = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}", {
        maxZoom: 19,
        attribution: "Labels &copy; Esri"
    }).addTo(liveMap);

    const mapModeButtons = document.querySelectorAll("[data-map-mode]");

    function updateCompassHeading(from, to) {
        const latitudeDifference = (to.lat - from.lat) * Math.PI / 180;
        const longitudeDifference = (to.lng - from.lng) * Math.PI / 180;
        const fromLatitude = from.lat * Math.PI / 180;
        const toLatitude = to.lat * Math.PI / 180;
        const y = Math.sin(longitudeDifference) * Math.cos(toLatitude);
        const x = Math.cos(fromLatitude) * Math.sin(toLatitude) -
            Math.sin(fromLatitude) * Math.cos(toLatitude) * Math.cos(longitudeDifference);
        const bearing = (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
        const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
        const direction = directions[Math.round(bearing / 45) % directions.length];
        const needle = document.querySelector(".compass-needle");
        const reading = document.querySelector(".compass-reading");
        const compass = document.querySelector(".compass-control");

        if (needle) needle.style.transform = `rotate(${bearing}deg)`;
        if (reading) reading.textContent = `${Math.round(bearing)}° ${direction}`;
        if (compass) {
            compass.title = `Move ${Math.round(bearing)}° ${direction} toward the shelter`;
            compass.setAttribute("aria-label", `Move ${Math.round(bearing)} degrees ${direction} toward the shelter`);
        }
    }

    mapModeButtons.forEach(button => {
        button.addEventListener("click", () => {
            const satelliteMode = button.dataset.mapMode === "satellite";

            if (satelliteMode) {
                liveMap.removeLayer(streetLayer);
                satelliteLayer.addTo(liveMap);
                placeLabelsLayer.addTo(liveMap);
            } else {
                liveMap.removeLayer(satelliteLayer);
                liveMap.removeLayer(placeLabelsLayer);
                streetLayer.addTo(liveMap);
            }

            mapModeButtons.forEach(modeButton => {
                modeButton.classList.toggle("active", modeButton === button);
            });
        });
    });

    const incidents = [
        { id: "city-center-fire", type: "fire", position: [26.73, 88.40], title: "Fire - City Center", detail: "High · Reported 20 min ago", situation: "Fire response team is active near the affected zone." },
        { id: "mangalpur-flood", type: "flood", position: [26.68, 88.45], title: "Flood alert - Mangalpur", detail: "High water level detected", situation: "Low-lying roads are at risk from continued flooding." },
        { type: "shelter", position: [26.71, 88.43], title: "Maitighara Sports", detail: "Shelter · 125 / 200 occupied" },
            { id: "fire-response-area", type: "fire", position: [26.76, 88.48], title: "Fire response area", detail: "Response team deployed", situation: "Response teams are deployed and monitoring the affected area." },
        { id: "siliguri-market-fire", type: "fire", position: [26.73, 88.42], title: "Fire affected area - Siliguri Market", detail: "High · Fire crews responding", situation: "Smoke and heat are reported near the market blocks; access is restricted." },
        { id: "sevoke-road-fire", type: "fire", position: [26.87, 88.32], title: "Fire affected area - Sevoke Road", detail: "Medium · Response team en route", situation: "A roadside fire is being contained; traffic movement is temporarily limited." },
        { id: "jalpaiguri-industrial-fire", type: "fire", position: [26.52, 88.73], title: "Fire affected area - Jalpaiguri", detail: "High · Emergency response active", situation: "Fire crews are working around the industrial zone and nearby buildings." },
        { id: "biratnagar-fire", type: "fire", position: [26.45, 87.27], title: "Fire affected area - Biratnagar, Nepal", detail: "High · Emergency monitoring", situation: "A fire response operation is active near the Biratnagar industrial corridor." },
        { id: "kathmandu-earthquake", type: "earthquake", position: [27.70, 85.32], title: "Earthquake affected area - Kathmandu Valley", detail: "Moderate · Seismic activity monitored", situation: "Aftershock monitoring is active across the Kathmandu Valley." },
        { id: "eastern-nepal-earthquake", type: "earthquake", position: [27.05, 87.30], title: "Earthquake affected area - Eastern Nepal", detail: "Moderate · Damage assessment active", situation: "Response teams are checking structures and roads after ground movement." },
        { id: "darjeeling-earthquake", type: "earthquake", position: [27.04, 88.26], title: "Earthquake affected area - Darjeeling", detail: "Low · Seismic monitoring active", situation: "Local authorities are monitoring tremors and checking vulnerable buildings." },
        { id: "siliguri-rainfall", type: "rainfall", position: [26.73, 88.40], title: "Heavy rainfall detected - Siliguri", detail: "82 mm · Heavy rainfall", situation: "Intense rainfall is reducing visibility and increasing waterlogging risk." },
        { id: "jalpaiguri-rainfall", type: "rainfall", position: [26.52, 88.73], title: "Heavy rainfall detected - Jalpaiguri", detail: "78 mm · Heavy rainfall", situation: "Persistent rain is raising local water levels near low-lying roads." },
        { id: "eastern-nepal-rainfall", type: "rainfall", position: [26.65, 87.27], title: "Heavy rainfall detected - Eastern Nepal", detail: "86 mm · Heavy rainfall", situation: "Heavy rain is increasing runoff and flood risk near the Koshi basin." },
        { id: "city-center-shelter", type: "shelter", nearbyTo: "city-center-fire", position: [26.74, 88.41], title: "City Center Emergency Shelter", detail: "Shelter · Near fire response area" },
        { id: "fire-response-shelter", type: "shelter", nearbyTo: "fire-response-area", position: [26.75, 88.47], title: "Fire Response Relief Shelter", detail: "Shelter · Near fire response area" },
        { id: "siliguri-market-shelter", type: "shelter", nearbyTo: "siliguri-market-fire", position: [26.74, 88.43], title: "Siliguri Market Relief Shelter", detail: "Shelter · Near Siliguri Market fire area" },
        { id: "sevoke-road-shelter", type: "shelter", nearbyTo: "sevoke-road-fire", position: [26.86, 88.33], title: "Sevoke Road Emergency Shelter", detail: "Shelter · Near Sevoke Road fire area" },
        { id: "jalpaiguri-industrial-shelter", type: "shelter", nearbyTo: "jalpaiguri-industrial-fire", position: [26.53, 88.72], title: "Jalpaiguri Relief Shelter", detail: "Shelter · Near Jalpaiguri fire area" },
        { id: "biratnagar-shelter", type: "shelter", nearbyTo: "biratnagar-fire", position: [26.46, 87.28], title: "Biratnagar Emergency Shelter", detail: "Shelter · Near Biratnagar fire area" },
        { id: "kathmandu-earthquake-shelter", type: "shelter", nearbyTo: "kathmandu-earthquake", position: [27.69, 85.33], title: "Kathmandu Earthquake Shelter", detail: "Shelter · Near Kathmandu earthquake area" },
        { id: "eastern-nepal-earthquake-shelter", type: "shelter", nearbyTo: "eastern-nepal-earthquake", position: [27.06, 87.31], title: "Eastern Nepal Relief Shelter", detail: "Shelter · Near Eastern Nepal earthquake area" },
        { id: "darjeeling-earthquake-shelter", type: "shelter", nearbyTo: "darjeeling-earthquake", position: [27.05, 88.27], title: "Darjeeling Emergency Shelter", detail: "Shelter · Near Darjeeling earthquake area" },
        { id: "siliguri-rainfall-shelter", type: "shelter", nearbyTo: "siliguri-rainfall", position: [26.74, 88.41], title: "Siliguri Rainfall Relief Shelter", detail: "Shelter · Near Siliguri rainfall area" },
        { id: "jalpaiguri-rainfall-shelter", type: "shelter", nearbyTo: "jalpaiguri-rainfall", position: [26.53, 88.72], title: "Jalpaiguri Rainfall Shelter", detail: "Shelter · Near Jalpaiguri rainfall area" },
        { id: "eastern-nepal-rainfall-shelter", type: "shelter", nearbyTo: "eastern-nepal-rainfall", position: [26.66, 87.28], title: "Eastern Nepal Rainfall Shelter", detail: "Shelter · Near Eastern Nepal rainfall area" },
        { id: "mangalpur-shelter", type: "shelter", nearbyTo: "mangalpur-flood", position: [26.70, 88.44], title: "Mangalpur Relief Shelter", detail: "Shelter · Near Mangalpur flood area" },
        { type: "shelter", position: [26.70, 88.39], title: "Pradhan Nagar Shelter", detail: "Shelter · Available" },
        { id: "nepal-sunsari-flood", type: "flood", position: [26.64, 87.15], title: "Flood affected area - Sunsari, Nepal", detail: "Koshi flood region · Emergency monitoring", situation: "Koshi river flooding is being monitored in the affected lowlands." },
        { id: "nepal-chitwan-flood", type: "flood", position: [27.68, 84.43], title: "Flood affected area - Chitwan, Nepal", detail: "Narayani flood region · Emergency monitoring", situation: "Narayani river flooding is affecting nearby low-lying settlements." },
        { id: "nepal-kathmandu-flood", type: "flood", position: [27.70, 85.32], title: "Flood affected area - Kathmandu Valley", detail: "Bagmati flood region · Emergency monitoring", situation: "Heavy rainfall is increasing flood risk along the Bagmati corridor." },
        { id: "sunsari-shelter", type: "shelter", nearbyTo: "nepal-sunsari-flood", position: [26.66, 87.28], title: "Itahari Emergency Shelter", detail: "Nepal · Near Sunsari flood area" },
        { id: "chitwan-shelter", type: "shelter", nearbyTo: "nepal-chitwan-flood", position: [27.68, 84.44], title: "Bharatpur Emergency Shelter", detail: "Nepal · Near Chitwan flood area" },
        { id: "kathmandu-shelter", type: "shelter", nearbyTo: "nepal-kathmandu-flood", position: [27.69, 85.32], title: "Kathmandu Relief Shelter", detail: "Nepal · Near Bagmati flood area" }
    ];

    const mapDetails = document.getElementById("mapDetails");

    function formatDistance(distance) {
        return distance < 1000 ? `${Math.round(distance)} m away` : `${(distance / 1000).toFixed(1)} km away`;
    }

    function renderMapDetails(filter) {
        if (!mapDetails) return;

        const selectedAreas = incidents.filter(incident => incident.type === filter && incident.type !== "shelter");
        const shelters = incidents.filter(incident => incident.type === "shelter");
        const heading = filter === "fire" ? "Fire response areas" : filter === "flood" ? "Flood affected areas" : filter === "earthquake" ? "Earthquake affected areas" : filter === "rainfall" ? "Heavy rainfall areas" : "All monitored areas";

        if (!selectedAreas.length) {
            mapDetails.innerHTML = `<div class="map-details-heading"><span>AREA INTELLIGENCE</span><strong>${heading}</strong></div><p class="map-details-empty">Select fire or flood to see active area information.</p>`;
            return;
        }

        mapDetails.innerHTML = `<div class="map-details-heading"><span>AREA INTELLIGENCE</span><strong>${heading}</strong></div>` +
            selectedAreas.map(area => {
                const nearbyShelters = shelters.filter(shelter => shelter.nearbyTo === area.id);
                const shelterText = nearbyShelters.length
                    ? nearbyShelters.map(shelter => {
                        const distance = L.latLng(area.position).distanceTo(L.latLng(shelter.position));
                        return `<button class="nearby-shelter" type="button" data-shelter-id="${shelter.id}" data-area-id="${area.id}" title="Zoom to ${shelter.title}"><i class="fa-solid fa-house"></i><span>${shelter.title}</span><strong>${formatDistance(distance)}</strong></button>`;
                    }).join("")
                    : `<span class="nearby-shelter unavailable">No linked shelter listed</span>`;

                return `<article class="area-card" data-area-id="${area.id}" tabindex="0" role="button" aria-label="Zoom to ${area.title}">
                    <div class="area-card-title"><i class="fa-solid fa-${area.type === "fire" ? "fire" : area.type === "earthquake" ? "house-crack" : area.type === "rainfall" ? "cloud-rain" : "water"}"></i><strong>${area.title}</strong></div>
                    <span class="area-status">${area.detail}</span>
                    <p>${area.situation || area.detail}</p>
                    <div class="shelter-label">NEARBY SHELTER</div>
                    ${shelterText}
                </article>`;
            }).join("");
    }

    const markerLayers = incidents.map(incident => {
        const iconName = incident.type === "flood"
            ? "water"
            : incident.type === "fire"
                ? "fire"
                : incident.type === "earthquake"
                        ? "house-crack"
                    : incident.type === "rainfall"
                        ? "cloud-rain"
                : "house";

        const icon = L.divIcon({
            className: "",
            html: `<div class="live-marker ${incident.type}"><i class="fa-solid fa-${iconName}"></i></div>`,
            iconSize: [28, 28],
            iconAnchor: [14, 28],
            popupAnchor: [0, -28]
        });

        const marker = L.marker(incident.position, { icon })
            .bindPopup(`<strong>${incident.title}</strong><br>${incident.detail}`)
            .addTo(liveMap);

        marker.incidentType = incident.type;
        marker.areaId = incident.id;
        marker.nearbyTo = incident.nearbyTo;
        return marker;
    });

    let routeLayer;
    let routeRequestId = 0;

    async function showShelterRoute(areaMarker, shelterMarker) {
        const requestId = ++routeRequestId;
        const areaPosition = areaMarker.getLatLng();
        const shelterPosition = shelterMarker.getLatLng();

        if (routeLayer) {
            liveMap.removeLayer(routeLayer);
        }

        const fallbackRoute = [
            [areaPosition.lat, areaPosition.lng],
            [shelterPosition.lat, shelterPosition.lng]
        ];

        try {
            const routeUrl = "https://router.project-osrm.org/route/v1/driving/" +
                `${areaPosition.lng},${areaPosition.lat};${shelterPosition.lng},${shelterPosition.lat}` +
                "?overview=full&geometries=geojson";
            const response = await fetch(routeUrl, { cache: "no-store" });

            if (!response.ok) throw new Error("Route request failed");

            const result = await response.json();
            const route = result.routes?.[0];

            if (!route || requestId !== routeRequestId) throw new Error("Route unavailable");

            routeLayer = L.layerGroup();

            L.geoJSON(route.geometry, {
                style: {
                    color: "#061018",
                    weight: 10,
                    opacity: .95
                }
            }).addTo(routeLayer);

            L.geoJSON(route.geometry, {
                style: {
                    color: "#19d3d9",
                    weight: 5,
                    opacity: 1
                }
            }).addTo(routeLayer);

            L.circleMarker(areaPosition, {
                radius: 8,
                color: "#ffffff",
                weight: 2,
                fillColor: "#ff4d5a",
                fillOpacity: 1
            }).addTo(routeLayer);

            L.circleMarker(shelterPosition, {
                radius: 8,
                color: "#ffffff",
                weight: 2,
                fillColor: "#2dd67b",
                fillOpacity: 1
            }).addTo(routeLayer);

            routeLayer.addTo(liveMap);

            liveMap.fitBounds(routeLayer.getBounds(), {
                padding: [55, 55],
                maxZoom: 16,
                animate: true,
                duration: .8
            });
            shelterMarker.setPopupContent(`<strong>${shelterMarker.getPopup().getContent().split("<br>")[0]}</strong><br>Exact road route<br>Distance: ${(route.distance / 1000).toFixed(1)} km<br>Estimated drive: ${Math.round(route.duration / 60)} min`);
        } catch (error) {
            if (requestId !== routeRequestId) return;

            routeLayer = L.layerGroup();

            L.polyline(fallbackRoute, {
                color: "#19d3d9",
                dashArray: "8 8",
                weight: 4,
                opacity: .9
            }).addTo(routeLayer);

            L.circleMarker(areaPosition, {
                radius: 8,
                color: "#ffffff",
                weight: 2,
                fillColor: "#ff4d5a",
                fillOpacity: 1
            }).addTo(routeLayer);

            L.circleMarker(shelterPosition, {
                radius: 8,
                color: "#ffffff",
                weight: 2,
                fillColor: "#2dd67b",
                fillOpacity: 1
            }).addTo(routeLayer);

            routeLayer.addTo(liveMap);

            liveMap.fitBounds(routeLayer.getBounds(), {
                padding: [55, 55],
                maxZoom: 16,
                animate: true,
                duration: .8
            });
        }
    }

    function zoomToShelter(shelterId, areaId) {
        const shelterMarker = markerLayers.find(marker => marker.areaId === shelterId);
        const areaMarker = markerLayers.find(marker => marker.areaId === areaId);

        if (!shelterMarker) return;

        const headingOrigin = lastUserPosition || (areaMarker && areaMarker.getLatLng());

        if (headingOrigin) {
            updateCompassHeading(headingOrigin, shelterMarker.getLatLng());
        }

        if (areaMarker) {
            showShelterRoute(areaMarker, shelterMarker);
        } else {
            liveMap.flyTo(shelterMarker.getLatLng(), 16, { duration: .8 });
        }

        shelterMarker.openPopup();
        mapDetails?.querySelectorAll(".nearby-shelter").forEach(shelter => {
            shelter.classList.toggle("selected", shelter.dataset.shelterId === shelterId);
        });
    }

    function zoomToArea(areaId) {
        const marker = markerLayers.find(areaMarker => areaMarker.areaId === areaId);

        if (!marker) return;

        liveMap.flyTo(marker.getLatLng(), 15, { duration: .8 });
        marker.openPopup();

        mapDetails?.querySelectorAll(".area-card").forEach(card => {
            card.classList.toggle("selected", card.dataset.areaId === areaId);
        });
    }

    mapDetails?.addEventListener("click", event => {
        const shelter = event.target.closest(".nearby-shelter[data-shelter-id]");
        if (shelter) {
            event.stopPropagation();
            zoomToShelter(shelter.dataset.shelterId, shelter.dataset.areaId);
            return;
        }

        const card = event.target.closest(".area-card");
        if (card) zoomToArea(card.dataset.areaId);
    });

    mapDetails?.addEventListener("keydown", event => {
        if (event.key !== "Enter" && event.key !== " ") return;

        const card = event.target.closest(".area-card");
        if (!card) return;

        event.preventDefault();
        zoomToArea(card.dataset.areaId);
    });

    window.filterLiveMap = filter => {
        routeRequestId++;

        if (routeLayer) {
            liveMap.removeLayer(routeLayer);
            routeLayer = undefined;
        }

        const visibleMarkers = markerLayers.filter(marker => {
            const shouldShow = filter === "all" || marker.incidentType === filter ||
                ((filter === "fire" || filter === "flood" || filter === "earthquake" || filter === "rainfall") && marker.nearbyTo);

            if (shouldShow) {
                marker.addTo(liveMap);
            } else {
                liveMap.removeLayer(marker);
            }

            return shouldShow;
        });

        if (filter === "all") {
            renderMapDetails("all");
            liveMap.flyTo([27.2, 87.8], 7, { duration: .7 });
            return;
        }

        renderMapDetails(filter);

        const selectedLocations = visibleMarkers.map(marker => marker.getLatLng());

        if (selectedLocations.length === 1) {
            liveMap.flyTo(selectedLocations[0], 14, { duration: .7 });
        } else if (selectedLocations.length > 1) {
            liveMap.flyToBounds(L.latLngBounds(selectedLocations), {
                padding: [25, 25],
                maxZoom: 13,
                duration: .7
            });
        }
    };

    const locateButton = document.getElementById("locateMe");
    const locationStatus = document.getElementById("locationStatus");
    let userLocationMarker;
    let userAccuracyCircle;
    let locationWatchId;
    let hasCenteredOnUser;
    let lastGeocodedPosition;
    let geocodingInProgress;
    let lastLocationAccuracy;
    let lastUserPosition;

    function updateLocationStatus(message, state) {
        if (!locationStatus) return;

        locationStatus.textContent = message;
        locationStatus.className = "location-status" + (state ? ` ${state}` : "");
    }

    function showUserLocation(position) {
        const { latitude, longitude, accuracy } = position.coords;
        const userPosition = [latitude, longitude];
        lastLocationAccuracy = accuracy;
        lastUserPosition = L.latLng(latitude, longitude);

        if (!hasCenteredOnUser) {
            liveMap.flyTo(userPosition, 16, { duration: .8 });
            hasCenteredOnUser = true;
        } else {
            liveMap.panTo(userPosition, { animate: false });
        }

        if (!userLocationMarker) {
            const userIcon = L.divIcon({
                className: "",
                html: '<div class="user-location-marker"></div>',
                iconSize: [18, 18],
                iconAnchor: [9, 9]
            });

            userLocationMarker = L.marker(userPosition, { icon: userIcon })
                .bindPopup("Your current location<br>Finding area name...")
                .addTo(liveMap);
        } else {
            userLocationMarker.setLatLng(userPosition);
        }

        if (!userAccuracyCircle) {
            userAccuracyCircle = L.circle(userPosition, {
                radius: accuracy,
                color: "#3ea6ff",
                fillColor: "#3ea6ff",
                fillOpacity: .12,
                weight: 1
            }).addTo(liveMap);
        } else {
            userAccuracyCircle.setLatLng(userPosition);
            userAccuracyCircle.setRadius(accuracy);
        }

        const accuracyText = accuracy > 1000
            ? `Low accuracy (about ${(accuracy / 1000).toFixed(1)} km)`
            : `Accuracy about ${Math.round(accuracy)} m`;
        const coordinates = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;

        userLocationMarker.setPopupContent(
            `Your current location<br><small>Coordinates: ${coordinates}<br>${accuracyText}</small>`
        );

        updateLocationStatus(`Live location enabled · ${accuracyText}`, accuracy > 1000 ? "error" : "active");
        locateButton?.classList.add("locating");

        reverseGeocodeLocation(latitude, longitude);
    }

    async function reverseGeocodeLocation(latitude, longitude) {
        if (geocodingInProgress || (lastGeocodedPosition &&
            Math.abs(lastGeocodedPosition.latitude - latitude) < .001 &&
            Math.abs(lastGeocodedPosition.longitude - longitude) < .001)) {
            return;
        }

        geocodingInProgress = true;

        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
                { headers: { "Accept-Language": "en" }, cache: "no-store" }
            );

            if (!response.ok) throw new Error("Area lookup failed");

            const result = await response.json();
            const address = result.address || {};
            const areaName = address.suburb || address.neighbourhood || address.village ||
                address.town || address.city_district || address.city || address.county ||
                result.display_name || "Area unavailable";

            lastGeocodedPosition = { latitude, longitude };
            updateLocationStatus(areaName, "active");

            if (userLocationMarker) {
                userLocationMarker.setPopupContent(
                    `<strong>${areaName}</strong><br>Your current location<br><small>Coordinates: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}<br>Accuracy about ${Math.round(lastLocationAccuracy)} m</small>`
                );
            }
        } catch (error) {
            updateLocationStatus("Live location enabled · Area name unavailable", "active");
        } finally {
            geocodingInProgress = false;
        }
    }

    function handleLocationError(error) {
        const message = error.code === 1
            ? "Location access denied"
            : "Unable to get your location";

        updateLocationStatus(message, "error");
        locateButton?.classList.remove("locating");
    }

    function requestUserLocation() {
        if (!navigator.geolocation) {
            updateLocationStatus("Location is not supported", "error");
            return;
        }

        updateLocationStatus("Requesting location access...");

        if (locationWatchId !== undefined) {
            navigator.geolocation.clearWatch(locationWatchId);
        }

        locationWatchId = navigator.geolocation.watchPosition(
            showUserLocation,
            handleLocationError,
            { enableHighAccuracy: true, maximumAge: 0, timeout: 30000 }
        );
    }

    locateButton?.addEventListener("click", requestUserLocation);

    setTimeout(() => liveMap.invalidateSize(), 0);
}
