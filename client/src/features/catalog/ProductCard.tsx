
import { Avatar, Button, Card, CardActions, CardContent, CardHeader, CardMedia, CircularProgress, Typography } from "@mui/material";
import { Product } from "../../app/models/product"
import { Link } from "react-router-dom";
import { useAppDispatch } from "../../app/stores/configureStore";
import { useState } from "react";
import agent from "../../app/api/agent";
import { setBasket } from "../basket/basketSlice";
import LoadingButton from '@mui/lab/LoadingButton';


interface Props{
    product: Product;
}
export default function ProductCard({product}: Props) {
    const  extractImageName =(item:Product):null| string =>{
        if(item && item.pictureUrl.length > 0){
            const parts = item.pictureUrl.split('/');
            if(parts.length > 0){
                return parts[parts.length - 1];
            }
        }
        return null;
    } 
    const formatPrice = (price: number): string =>{
        return Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD', minimumFractionDigits: 2}).format(price );
    }
    const[loading, SetLoading] = useState(false);
    const dispatch = useAppDispatch();
    function addItem(){
        SetLoading(true);
        agent.Basket.addItem(product, dispatch)
        .then(response =>{
            console.log('New Basket', response.basket);
            dispatch(setBasket(response.basket));
        })
        .catch(error => console.log(error))
        .finally(() => SetLoading(false));
    }
    
  return (
    <Card>
        <CardHeader avatar={
           <Avatar sx={{bgcolor: 'secondary.main'}}>
               {product.name.charAt(0).toUpperCase()}
           </Avatar>
        }
        title={product.name}
        titleTypographyProps={{
            sx: {fontWeight: 'bold', color: 'primary.main'}
        }}
        />
        <CardMedia sx={{height: 140, backgroundSize: 'contain', bgcolor: 'primary.light'}}>
        <img src={"/images/products/"+extractImageName(product)} />
           {/**<img src={`/images/products/${extractImageName(product)}`} title={product.name} /> */} 
        </CardMedia>
        <CardContent>
            <Typography gutterBottom variant="h5" color="secondary.main">
                {formatPrice(product.price)}
            </Typography>
              <Typography variant="body2" color="text.secondary">
                 {product.productBrand} / {product.productType}
             </Typography>
        </CardContent>
        <CardActions>
           <LoadingButton loading={loading} onClick={addItem} size="small"
            startIcon={ loading? <CircularProgress size={20} color="inherit" /> : null } >

           </LoadingButton>
            
            <Button component={Link} to={`/store/${product.id}`} size="small">View</Button>
        </CardActions>
    </Card>
  )
}





/*import { Avatar, Button, Card, CardActions, CardContent, CardHeader, CardMedia, Typography } from "@mui/material";
import { Product } from "../../app/models/product"
import { Link } from "react-router-dom";


interface Props{
    product: Product;
}
export default function ProductCard({product}: Props) {
    const  extractImageName =(item:Product):null| string =>{
        if(item && item.pictureUrl.length > 0){
            const parts = item.pictureUrl.split('/');
            if(parts.length > 0){
                return parts[parts.length - 1];
            }
        }
        return null;
    } 
    const formatPrice = (price: number): string =>{
        return Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD', minimumFractionDigits: 2}).format(price );
    }
  return (
    <Card>
        <CardHeader avatar={
           <Avatar sx={{bgcolor: 'secondary.main'}}>
               {product.name.charAt(0).toUpperCase()}
           </Avatar>
        }
        title={product.name}
        titleTypographyProps={{
            sx: {fontWeight: 'bold', color: 'primary.main'}
        }}
        />
        <CardMedia sx={{height: 140, backgroundSize: 'contain', bgcolor: 'primary.light'}}>
        <img src={"/images/products/"+extractImageName(product)} />
           {/**<img src={`/images/products/${extractImageName(product)}`} title={product.name} /> } 
      /*  </CardMedia>
        <CardContent>
            <Typography gutterBottom variant="h5" color="secondary.main">
                {formatPrice(product.price)}
            </Typography>
              <Typography variant="body2" color="text.secondary">
                 {product.productBrand} / {product.productType}
             </Typography>
        </CardContent>
        <CardActions>
            <Button size="small">Add to cart</Button>
            <Button component={Link} to={`/store/${product.id}`} size="small">View</Button>
        </CardActions>
    </Card>
  )
}*/






{/** 
    
    
    
*/}
