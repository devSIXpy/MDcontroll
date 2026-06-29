#!/usr/bin/env bash
set -e

REPO="$(cd "$(dirname "$0")/.." && pwd)"
DB="$REPO/backend/md.db"
BACKUP_DIR="$REPO/backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
DEST="$BACKUP_DIR/md_$TIMESTAMP.db"

if [ ! -f "$DB" ]; then
  echo "[MD] Banco de dados não encontrado: $DB"
  exit 1
fi

mkdir -p "$BACKUP_DIR"
cp "$DB" "$DEST"
echo "[MD] Backup criado: $DEST"
