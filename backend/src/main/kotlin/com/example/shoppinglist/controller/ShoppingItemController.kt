package com.example.shoppinglist.controller

import com.example.shoppinglist.model.ShoppingItem
import com.example.shoppinglist.service.ShoppingItemService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/items")
class ShoppingItemController(private val service: ShoppingItemService) {

    @GetMapping
    fun getAll(): List<ShoppingItem> = service.findAll()

    @GetMapping("/{id}")
    fun getById(@PathVariable id: Long): ResponseEntity<ShoppingItem> =
        service.findById(id)?.let { ResponseEntity.ok(it) }
            ?: ResponseEntity.notFound().build()

    @PostMapping
    fun create(@RequestBody item: ShoppingItem): ShoppingItem =
        service.save(item)

    @PutMapping("/{id}")
    fun update(@PathVariable id: Long, @RequestBody item: ShoppingItem): ResponseEntity<ShoppingItem> =
        service.update(id, item)?.let { ResponseEntity.ok(it) }
            ?: ResponseEntity.notFound().build()

    @DeleteMapping("/{id}")
    fun delete(@PathVariable id: Long): ResponseEntity<Void> {
        service.delete(id)
        return ResponseEntity.noContent().build()
    }
}