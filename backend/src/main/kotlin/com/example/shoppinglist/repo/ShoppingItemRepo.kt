package com.example.shoppinglist.repo

import com.example.shoppinglist.model.ShoppingItem
import org.springframework.data.jpa.repository.JpaRepository

interface ShoppingItemRepo : JpaRepository<ShoppingItem, Long>