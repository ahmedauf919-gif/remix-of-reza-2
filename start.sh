#!/bin/bash
cd "$(dirname "$0")"
echo "Starting the app..."
sleep 3 && open http://localhost:8080 2>/dev/null || sleep 3 && xdg-open http://localhost:8080 2>/dev/null &
npm run dev
