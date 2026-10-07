document.getElementById("year").textContent = new Date().getFullYear();

async function updateVisitorCount() {
  const counter = document.getElementById("visitor-count");

  if (!counter) {
    return;
  }

  try {
    const response = await fetch("/api/visitor", {
      method: "POST"
    });

    if (!response.ok) {
      throw new Error(`Visitor API returned ${response.status}`);
    }

    const data = await response.json();

    counter.textContent =
      `• Site visits: ${Number(data.count).toLocaleString()}`;
  } catch (error) {
    console.error("Unable to load visitor count:", error);
    counter.textContent = "• Site visits unavailable";
  }
}

updateVisitorCount();
