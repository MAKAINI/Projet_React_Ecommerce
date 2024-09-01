import { useState, useEffect } from "react";
import { Product } from "../../app/models/product";
import agent from "../../app/api/agent";
import ProductList from "./ProductList";
import Spinner from "../../app/layout/Spinner";
import { FormControl, FormControlLabel, FormLabel, Grid, Paper, Radio, RadioGroup, TextField } from "@mui/material";
import { Brand } from "../../app/models/Brand";
import { Type } from "../../app/models/Type";



const sortOptions = [
    { value: 'asc', label: 'Ascending' },
    { value: 'desc', label: 'Descending' },
];

export default function Catalog() {
    const [products, setProducts] = useState<Product[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [types, setTypes] = useState<Type[]>([]);
    const [selectedSort, setSelectedSort] = useState('asc');
    const [selectedBrand, setSelectedBrand] = useState('All');
    const [selectedType, setSelectedType] = useState('All');
    const [selectedBrandId, setSelectedBrandId] = useState(0);
    const [selectedTypeId, setSelectedTypeId] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        setLoading(true);
        Promise.all([
            agent.Store.lists(),
            agent.Store.brands(),
            agent.Store.types(),
        ])
        .then(([productsResp, brandsResp, typesResp]) => {
            

            setProducts(productsResp.content);
            setBrands(brandsResp);
            setTypes(typesResp);
        })
        .catch((error) => {
            console.error('Error fetching initial data:', error);
            setError('Erreur lors de la récupération des données initiales');
        })
        .finally(() => setLoading(false));
    }, []);

    const loadProducts = (selectedSort: string, searchKeyword = '') => {
        setLoading(true);
        let brandId = selectedBrandId !== 0 ? selectedBrandId : undefined;
        let typeId = selectedTypeId !== 0 ? selectedTypeId : undefined;
        const sort = "name";
        const order = selectedSort === 'desc' ? 'desc' : 'asc';

        let url = `?sort=${sort},&order=${order}`;
        if (brandId !== undefined || typeId !== undefined) {
            url += "&";
            if (brandId !== undefined) url += `brandId=${brandId}&`;
            if (typeId !== undefined) url += `typeId=${typeId}&`;
            url = url.replace(/&$/, '');
        }

        if (searchKeyword ) {
            agent.Store.search(searchKeyword)
            .then((productResp) => {
                
                setProducts(productResp.content);
            })
            .catch((error) => {
                console.error('Error searching products:', error);
                setError('Erreur lors de la recherche des produits');
            })
            .finally(() => setLoading(false));
        } else {
            agent.Store.lists(brandId, typeId, url)
            .then((productResp) => {
                setProducts(productResp);
            })
            .catch((error) => {
                console.error('Error fetching products:', error);
                setError('Erreur lors de la sélection des produits');
            })
            .finally(() => setLoading(false));
        }
    };

    useEffect(() => {
        loadProducts(selectedSort, searchTerm);
    }, [selectedBrand, selectedType]);

    const handleSortChange = (event: any) => {
        const selectedSort = event.target.value;
        setSelectedSort(selectedSort);
        loadProducts(selectedSort);
    };

    const handleBrandChange = (event: any) => {
        const selectedBrand = event.target.value;
        const brand = brands.find((a) => a.name === selectedBrand);
        setSelectedBrand(selectedBrand);
        setSelectedBrandId(brand?.id || 0);
        loadProducts(selectedSort);
    };

    const handleTypeChange = (event: any) => {
        const selectedType = event.target.value;
        const type = types.find((b) => b.name === selectedType);
        setSelectedType(selectedType);
        setSelectedTypeId(type?.id || 0);
        loadProducts(selectedSort);
    };

    if (loading) return <Spinner message="Chargement des Articles..." />;
    if (error) return <h3>{error}</h3>;
    if (!products || products.length === 0) return <h3>Aucun article disponible</h3>;

    return (
        <Grid container spacing={4}>
            <Grid item xs={3}>
                <Paper sx={{ mb: 2 }}>
                    <TextField
                        label="Search products"
                        variant="outlined"
                        fullWidth
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                loadProducts(selectedSort, searchTerm);
                            }
                        }}
                    />
                </Paper>
                <Paper sx={{ mb: 2, p: 2 }}>
                    <FormControl>
                        <FormLabel id="sort-by-name-label">Sort by Name</FormLabel>
                        <RadioGroup
                            aria-label="sort-by-name"
                            name="sort-by-name"
                            value={selectedSort}
                            onChange={handleSortChange}
                        >
                            {sortOptions.map(({ value, label }) => (
                                <FormControlLabel key={value} value={value} control={<Radio />} label={label} />
                            ))}
                        </RadioGroup>
                    </FormControl>
                </Paper>
                <Paper sx={{ mb: 2, p: 2 }}>
                    <FormControl>
                        <FormLabel id="brand-label">Brands</FormLabel>
                        <RadioGroup
                            aria-label="brands"
                            name="brands"
                            value={selectedBrand}
                            onChange={handleBrandChange}
                        >
                            {brands.map((brand) => (
                                <FormControlLabel key={brand.id} value={brand.name} control={<Radio />} label={brand.name} />
                            ))}
                        </RadioGroup>
                    </FormControl>
                </Paper>
                <Paper sx={{ mb: 2, p: 2 }}>
                    <FormControl>
                        <FormLabel id="type-label">Types</FormLabel>
                        <RadioGroup
                            aria-label="types"
                            name="types"
                            value={selectedType}
                            onChange={handleTypeChange}
                        >
                            {types.map((type) => (
                                <FormControlLabel key={type.id} value={type.name} control={<Radio />} label={type.name} />
                            ))}
                        </RadioGroup>
                    </FormControl>
                </Paper>
            </Grid>
            <Grid item xs={9}>
                <ProductList products={products} />
            </Grid>
        </Grid>
    );
}