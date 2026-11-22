def generate_itinerary(destination, duration, budget, style="Nature", query=""):
    daily_cost = budget / max(duration, 1)
    suggestions = {
        "adventure": ["Local guided adventure activity", "Scenic viewpoint visit", "Local food experience"],
        "culture": ["Explore a historic site", "Visit a local market", "Try regional cuisine"],
        "relaxation": ["Leisurely sightseeing", "Relax at a scenic spot", "Enjoy a local cafe"],
        "nature": ["Explore a nature viewpoint", "Visit a lake or valley", "Enjoy a short nature walk"]
    }
    activities = suggestions.get(style.lower(), suggestions["nature"])
    days = []
    for number in range(1, duration + 1):
        days.append({"day": number, "title": f"Explore {destination}", "activities": activities[:]})
    return {
        "destination": destination, "duration": duration, "estimated_cost": round(min(budget, daily_cost * duration)),
        "budget_note": "Illustrative estimate; verify transport, lodging and seasonal prices before travel.",
        "days": days
    }
