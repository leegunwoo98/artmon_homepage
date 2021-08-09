import express from "express";
import cors from "cors";
import property from "./api/router/property.route.js ";
import date from "./api/router/date.route.js"
import booking from "./api/router/booking.route.js"
import webhook from "./webhook/webhook.js"
const port = process.env.PORT || 8000;

const app = express()

app.use(cors());
app.use(express.json());

app.use("/api/v1/property", property);
app.use("/api/v1/date", date)
app.use("/api/v1/booking", booking)
app.get("/webhook",webhook.recieve_booking)
app.post("/webhook",webhook.recieve_booking_post)

app.use("*", (req, res) => res.status(404).json({ error: "not found" }));

export default app;
