import { phase2IP } from "../../../helpers/http-client";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchGames = createAsyncThunk("game/fetchGames", async (params) => {
    const { data } = await phase2IP.get('/public/games', {
        params: {
            page: params.pages,
            search: params.search,
        }
    });
    return data;
});

export const gameSlice = createSlice({
    name: 'game',
    initialState: {
        list: {
            games: [],
            htmlPages: [],
            search: "",
            pages: 1,
            limit: 0,
            length: 0,
            count: 0
        },
    },
    reducers: {
        setPages: (state, action) => {
            state.list.pages = action.payload;
        },
        setSearch: (state, action) => {
            state.list.search = action.payload;
            state.list.pages = 1;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchGames.fulfilled, (state, action) => {
            state.list.games = action.payload.rows;
            state.list.count = action.payload.count;
            state.list.limit = action.payload.limit;
            state.list.length = action.payload.length;
        });
        builder.addCase(fetchGames.pending, () => {
            console.log('Fetching game data...');
        });
        builder.addCase(fetchGames.rejected, (state, action) => {
            console.log('Error fetching game data:', action.payload);
        });
    }
});

export const { setPages, setSearch } = gameSlice.actions;

export default gameSlice.reducer;
