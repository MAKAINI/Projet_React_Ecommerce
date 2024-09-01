import { Grid } from "@mui/material";
import { Product } from "../../app/models/product";
import ErrorBoundary from "./ErrorBoundary";
import ProductCard from "./ProductCard";

interface Props {
  products: Product[];
}

export default function ProductList({ products }: Props) {
  console.log("Rendu de la liste de produits avec des produits", products);

  if (!products || !Array.isArray(products) || products.length === 0) {
    return <h3>Aucun produit n'a été affiché pour le moment.</h3>;
  }

  return (
    <Grid container spacing={4}>
      {products.map((product) => (
        <Grid item xs={4} key={product.id}>
          <ErrorBoundary fallback={<p>Une erreur est survenue lors du chargement du produit.</p>}>
            <ProductCard product={product} />
            <div>
              <h4>{product.name}</h4>
              <p>{product.description}</p>
              <p>P: {product.price} EUR</p>
              {/* Ajoutez d'autres détails du produit en fonction de votre modèle Product */}
            </div>
          </ErrorBoundary>
        </Grid>
      ))}
    </Grid>
  );
}