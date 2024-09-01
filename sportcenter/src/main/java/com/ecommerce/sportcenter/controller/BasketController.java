package com.ecommerce.sportcenter.controller;

import com.ecommerce.sportcenter.entity.Basket;
import com.ecommerce.sportcenter.entity.BasketItem;
import com.ecommerce.sportcenter.model.BasketItemResponse;
import com.ecommerce.sportcenter.model.BasketResponse;
import com.ecommerce.sportcenter.service.BasketService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/baskets")
public class BasketController {
    private final BasketService basketService;

    public BasketController(BasketService basketService) {
        this.basketService = basketService;
    }
    @GetMapping()
    public List<BasketResponse>getBasketAlls(){
        return basketService.getAllBaskets();
    }
    @GetMapping("/{basketId}")
    public BasketResponse getBasketById(@PathVariable String basketId){
        return basketService.getBasketById(basketId);

    }
    @DeleteMapping("/{basketId}")
    public void deleteBasketById(@PathVariable String basketId){
        basketService.deleteBasketId(basketId);

    }
    @PostMapping
    public ResponseEntity<BasketResponse>createBasket(@RequestBody BasketResponse basketResponse){
        //convert this basket to basket entity
        Basket basket = convertToBasketEntity(basketResponse);
        // call the service method to create basket
        BasketResponse createBasket = basketService.createBasket(basket);
        //return the created basket
       return new ResponseEntity<>(createBasket, HttpStatus.CREATED);
    }

    private Basket convertToBasketEntity(BasketResponse basketResponse) {
        Basket basket = new Basket();
        basket.setId(basketResponse.getId());
        basket.setItems(mapBasketItemResponseToEntity(basketResponse.getItems()));
        return basket;
    }

    private List<BasketItem> mapBasketItemResponseToEntity(List<BasketItemResponse> itemResponses) {
        return itemResponses.stream()
                .map(this::convertToBasketItemEntity)
                .collect(Collectors.toList());
    }

    private BasketItem convertToBasketItemEntity(BasketItemResponse basketItemResponse) {
        BasketItem basketItem = new BasketItem();
        basketItem.setId(basketItemResponse.getId());
        basketItem.setName(basketItemResponse.getName());
        basketItem.setDescription(basketItemResponse.getDescription());
        basketItem.setPrice(basketItemResponse.getPrice());
        basketItem.setPictureUrl(basketItemResponse.getPictureUrl());
        basketItem.setProductBrand(basketItemResponse.getProductBrand());
        basketItem.setProductType(basketItemResponse.getProductType());
        basketItem.setQuantity(basketItemResponse.getQuantity());
        return basketItem;
    }

}
