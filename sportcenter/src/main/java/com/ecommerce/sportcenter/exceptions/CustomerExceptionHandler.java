package com.ecommerce.sportcenter.exceptions;

import com.ecommerce.sportcenter.model.CustomerErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@ControllerAdvice
public class CustomerExceptionHandler extends ResponseEntityExceptionHandler {
    @ExceptionHandler(ProductNotFoundException.class)
    public ResponseEntity<Object>handleProductNotFoundException(ProductNotFoundException ex, WebRequest request){
        CustomerErrorResponse customerErrorResponse = new CustomerErrorResponse(HttpStatus.NOT_FOUND, "Product doesn't exists",ex.getMessage() );
        return new ResponseEntity<>(customerErrorResponse, HttpStatus.NOT_FOUND);
    }
}
