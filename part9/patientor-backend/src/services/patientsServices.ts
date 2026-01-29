import dbPatients from "../data/patients";
import {
  EntryWithoutId,
  NoSSNPatients,
  Patients,
  PatientsEntry,
} from "../types/patients";
import { v1 as uuid } from "uuid";

let patients: Patients[] = dbPatients;

const getAllPatients = (): Patients[] => {
  const newPatients: Patients[] = patients.map((patient: Patients) => {
    const { id, name, dateOfBirth, gender, occupation, entries, ssn } = patient;
    return {
      id,
      name,
      dateOfBirth,
      gender,
      occupation,
      entries,
      ssn,
    };
  });

  return newPatients;
};

const getPatientWithoutSsn = (): NoSSNPatients[] => {
  const newPatients: NoSSNPatients[] = patients.map((patient: Patients) => {
    const { id, name, dateOfBirth, gender, occupation, entries } = patient;
    return {
      id,
      name,
      dateOfBirth,
      gender,
      occupation,
      entries,
    };
  });

  return newPatients;
};

const addPatients = (patient: PatientsEntry): NoSSNPatients => {
  const newPatientEntry = {
    id: uuid(),
    ...patient,
    entries: [],
  };

  patients.push(newPatientEntry);
  return newPatientEntry;
};

const addEntry = (id: string, entry: EntryWithoutId): Patients | undefined => {
  const found = patients.find((patient) => id === patient.id);
  if (!found) return;

  const newEntry = {
    id: uuid(),
    ...entry,
  };
  const newPatientEntry: Patients = found;

  patients = patients.map((patient) => {
    if (patient.id === id) {
      newPatientEntry.entries = newPatientEntry.entries.concat(newEntry);
      return newPatientEntry;
    }
    return patient;
  });

  return newPatientEntry;
};

export default { getAllPatients, getPatientWithoutSsn, addPatients, addEntry };
