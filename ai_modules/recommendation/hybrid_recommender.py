from .content_based import recommend_destinations
def hybrid_recommend(preferences, destinations, limit=5):
    # Starter hybrid: content-based results. Add collaborative scores when enough user history exists.
    return recommend_destinations(preferences, destinations, limit)
