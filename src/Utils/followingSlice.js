import { createSlice } from "@reduxjs/toolkit";

const followingIDs = createSlice({
    name: 'followingIDs',
    initialState: {},
    reducers: {
        initializeIDs: (state, action) => (action.payload),
        addId: (state, action) => {
            state[action.payload] = true;
        },
        deleteID: (state, action) => {
            state[action.payload] = false;
        },
        wipeIDs: () => ({})
    }
});

export const { initializeIDs, addId, deleteID, wipeIDs } = followingIDs.actions;
export default followingIDs.reducer;