import { createSlice } from "@reduxjs/toolkit";

const isLoggedIn = createSlice({
    name: 'isLoggedIn',
    initialState: false,
    reducers: {
        set: () => (true),
        unset: () => (false)
    }
});

export const { set, unset } = isLoggedIn.actions;
export default isLoggedIn.reducer;