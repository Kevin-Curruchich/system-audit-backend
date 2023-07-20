import express from "express";
import studentsRouter from "./routes/students";
import collections from "./routes/collections";
import payments from "./routes/payments";
import quartets from "./routes/quarters";
import user from "./routes/user";
import reports from "./routes/reports";
import auth from "./routes/auth";
import cors from "cors";
import { isAuthenticated } from "./middlewares/authMiddleware";
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use(express.raw({ type: "application/vnd.custom-type" }));
app.use(express.text({ type: "text/html" }));

app.use("/", auth);
app.use("/user", user);
app.use("/reports", reports);
app.use("/students", isAuthenticated, studentsRouter);
app.use("/collections", isAuthenticated, collections);
app.use("/payments", isAuthenticated, payments);
app.use("/quartes", isAuthenticated, quartets);

app.listen(Number(port), "0.0.0.0", () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
