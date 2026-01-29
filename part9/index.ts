import express from "express";
import { isNotNumber } from "./utils.ts";
import { calculateBmi } from "./bmiCalculator.ts";
import { Input, exerciseCalculator } from "./exerciseCalculator.ts";

const app = express();
app.use(express.json());

app.get("/ping", (_req, res) => {
  res.send("pong");
});

app.get("/bmi", (req, res) => {
  const { height, weight } = req.query as { height: string; weight: string };
  if (isNotNumber(height) || isNotNumber(weight))
    return res.status(400).json({ error: "malformatted parameter" });
  return res.send(calculateBmi(Number(height), Number(weight)));
});

app.post("/exercises", (req, res) => {
  const { daily_exercises, target } = req.body as unknown as Input;
  if (!daily_exercises || !target)
    return res.status(400).json({ error: "parameters missing" });

  if (
    !daily_exercises.every((e) => {
      console.log(e, Number(e), Number(e) === e);
      return Number(e) === e;
    }) ||
    target !== Number(target)
  ) {
    console.log("This if statement is run");
    return res.status(400).json({ error: "malformatted parameters" });
  }

  return res.send(exerciseCalculator(req.body as unknown as Input));
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
