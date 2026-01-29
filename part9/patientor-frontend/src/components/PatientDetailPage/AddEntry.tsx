import { useState, useEffect, ChangeEvent } from "react";
import {
  BaseEntry,
  EntryWithoutId,
  HealthCheckEntry,
  HospitalEntry,
  OccupationalHealthCareEntry,
  UnionOmit,
} from "../../types";
import patientsServices from "../../services/patients";
import diagnosesServices from "../../services/diagnosis";
import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  TextField,
  FormControl,
  FormLabel,
  Radio,
  RadioGroup,
  FormControlLabel,
  Box,
  InputLabel,
  NativeSelect,
  Alert,
} from "@mui/material";

const defaultEntry: UnionOmit<BaseEntry, "id"> = {
  date: "",
  specialist: "",
  diagnosisCodes: [],
  description: "",
};

type EntryType = "HealthCheck" | "Hospital" | "OccupationalHealthcare";

const AddEntry = () => {
  const [entryData, setEntryData] = useState<
    EntryWithoutId | UnionOmit<BaseEntry, "id">
  >(defaultEntry);
  const [defaultDiagnosisCodes, setDefaultDiagnosisCode] = useState<string[]>(
    [],
  );

  const [diagnosisCode, setDiagnosisCode] = useState<string>("");
  const [entryType, setEntryType] = useState<EntryType | null>(null);
  const { id } = useParams();
  const [date, setDate] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const addDiagnosisCode = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();
    if (entryData.diagnosisCodes?.includes(diagnosisCode)) {
      setDiagnosisCode("");
      return;
    }
    setEntryData((prev) => ({
      ...prev,
      diagnosisCodes: prev.diagnosisCodes?.concat(diagnosisCode),
    }));
    setDiagnosisCode("");
  };

  const setErrorMessage = (message: string) => {
    setMessage(message);
    setTimeout(() => setMessage(""), 5000);
  };

  const addEntry = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!id) return;
    try {
      const response = await patientsServices.addEntry(
        id,
        entryData as EntryWithoutId,
      );

      if (!response) return;
      navigate(0);
    } catch (error: unknown) {
      if (error instanceof Error) setErrorMessage(error.message);
      else console.error(error);
    }
  };

  const resetForm = () => {
    setEntryData(defaultEntry);
    setDiagnosisCode("");
  };

  const selectDiagnosisCode = (e: ChangeEvent<HTMLSelectElement>) =>
    setDiagnosisCode(e.target.value);

  useEffect(() => {
    diagnosesServices.getAll().then((diagnoses) => {
      setDefaultDiagnosisCode(diagnoses.map((d) => d.code));
    });
  }, []);

  return (
    <>
      {message && (
        <Alert severity="error" className="my-3">
          {message}
        </Alert>
      )}
      <div className="border p-3 rounded">
        <h2 className="pt-5">New Entry</h2>
        <form onSubmit={addEntry}>
          {/* Standard Entry Input */}
          <div className="flex flex-col gap-3">
            <div>
              <FormControl>
                <FormLabel id="demo-controlled-radio-buttons-group">
                  Type
                </FormLabel>
                <RadioGroup
                  aria-labelledby="demo-controlled-radio-buttons-group"
                  name="controlled-radio-buttons-group"
                  value={entryType}
                  onChange={(e) => setEntryType(e.target.value as EntryType)}
                  row
                >
                  <FormControlLabel
                    value="HealthCheck"
                    control={<Radio />}
                    label="Health Check"
                  />
                  <FormControlLabel
                    value="Hospital"
                    control={<Radio />}
                    label="Hospital"
                  />
                  <FormControlLabel
                    value="OccupationalHealthcare"
                    control={<Radio />}
                    label="Occupational Healthcare"
                  />
                </RadioGroup>
              </FormControl>
            </div>
            <div className="flex gap-3">
              <TextField
                type={date ? "date" : ""}
                name="date"
                label="Entry Date"
                value={entryData?.date}
                onFocus={() => setDate(true)}
                onBlur={() => setDate(false)}
                onChange={(e) =>
                  setEntryData((prev) => ({ ...prev, date: e.target.value }))
                }
                required
              ></TextField>
              <TextField
                label="Specialist"
                name="specialist"
                value={entryData?.specialist}
                onChange={(e) =>
                  setEntryData((prev) => ({
                    ...prev,
                    specialist: e.target.value,
                  }))
                }
                required
              ></TextField>
              <TextField
                label="Description"
                name="description"
                value={entryData?.description}
                onChange={(e) =>
                  setEntryData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                required
              ></TextField>
            </div>
            <div className="flex items-center gap-3">
              <Box sx={{ minWidth: 120 }}>
                <FormControl fullWidth>
                  <InputLabel id="diagnosisCode">Diagnosis Code</InputLabel>
                  <NativeSelect
                    value={diagnosisCode}
                    onChange={selectDiagnosisCode}
                  >
                    <option></option>
                    {defaultDiagnosisCodes.map((code) => (
                      <option value={code} key={code}>
                        {code}
                      </option>
                    ))}
                  </NativeSelect>
                </FormControl>
              </Box>
              <TextField
                label="Diagnosis Code"
                name="diagnosisCode"
                value={diagnosisCode}
                onChange={(e) => setDiagnosisCode(e.target.value)}
              ></TextField>
              <Button
                variant="contained"
                onClick={addDiagnosisCode}
                type="button"
              >
                Add Diagnosis
              </Button>
            </div>
            {entryData.diagnosisCodes?.length !== 0 && (
              <p>{JSON.stringify(entryData.diagnosisCodes)}</p>
            )}
            {/* Specific Entry Input */}
            {entryType === "HealthCheck" && (
              <div className="flex gap-3">
                <TextField
                  type="number"
                  label="Health Check Rating"
                  name="healthCheckRating"
                  value={
                    (entryData as HealthCheckEntry).healthCheckRating || ""
                  }
                  onChange={(e) =>
                    setEntryData((prev) => ({
                      ...prev,
                      type: entryType,
                      healthCheckRating: Number(e.target.value),
                    }))
                  }
                  required
                />
              </div>
            )}
            {entryType === "Hospital" && (
              <div className="flex gap-3">
                <TextField
                  type={date ? "date" : ""}
                  label="Start Date"
                  name="DischargeDate"
                  onFocus={() => setDate(true)}
                  onBlur={() => setDate(false)}
                  value={(entryData as HospitalEntry).discharge?.date || ""}
                  onChange={(e) =>
                    setEntryData((prev) => ({
                      ...prev,
                      type: entryType,
                      discharge:
                        "discharge" in prev
                          ? { ...prev.discharge, date: e.target.value }
                          : { date: e.target.value },
                    }))
                  }
                />
                <TextField
                  label="Discharge Criteria"
                  name="DischargeCriteria"
                  value={(entryData as HospitalEntry).discharge?.criteria || ""}
                  onChange={(e) =>
                    setEntryData((prev) => ({
                      ...prev,
                      type: entryType,
                      discharge:
                        "discharge" in prev
                          ? { ...prev.discharge, criteria: e.target.value }
                          : { criteria: e.target.value },
                    }))
                  }
                />
              </div>
            )}
            {entryType === "OccupationalHealthcare" && (
              <div className="flex gap-3">
                <TextField
                  label="Employer Name"
                  name="EmployerName"
                  value={
                    (entryData as OccupationalHealthCareEntry).employerName ||
                    ""
                  }
                  onChange={(e) =>
                    setEntryData((prev) => ({
                      ...prev,
                      type: entryType,
                      employerName: e.target.value,
                    }))
                  }
                  required
                />
                <FormLabel className="font-semibold italic">
                  Sick Leave
                </FormLabel>
                <TextField
                  label="Start Date"
                  type={date ? "date" : ""}
                  name="SickLeaveStartDate"
                  onFocus={() => setDate(true)}
                  onBlur={() => setDate(false)}
                  value={
                    (entryData as OccupationalHealthCareEntry).sickLeave
                      ?.startDate || ""
                  }
                  onChange={(e) =>
                    setEntryData((prev) => ({
                      ...prev,
                      type: entryType,
                      sickLeave:
                        "sickLeave" in prev
                          ? { ...prev.sickLeave, startDate: e.target.value }
                          : { startDate: e.target.value },
                    }))
                  }
                />
                <TextField
                  type={date ? "date" : ""}
                  label="End Date"
                  name="SickLeaveEndDate"
                  onFocus={() => setDate(true)}
                  onBlur={() => setDate(false)}
                  value={
                    (entryData as OccupationalHealthCareEntry).sickLeave
                      ?.endDate || ""
                  }
                  onChange={(e) =>
                    setEntryData((prev) => ({
                      ...prev,
                      type: entryType,
                      sickLeave:
                        "sickLeave" in prev
                          ? { ...prev.sickLeave, endDate: e.target.value }
                          : { startDate: e.target.value },
                    }))
                  }
                />
              </div>
            )}
            <div className="flex justify-between">
              <Button
                className="border rounded cursor-pointer px-2 hover:bg-gray-300"
                variant="contained"
                color="error"
                onClick={resetForm}
              >
                Cancel
              </Button>
              <Button
                className="border rounded cursor-pointer px-2 hover:bg-gray-300"
                type="submit"
                variant="contained"
              >
                Add
              </Button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddEntry;
