package com.ecommerce.sportcenter.service;

import com.ecommerce.sportcenter.entity.Product;
import com.ecommerce.sportcenter.exceptions.ProductNotFoundException;
import com.ecommerce.sportcenter.model.ProductResponse;
import com.ecommerce.sportcenter.repository.ProductRepository;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;



@Service
@Log4j2
public class ProductServiceImpl implements ProductService{
    private final ProductRepository productRepository;

    public ProductServiceImpl(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Override
    public ProductResponse getProductById(Integer productId) {
        log.info("fetching Product of id: {}", productId);
        Product product = productRepository.findById(productId)
                .orElseThrow(()->new ProductNotFoundException("Product with given Id:{} doesn't exist"));
        //now convert the Product to Product response
        ProductResponse productResponse = convertToProductResponse(product);
        log.info("Fetched Product by Product Id: {}", productId);
        return productResponse;
    }


    @Override
    public Page<ProductResponse> getProducts(Pageable pageable,Integer brandId, Integer typeId, String keyword) {
        log.info("Fetching products");
        Specification<Product> spec = Specification.where(null);
        if (brandId != null){
            spec = spec.and(((root, query, criteriaBuilder)
                    ->criteriaBuilder.equal(root.get("brand").get("id"),brandId) ));
        }
        if (typeId!=null){
            spec = spec.and(((root, query, criteriaBuilder) ->
                    criteriaBuilder.equal(root.get("type").get("id"),typeId)));
        }
        if (keyword!=null && !keyword.isEmpty()){
            spec = spec.and(((root, query, criteriaBuilder)
                    -> criteriaBuilder.like(root.get("name").get("keyword"), " % " + keyword + " % ")));
        }
        log.info("fetched all products");
        return productRepository.findAll(spec, pageable).map(this::convertToProductResponse);


    }

    private ProductResponse convertToProductResponse(Product product) {
        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .pictureUrl(product.getPictureUrl())
                .productBrand(product.getBrand().getName())
                .productType(product.getType().getName())
                .build();
    }

}
