# Modular Firewall Backend

## Setup

1. **Install Dependencies**
   ```bash
   pip install -r backend/requirements.txt
   ```

2. **Database**
   - Ensure PostgreSQL is running.
   - Create a database defined in `backend/app/core/config.py` (default: `firewall_db`).
   - The app uses `asyncpg`.

3. **Run Server**
   ```bash
   uvicorn backend.app.main:app --reload --host 0.0.0.0 --port 8000
   ```

## Modules

- **Core**: Config, Logger
- **Database**: SQLModel based models
- **Middleware**: DDoS, Ransomware, URL Filter, Anomaly (Integration in `main.py` and routers)
- **Services**: Business logic for db interaction
- **Routers**: API Endpoints

## Endpoints

See `/docs` for Swagger UI.

- `/admin/*`: Manage rules and IPs
- `/simulate/*`: Simulate attacks
- `/public/*`: Test protection

## Testing

Run `pytest backend/tests`.
