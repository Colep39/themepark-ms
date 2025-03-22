using BackendGroup.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BackendGroup.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ShopController : ControllerBase
    {
        private readonly ThemeParkContext _context;

        public ShopController(ThemeParkContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Shop>>> GetShops()
        {
            var shops = await _context.Shops.ToListAsync();
            if (shops == null || shops.Count == 0)
            {
                return NotFound("No shops found.");
            }
            return Ok(shops);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Shop>> GetShop(int id)
        {
            var shop = await _context.Shops.FindAsync(id);

            if (shop == null)
            {
                return NotFound();
            }

            return shop;
        }

        [HttpPost]
        public async Task<ActionResult<Shop>> PostShop(Shop shop)
        {
            try
            {
                // Don't let client set the ID - database will generate it
                shop.shop_id = 0;
                
                // Convert string to byte[] if item_img is provided as string
                if (shop.item_img == null)
                {
                    shop.item_img = null;
                }

                _context.Shops.Add(shop);
                await _context.SaveChangesAsync();

                return CreatedAtAction(
                    nameof(GetShop),
                    new { id = shop.shop_id },
                    shop
                );
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutShop(int id, Shop shop)
        {
            if (id != shop.shop_id)
            {
                return BadRequest();
            }

            var existingShop = await _context.Shops.FindAsync(id);
            if (existingShop == null)
            {
                return NotFound();
            }

            // Only update fields if they are provided (non-null)
            if (!string.IsNullOrEmpty(shop.item_name))
            {
                existingShop.item_name = shop.item_name;
            }

            existingShop.shop_name = shop.shop_name;

            existingShop.status = shop.status;

            if (shop.item_price != 0)
            {
                existingShop.item_price = shop.item_price;
            }

            if (shop.item_img != null && shop.item_img.Length > 0)
            {
                existingShop.item_img = shop.item_img;
            }

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Shops.Any(s => s.shop_id == id))
                {
                    return NotFound();
                }
                throw;
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteShop(int id)
        {
            var shop = await _context.Shops.FindAsync(id);

            if (shop == null)
            {
                return NotFound();
            }

            _context.Shops.Remove(shop);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}