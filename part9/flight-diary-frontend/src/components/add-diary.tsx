import { useState, type FormEvent } from "react";
import { Visibility, Weather, type DiaryEntry } from "../types";
import diariesService from "../services/diariesService";

const defaultForm = {
  date: "",
  visibility: "" as Visibility,
  weather: "" as Weather,
  comment: "",
};

export const AddDiary = () => {
  const [formData, setFormData] = useState<DiaryEntry>(defaultForm);
  const [alertMessage, setAlertMessage] = useState<string>("");

  const setAlert = (message: string): void => {
    setAlertMessage(message);
    setTimeout(() => setAlertMessage(""), 5000);
  };

  const addNewDiary = async (e: FormEvent<Element>): Promise<void> => {
    e.preventDefault();
    try {
      await diariesService.addNewDiary(formData);
      setFormData(defaultForm);
      window.location.replace("/");
    } catch (error) {
      if (error instanceof Error) setAlert(error.message);
    }
  };

  return (
    <div>
      <p style={{ color: "red" }}>{alertMessage}</p>
      <form onSubmit={addNewDiary}>
        <div>
          <label htmlFor="date">date</label>
          <input
            name="date"
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, date: e.target.value }))
            }
            value={formData.date}
            placeholder="YYYY-MM-DD"
            type="date"
          ></input>
        </div>
        <div>
          <legend>Visibility</legend>
          {Object.values(Visibility).map((visibility) => (
            <>
              <input
                name="visibility"
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    visibility: e.target.value as Visibility,
                  }))
                }
                value={visibility}
                type="radio"
                id={visibility}
              ></input>
              <label htmlFor={visibility}>{visibility}</label>
            </>
          ))}
        </div>
        <div>
          <legend>weather</legend>
          {Object.values(Weather).map((weather) => (
            <>
              <input
                name="weather"
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    weather: e.target.value as Weather,
                  }))
                }
                value={weather}
                type="radio"
                id={weather}
              ></input>
              <label htmlFor={weather}>{weather}</label>
            </>
          ))}
        </div>
        <div>
          <label htmlFor="comment">comment</label>
          <input
            name="comment"
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, comment: e.target.value }))
            }
            value={formData.comment}
          ></input>
        </div>
        <button type="submit">Add</button>
      </form>
    </div>
  );
};
