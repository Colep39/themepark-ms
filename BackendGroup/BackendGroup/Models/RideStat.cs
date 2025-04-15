namespace BackendGroup.Models
{
    public class RideStat
    {
        public string RideName { get; set; }
        public string RideType { get; set; }
        public int RideCount { get; set; }
        public DateTime RideDate { get; set; }
        public decimal Temperature { get; set; }
        public bool RainOut { get; set; }
    }
}
