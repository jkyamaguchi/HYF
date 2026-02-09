import express from "express";
import knex from "knex";

// Set up express server
const app = express();
app.use(express.json()); // Support JSON content types in requests

// Serve frontend files from the app directory
app.use(express.static("../app/html"));
app.use("/images", express.static("../app/images"));
app.use("/scripts", express.static("../app/scripts"));

// Set up database - Creates an instance of the Knex library
// connected to our SQLite database file.
const db = knex({
  client: "sqlite3",
  connection: { filename: "./database.db" },
  useNullAsDefault: true, // Required for SQLite
});

// GET endpoint for listing all users from the database table "users"
app.get("/users", async function (request, response) {
  // Get all users from the database
  const rows = await db.raw("SELECT * FROM users");
  response.json(rows); // Respond with the users list in JSON format
});

// Start the server on port 3000 on your local machine
app.listen(3000, () => {
  console.log("App running on http://localhost:3000. Type Ctrl+C to stop.");
});

// GET endpoint for listing all cards from the database table "card"
app.get("/cards", async function (request, response) {
  const rows = await db.raw("SELECT * FROM card");
  response.json(rows); // Respond with the cards list in JSON format
});

// GET endpoint for a specific config value
app.get("/config/:key", async function (request, response) {
  try {
    const { key } = request.params;
    const rows = await db.raw("SELECT value FROM config WHERE key = ?", [key]);

    const value = rows.length > 0 ? rows[0].value : "cardFront.jpg";
    response.json({ value });
  } catch (error) {
    console.error("Config endpoint error:", error);
    response
      .status(500)
      .json({ error: "Database error", value: "cardFront.jpg" });
  }
});
