package com.example.shoppinglist

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class ShoppinglistApplication

fun main(args: Array<String>) {
	runApplication<ShoppinglistApplication>(*args)
}
