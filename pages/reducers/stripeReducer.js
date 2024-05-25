import { createSlice } from "@reduxjs/toolkit";

export const StripeReducer = createSlice({
  name: "stripe_session_id",
  initialState: {
    stripe_session_id: null,
  },

  reducers: {
    setSessionID: (state, action) => {
      state.stripe_session_id = action.payload;
      // state.push(action.payload)
    },
  },
});
export const { setSessionID } = StripeReducer.actions;

export const SelectSessionID = (state) =>
  state.stripe_session_id.stripe_session_id; //this will goto "name : "planName"" and get the plan from its state initialized
export default StripeReducer.reducer;
