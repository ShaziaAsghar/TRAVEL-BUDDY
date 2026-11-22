from .hybrid_recommender import hybrid_recommend
def recommend(preferences, destinations, limit=5):
    return hybrid_recommend(preferences, destinations, limit)
