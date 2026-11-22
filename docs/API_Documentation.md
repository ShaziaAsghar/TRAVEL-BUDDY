# API starter documentation
Base URL: `http://127.0.0.1:5000`

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | Check API status |
| POST | `/api/auth/register` | Registration scaffold |
| POST | `/api/auth/login` | Login scaffold |
| GET | `/api/destinations` | Sample destination list |
| POST | `/api/itinerary/generate` | Generate starter itinerary |

Example request:
```json
{"destination":"Hunza","duration":3,"budget":25000,"style":"Nature","query":"3 days in Hunza"}
```
