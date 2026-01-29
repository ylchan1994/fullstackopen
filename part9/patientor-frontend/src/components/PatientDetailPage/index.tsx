import { useEffect, useState } from "react";
import patientService from "../../services/patients";
import { useParams } from "react-router-dom";
import { Patient } from "../../types";
import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";
import TransgenderIcon from "@mui/icons-material/Transgender";
import EntryView from "./EntryView";

const PatientDetail = () => {
  const [patient, setPatient] = useState<Patient | null>(null);
  const { id } = useParams();

  useEffect(() => {
    if (!id) return;
    const getPatient = async () => {
      const response = await patientService.getPatient(id);
      setPatient(response);
    };

    getPatient();
  }, [id]);

  if (!patient) return;

  return (
    <div className="App">
      <div>
        <h2>
          {patient.name}&nbsp;
          {patient.gender === "male" ? (
            <MaleIcon />
          ) : patient.gender === "female" ? (
            <FemaleIcon />
          ) : (
            <TransgenderIcon />
          )}
        </h2>
        <p>ssn: {patient.ssn}</p>
        <p>occupation: {patient.occupation}</p>

        {patient.entries.length !== 0 && (
          <div>
            <EntryView entries={patient.entries}></EntryView>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientDetail;
