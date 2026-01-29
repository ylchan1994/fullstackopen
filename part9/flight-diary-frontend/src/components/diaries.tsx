import { useEffect, useState } from "react";
import type { NonSensitiveDiary } from "../types";
import diariesService from "../services/diariesService";

export const Diaries = () => {
  const [diaries, setDiaries] = useState<NonSensitiveDiary[]>([]);

  useEffect(() => {
    const loadInitialDiaries = async (): Promise<void> => {
      setDiaries(await diariesService.getAllDiaries());
    };

    loadInitialDiaries();
  }, []);

  return (
    <div>
      {diaries.map((diary: NonSensitiveDiary) => (
        <div key={diary.id}>
          <h2>{diary.date}</h2>
          <p>
            visibility: {diary.visibility}
            <br />
            weather: {diary.weather}
          </p>
        </div>
      ))}
    </div>
  );
};
