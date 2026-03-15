const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Simple in-memory storage
let campaigns = [
    {
        id: 1,
        title: "Medical Help",
        description: "Support surgery expenses",
        goal: 50000,
        raised: 20000
    }
];

// Get all campaigns
app.get("/campaigns", (req, res) => {
    res.json(campaigns);
});

// Create new campaign
app.post("/campaigns", (req, res) => {
    const newCampaign = {
        id: campaigns.length + 1,
        title: req.body.title,
        description: req.body.description,
        goal: req.body.goal,
        raised: 0
    };
    campaigns.push(newCampaign);
    res.json(newCampaign);
});

// Donate to campaign
app.post("/donate/:id", (req, res) => {

    const campaign = campaigns.find(c => c.id == req.params.id);

    if (!campaign) {
        return res.status(404).send("Campaign not found");
    }

    const amount = Number(req.body.amount);

    // Check if goal already reached
    if (campaign.raised >= campaign.goal) {
        return res.json({ message: "Campaign goal already reached" });
    }

    // Prevent exceeding goal
    if (campaign.raised + amount > campaign.goal) {
        return res.json({
            message: "Donation exceeds campaign goal",
            remaining: campaign.goal - campaign.raised
        });
    }

    campaign.raised += amount;

    res.json({
        message: "Donation successful",
        campaign
    });
});
app.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
});