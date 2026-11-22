def recommend_destinations(preferences, destinations, limit=5):
    interests = {str(x).lower() for x in preferences.get("interests", [])}
    ranked = []
    for place in destinations:
        tags = {str(x).lower() for x in place.get("interests", [])}
        score = len(interests & tags)
        ranked.append((score, place))
    ranked.sort(key=lambda item: item[0], reverse=True)
    return [place for score, place in ranked[:limit]]
