import express from "express";
import studentsRouter from "./routes/students";
import collections from "./routes/collections";
import payments from "./routes/payments";
import cors from "cors";
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use(express.raw({ type: "application/vnd.custom-type" }));
app.use(express.text({ type: "text/html" }));

app.use("/students", studentsRouter);
app.use("/collections", collections);
app.use("/payments", payments);

app.listen(Number(port), "0.0.0.0", () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
