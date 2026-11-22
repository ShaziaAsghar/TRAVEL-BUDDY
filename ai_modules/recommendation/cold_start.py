def cold_start_recommend(destinations, region=None, limit=5):
    matches = [d for d in destinations if not region or d.get("region", "").lower() == region.lower()]
    return matches[:limit]
