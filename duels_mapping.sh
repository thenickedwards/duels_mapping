#!/bin/bash
# Note: the commands to start below will source script in current shell (instead of executing in a subshell), 
# this allows environment changes (like activating the virtual environment) to persist

# >> source ./duels_mapping.sh start
# OR      
# >> . ./duels_mapping.sh start
    

# Load environment variables
source .env 
echo "Loading \033[3m$VENV_NAME\033[0m environment variables..."

action="$1"

# Start up development environment
if [ "$action" = "start" ]; then
    echo "Activating $VENV_NAME virtual environment..."
    source "$VENV_PATH"
    echo "Virtual environment $VENV_NAME activated."
    echo "Happy coding you beautiful and strong genius, you 🧑‍💻"

# Otherwise, assume the action is "stop"
else
    echo "Deactivating $VENV_NAME virtual environment..."
    deactivate
    echo "Virtual environment $VENV_NAME deactivated."
    echo "Way to go you beautiful and strong genius, you 🧑‍💻"
fi

echo "\n༼ つ ◕◕ ༽つ SENDING THE GOODEST OF VIBES ༼ つ ◕◕ ༽つ\n\n"