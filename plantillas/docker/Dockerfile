# Dockerfile para Don Cheli
# Entorno de ejecución de tests y lint

FROM python:3.12-slim

WORKDIR /app

# Instalar dependencias
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt 2>/dev/null || true

# Copiar código
COPY . .

# Comando por defecto: ejecutar tests
CMD ["pytest", "-v", "--tb=short"]
