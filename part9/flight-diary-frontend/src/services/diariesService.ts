import axios from "axios";
import type { Diary, DiaryEntry, NonSensitiveDiary } from "../types";

const baseUrl = "/api/diaries";

const getAllDiaries = async (): Promise<NonSensitiveDiary[]> => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const addNewDiary = async (diary: DiaryEntry): Promise<Diary> => {
  try {
    const response = await axios.post(baseUrl, diary);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data || error.message);
    } else if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Unknown error occurred");
  }
};

export default { getAllDiaries, addNewDiary };
