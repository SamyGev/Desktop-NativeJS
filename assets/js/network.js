let type = navigator.connection.effectiveType;

function updateConnectionStatus() {
  console.log(
    `Connection type changed from ${type} to ${navigator.connection.effectiveType}`
  );
  document.getElementById("networkType").innerText = `Connection type changed from ${type} to ${navigator.connection.effectiveType}`;
  type = navigator.connection.effectiveType;
}

navigator.connection.addEventListener("change", updateConnectionStatus);

document.getElementById("networkType").innerText= `${navigator.connection.effectiveType}`