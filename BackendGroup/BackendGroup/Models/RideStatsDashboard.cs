using System.Collections.Generic;

namespace BackendGroup.Models
{
    public class RideStatsDashboard
    {
        public List<RideStat> RideStats { get; set; } = new List<RideStat>();
        public List<TopRide> TopRides { get; set; } = new List<TopRide>();
        public string MostPopularType { get; set; }
        public int MostPopularTypeCount { get; set; } // Add this property to store the count
        public double AvgTemp { get; set; }
        public int TotalRainouts { get; set; }
    }
}
