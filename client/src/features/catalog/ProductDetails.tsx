import { Divider, Grid, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from "@mui/material";

import {  useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Product } from "../../app/models/product";
//import agent from "../../app/api/agent";
//import axios from "axios";
import agent from "../../app/api/agent";
import NotFound from "../../app/errors/NotFound";
import Spinner from "../../app/layout/Spinner";


export default function ProductDetails() {
 
  const{id} = useParams<{id: string}>();
  const[product, setProduct] = useState<Product | null>(null);
  const[loading, setLoading] = useState(true);
  const[error, setError] = useState<string | null>(null);

  
  const  extractImageName =(item:Product):null| string =>{
    if(item && item.pictureUrl && item.pictureUrl.length > 0){
        const parts = item.pictureUrl.split('/');
        return parts[parts.length - 1];
    }
    return 'default.jpg';
} 
const formatPrice = (price: number): string =>{
    return Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD', minimumFractionDigits: 2}).format(price );
}
useEffect(() => {
  if(id) {
    const productId = parseInt(id,10);
    agent.Store.details(productId)
    .then((response) => {
        setProduct(response); // Assure-toi que response.data n'est pas nécessaire si la réponse renvoie directement le produit
        setError(null);
    })
    .catch((error: any) => {
        console.error('Error fetching product data:', error);
        setError('Error fetching product data');
    })
    .finally(() => setLoading(false));
}
    
  

  
  //id && agent.Store.details(parseInt(id)) 
  //      axios.get(`http://localhost:8080/api/products?page=0&size=10&sort=name&order=asc/${id}`)
  //axios.get(`http://localhost:8080/api/products/${id}`)
  // .then((response)=>{
   // setProduct(response.data)
  //  setError(null)
 //  })
 //   .catch((error: any) => {
  //    console.error(error);
    //  if (error.response && error.response.data) {
   //     console.log('Server response:', error.response.data);
   // }
    //  setError('Error fetching product data');
  //  })
   // .finally(() => setLoading(false));
}, [id]);
  

  
  if(loading) return <Spinner message="Chargement du produit..."/>
  if(error) return <h3>{error}</h3>
  if(!product) return <NotFound/>
  return ( 
    
      
    <Grid container spacing={6}>
      <Grid  item xs={6}>
        <img src={'/images/products/' + (extractImageName(product) || 'default.jpg')} alt={product.name} style={{width: '100%'}}/>
      </Grid>
      <Grid item xs={6}>
        <Typography variant="h3">{product.name}</Typography>
        <Divider sx={{mb: 2}}/>
        <Typography  color="secondary" variant="h4">{formatPrice(product.price)}</Typography>
        <TableContainer>
           <Table>
              <TableBody>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>{product.name}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Description</TableCell>
                  <TableCell>{product.description}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Type</TableCell>
                  <TableCell>{product.productType}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Brand</TableCell>
                  <TableCell>{product.productBrand}</TableCell>
                </TableRow>
              </TableBody>
           </Table>
        </TableContainer>
      </Grid>

    </Grid>
    
  ) 
}


