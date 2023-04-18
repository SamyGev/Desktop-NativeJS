const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
};

function success(pos) {
    const crd = pos.coords;

    console.log("Your current position is:");
    console.log(`Latitude : ${crd.latitude}`);
    console.log(`Longitude: ${crd.longitude}`);
    console.log(`More or less ${crd.accuracy} meters.`);

    document.getElementById("latitude").innerText = `Latitude : ${crd.latitude}`;
    document.getElementById("longitude").innerText = `Longitude: ${crd.longitude}`;
}

function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
}

document.getElementById('permission-granted-button').addEventListener('click', () => {
navigator.geolocation.watchPosition(success, error, options);
});