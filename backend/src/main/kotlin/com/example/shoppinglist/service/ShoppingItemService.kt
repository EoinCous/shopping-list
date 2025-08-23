package com.example.shoppinglist.service

import com.example.shoppinglist.model.ShoppingItem
import com.example.shoppinglist.repo.ShoppingItemRepo
import org.springframework.stereotype.Service

@Service
class ShoppingItemService(private val repo: ShoppingItemRepo) {

    fun findAll(): List<ShoppingItem> = repo.findAll()

    fun findById(id: Long): ShoppingItem? = repo.findById(id).orElse(null)

    fun save(item: ShoppingItem): ShoppingItem = repo.save(item)

    fun update(id: Long, updated: ShoppingItem): ShoppingItem? {
        val existing = repo.findById(id).orElse(null) ?: return null
        val merged = existing.copy(
            name = updated.name,
            quantity = updated.quantity,
            isChecked = updated.isChecked
        )
        return repo.save(merged)
    }

    fun delete(id: Long) = repo.deleteById(id)
}