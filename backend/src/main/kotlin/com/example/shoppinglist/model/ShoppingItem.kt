package com.example.shoppinglist.model

import jakarta.persistence.*
import jakarta.validation.constraints.Min
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size

@Entity
@Table(name = "shopping_items")
data class ShoppingItem(

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @field:NotBlank(message = "Item name cannot be blank")
    @field:Size(max = 50, message = "Item name cannot exceed 50 characters")
    val name: String = "",

    @field:Min(value = 1, message = "Quantity must be at least 1")
    val quantity: Int = 1,

    @Column(name = "is_checked")
    val isChecked: Boolean = false
)