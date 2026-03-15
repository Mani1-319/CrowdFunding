// Load campaigns from backend
async function loadCampaigns() {
    const res = await fetch("http://localhost:5000/campaigns");
    const campaigns = await res.json();

    const container = document.querySelector(".container");

    container.innerHTML = "<h2>Active Campaigns</h2>";

    campaigns.forEach(c => {
        const card = `
            <div class="card">
                <h3>${c.title}</h3>
                <p>${c.description}</p>
                <p>₹${c.raised} raised of ₹${c.goal}</p>
                <button onclick="donate(${c.id})">Donate ₹100</button>
            </div>
        `;
        container.innerHTML += card;
    });
}

// Create campaign
async function createCampaign() {

    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const goal = document.getElementById("goal").value;

    const res = await fetch("http://localhost:5000/campaigns", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            title,
            description,
            goal: Number(goal)
        })
    });

    const data = await res.json();

    console.log("Created:", data);

    alert("Campaign Created Successfully!");

    window.location.href = "index.html";
}
// Donate function
async function donate(id) {

    const amount = prompt("Enter donation amount:");

    if (!amount || amount <= 0) {
        alert("Enter a valid amount");
        return;
    }

    await fetch(`http://localhost:5000/donate/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Number(amount) })
    });

    alert("Donation Successful!");

    loadCampaigns();
}

// Auto load campaigns on home page
if (document.querySelector(".container")) {
    loadCampaigns();
}