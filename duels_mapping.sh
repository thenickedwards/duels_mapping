#!/bin/bash
# Note: the commands to start below will source script in current shell (instead of executing in a subshell), 
# this allows environment changes (like activating the virtual environment) to persist

# To start the virtual environment for development:
# >> source ./duels_mapping.sh start    OR  >> . ./duels_mapping.sh start

# To set up the data environment for the first time:
# >> source ./duels_mapping.sh setup    OR  >> . ./duels_mapping.sh setup

# To update the data environment:
# >> source ./duels_mapping.sh update    OR  >> . ./duels_mapping.sh update

#####   #####   #####   #####   #####

# Load environment variables
source .env 
echo -e "Loading \033[3m$VENV_NAME\033[0m environment variables..."

action="$1"

# Function: Activate the virtual environment
activate_venv() {
    echo -e "Activating $VENV_NAME virtual environment..."
    source "$VENV_PATH"
    echo -e "Virtual environment $VENV_NAME activated."
}

# Function: Deactivate the virtual environment
deactivate_venv() {
    echo -e "Deactivating $VENV_NAME virtual environment..."
    deactivate
    echo -e "Virtual environment $VENV_NAME deactivated."
}


# Function: Run Next.js app and open browser
run_nextjs_app() {
    echo -e "\n⚙️ Starting Next.js development server (press Ctrl+C to stop)..."
    (cd app-duels-mapping && npm run dev) &
    sleep 5
    echo -e "\n🌐 Opening browser at http://localhost:3000/api/schmetzer_scores/2025"
    if command -v xdg-open &> /dev/null; then
        xdg-open "http://localhost:3000/api/schmetzer_scores/2025"
    elif command -v open &> /dev/null; then
        open "http://localhost:3000/api/schmetzer_scores/2025"
    else
        echo -e "🔗 Please open http://localhost:3000/api/schmetzer_scores/2025 in your browser."
    fi
}

# Function: Bonne chance et bon courage! 🔥💪🧑‍💻
send_off() {
    echo -e "\n༼ つ ◕◕ ༽つ SENDING THE GOODEST OF VIBES ༼ つ ◕◕ ༽つ\n\n"
}

#####   #####   #####   #####   #####

# Handle action argument
## If no argument
if [ -z "$action" ]; then
  echo "Usage: source ./duels_mapping.sh {start|stop|setup|update}"
  return 0
fi

## start
if [ "$action" = "start" ]; then
    activate_venv
    echo -e "Happy coding you beautiful and strong genius, you 🧑‍💻"
    send_off

## stop
elif [ "$action" = "stop" ]; then
    deactivate_venv
    echo -e "Way to go you beautiful and strong genius, you 🧑‍💻"
    send_off

## setup
elif [ "$action" = "setup" ]; then
    activate_venv
    
    echo -e "\n📦 Installing Python dependencies from requirements.txt..."
    pip install -r requirements.txt || { echo "❌ Python dependencies installation failed."; exit 1; }

    echo -e "\n🧬 Running ETL pipeline to backfill all historical season data..."
    python app-duels-mapping/public/data/etl/pipeline_hist_FBref_misc_stats_to_schmetzer_scores_players.py || {
        echo -e "❌ ETL pipeline execution failed."; exit 1; }

    run_nextjs_app

    send_off

## update
elif [ "$action" = "update" ]; then
    activate_venv

    echo -e "\n🧬 Running ETL pipeline to update current season data..."
    python app-duels-mapping/public/data/etl/pipeline_cur_FBref_misc_stats_to_schmetzer_scores_players.py || {
        echo "❌ ETL pipeline execution failed."; exit 1; }

    run_nextjs_app
    
    send_off

## Unrecognized argument
else
    echo -e "⚠️  Unknown action: '$action'. Use 'start', 'stop','setup', or 'update'."
    exit 1
fi

