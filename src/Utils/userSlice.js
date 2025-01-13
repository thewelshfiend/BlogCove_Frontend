import { createSlice } from "@reduxjs/toolkit";

const userInfo = createSlice({
    name: 'userInfo',
    initialState: {},
    reducers: {
        addInfo: (state, action) => {
            state.name = action.payload.name;
            state.email = action.payload.email;
            state.username = action.payload.username;
        },
        deleteInfo: () => ({})
    }
});

export const { addInfo, deleteInfo } = userInfo.actions;
export default userInfo.reducer;