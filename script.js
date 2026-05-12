 function showDateTime() {
    const now = new Date();

    const date = now.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });

    const time = now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });

    document.getElementById("currentDate").textContent = date;
    document.getElementById("currentTime").textContent = time;
  }

  showDateTime();
  setInterval(showDateTime, 1000);

function buyPlant(plantName) {

    // Daraz Search
    const url = `https://www.google.com/search?q=site:plant.pk+${encodeURIComponent(plantName)}+plant`;

    // New Tab Open
    window.open(url, "_blank");
}
