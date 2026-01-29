import diagnoses from "../data/diagnoses";
import { Diagnosis } from "../types/diagnosis";

const getDiagnoses = (): Diagnosis[] => {
  return diagnoses;
};

export default {
  getDiagnoses,
};
