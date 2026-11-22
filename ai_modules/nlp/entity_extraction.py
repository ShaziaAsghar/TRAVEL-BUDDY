import re
def extract_entities(text):
    text = text or ""
    days = re.search(r"(\d+)\s*[- ]?day", text, re.I)
    budget = re.search(r"(?:under|below|budget(?: of)?|within)\s*([\d,]+)", text, re.I)
    return {
        "duration": int(days.group(1)) if days else None,
        "budget": int(budget.group(1).replace(",", "")) if budget else None
    }
