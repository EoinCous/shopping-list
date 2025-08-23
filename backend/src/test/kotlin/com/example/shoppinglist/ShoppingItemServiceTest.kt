import io.mockk.*
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import java.util.*
import com.example.shoppinglist.repo.ShoppingItemRepo
import com.example.shoppinglist.service.ShoppingItemService
import com.example.shoppinglist.model.ShoppingItem

class ShoppingItemServiceTest {

    private val repo = mockk<ShoppingItemRepo>()
    private val service = ShoppingItemService(repo)

    @Test
    fun `findAll should return items`() {
        val items = listOf(ShoppingItem(1, "Apples", 2, false))
        every { repo.findAll() } returns items

        val result = service.findAll()

        assertEquals(items, result)
        verify { repo.findAll() }
    }

    @Test
    fun `findById should return item when found`() {
        val item = ShoppingItem(1, "Milk", 1, false)
        every { repo.findById(1) } returns Optional.of(item)

        val result = service.findById(1)

        assertEquals(item, result)
        verify { repo.findById(1) }
    }

    @Test
    fun `findById should return null when not found`() {
        every { repo.findById(99) } returns Optional.empty()

        val result = service.findById(99)

        assertNull(result)
    }

    @Test
    fun `save should persist item`() {
        val item = ShoppingItem(0, "Bread", 1, false)
        val saved = item.copy(id = 1)
        every { repo.save(item) } returns saved

        val result = service.save(item)

        assertEquals(saved, result)
        verify { repo.save(item) }
    }

    @Test
    fun `update should modify existing item`() {
        val existing = ShoppingItem(1, "Eggs", 6, false)
        val updated = ShoppingItem(1, "Eggs", 12, true)
        every { repo.findById(1) } returns Optional.of(existing)
        every { repo.save(any()) } answers { firstArg() }

        val result = service.update(1, updated)

        assertEquals(12, result?.quantity)
        assertTrue(result?.isChecked == true)
        verify { repo.save(any()) }
    }

    @Test
    fun `delete should call repo delete`() {
        every { repo.deleteById(1) } just Runs

        service.delete(1)

        verify { repo.deleteById(1) }
    }
}