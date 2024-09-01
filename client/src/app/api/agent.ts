
import axios, { AxiosError, AxiosResponse } from "axios";
import { router } from "../router/Routes";
import { toast } from "react-toastify";

import BasketService from "./BasketService";

import { Product } from "../models/product";
import { Dispatch } from "redux";



axios.defaults.baseURL = 'http://localhost:8080/api/';
const dle = ()=> new Promise((resolve) => {
  setTimeout(resolve, 100);
})
const responseBody = (response: AxiosResponse) => response.data;

axios.interceptors.response.use(async response=>{
  await dle();
  return response;
}, (error: AxiosError) => {
  if (!error.response) {
    toast.error("Network error occurred");
    return Promise.reject("Network error occurred");
  }
  const{status} = error.response as AxiosResponse;
  switch(status){
    case 404:
      toast.error("Resource not found");
      router.navigate('/not-found')
      break;
    case 500:
      toast.error("Internal server error occurred");
      router.navigate('/server-error')
      break;
    default:
      break;
  }
  return Promise.reject(error.message);
  
})


const requests = {
  get: (url: string) => axios.get(url).then(responseBody),
  post: (url: string, body: object) => axios.post(url, body).then(responseBody),
  put: (url: string, body: object) => axios.put(url, body).then(responseBody),
  delete: (url: string) => axios.delete(url).then(responseBody),

    };
    
const Store = {
   //apiUrl: 'http://localhost:8080/api/products?page=0&size=10&sort=name&order=asc',
  apiUrl: 'http://localhost:8080/api/products',
  

    lists: (brandId?: number, typeId?: number, url?: string)=> {
      let requestUrl = url || Store.apiUrl;
      if(brandId!== undefined){
        requestUrl = `${requestUrl}&brandId=${brandId}`;
      }
      if(typeId!== undefined){
        requestUrl = `${requestUrl}&typeId=${typeId}`;
      }
      return requests.get(requestUrl);
      
    },

    details: (id: number) => requests.get(`products/${id}`),
    types: () => requests.get('products/types').then(types=>[{id:0, name:'All'}, {...types}]),
    brands: () => requests.get('products/brands').then(brands=>[{id:0, name:'All'}, {...brands}]),
    search:(keyword: string) => requests.get(`products?keyword=${keyword}`).then(brands=>[{id:0, name:'All'}, {...brands}]),
    
};

const Basket ={
  get: async () => {
    try{
      return await BasketService.getBasket();
    }catch(error){
      throw new Error("failed to retrieve products from basket :  "  + error);
    }
    },
    addItem: async(product: Product, dispatch: Dispatch) => {
      try{
        const result = await BasketService.addItemToBasket(product, 1,  dispatch);
        console.log(result);
        return result;
      }catch(error){
        throw new Error("failed to add item to basket :  "  + error);
    
    }
  },
  removeItem: async(itemId: number, dispatch: Dispatch) => {
    try{
        await BasketService.remove(itemId, dispatch);

    } catch(error){
     throw new Error("failed to remove item from basket :  "  + error);

    }
  },
  deleteBasket: async(baskeId: string) => {
    try{
            await BasketService.deleteBasket(baskeId);
    }catch(error){
        throw new Error("failed to delete basket :  "  + error);
    }
  },
  incrementItemQuantity: async (itemId: number, quantity: number = 1, dispatch: Dispatch) => {
    try {
      await BasketService.incrementItemQuantity(itemId, quantity, dispatch);
    } catch (error) {
      console.error("Failed to increment item quantity in basket:", error);
      throw error;
    }
  },
  decrementItemQuantity: async (itemId: number, quantity: number = 1, dispatch: Dispatch) => {
    try {
      await BasketService.decrementItemQuantity(itemId, quantity, dispatch);
    } catch (error) {
      console.error("Failed to decrement item quantity in basket:", error);
      throw error;
    }
  },
}

const agent = {
    Store,
    Basket
}

export default agent;

