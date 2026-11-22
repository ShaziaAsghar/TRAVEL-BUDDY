def detect_intent(text):
    text = (text or "").lower()
    if any(word in text for word in ["plan", "itinerary", "trip"]):
        return "travel_planning"
    if any(word in text for word in ["budget", "cost", "price"]):
        return "budget_check"
    return "destination_search"
