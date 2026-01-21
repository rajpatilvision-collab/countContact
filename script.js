ZOHO.embeddedApp.on("PageLoad", function () {
    initMap();
});

ZOHO.embeddedApp.init();

function initMap() {

    // Default view (India)
    var map = L.map("map").setView([20.5937, 78.9629], 5);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap"
    }).addTo(map);

    var drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);

    var drawControl = new L.Control.Draw({
        draw: {
            rectangle: true,
            polygon: false,
            polyline: false,
            circle: false,
            marker: false,
            circlemarker: false
        },
        edit: {
            featureGroup: drawnItems
        }
    });

    map.addControl(drawControl);

    map.on(L.Draw.Event.CREATED, function (event) {

        drawnItems.clearLayers();
        var layer = event.layer;
        drawnItems.addLayer(layer);

        var bounds = layer.getBounds();

        var payload = {
            minLat: bounds.getSouthWest().lat,
            maxLat: bounds.getNorthEast().lat,
            minLng: bounds.getSouthWest().lng,
            maxLng: bounds.getNorthEast().lng
        };

        document.getElementById("count").innerText = "Calculating...";

        ZOHO.CRM.FUNCTIONS.execute(
            "countContacts",
            payload
        ).then(function (res) {
            document.getElementById("count").innerText =
                res.details.output;
        }).catch(function () {
            document.getElementById("count").innerText = "Error";
        });
    });
}
