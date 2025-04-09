using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.Serialization;
using System.Text.Json.Serialization;

namespace BackendGroup.Models
{
    [Table("shops")]  // Explicitly map to "shops" table
    public class Shop
    {
        // Add JsonConverter attribute to handle enum serialization
        [JsonConverter(typeof(JsonStringEnumConverter))]
        public enum ShopName
        {
            [EnumMember(Value = "Candy Kingdom")]
            Candy_Kingdom,
            [EnumMember(Value = "Gourmet Bites")]
            Gourmet_Bites,
            [EnumMember(Value = "Adventure Gear")]
            Adventure_Gear
        }

        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int shop_id { get; set; }

        [Required]
        [Column(TypeName = "varchar(50)")]
        public string item_name { get; set; } = string.Empty;

        [Required]
        [Column(TypeName = "enum('Candy Kingdom', 'Gourmet Bites', 'Adventure Gear')")]
        public ShopName shop_name { get; set; }

        [Required]
        [Column(TypeName = "bit")]
        public bool status { get; set; }

        [Required]
        public int item_price { get; set; }

        public string? item_img { get; set; }
    }
}