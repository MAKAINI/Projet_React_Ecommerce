import { Navigate, createBrowserRouter } from "react-router-dom";
import HomePage from "../../features/home/HomePage";
import Catalog from "../../features/catalog/Catalog";
import ContactPage from "../../features/contact/ContactPage";
import ProductDetails from "../../features/catalog/ProductDetails";
import App from "../layout/App";
import NotFound from "../errors/NotFound";
import ServerError from "../errors/ServerError";
import BasketPage from "../../features/basket/BasketPage";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <App/>,
        children: [
            {path:'', element:<HomePage/>},
            {path:'store', element:<Catalog/>},
            {path:'store/:id', element:<ProductDetails/>},
            {path:'contact', element:<ContactPage/>},
            {path:'basket', element:<BasketPage/>},
            {path:'not-found', element:<NotFound/>},
            {path:'server-error', element:<ServerError/>},
            {path:'*', element:<Navigate replace to='/not-found'/>}
            
        ]
    }
]);
