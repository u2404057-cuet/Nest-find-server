const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require('mongodb');
require("dotenv").config();
const app = express();
const port = process.env.PORT;
const uri = process.env.MONGO_URI;

app.use(express.json());
app.use(cors());

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function run() {
  try {
    await client.connect();
    db = client.db("nestfind");
    console.log("Successfully connected to MongoDB!");
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
  }
}
run().catch(console.dir);

// Properties Mock API
app.get("/api/properties", (req, res) => {
  const properties = [
    {
      id: "1",
      title: "Azure Horizon Villa",
      price: 2450000,
      location: "Malibu, CA",
      beds: 4,
      baths: 3.5,
      isNew: true,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAfYf3Bi8XY59JuhaObwLDHfAvh4EkM9d8jDN7EtZVAFenCgtzsBxNSWnA38ZTIyslNiZSaoZlmvgMCnyPjn1k7ml_1TvMQu0Uf-zq0YMLFcW6zauz9VGvbhp1--tatI0e2rmiZKtkOLZW0fHxSM2x6Wqvb7pPGYesgSaYbyyORdsdUiX0Tu6RVVURfy5EbvP18d0mPyTaCqI7cfCQvO45YQaIUtPiadwuoCavTBJDTfoW83F08kRrRDA",
    },
    {
      id: "2",
      title: "The Brick Loft",
      price: 1200000,
      location: "Soho, NY",
      beds: 2,
      baths: 2,
      isNew: false,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCztlg4cORs4UNyw207ziTAMVLKQ2lDy4Rm-WO1xwmgKeCjp3fWV2RJwexV3yIQzyrwG4Co22Lj9FeT1yG0fRHPXpPs6BqQym9UsqfXX0E8RPT5U7TerG5YHrVAyDHaDQsLbG1yr9XxZHc3rF339vFvlNEkeEvlfkOfeNZU9wxr_XkgorSV82kl6P5vgy6oimIplcRRqY864nJuS0BCc20gcy9NmKACJUE34vO7xicZdjML6H3OfjwaTQ",
    },
    {
      id: "3",
      title: "Skyline Penthouse",
      price: 4800000,
      location: "Chicago, IL",
      beds: 3,
      baths: 3,
      isNew: false,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBKQlm-sI-byzKxN02_9TwqIxDbmgi-8PCRUR5_mjKaPY4l6FXbjP6vYQy06t3izxqkomEh102NIBTX4T1bqydPijE7ZwX7SwAtHo7G8gkG3_2cKWhHFvqhBT1xd7G68UpBwgc2VYrT9IISLKfTjlY9cUVWafeV3QwNWKk70k7owQzH3Uo_GiB3fmUfMCnDcjR9nUfOanq6jE2XIUMrVBwIYakxHKhriMwdLeNhaonk4vFiuQtrzfF61g",
    },
    {
      id: "4",
      title: "Desert Zen Retreat",
      price: 3150000,
      location: "Sedona, AZ",
      beds: 5,
      baths: 5.5,
      isNew: false,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBpPTOfivnLA9kBr1Qv1nVTugk5mZsX0JUWHFrXBAyQS7xHCO2Bf57CTY0gh5CIR_qCnytF_v5P7GdzDYV9_hXNJsxLFq9f6sqlCKy1dIXM-7TfV3dxxdSCUAD0YqD1B4Z9d3aep60KkVUgrEl6M73YOWP7k9fTtNa_PYMa-scVEMVM505Bt4uHEEz3r58cerhWhLZ92nS4xhMupk17mx1ai9pWAUW8fB-PUsroBskJlLNrrpXWKix--Q",
    }
  ];
  res.json(properties);
});

// Testimonials Mock API
app.get("/api/testimonials", (req, res) => {
  const testimonials = [
    {
      id: "1",
      stars: 5,
      text: "NestFind turned a stressful search into an absolute pleasure. Their attention to architectural detail was exactly what I needed for my new studio.",
      name: "David Chen",
      role: "Architectural Designer",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCDSHBLjyW5B5BEZSvUtoSCahEvz_qLNUkLPI290RtsYWTHhXsJq933jued5Sypyt9sOuxU90Jn7issmmBG1A1wgNqUpYJHJ_iN_aZXa7ZRywa43MvcPPrmFEMr6vVVYeqmZAcmknR17VZ9LLn-8WIGlGe_7DCI-Ccwel1i3272Ut3S9T1SSP-DX-myAM6kUduhstOYM75kXk7iMnhNksJHQQGGqTqtXwKZbLgH_skltEoSxNtUg-6JQw",
    },
    {
      id: "2",
      stars: 5,
      text: "The level of professionalism and the quality of listings on this platform are unmatched. We found our forever home in just two weeks!",
      name: "The Robertsons",
      role: "New Homeowners",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAohxZgtyBsLeEJnpY4Q6iuoQu3UN8PHyOABRy_NfdsGgzO6EE7PoXYFlQ_K0UfuQGJlYOm6U69O61xfYnhHBHyAWQO0Mh_XWGQx-iYF44knbhQ10CJ1k_AdXTDiT5TTF9BoPv0PbMAzS4EbxkKSLwa7Xbq7BVrfounVd7DPBur2UkpQ5V77WsVdHWqJqrlGa6ltSViRaxMN00Zp8wv2Yv1rOBRj8TKP7CKgmGuPptSfCHFj1Pv_443Fg",
    },
    {
      id: "3",
      stars: 5,
      text: "I've worked with many real estate platforms, but NestFind's data-driven approach and premium interface make it my primary tool now.",
      name: "James Wilson",
      role: "Real Estate Investor",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCH1jqohf3Cdx4U37V0h9hCdpBsD1p-ZaPrGNXxOHIMuU1vsnFe9bYaKzEQBLI3w_lEwioak5H8G5D6ZOVqfbjsYjWL9ia9K1xH6PoA4VVunH-AoQLN-VLXe0zrcJSnTMAJonxM05Ooe0-CsJnS2owVrymmeTlFHsrQHkpJynQSDVooRNxQqJx8-gDkSoQNQNgpvJVd1QI781DiObAzTzsIi1f8FBCx3sJ71y_mlD-LuS22g-PzzSPwLA",
    }
  ];
  res.json(testimonials);
});

// Agents Mock API
app.get("/api/agents", (req, res) => {
  const agents = [
    {
      id: "1",
      name: "Sarah Kensington",
      role: "Luxury Estates Specialist",
      listings: 142,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuANKYAq-CmnmP7LW7b3gmiUW44BsRdOyEJq9kpQwLmWq0yLKgip9BXyShzFOwzeDtnlWYdfezIUK4zXs8kZiPf4U6IE_fYD2k0rL3zRTkOF6UbRaAN0bNH97arBDJs5Z-fUGssH0uX9fcZaG-Z9x9Hi_CEkR3nloE3vgozZU94HZ9pUExV6jwOUps7YAZJSypbtKyGQOsIRGBgbxYpokFhWu7ORLEN3mTdxolEZ7nSZjuDM5Zm0wn8MYw"
    },
    {
      id: "2",
      name: "Marcus Thorne",
      role: "Urban Loft Expert",
      listings: 98,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAZEuricKO0ilqfki-QJolibxLhVLIoYROQPk6Wi_0Ej-IJBTGc5MphMUdeGQ6Px0Pe5_IihUJngE9HMBhDHwZnzVFcuSwNe9cvhUWHKlOVwLkJNqYsebbt2xmi9ctV9v2pswO_S181rU2nBdul1MwZN63bI_nkdKIEz_wqc2OwA3DJadc9_AolCBYH-oRqo1uTRIBUHZ6QWv8aki0vQEVCHm0qYNoYmkglI4SfixwfAxgeG_FKxn9meg"
    },
    {
      id: "3",
      name: "Elena Rodriguez",
      role: "Investment Portfolio Advisor",
      listings: 115,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCR28PLdjQrSjB_LZhc3apJZHb4Axe6BJa1-qHRWD1fmpawre3n2ASMa74ngwRCh11dePP_HkZEHW9uXyov8EihSR8F7S9QCjkNJfmlXbS5OnQXphTHu4CKZTz_-y2M1XvZGMAIsoJ6K1hfDnrIz7oQxe0Vr4MCF9hN6sm7D0dYkpV1c28tTrGN9yiw1ksepw8cXGC9nC-mcWbhDceW6E6sIdcgd2slvcUGPMf4aKZ0O8gBd545nKKT8g"
    }
  ];
  res.json(agents);
});

// Stats Mock API
app.get("/api/stats", (req, res) => {
  res.json({
    properties: 2500,
    cities: 45,
    clients: 12000,
    agents: 150
  });
});

app.get("/", (req, res) => {
  res.send("SCIC server is active");
});

app.listen(port, () => {
  console.log(`SCIC server is running on port ${port}`);
});