#!/bin/bash

# Content Scheduler Cron Job Setup Script
# This script helps set up cron jobs for the content scheduling system

set -e

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
NODE_PATH=$(which node)
CRON_USER=${CRON_USER:-$(whoami)}

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}Content Scheduler Cron Job Setup${NC}"
echo "=================================="
echo ""

# Check if Node.js is available
if [ ! -x "$NODE_PATH" ]; then
    echo -e "${RED}Error: Node.js not found. Please install Node.js first.${NC}"
    exit 1
fi

echo -e "Node.js found at: ${GREEN}$NODE_PATH${NC}"
echo -e "Project directory: ${GREEN}$PROJECT_DIR${NC}"
echo -e "Cron user: ${GREEN}$CRON_USER${NC}"
echo ""

# Check if the scheduling script exists
SCHEDULER_SCRIPT="$PROJECT_DIR/scripts/process-scheduled-content.js"
if [ ! -f "$SCHEDULER_SCRIPT" ]; then
    echo -e "${RED}Error: Scheduler script not found at $SCHEDULER_SCRIPT${NC}"
    exit 1
fi

echo -e "Scheduler script found: ${GREEN}$SCHEDULER_SCRIPT${NC}"
echo ""

# Make the script executable
chmod +x "$SCHEDULER_SCRIPT"

# Function to add cron job
add_cron_job() {
    local schedule="$1"
    local description="$2"
    local log_file="$PROJECT_DIR/logs/scheduler.log"
    
    # Create logs directory if it doesn't exist
    mkdir -p "$(dirname "$log_file")"
    
    # Create the cron job command
    local cron_command="$NODE_PATH $SCHEDULER_SCRIPT >> $log_file 2>&1"
    local cron_entry="$schedule $cron_command"
    
    echo -e "${YELLOW}Adding cron job:${NC}"
    echo "Schedule: $schedule ($description)"
    echo "Command: $cron_command"
    echo "Log file: $log_file"
    echo ""
    
    # Check if cron job already exists
    if crontab -l 2>/dev/null | grep -q "$SCHEDULER_SCRIPT"; then
        echo -e "${YELLOW}Warning: A cron job for this script already exists.${NC}"
        echo "Existing cron jobs:"
        crontab -l 2>/dev/null | grep "$SCHEDULER_SCRIPT" || true
        echo ""
        read -p "Do you want to replace it? (y/N): " -n 1 -r
        echo ""
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            echo "Skipping cron job addition."
            return
        fi
        
        # Remove existing cron jobs for this script
        (crontab -l 2>/dev/null | grep -v "$SCHEDULER_SCRIPT") | crontab -
        echo "Removed existing cron jobs."
    fi
    
    # Add the new cron job
    (crontab -l 2>/dev/null; echo "$cron_entry") | crontab -
    echo -e "${GREEN}Cron job added successfully!${NC}"
}

# Function to show menu
show_menu() {
    echo "Please select a scheduling frequency:"
    echo "1) Every 5 minutes (recommended for high-frequency posting)"
    echo "2) Every 15 minutes (recommended for normal usage)"
    echo "3) Every 30 minutes (recommended for low-frequency posting)"
    echo "4) Every hour"
    echo "5) Custom schedule"
    echo "6) View current cron jobs"
    echo "7) Remove cron jobs"
    echo "8) Exit"
    echo ""
}

# Function to view current cron jobs
view_cron_jobs() {
    echo -e "${YELLOW}Current cron jobs for $CRON_USER:${NC}"
    if crontab -l 2>/dev/null | grep -q "$SCHEDULER_SCRIPT"; then
        crontab -l 2>/dev/null | grep "$SCHEDULER_SCRIPT"
    else
        echo "No cron jobs found for the scheduler script."
    fi
    echo ""
}

# Function to remove cron jobs
remove_cron_jobs() {
    if crontab -l 2>/dev/null | grep -q "$SCHEDULER_SCRIPT"; then
        echo -e "${YELLOW}Found existing cron jobs:${NC}"
        crontab -l 2>/dev/null | grep "$SCHEDULER_SCRIPT"
        echo ""
        read -p "Are you sure you want to remove these cron jobs? (y/N): " -n 1 -r
        echo ""
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            (crontab -l 2>/dev/null | grep -v "$SCHEDULER_SCRIPT") | crontab -
            echo -e "${GREEN}Cron jobs removed successfully!${NC}"
        else
            echo "Cancelled."
        fi
    else
        echo "No cron jobs found for the scheduler script."
    fi
    echo ""
}

# Main menu loop
while true; do
    show_menu
    read -p "Enter your choice (1-8): " choice
    echo ""
    
    case $choice in
        1)
            add_cron_job "*/5 * * * *" "every 5 minutes"
            ;;
        2)
            add_cron_job "*/15 * * * *" "every 15 minutes"
            ;;
        3)
            add_cron_job "*/30 * * * *" "every 30 minutes"
            ;;
        4)
            add_cron_job "0 * * * *" "every hour"
            ;;
        5)
            echo "Enter a custom cron schedule (e.g., '0 */2 * * *' for every 2 hours):"
            read -p "Schedule: " custom_schedule
            if [ -n "$custom_schedule" ]; then
                add_cron_job "$custom_schedule" "custom schedule"
            else
                echo "Invalid schedule. Please try again."
            fi
            ;;
        6)
            view_cron_jobs
            ;;
        7)
            remove_cron_jobs
            ;;
        8)
            echo "Exiting..."
            break
            ;;
        *)
            echo -e "${RED}Invalid choice. Please try again.${NC}"
            ;;
    esac
    
    echo ""
done

echo -e "${GREEN}Setup complete!${NC}"
echo ""
echo "Important notes:"
echo "- Make sure your application is running and accessible"
echo "- Check the log file for any errors: $PROJECT_DIR/logs/scheduler.log"
echo "- You can view cron job status with: crontab -l"
echo "- To manually test the scheduler: $NODE_PATH $SCHEDULER_SCRIPT"
echo ""
echo "For more information, see the documentation."