import { useEffect, useState, ComponentProps } from "react";
import type {
  Diagnosis,
  Entry,
  HealthCheckEntry,
  HospitalEntry,
  OccupationalHealthCareEntry,
} from "../../types";
import diagnosesServices from "../../services/diagnosis";
import FavoriteIcon from "@mui/icons-material/Favorite";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import WorkIcon from "@mui/icons-material/Work";
import { assertNever } from "../../lib/utils";
import AddEntry from "./AddEntry";

const EntryView = ({ entries }: { entries: Entry[] }) => {
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);

  const Diagnoses = ({ diagnosisCodes }: { diagnosisCodes: string[] }) => {
    if (!diagnosisCodes) return;

    return (
      <div>
        <ul>
          {diagnosisCodes.map((code) => (
            <li key={code}>
              {code} {diagnoses?.find((d) => d.code === code)?.name}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const HealthCheckEntry = ({
    entry,
    ...props
  }: {
    entry: HealthCheckEntry;
  } & ComponentProps<"div">) => {
    const getHeartColor = (rating: number) => {
      switch (rating) {
        case 3:
          return undefined;
        case 2:
          return "error";
        case 1:
          return "warning";
        case 0:
          return "success";
        default:
          return undefined;
      }
    };

    return (
      <div {...props} className="border rounded p-2 my-1">
        <div className="flex">
          <p>{entry.date} </p>
          <HealthAndSafetyIcon />
        </div>
        <p className="italic">{entry.description}</p>
        {entry.diagnosisCodes && (
          <Diagnoses diagnosisCodes={entry.diagnosisCodes} />
        )}
        <FavoriteIcon color={getHeartColor(entry.healthCheckRating)} />
        <p>Diagnose by {entry.specialist}</p>
      </div>
    );
  };

  const HospitalEntry = ({
    entry,
    ...props
  }: { entry: HospitalEntry } & ComponentProps<"div">) => {
    return (
      <div {...props} className="border rounded p-2 my-1">
        <div className="flex">
          <p>{entry.date} </p>
          <LocalHospitalIcon />
        </div>
        <p className="italic">{entry.description}</p>
        {entry.diagnosisCodes && (
          <Diagnoses diagnosisCodes={entry.diagnosisCodes} />
        )}
        {entry.discharge && (
          <p>
            Discharged on {entry.discharge.date} under{" "}
            {entry.discharge.criteria}
          </p>
        )}
        <p>Diagnose by {entry.specialist}</p>
      </div>
    );
  };

  const OccupationalHealthCareEntry = ({
    entry,
    ...props
  }: {
    entry: OccupationalHealthCareEntry;
  } & ComponentProps<"div">) => {
    return (
      <div {...props} className="border rounded p-2 my-1">
        <div className="flex">
          <p>{entry.date} </p>
          <WorkIcon />
          <p>{entry.employerName}</p>
        </div>
        <p className="italic">{entry.description}</p>
        {entry.sickLeave && (
          <div>
            <p className="italic font-semibold pt-2">Sick leave: </p>
            <ul className="pb-3">
              <li key={entry.sickLeave.startDate}>
                start: {entry.sickLeave?.startDate}
              </li>
              <li key={entry.sickLeave.endDate}>
                end: {entry.sickLeave?.endDate}
              </li>
            </ul>
          </div>
        )}
        {entry.diagnosisCodes && (
          <Diagnoses diagnosisCodes={entry.diagnosisCodes} />
        )}
        <p>Diagnose by {entry.specialist}</p>
      </div>
    );
  };

  const getEntry = (entry: Entry) => {
    switch (entry.type) {
      case "HealthCheck":
        return <HealthCheckEntry entry={entry} key={entry.id} />;
      case "Hospital":
        return <HospitalEntry entry={entry} key={entry.id} />;
      case "OccupationalHealthcare":
        return <OccupationalHealthCareEntry entry={entry} key={entry.id} />;
      default:
        return assertNever(entry);
    }
  };

  useEffect(() => {
    const getDiagnoses = async (): Promise<void> => {
      const diagnoses = await diagnosesServices.getAll();
      setDiagnoses(diagnoses);
    };

    getDiagnoses();
  }, []);

  if (!entries) return;

  return (
    <div>
      <AddEntry />
      <h3>Entries</h3>
      <div>{entries.map((entry) => getEntry(entry))}</div>
    </div>
  );
};

export default EntryView;
