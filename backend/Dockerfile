FROM python:3.11-slim

WORKDIR /app

# System deps kept minimal; psycopg[binary] ships wheels so no build tools needed.
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app ./app

# Content auto-seeds on startup (see app/main.py lifespan).
EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
