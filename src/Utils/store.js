import { configureStore } from "@reduxjs/toolkit";
import userInfoReducer from "./userSlice";
import followingIDsReducer from "./followingSlice";
import isLoggedInReducer from "./loginSlice";

const store = configureStore({
    reducer: {
        userInfo: userInfoReducer,
        followingIDs: followingIDsReducer,
        isLoggedIn: isLoggedInReducer
    }
});

export default store