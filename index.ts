import express, { Request, Response } from "express";
import cors from "cors";
import { MongoClient, ServerApiVersion, ObjectId, Db } from "mongodb";
import "dotenv/config";

const app = express();
const port = process.env.PORT || 8000;
const uri = process.env.MONGO_URI!;

app.use(express.json());
app.use(cors());

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let db: Db | null = null;

async function getDb(): Promise<Db> {
  if (!db) {
    await client.connect();
    db = client.db("nestFind");
  }
  return db;
}

function parseId(id: string): ObjectId | string {
  try {
    return new ObjectId(id);
  } catch {
    return id;
  }
}

async function seedDatabase() {
  try {
    const database = await getDb();
    const seedUsers = [
      { _id: "usr_buyer_001", name: "Tanvir Rahman", email: "tanvir@example.com", role: "buyer" },
      { _id: "usr_buyer_002", name: "Sarah Jenkins", email: "sarah.j@example.com", role: "buyer" },
    ];
    const usersCollection = database.collection<any>("user");
    for (const u of seedUsers) {
      await usersCollection.updateOne({ _id: u._id }, { $set: u }, { upsert: true });
    }

    const seedReviews = [
      {
        _id: "rev_0001",
        propertyId: "prop_0001",
        userId: "usr_buyer_002",
        rating: 5,
        comment: "Toured this apartment last month – the finishing and natural light are exceptional. Extremely quiet neighborhood.",
        createdAt: "2026-01-08T12:00:00.000Z",
      },
      {
        _id: "rev_0002",
        propertyId: "prop_0003",
        userId: "usr_buyer_001",
        rating: 4,
        comment: "Great house with a lot of privacy, though the road leading up the hill is a bit narrow. Beautiful layout and views.",
        createdAt: "2026-01-05T15:30:00.000Z",
      },
      {
        _id: "rev_0003",
        agentId: "usr_agent_001",
        userId: "usr_buyer_001",
        rating: 5,
        comment: "Tanvir was very responsive and arranged viewings quickly around my schedule. Highly recommended!",
        createdAt: "2026-01-07T09:15:00.000Z",
      },
      {
        _id: "rev_0004",
        propertyId: "prop_0001",
        userId: "usr_buyer_001",
        rating: 4,
        comment: "Excellent Gulshan 2 location, walking distance to all major cafes and restaurants. Clean building management.",
        createdAt: "2026-02-14T10:00:00.000Z",
      },
      {
        _id: "rev_0005",
        propertyId: "prop_0002",
        userId: "usr_buyer_002",
        rating: 5,
        comment: "Superb flat! The rent is very reasonable for this part of Banani. Clean corridors and friendly security.",
        createdAt: "2026-03-01T11:20:00.000Z",
      },
      {
        _id: "rev_0006",
        propertyId: "prop_0004",
        userId: "usr_buyer_001",
        rating: 5,
        comment: "Highly functional office layout in Agrabad. Excellent backup generator uptime and high-speed internet provisions.",
        createdAt: "2026-04-10T14:45:00.000Z",
      },
    ];
    const reviewsCollection = database.collection<any>("reviews");
    const revCount = await reviewsCollection.countDocuments();
    if (revCount < 6) {
      for (const review of seedReviews) {
        await reviewsCollection.updateOne({ _id: review._id }, { $set: review }, { upsert: true });
      }
    }

    const seedTestimonials = [
      {
        _id: "test_001",
        stars: 5,
        text: "NestFind turned a stressful search into an absolute pleasure. Their attention to architectural detail was exactly what I needed for my new studio.",
        name: "David Chen",
        role: "Architectural Designer",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCDSHBLjyW5B5BEZSvUtoSCahEvz_qLNUkLPI290RtsYWTHhXsJq933jued5Sypyt9sOuxU90Jn7issmmBG1A1wgNqUpYJHJ_iN_aZXa7ZRywa43MvcPPrmFEMr6vVVYeqmZAcmknR17VZ9LLn-8WIGlGe_7DCI-Ccwel1i3272Ut3S9T1SSP-DX-myAM6kUduhstOYM75kXk7iMnhNksJHQQGGqTqtXwKZbLgH_skltEoSxNtUg-6JQw",
      },
      {
        _id: "test_002",
        stars: 5,
        text: "The level of professionalism and the quality of listings on this platform are unmatched. We found our forever home in just two weeks!",
        name: "The Robertsons",
        role: "New Homeowners",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAohxZgtyBsLeEJnpY4Q6iuoQu3UN8PHyOABRy_NfdsGgzO6EE7PoXYFlQ_K0UfuQGJlYOm6U69O61xfYnhHBHyAWQO0Mh_XWGQx-iYF44knbhQ10CJ1k_AdXTDiT5TTF9BoPv0PbMAzS4EbxkKSLwa7Xbq7BVrfounVd7DPBur2UkpQ5V77WsVdHWqJqrlGa6ltSViRaxMN00Zp8wv2Yv1rOBRj8TKP7CKgmGuPptSfCHFj1Pv_443Fg",
      },
      {
        _id: "test_003",
        stars: 5,
        text: "I've worked with many real estate platforms, but NestFind's data-driven approach and premium interface make it my primary tool now.",
        name: "James Wilson",
        role: "Real Estate Investor",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCH1jqohf3Cdx4U37V0h9hCdpBsD1p-ZaPrGNXxOHIMuU1vsnFe9bYaKzEQBLI3w_lEwioak5H8G5D6ZOVqfbjsYjWL9ia9K1xH6PoA4VVunH-AoQLN-VLXe0zrcJSnTMAJonxM05Ooe0-CsJnS2owVrymmeTlFHsrQHkpJynQSDVooRNxQqJx8-gDkSoQNQNgpvJVd1QI781DiObAzTzsIi1f8FBCx3sJ71y_mlD-LuS22g-PzzSPwLA",
      },
    ];
    const testimonialsCollection = database.collection<any>("testimonials");
    const testCount = await testimonialsCollection.countDocuments();
    if (testCount === 0) {
      await testimonialsCollection.insertMany(seedTestimonials);
    }

    const seedAgents = [
      {
        _id: "agent_001",
        name: "Sarah Kensington",
        role: "Luxury Estates Specialist",
        listings: 142,
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuANKYAq-CmnmP7LW7b3gmiUW44BsRdOyEJq9kpQwLmWq0yLKgip9BXyShzFOwzeDtnlWYdfezIUK4zXs8kZiPf4U6IE_fYD2k0rL3zRTkOF6UbRaAN0bNH97arBDJs5Z-fUGssH0uX9fcZaG-Z9x9Hi_CEkR3nloE3vgozZU94HZ9pUExV6jwOUps7YAZJSypbtKyGQOsIRGBgbxYpokFhWu7ORLEN3mTdxolEZ7nSZjuDM5Zm0wn8MYw",
      },
      {
        _id: "agent_002",
        name: "Marcus Thorne",
        role: "Urban Loft Expert",
        listings: 98,
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAZEuricKO0ilqfki-QJolibxLhVLIoYROQPk6Wi_0Ej-IJBTGc5MphMUdeGQ6Px0Pe5_IihUJngE9HMBhDHwZnzVFcuSwNe9cvhUWHKlOVwLkJNqYsebbt2xmi9ctV9v2pswO_S181rU2nBdul1MwZN63bI_nkdKIEz_wqc2OwA3DJadc9_AolCBYH-oRqo1uTRIBUHZ6QWv8aki0vQEVCHm0qYNoYmkglI4SfixwfAxgeG_FKxn9meg",
      },
      {
        _id: "agent_003",
        name: "Elena Rodriguez",
        role: "Investment Portfolio Advisor",
        listings: 115,
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCR28PLdjQrSjB_LZhc3apJZHb4Axe6BJa1-qHRWD1fmpawre3n2ASMa74ngwRCh11dePP_HkZEHW9uXyov8EihSR8F7S9QCjkNJfmlXbS5OnQXphTHu4CKZTz_-y2M1XvZGMAIsoJ6K1hfDnrIz7oQxe0Vr4MCF9hN6sm7D0dYkpV1c28tTrGN9yiw1ksepw8cXGC9nC-mcWbhDceW6E6sIdcgd2slvcUGPMf4aKZ0O8gBd545nKKT8g",
      },
    ];
    const agentsCollection = database.collection<any>("agents");
    const agentCount = await agentsCollection.countDocuments();
    if (agentCount === 0) {
      await agentsCollection.insertMany(seedAgents);
    }
  } catch (error) {
    console.error("Seeding error:", error);
  }
}

app.get("/api/properties", async (req: Request, res: Response) => {
  try {
    const database = await getDb();
    const agentId = req.query.agentId as string | undefined;
    const q = req.query.q as string | undefined;
    const category = req.query.category as string | undefined;
    const sort = req.query.sort as string | undefined;

    const filter: any = {};
    if (agentId) filter.agentId = agentId;

    if (q && q.trim()) {
      const regex = new RegExp(q.trim(), "i");
      filter.$or = [
        { title: regex },
        { "location.area": regex },
        { "location.city": regex },
        { "location.address": regex },
      ];
    }

    if (category && category !== "all") {
      filter.propertyType = new RegExp(`^${category}$`, "i");
    }

    let sortOption: any = { createdAt: -1 };
    if (sort === "price_asc") sortOption = { price: 1 };
    else if (sort === "price_desc") sortOption = { price: -1 };

    const result = await database
      .collection("properties")
      .find(filter)
      .sort(sortOption)
      .toArray();

    const mappedProperties = result.map((p) => ({
      id: p._id.toString(),
      title: p.title,
      price: p.price,
      location:
        p.location && typeof p.location === "object"
          ? `${p.location.area || ""}, ${p.location.city || ""}`.replace(/^, |, $/, "")
          : p.location || "",
      beds: p.bedrooms || 0,
      baths: p.bathrooms || 0,
      isNew: p.featured || false,
      image:
        Array.isArray(p.images) && p.images.length > 0
          ? p.images[0]
          : p.image || "",
    }));

    res.json(mappedProperties);
  } catch (error) {
    console.error("GET /api/properties:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/properties", async (req: Request, res: Response) => {
  try {
    const database = await getDb();
    const newProperty = {
      ...req.body,
      createdAt: new Date().toISOString(),
      views: 0,
      status: "available",
      featured: false,
    };

    const result = await database.collection("properties").insertOne(newProperty);
    res.status(201).json({ id: result.insertedId });
  } catch (error) {
    console.error("POST /api/properties:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/properties/:id", async (req: Request, res: Response) => {
  try {
    const database = await getDb();
    const idParam = req.params.id as string;
    const query = { _id: parseId(idParam) as any };
    const property = await database.collection("properties").findOne(query);
    if (!property) return res.status(404).json({ error: "Property not found" });

    res.json({
      id: property._id.toString(),
      title: property.title,
      shortDescription: property.shortDescription || "",
      fullDescription: property.fullDescription || "",
      propertyType: property.propertyType || "apartment",
      listingType: property.listingType || "sale",
      price: property.price,
      currency: property.currency || "BDT",
      location: property.location || {},
      bedrooms: property.bedrooms || 0,
      bathrooms: property.bathrooms || 0,
      areaSqft: property.areaSqft || 0,
      yearBuilt: property.yearBuilt || 0,
      amenities: property.amenities || [],
      images: property.images || [],
      status: property.status || "available",
      views: property.views || 0,
      featured: property.featured || false,
      createdAt: property.createdAt,
    });
  } catch (error) {
    console.error("GET /api/properties/:id:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.patch("/api/properties/:id", async (req: Request, res: Response) => {
  try {
    const database = await getDb();
    const idParam = req.params.id as string;
    const query = { _id: parseId(idParam) as any };
    const updateDoc = { $set: { ...req.body, updatedAt: new Date().toISOString() } };
    const result = await database.collection("properties").updateOne(query, updateDoc);
    if (result.matchedCount === 0) return res.status(404).json({ error: "Property not found" });

    res.json({ message: "Property updated successfully" });
  } catch (error) {
    console.error("PATCH /api/properties/:id:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete("/api/properties/:id", async (req: Request, res: Response) => {
  try {
    const database = await getDb();
    const idParam = req.params.id as string;
    const query = { _id: parseId(idParam) as any };
    const result = await database.collection("properties").deleteOne(query);
    if (result.deletedCount === 0) return res.status(404).json({ error: "Property not found" });

    res.json({ message: "Property deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/properties/:id:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/properties/:id/reviews", async (req: Request, res: Response) => {
  try {
    const database = await getDb();
    const idParam = req.params.id as string;
    const reviews = await database
      .collection("reviews")
      .aggregate([
        { $match: { propertyId: idParam } },
        {
          $lookup: {
            from: "user",
            localField: "userId",
            foreignField: "_id",
            as: "userDetails",
          },
        },
        { $unwind: { path: "$userDetails", preserveNullAndEmptyArrays: true } },
        { $sort: { createdAt: -1 } },
      ])
      .toArray();

    const mapped = reviews.map((rev) => ({
      id: rev._id.toString(),
      author: rev.userDetails?.name || rev.userDetails?.email || "Anonymous",
      rating: rev.rating || 5,
      date: rev.createdAt
        ? new Date(rev.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : "Recent",
      comment: rev.comment || "",
    }));

    res.json(mapped);
  } catch (error) {
    console.error("GET /api/properties/:id/reviews:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/testimonials", async (req: Request, res: Response) => {
  try {
    const database = await getDb();
    const testimonials = await database
      .collection("testimonials")
      .find({})
      .toArray();

    const mapped = testimonials.map((t) => ({
      id: t._id.toString(),
      stars: t.stars || 5,
      text: t.text,
      name: t.name,
      role: t.role,
      image: t.image || "",
    }));

    res.json(mapped);
  } catch (error) {
    console.error("GET /api/testimonials:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/agents", async (req: Request, res: Response) => {
  try {
    const database = await getDb();
    const agents = await database.collection("agents").find({}).toArray();

    const mapped = agents.map((a) => ({
      id: a._id.toString(),
      name: a.name,
      role: a.role,
      listings: a.listings || 0,
      image: a.image || "",
    }));

    res.json(mapped);
  } catch (error) {
    console.error("GET /api/agents:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/stats", async (req: Request, res: Response) => {
  try {
    const database = await getDb();
    const [propertyCount, agentCount] = await Promise.all([
      database.collection("properties").countDocuments(),
      database.collection("agents").countDocuments(),
    ]);

    const cityDocs = await database
      .collection("properties")
      .distinct("location.city");

    res.json({
      properties: propertyCount,
      cities: cityDocs.length || 0,
      clients: 12000,
      agents: agentCount,
    });
  } catch (error) {
    console.error("GET /api/stats:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/", (req: Request, res: Response) => {
  res.json({ status: "ok", message: "NestFind API is running" });
});

// Trigger seeding
seedDatabase();

app.listen(port, () => {
  console.log(`NestFind server is running on port ${port}`);
});
