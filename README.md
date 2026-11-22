# AI Travel Buddy

A starter FYP project for an AI-assisted travel recommendation and planning web app.
Frontend: HTML5, CSS3 and vanilla JavaScript. Backend: Python Flask. Database: MySQL schema included; SQLite is used by default for an easy first run.

## Requirements
- Python 3.10+
- VS Code
- A modern browser
- MySQL 8 (optional for first local run; schema is in `database/schema.sql`)

## Run the backend (Windows PowerShell)
```powershell
cd backend
py -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
python app.py
```
The API will run at http://127.0.0.1:5000. Test http://127.0.0.1:5000/api/health.

## Open the frontend
Open `frontend/index.html` with the VS Code Live Server extension, or use another local static server. Do not double-click pages if your browser blocks local fetch requests; use Live Server.

## First test
1. Start the Flask backend.
2. Open `frontend/index.html` with Live Server.
3. Open AI Planner and submit a trip request.
4. The starter itinerary endpoint returns a rule-based sample plan.

## MySQL setup
1. Create a MySQL database by running `database/schema.sql` in MySQL Workbench.
2. Copy `.env.example` to `.env`.
3. Set `DATABASE_URL` to `mysql+pymysql://YOUR_USER:YOUR_PASSWORD@localhost/travel_buddy`.
4. Implement SQLAlchemy models and migrations before switching from the starter SQLite configuration.

## Important implementation notes
- Authentication routes are scaffolds only; they do not yet store users or issue JWT tokens.
- The sample itinerary is rule-based, not a trained generative AI model.
- Collaborative filtering requires real user-item interaction data and is a TODO.
- Weather and Maps integrations need API keys and backend endpoints before they are live.
- Replace sample destination data and cost assumptions with verified, current data.
- Never commit `.env` or API secrets to Git.
