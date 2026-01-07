import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notifications",
  initialState: {
    message: null,
    style: null,
  },
  reducers: {
    setNotification(_state, action) {
      return action.payload;
    },
  },
});

export default notificationSlice.reducer;
export const { setNotification } = notificationSlice.actions;
