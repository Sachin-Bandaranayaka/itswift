#!/bin/bash

# Blog Post Scheduler Cron Job Setup Script
# This script sets up the cron job for processing scheduled blog posts

set -e

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
CRON_SCRIPT="$PROJECT_ROOT/scripts/process-scheduled-blog-posts.js"
LOG_DIR="$PROJECT_ROOT/logs"
CRON_LOG="$LOG_DIR/blog-scheduler-cron.log"
NODE_PATH=$(which node)

# Default cron schedule (every 5 minutes)
CRON_SCHEDULE="${BLOG_SCHEDULER_CRON_SCHEDULE:-*/5 * * * *}"

# Environment variables
NEXTAUTH_URL="${NEXTAUTH_URL:-http://localhost:3000}"
BLOG_SCHEDULER_LOG_LEVEL="${BLOG_SCHEDULER_LOG_LEVEL:-info}"

echo "Setting up blog post scheduler cron job..."
echo "Project root: $PROJECT_ROOT"
echo "Cron script: $CRON_SCRIPT"
echo "Node path: $NODE_PATH"
echo "Schedule: $CRON_SCHEDULE"
echo "Log directory: $LOG_DIR"

# Create logs directory if it doesn't exist
if [ ! -d "$LOG_DIR" ]; then
    echo "Creating logs directory: $LOG_DIR"
    mkdir -p "$LOG_DIR"
fi

# Make sure the script is executable
if [ ! -x "$CRON_SCRIPT" ]; then
    echo "Making script executable: $CRON_SCRIPT"
    chmod +x "$CRON_SCRIPT"
fi

# Test the script first
echo "Testing the blog scheduler script..."
cd "$PROJECT_ROOT"

# Set environment variables for the test
export NEXTAUTH_URL="$NEXTAUTH_URL"
export BLOG_SCHEDULER_LOG_LEVEL="$BLOG_SCHEDULER_LOG_LEVEL"
export BLOG_SCHEDULER_TIMEOUT="10000"  # 10 seconds for test

# Run a quick test (with shorter timeout)
if ! "$NODE_PATH" "$CRON_SCRIPT"; then
    echo "ERROR: Blog scheduler script test failed!"
    echo "Please check the script and your environment configuration."
    exit 1
fi

echo "Script test passed!"

# Create the cron job entry
CRON_ENTRY="$CRON_SCHEDULE cd $PROJECT_ROOT && NEXTAUTH_URL=$NEXTAUTH_URL BLOG_SCHEDULER_LOG_LEVEL=$BLOG_SCHEDULER_LOG_LEVEL $NODE_PATH $CRON_SCRIPT >> $CRON_LOG 2>&1"

echo "Cron job entry:"
echo "$CRON_ENTRY"

# Check if cron job already exists
if crontab -l 2>/dev/null | grep -q "process-scheduled-blog-posts.js"; then
    echo "Blog scheduler cron job already exists. Updating..."
    
    # Remove existing entry and add new one
    (crontab -l 2>/dev/null | grep -v "process-scheduled-blog-posts.js"; echo "$CRON_ENTRY") | crontab -
else
    echo "Adding new blog scheduler cron job..."
    
    # Add new entry to existing crontab
    (crontab -l 2>/dev/null; echo "$CRON_ENTRY") | crontab -
fi

echo "Cron job installed successfully!"

# Display current crontab
echo ""
echo "Current crontab entries:"
crontab -l

# Create a status check script
STATUS_SCRIPT="$SCRIPT_DIR/check-blog-scheduler-status.sh"
cat > "$STATUS_SCRIPT" << 'EOF'
#!/bin/bash

# Blog Scheduler Status Check Script

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
LOG_DIR="$PROJECT_ROOT/logs"
CRON_LOG="$LOG_DIR/blog-scheduler-cron.log"
SCHEDULER_LOG="$LOG_DIR/blog-scheduler.log"

echo "Blog Post Scheduler Status Check"
echo "================================"
echo "Timestamp: $(date)"
echo ""

# Check if cron job is installed
echo "Cron Job Status:"
if crontab -l 2>/dev/null | grep -q "process-scheduled-blog-posts.js"; then
    echo "✓ Cron job is installed"
    echo "Schedule: $(crontab -l | grep process-scheduled-blog-posts.js | awk '{print $1" "$2" "$3" "$4" "$5}')"
else
    echo "✗ Cron job is NOT installed"
fi
echo ""

# Check log files
echo "Log Files:"
if [ -f "$CRON_LOG" ]; then
    echo "✓ Cron log exists: $CRON_LOG"
    echo "  Size: $(du -h "$CRON_LOG" | cut -f1)"
    echo "  Last modified: $(stat -f "%Sm" "$CRON_LOG" 2>/dev/null || stat -c "%y" "$CRON_LOG" 2>/dev/null)"
else
    echo "✗ Cron log not found: $CRON_LOG"
fi

if [ -f "$SCHEDULER_LOG" ]; then
    echo "✓ Scheduler log exists: $SCHEDULER_LOG"
    echo "  Size: $(du -h "$SCHEDULER_LOG" | cut -f1)"
    echo "  Last modified: $(stat -f "%Sm" "$SCHEDULER_LOG" 2>/dev/null || stat -c "%y" "$SCHEDULER_LOG" 2>/dev/null)"
    echo "  Recent entries: $(wc -l < "$SCHEDULER_LOG")"
else
    echo "✗ Scheduler log not found: $SCHEDULER_LOG"
fi
echo ""

# Show recent log entries
if [ -f "$CRON_LOG" ]; then
    echo "Recent Cron Log Entries (last 10):"
    tail -n 10 "$CRON_LOG" | while read line; do
        echo "  $line"
    done
    echo ""
fi

if [ -f "$SCHEDULER_LOG" ]; then
    echo "Recent Scheduler Log Entries (last 5):"
    tail -n 5 "$SCHEDULER_LOG" | while read line; do
        echo "  $line"
    done
    echo ""
fi

# Check if the application is running
echo "Application Status:"
if curl -s -f "${NEXTAUTH_URL:-http://localhost:3000}/api/health" > /dev/null 2>&1; then
    echo "✓ Application is responding"
else
    echo "✗ Application is not responding or not running"
fi

echo ""
echo "To view live logs:"
echo "  Cron log: tail -f $CRON_LOG"
echo "  Scheduler log: tail -f $SCHEDULER_LOG"
echo ""
echo "To remove cron job:"
echo "  crontab -l | grep -v process-scheduled-blog-posts.js | crontab -"
EOF

chmod +x "$STATUS_SCRIPT"

echo ""
echo "Setup complete!"
echo ""
echo "The blog post scheduler will now run every 5 minutes."
echo "Logs will be written to:"
echo "  Cron output: $CRON_LOG"
echo "  Scheduler details: $LOG_DIR/blog-scheduler.log"
echo ""
echo "To check status: $STATUS_SCRIPT"
echo "To view logs: tail -f $CRON_LOG"
echo "To remove cron job: crontab -l | grep -v process-scheduled-blog-posts.js | crontab -"
echo ""
echo "Environment variables used:"
echo "  NEXTAUTH_URL: $NEXTAUTH_URL"
echo "  BLOG_SCHEDULER_LOG_LEVEL: $BLOG_SCHEDULER_LOG_LEVEL"
echo "  BLOG_SCHEDULER_CRON_SCHEDULE: $CRON_SCHEDULE"