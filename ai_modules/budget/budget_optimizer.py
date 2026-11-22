def fit_budget(estimated_cost, budget):
    return {"within_budget": estimated_cost <= budget, "difference": budget - estimated_cost}
