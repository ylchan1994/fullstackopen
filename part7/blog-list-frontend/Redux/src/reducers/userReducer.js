import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "notifications",
  initialState: {
    message: null,
    style: null,
  },
  reducers: {
    setUser(_state, action) {
      return action.payload;
    },
  },
});

export default userSlice.reducer;
export const { setUser } = userSlice.actions;
