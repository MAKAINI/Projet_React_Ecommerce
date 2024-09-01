package com.ecommerce.sportcenter.service;

import com.ecommerce.sportcenter.entity.Basket;
import com.ecommerce.sportcenter.model.BasketResponse;

import java.util.List;

public interface BasketService {
    List<BasketResponse> getAllBasket();

    List<BasketResponse>getAllBaskets();
    BasketResponse getBasketById(String basketId);
    void deleteBasketId(String basketId);
    BasketResponse createBasket(Basket basket);
}
