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
let db;

async function run() {
  try {
    await client.connect();
    db = client.db("nestFind");
    console.log("Successfully connected to MongoDB!");

    // Seed mock users and reviews if not present
    const seedUsers = [
      { _id: "usr_buyer_001", name: "Tanvir Rahman", email: "tanvir@example.com", role: "buyer" },
      { _id: "usr_buyer_002", name: "Sarah Jenkins", email: "sarah.j@example.com", role: "buyer" }
    ];

    const seedReviews = [
      {
        _id: "rev_0001",
        propertyId: "prop_0001",
        userId: "usr_buyer_002",
        rating: 5,
        comment: "Toured this apartment last month – the finishing and natural light are exceptional. Extremely quiet neighborhood.",
        createdAt: "2026-01-08T12:00:00.000Z"
      },
      {
        _id: "rev_0002",
        propertyId: "prop_0003",
        userId: "usr_buyer_001",
        rating: 4,
        comment: "Great house with a lot of privacy, though the road leading up the hill is a bit narrow. Beautiful layout and views.",
        createdAt: "2026-01-05T15:30:00.000Z"
      },
      {
        _id: "rev_0003",
        agentId: "usr_agent_001",
        userId: "usr_buyer_001",
        rating: 5,
        comment: "Tanvir was very responsive and arranged viewings quickly around my schedule. Highly recommended!",
        createdAt: "2026-01-07T09:15:00.000Z"
      },
      {
        _id: "rev_0004",
        propertyId: "prop_0001",
        userId: "usr_buyer_001",
        rating: 4,
        comment: "Excellent Gulshan 2 location, walking distance to all major cafes and restaurants. Clean building management.",
        createdAt: "2026-02-14T10:00:00.000Z"
      },
      {
        _id: "rev_0005",
        propertyId: "prop_0002",
        userId: "usr_buyer_002",
        rating: 5,
        comment: "Superb flat! The rent is very reasonable for this part of Banani. Clean corridors and friendly security.",
        createdAt: "2026-03-01T11:20:00.000Z"
      },
      {
        _id: "rev_0006",
        propertyId: "prop_0004",
        userId: "usr_buyer_001",
        rating: 5,
        comment: "Highly functional office layout in Agrabad. Excellent backup generator uptime and high-speed internet provisions.",
        createdAt: "2026-04-10T14:45:00.000Z"
      }
    ];

    const usersCollection = db.collection("user");
    for (const u of seedUsers) {
      await usersCollection.updateOne({ _id: u._id }, { $set: u }, { upsert: true });
    }

    const reviewsCollection = db.collection("reviews");
    const count = await reviewsCollection.countDocuments();
    if (count < 6) {
      for (const review of seedReviews) {
        await reviewsCollection.updateOne({ _id: review._id }, { $set: review }, { upsert: true });
      }
      console.log("Seeded database reviews successfully!");
    }
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
  }
}
run().catch(console.dir);

// Properties Mock API
app.get("/api/properties", async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: "Database not connected yet" });
    }
    const propertiesCollection = db.collection("properties");
    
    const { agentId, q, category, sort } = req.query;

    // Build MongoDB filter
    const filter = {};
    if (agentId) filter.agentId = agentId;

    // Full-text search: match title or location (case-insensitive regex)
    if (q && q.trim()) {
      const regex = new RegExp(q.trim(), "i");
      filter.$or = [
        { title: regex },
        { "location": regex },
        { "location.area": regex },
        { "location.city": regex },
        { "location.address": regex },
      ];
    }

    // Category filter (maps to propertyType field)
    if (category && category !== "all") {
      filter.propertyType = new RegExp(category, "i");
    }

    // Sort options
    let sortOption = {};
    if (sort === "price_asc")  sortOption = { price: 1 };
    else if (sort === "price_desc") sortOption = { price: -1 };
    else sortOption = { createdAt: -1 }; // default: newest first

    const result = await propertiesCollection.find(filter).sort(sortOption).toArray();
    
    const mappedProperties = result.map(property => ({
      id: property._id.toString(),
      title: property.title,
      price: property.price,
      location: property.location
        ? (typeof property.location === "object"
          ? `${property.location.area || ""}, ${property.location.city || ""}`.replace(/^, |, $/, "")
          : property.location)
        : "",
      beds: property.bedrooms || 0,
      baths: property.bathrooms || 0,
      isNew: property.featured || false,
      image: Array.isArray(property.images) && property.images.length > 0
        ? property.images[0]
        : (property.image || ""),
    }));

    res.json(mappedProperties);
  } catch (error) {
    console.error("Error fetching properties from MongoDB:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// POST Property API (Agent only)
app.post("/api/properties", async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: "Database not connected yet" });
    }
    const propertiesCollection = db.collection("properties");
    
    const newProperty = {
      ...req.body,
      createdAt: new Date().toISOString(),
      views: 0,
      status: "available",
      featured: false
    };

    const result = await propertiesCollection.insertOne(newProperty);
    res.status(201).json({ id: result.insertedId });
  } catch (error) {
    console.error("Error creating property:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// DELETE Property API (Agent only)
app.delete("/api/properties/:id", async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: "Database not connected yet" });
    }
    const propertiesCollection = db.collection("properties");
    const { ObjectId } = require('mongodb');
    const id = req.params.id;
    
    let query = {};
    try {
      query = { _id: new ObjectId(id) };
    } catch (e) {
      query = { _id: id };
    }

    const result = await propertiesCollection.deleteOne(query);
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Property not found" });
    }
    res.json({ message: "Property deleted successfully" });
  } catch (error) {
    console.error("Error deleting property:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Single Property Detail API
app.get("/api/properties/:id", async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: "Database not connected yet" });
    }
    const { ObjectId } = require('mongodb');
    const propertiesCollection = db.collection("properties");
    
    let query = {};
    const id = req.params.id;
    try {
      query = { _id: new ObjectId(id) };
    } catch (e) {
      // If it's not a valid ObjectId (like prop_0001), query as direct string
      query = { _id: id };
    }

    const property = await propertiesCollection.findOne(query);
    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    // Map the MongoDB document format to the detail format expected by frontend
    const mappedProperty = {
      id: property._id.toString(),
      title: property.title,
      shortDescription: property.shortDescription || '',
      fullDescription: property.fullDescription || '',
      propertyType: property.propertyType || 'apartment',
      listingType: property.listingType || 'sale',
      price: property.price,
      currency: property.currency || 'BDT',
      location: property.location || {},
      bedrooms: property.bedrooms || 0,
      bathrooms: property.bathrooms || 0,
      areaSqft: property.areaSqft || 0,
      yearBuilt: property.yearBuilt || 0,
      amenities: property.amenities || [],
      images: property.images || [],
      status: property.status || 'available',
      views: property.views || 0,
      featured: property.featured || false,
      createdAt: property.createdAt
    };

    res.json(mappedProperty);
  } catch (error) {
    console.error("Error fetching property details from MongoDB:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET Property Reviews API
app.get("/api/properties/:id/reviews", async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: "Database not connected yet" });
    }
    const reviewsCollection = db.collection("reviews");
    const propertyId = req.params.id;

    // Aggregate with lookup to join user collection details
    const reviews = await reviewsCollection.aggregate([
      { $match: { propertyId: propertyId } },
      {
        $lookup: {
          from: "user",
          localField: "userId",
          foreignField: "_id",
          as: "userDetails"
        }
      },
      {
        $unwind: {
          path: "$userDetails",
          preserveNullAndEmptyArrays: true
        }
      }
    ]).toArray();

    // Map to the output structure required by frontend
    const mappedReviews = reviews.map(rev => ({
      id: rev._id.toString(),
      author: rev.userDetails?.name || rev.userDetails?.email || "Anonymous User",
      rating: rev.rating || 5,
      date: rev.createdAt ? new Date(rev.createdAt).toLocaleDateString("en-US", {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }) : "Recent",
      comment: rev.comment || ""
    }));

    res.json(mappedReviews);
  } catch (error) {
    console.error("Error fetching property reviews:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
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