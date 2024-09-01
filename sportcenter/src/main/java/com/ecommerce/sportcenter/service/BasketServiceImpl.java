package com.ecommerce.sportcenter.service;

import com.ecommerce.sportcenter.entity.Basket;
import com.ecommerce.sportcenter.entity.BasketItem;
import com.ecommerce.sportcenter.model.BasketItemResponse;
import com.ecommerce.sportcenter.model.BasketResponse;
import com.ecommerce.sportcenter.repository.BasketRepository;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Log4j2
public class BasketServiceImpl implements  BasketService{
    private final BasketRepository basketRepository;

    public BasketServiceImpl(BasketRepository basketRepository) {
        this.basketRepository = basketRepository;
    }


    @Override
    public List<BasketResponse> getAllBasket() {
        log.info("Recherche de tous les paniers");
        List<Basket>listBasket = (List<Basket>) basketRepository.findAll();
        //utilisation de l'opérateur des flux pour le mappage des réponses
        List<BasketResponse> basketResponses = listBasket.stream()
                .map(this::convertToBasketResponses)
                .collect(Collectors.toList());


       log.info("Cherche tous  les paniers");
        return basketResponses;
    }


    @Override
    public List<BasketResponse> getAllBaskets() {
        return List.of();
    }

    @Override
    public BasketResponse getBasketById(String basketId) {
        log.info("Recherché le panier par id:{}", basketId);
        Optional<Basket>optionalBasket = basketRepository.findById(basketId);
        if(optionalBasket.isPresent()){
            Basket basket = optionalBasket.get();
            log.info("Recherché le panier par id:{}", basketId);
            return convertToBasketResponses(basket);
        }else {
            log.info("Recherché le panier avec son id:{} n'existe pas", basketId);
            return null;
        }
    }

    @Override
    public void deleteBasketId(String basketId) {
        log.info("Supprimé le panier par son id:{}", basketId);
        basketRepository.deleteById(basketId);
        log.info("Supprimer le panier par avec son id:{}", basketId);

    }

    @Override
    public BasketResponse createBasket(Basket basket) {
        log.info("création du panier");
        Basket saveBasket = basketRepository.save(basket);
        log.info("création de panier avec  id:{}", saveBasket.getId());
        return convertToBasketResponses(saveBasket);
    }
    private BasketResponse convertToBasketResponses(Basket basket) {
        if (basket == null){
            return null;
        }
        List<BasketItemResponse> itemResponse =basket.getItems().stream()
                .map(this::convertToBasketItemResponses)
                .collect(Collectors.toList());
        return BasketResponse.builder()
                .id(basket.getId())
                .items(itemResponse)
                .build();
    }

    private BasketItemResponse convertToBasketItemResponses(BasketItem basketItem) {
        return BasketItemResponse.builder()
                .id(basketItem.getId())
                .name(basketItem.getName())
                .description(basketItem.getDescription())
                .price(basketItem.getPrice())
                .pictureUrl(basketItem.getPictureUrl())
                .productBrand(basketItem.getProductBrand())
                .productType(basketItem.getProductType())
                .quantity(basketItem.getQuantity())
                .build();
    }

}
