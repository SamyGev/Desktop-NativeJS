navigator.getBattery().then((battery) => {
    function updateAllBatteryInfo() {
      updateChargeInfo();
      updateLevelInfo();
      updateChargingInfo();
      updateDischargingInfo();
    }
    updateAllBatteryInfo();
  
    battery.addEventListener("chargingchange", () => {
      updateChargeInfo();
    });
    function updateChargeInfo() {
      console.log(`Battery charging? ${battery.charging ? "Yes" : "No"}`);
      document.getElementById("chargeBool").innerText = `${battery.charging ? "En charge" : "Non branché"}`;
    }
  
    battery.addEventListener("levelchange", () => {
      updateLevelInfo();
    });
    function updateLevelInfo() {
      console.log(`Battery level: ${battery.level * 100}%`);
      document.getElementById("chargeLvl").innerText = `${battery.level * 100}% restant`;
    }
  
    battery.addEventListener("chargingtimechange", () => {
      updateChargingInfo();
    });
    function updateChargingInfo() {
      console.log(`Battery charging time: ${battery.chargingTime} seconds`);
      document.getElementById("chargeTime").innerText = `${battery.chargingTime} secondes avant la fin de la charge`;
    }
  
    battery.addEventListener("dischargingtimechange", () => {
      updateDischargingInfo();
    });
    function updateDischargingInfo() {
      console.log(`Battery discharging time: ${battery.dischargingTime} seconds`);
      document.getElementById("dischargeTime").innerText = `${battery.dischargingTime} secondes restantes`;
    }
  });