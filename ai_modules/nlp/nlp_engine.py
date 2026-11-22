from .text_preprocessing import clean_text
from .intent_detection import detect_intent
from .entity_extraction import extract_entities
def parse_query(text):
    cleaned = clean_text(text)
    return {"cleaned_query": cleaned, "intent": detect_intent(cleaned), **extract_entities(cleaned)}
