import { createSlice } from "@reduxjs/toolkit";

const MAX_ACTIVITIES = 5;

const loadActivitiesFromStorage = () => {
  try {
    const data = localStorage.getItem("recent_activities");
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveActivitiesToStorage = (activities) => {
  try {
    localStorage.setItem("recent_activities", JSON.stringify(activities));
  } catch {}
};

const initialState = {
  activities: loadActivitiesFromStorage(),
};

const activitySlice = createSlice({
  name: "activity",
  initialState,
  reducers: {
    addActivity: (state, action) => {
      const newActivity = {
        ...action.payload,
        timestamp: new Date().toISOString(),
        id: Date.now(),
      };
      state.activities.unshift(newActivity);
      // Keep only the latest MAX_ACTIVITIES
      if (state.activities.length > MAX_ACTIVITIES) {
        state.activities = state.activities.slice(0, MAX_ACTIVITIES);
      }
      saveActivitiesToStorage(state.activities);
    },
    clearActivities: (state) => {
      state.activities = [];
      saveActivitiesToStorage(state.activities);
    },
  },
});

export const { addActivity, clearActivities } = activitySlice.actions;
export const selectActivities = (state) => state.activity.activities;
export default activitySlice.reducer;
