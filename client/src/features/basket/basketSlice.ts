import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Basket } from "../../app/models/basket";

interface Basketdata{
    basket: Basket | null;
}
const  initialState: Basketdata = {
    basket: null,
}

export const basketSlice = createSlice({
    name: 'basket',
    initialState,
    reducers: {
        setBasket: (state, action:PayloadAction<Basket>) => {
            console.log('new basket state : ', action.payload)
            state.basket = action.payload
        },
        
        
    },
});
export const {setBasket} = basketSlice.actions;
    

