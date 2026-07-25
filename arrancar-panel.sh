#!/usr/bin/env bash
#
# arrancar-panel.sh — Levanta el panel de escalabilidad de punta a punta:
#   1) La API FastAPI de CORE OPS (métricas internas: rps, p95, hit ratio, jobs)
#   2) El next dev de praxialabs (la web con /admin/escalabilidad)
#
# Uso:   ./arrancar-panel.sh
# Parar: Ctrl+C  (apaga ambos limpiamente)
#
set -euo pipefail

# --- Rutas (ajusta si mueves los proyectos) ---
CORE_OPS_DIR="/home/jmari/proyectosIA/CRM IT"
SIAM_DIR="/home/jmari/proyectosIA/SIAM"
WEB_DIR="/home/jmari/proyectosIA/web"
API_PORT=8123      # CORE OPS
SIAM_PORT=8001     # SIAM
WEB_PORT=3000

CORE_OPS_URL="http://127.0.0.1:${API_PORT}"
SIAM_URL="http://127.0.0.1:${SIAM_PORT}"

echo "==> Liberando puertos ${API_PORT}, ${SIAM_PORT} y ${WEB_PORT} si estaban ocupados..."
fuser -k "${API_PORT}/tcp" "${SIAM_PORT}/tcp" "${WEB_PORT}/tcp" 2>/dev/null || true
sleep 1

# --- 1) API CORE OPS (FastAPI persistente) ---
echo "==> Arrancando API CORE OPS en ${CORE_OPS_URL} ..."
cd "${CORE_OPS_DIR}"
python3 -m uvicorn src.api.main:app --host 127.0.0.1 --port "${API_PORT}" --log-level warning &
API_PID=$!

# --- 2) SIAM (FastAPI persistente, métricas internas) ---
echo "==> Arrancando SIAM en ${SIAM_URL} ..."
cd "${SIAM_DIR}"
python3 -m uvicorn siem.main:app --host 127.0.0.1 --port "${SIAM_PORT}" --log-level warning &
SIAM_PID=$!

# Al salir (Ctrl+C o fin), apaga las APIs.
cleanup() {
  echo ""
  echo "==> Apagando APIs (CORE OPS ${API_PID}, SIAM ${SIAM_PID})..."
  kill "${API_PID}" "${SIAM_PID}" 2>/dev/null || true
  fuser -k "${API_PORT}/tcp" "${SIAM_PORT}/tcp" 2>/dev/null || true
}
trap cleanup EXIT INT TERM

# Espera a que las APIs respondan (hasta ~15s).
echo -n "==> Esperando a las APIs"
for _ in $(seq 1 30); do
  if curl -s -o /dev/null "http://127.0.0.1:${API_PORT}/api/health" \
     && curl -s -o /dev/null "http://127.0.0.1:${SIAM_PORT}/v1/metrics/scalability"; then
    echo " ✅ listas."
    break
  fi
  echo -n "."
  sleep 0.5
done

# --- 2) Web praxialabs (next dev) ---
echo "==> Arrancando la web en http://localhost:${WEB_PORT} ..."
echo "    Panel: http://localhost:${WEB_PORT}/admin/escalabilidad"
echo "    (Ctrl+C para parar todo)"
cd "${WEB_DIR}"
# next dev en primer plano: al cortarlo, el trap apaga las APIs.
CORE_OPS_URL="${CORE_OPS_URL}" SIAM_URL="${SIAM_URL}" npm run dev
