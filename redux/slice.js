import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  data: [],
  allData: [],
  headers: [],
  clubData: [],
  clubs: [],
  loadClubData: false
};

// esto es la data de cada una de las personas.
export const fetchData = createAsyncThunk("getData/fetchData", async () => {
  let email = JSON.parse(localStorage.getItem("userEmail"));
  let user = email.email;
  // let url =
  //   "https://script.google.com/macros/s/AKfycbzS8V3isIRn4Ccd1FlvxMXsNj_BFs_IQe5r7Vr5LWNVbX2v1mvCDCYWc8QDVssxRj8k3g/exec?action=getAllData&activeUser=" + user;
  let url =
  "https://script.google.com/macros/s/AKfycbyIFIDagEQnkF3YrRICwgmhAq6gGycMpEHTF9oXYkpqx0h4uAmaVF46nhI0zHYW9eC-NA/exec?action=getAllData&activeUser=" + user;
  const response = await fetch(url);
  const data = await response.json();
  return data.response;
});

export const fetchClubData = createAsyncThunk("getData/fetchClubData", async () => {
  let isBcsf = JSON.parse(localStorage.getItem("isBcsf"));
  let email = JSON.parse(localStorage.getItem("userEmail"));
  let user = email.email;
  // let url =
  //   "https://script.google.com/macros/s/AKfycbzS8V3isIRn4Ccd1FlvxMXsNj_BFs_IQe5r7Vr5LWNVbX2v1mvCDCYWc8QDVssxRj8k3g/exec?action=fetchClubsProfileData&isBcsf=" + isBcsf + "&user=" + user;
  let url =
  "https://script.google.com/macros/s/AKfycbyIFIDagEQnkF3YrRICwgmhAq6gGycMpEHTF9oXYkpqx0h4uAmaVF46nhI0zHYW9eC-NA/exec?action=fetchClubsProfileData&isBcsf=" + isBcsf + "&user=" + user;
  const response = await fetch(url);
  const data = await response.json();
  return data.response;
});

export const clear = createAsyncThunk("getData/clear", async () => {
  return localStorage.clear();
});

export const fetchAllClubs = createAsyncThunk("getData/fetchAllClubs", async () => {
  // let url =
  //   "https://script.google.com/macros/s/AKfycbzS8V3isIRn4Ccd1FlvxMXsNj_BFs_IQe5r7Vr5LWNVbX2v1mvCDCYWc8QDVssxRj8k3g/exec?action=fetchAllClubs";
  let url =
  "https://script.google.com/macros/s/AKfycbyIFIDagEQnkF3YrRICwgmhAq6gGycMpEHTF9oXYkpqx0h4uAmaVF46nhI0zHYW9eC-NA/exec?action=fetchAllClubs";
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
        "Admin status"
      ]);
    },
  },
  extraReducers: (builder) => {
    builder
    .addCase(fetchData.fulfilled, (state, action) => {
      let setData = action.payload
      state.data = setData;
      state.allData = setData;
    })
    .addCase(fetchClubData.pending, (state) => {
      state.loadClubData = true;
    })
    .addCase(fetchClubData.fulfilled, (state, action) => {
      state.clubData = action.payload;
      state.loadClubData = false;
    })
    .addCase(fetchClubData.rejected, (state) => {
      state.loadClubData = false;
    })
    .addCase(clear.fulfilled, (state, action) => {
      state.data = [];
      state.allData = [];
      state.clubData = [];
    })
    .addCase(fetchAllClubs.fulfilled, (state, action) => {
      state.clubs = action.payload
    })
  },
});

export default appReducer.reducer;
