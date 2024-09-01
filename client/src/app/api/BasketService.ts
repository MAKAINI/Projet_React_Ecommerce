import axios from "axios";
import { Basket, BasketItem, BasketTotals } from "../models/basket";
import { Product } from "../models/product";
import { Dispatch } from "redux";
import { setBasket } from "../../features/basket/basketSlice";
import { createId } from "@paralleldrive/cuid2";

class BasketService{
    API_URL = "http://localhost:8080/api/basket";
    async getBasketFromApi(){
        try{
            const response = await axios.get<Basket>(`${this.API_URL}`);
            return response.data;
        } catch(error){
            throw new Error("failed to retrieve products from basket")
        }
    }
    async getBasket(){
        try{
            const basket = localStorage.getItem('basket');
            if(basket){
                return JSON.parse(basket) as Basket;
            }else{
                throw new Error("basket not found in local storage");
            }

        }catch(error){
         throw new Error("failed to retrieve products from basket" + error);
 }
    }
    async addItemToBasket(item:Product, quantity = 1, dispatch: Dispatch){
        try{
             let basket = this.getCurrentBasket();
             if(!basket){
                basket = await this.createBasket();
             }
             const itemToAdd = this.mapProductToBsket(item);
             basket.items = this.upInsertItems(basket.items, itemToAdd, quantity);
             this.setBasket(basket, dispatch);
             //calcule to total price
             const totals = this.calculTotals(basket);
             return{basket, totals};
        }catch(error){
            throw new Error("failed to add item to basket" + error);
        }

    }
    async remove(itemId:number, dispatch:Dispatch){
        try{
            const basket = this.getCurrentBasket();
            if(basket){
                const itemIndex = basket.items.findIndex((p)=>p.id === itemId);
                if(itemIndex !== -1){
                    basket.items.splice(itemIndex, 1);
                    this.setBasket(basket, dispatch);
                }
                // check if basket is empty after removing  the item
               if(basket.items.length === 0){
                localStorage.removeItem('basket_id');
                localStorage.removeItem('basket');
              }
            }
            
            
        }catch(error){
            throw new Error("failed to remove item from basket" + error);
        }
    }
    async incrementItemQuantity(itemId:number, quantity:number = 1, dispatch:Dispatch){
        const basket = this.getCurrentBasket();
        if(basket){
            const item = basket.items.find((p)=>p.id === itemId);
            if(item){
               item.quantity += quantity;
               this.setBasket(basket, dispatch);
               if(item.quantity < 0){
                 item.quantity = 1
               }
               this.setBasket(basket, dispatch);
            }
            
        }
    }
    async decrementItemQuantity(itemId:number, quantity:number = 1, dispatch:Dispatch){
        const basket = this.getCurrentBasket();
        if(basket){
            const item = basket.items.find((p)=>p.id === itemId);
            if(item && item.quantity > 0){
               item.quantity -= quantity;
               this.setBasket(basket, dispatch);
               if(item.quantity < 0){
                 item.quantity = 1
               }
               this.setBasket(basket, dispatch);
            }
            
        }
    }
    async deleteBasket(baskeId:string):Promise<void>{
        try{
           await axios.delete(`${this.API_URL}/${baskeId}`);
        }catch(error){
            throw new Error("failed to delete basket" + error);
        }
        
    }
    async setBasket(basket:Basket, dispatch:Dispatch){
        try{
            await axios.post<Basket>(`${this.API_URL}`, basket);
            localStorage.setItem('basket', JSON.stringify(basket));
            dispatch(setBasket(basket));

        }catch(error){
            throw new Error("failed to update basket" + error);
        }
        
    }
    private getCurrentBasket(){
        const basket = localStorage.getItem('basket');
        return basket ? JSON.parse(basket) as Basket: null;
    }
    private async createBasket():Promise<Basket>{{
        try{
            const newBasket :Basket = {
                id:createId(),
                items:[],
            }
            localStorage.setItem('basket_id', newBasket.id);
            return newBasket;

        }catch(error){
            throw new Error("failed to create basket" + error);
        }
    }
  }
  private mapProductToBsket(item:Product):BasketItem{
    return {
        id: item.id,
        name: item.name,
        price: item.price,
        description: item.description,
        quantity: 0,
        pictureUrl: item.pictureUrl,
        productBrand: item.productBrand,
        productType: item.productType
    };
  }
  private upInsertItems(items:BasketItem[], itemToAdd:BasketItem, quantity:number):BasketItem[]{
     const existingItem = items.find(i => i.id === itemToAdd.id);
     if(existingItem){
        existingItem.quantity += quantity;
     }else{
        itemToAdd.quantity = quantity;
        items.push(itemToAdd);
     }
     return items;
  }

  private calculTotals(basket:Basket):BasketTotals{
    const shipping = 0;
    const subTotal = basket.items.reduce((acc, item)=>acc+(item.price * item.quantity), 0);
    const total = subTotal + shipping;
    return {shipping, subtotal: subTotal, total};
  }
  
}

export default new BasketService();