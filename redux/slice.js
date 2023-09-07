import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  data: [],
  allData: [],
  headers: [],
  isBcsf: false,
  clubName: null,
  activeUser: null,
  clubData: [],
};

export const fetchData = createAsyncThunk("getData/fetchData", async () => {
  let url =
    "https://script.google.com/macros/s/AKfycbzS8V3isIRn4Ccd1FlvxMXsNj_BFs_IQe5r7Vr5LWNVbX2v1mvCDCYWc8QDVssxRj8k3g/exec?action=getAllData&activeUser=mora@setandforget.io";
  const response = await fetch(url);
  const data = await response.json();
  return data.response;
});

export const fetchClubData = createAsyncThunk("getData/fetchClubData", async () => {
  let url =
    "https://script.google.com/macros/s/AKfycbzS8V3isIRn4Ccd1FlvxMXsNj_BFs_IQe5r7Vr5LWNVbX2v1mvCDCYWc8QDVssxRj8k3g/exec?action=fetchClubsProfileData&isBcsf=true";
  const response = await fetch(url);
  const data = await response.json();
  return data.response;
});

const appReducer = createSlice({
  name: "getData",
  initialState,
  reducers: {
    getHeaders: (state) => {
      state.headers.push([
        "Name",
        "Lastname",
        "Gender",
        "Effective Date",
        "Role",
        "Status",
        "Amilia",
        "Last Update",
        "Spreadsheet ID",
        "Club Name",
      ]);
    },
    isBcsf: (state) => {
      state.isBcsf = true;
    },
    clubName: (state) => {
      state.clubName = "British Columbia Snowmobile Federation";
    },
    activeUser: (state) => {
      state.activeUser = "mora@setandforget.io";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchData.fulfilled, (state, action) => {
      state.data = action.payload; // Replaces the existing data
      state.allData = action.payload; // Replaces the existing data
    });
    builder.addCase(fetchClubData.fulfilled, (state, action) => {
      state.clubData = action.payload;
    });
  },
});

export default appReducer.reducer;
