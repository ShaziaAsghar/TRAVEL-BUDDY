FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONPATH=/app

WORKDIR /app

COPY backend/requirements.txt backend/requirements.txt
RUN pip install --no-cache-dir --default-timeout=300 --retries 10 -r backend/requirements.txt

COPY . .

EXPOSE 5000
# $PORT is set by hosting platforms such as Render; 5000 is used locally.
CMD ["sh", "-c", "gunicorn --chdir backend --bind 0.0.0.0:${PORT:-5000} --workers 2 app:app"]