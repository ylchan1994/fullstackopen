import z from "zod";
import { Gender } from "./types/patients";

export const NewPatientsEntry = z.object({
  name: z.string(),
  dateOfBirth: z.iso.date(),
  gender: z.enum(Gender),
  ssn: z.string(),
  occupation: z.string(),
});
