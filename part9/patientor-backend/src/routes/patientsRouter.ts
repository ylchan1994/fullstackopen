import express, { NextFunction, Response, Request } from "express";
import patientsServices from "../services/patientsServices";
import {
  EntryWithoutId,
  NoSSNPatients,
  Patients,
  PatientsEntry,
} from "../types/patients";
import { NewPatientsEntry } from "../utils";
import { ZodError } from "zod";

const router = express.Router();

const newPatientParser = (req: Request, _res: Response, next: NextFunction) => {
  try {
    NewPatientsEntry.parse(req.body);
    next();
  } catch (error: unknown) {
    next(error);
  }
};

const middlewareError = (
  error: unknown,
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  let errorMessage = "Something went wrong :(";
  if (error instanceof ZodError) {
    res.status(400).send(error.issues);
  } else if (error instanceof Error) {
    errorMessage = "Error: " + error.message;
    res.status(400).send({ error: errorMessage });
  } else {
    next(error);
  }
};

router.get("/", (_req, res: Response<NoSSNPatients[]>) => {
  res.send(patientsServices.getPatientWithoutSsn());
});

router.post(
  "/",
  newPatientParser,
  (
    req: Request<unknown, unknown, PatientsEntry>,
    res: Response<NoSSNPatients>,
  ) => {
    const addedEntry = patientsServices.addPatients(req.body);
    res.json(addedEntry);
  },
);

router.get("/:id", (req, res: Response<Patients>) => {
  const requestId = req.params.id;
  const patientsList = patientsServices.getAllPatients();
  res.send(patientsList.filter((patient) => patient.id === requestId)[0]);
});

router.post(
  "/:id/entries",
  (
    req: Request<{ id: string }, unknown, EntryWithoutId>,
    res: Response<Patients>,
  ) => {
    const id = req.params?.id;
    const modifiedPatient = patientsServices.addEntry(id, req.body);
    // if (!modifiedPatient)
    //   return res.status(400).json({ error: "Patient Not found" });
    res.json(modifiedPatient);
  },
);

router.use(middlewareError);

export default router;
