import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  data: [],
  allData: [],
  headers: [],
  clubData: [],
};

export const fetchData = createAsyncThunk("getData/fetchData", async () => {
  let email = JSON.parse(localStorage.getItem("userEmail"));
  let user = email.email;
  let url =
    "https://script.google.com/macros/s/AKfycbzS8V3isIRn4Ccd1FlvxMXsNj_BFs_IQe5r7Vr5LWNVbX2v1mvCDCYWc8QDVssxRj8k3g/exec?action=getAllData&activeUser=" + user;
  const response = await fetch(url);
  const data = await response.json();
  return data.response;
});

export const fetchClubData = createAsyncThunk("getData/fetchClubData", async () => {
  let isBcsf = JSON.parse(localStorage.getItem("isBcsf"));
  console.log("isbcsf", isBcsf)
  let email = JSON.parse(localStorage.getItem("userEmail"));
  let user = email.email;
  let url =
    "https://script.google.com/macros/s/AKfycbzS8V3isIRn4Ccd1FlvxMXsNj_BFs_IQe5r7Vr5LWNVbX2v1mvCDCYWc8QDVssxRj8k3g/exec?action=fetchClubsProfileData&isBcsf=" + isBcsf + "&user=" + user;
    console.log('url', url)
  const response = await fetch(url);
  const data = await response.json();
  console.log('at fetch', data.response)
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
  },
  extraReducers: (builder) => {
    builder.addCase(fetchData.fulfilled, (state, action) => {
      let setData = action.payload
      state.data = setData; 
      state.allData = setData; 
    });
    builder.addCase(fetchClubData.fulfilled, (state, action) => {
      state.clubData = action.payload;
    });
  },
});

export default appReducer.reducer;
