def estimate_trip_cost(transport, lodging_per_night, meals_per_day, activities, days):
    return max(0, transport) + max(0, lodging_per_night) * max(days - 1, 0) + max(0, meals_per_day) * days + max(0, activities)
