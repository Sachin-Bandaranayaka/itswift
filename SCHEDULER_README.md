# Background Scheduler System

This document describes the background scheduling system implemented for automated content processing.

## Overview

The background scheduler is a comprehensive system that handles automated posting of social media content and newsletter campaigns. It includes:

- **Queue Management**: Intelligent queuing system with priority handling
- **Retry Logic**: Exponential backoff retry mechanism for failed items
- **Logging**: Comprehensive logging with multiple levels and monitoring
- **Monitoring**: Real-time monitoring dashboard and health checks
- **Cron Integration**: Scripts for automated execution via cron jobs

## Architecture

### Core Components

1. **BackgroundScheduler** (`lib/services/background-scheduler.ts`)
   - Main scheduler service with queue processing
   - Handles concurrent job execution
   - Manages retry logic and error handling

2. **SchedulerQueue** (`lib/services/scheduler-queue.ts`)
   - Queue management with priority ordering
   - Item status tracking (pending, processing, completed, failed)
   - Automatic cleanup of completed items

3. **SchedulerLogger** (`lib/services/scheduler-logger.ts`)
   - Multi-level logging (debug, info, warn, error)
   - File and console output
   - Log statistics and monitoring

4. **API Routes** (`app/api/admin/scheduler/route.ts`)
   - RESTful API for scheduler control
   - Status monitoring and health checks
   - Configuration management

## Features

### Queue System
- **Priority-based processing**: Items are processed based on priority (overdue items first)
- **Concurrent processing**: Configurable number of concurrent jobs
- **Status tracking**: Items tracked through pending → processing → completed/failed states
- **Automatic cleanup**: Completed items are automatically cleaned up to prevent memory issues

### Retry Logic
- **Exponential backoff**: Failed items are retried with increasing delays
- **Configurable retries**: Maximum retry attempts can be configured
- **Error tracking**: Last error message is stored for debugging
- **Permanent failure handling**: Items that exceed max retries are marked as permanently failed

### Logging
- **Multiple levels**: Debug, info, warn, error logging levels
- **Structured logging**: Consistent log format with timestamps and metadata
- **File output**: Optional file logging for production environments
- **Statistics**: Log statistics including error counts and recent activity

### Monitoring
- **Health checks**: Comprehensive health monitoring of all system components
- **Real-time status**: Live status updates including queue size and processing stats
- **Performance metrics**: Processing statistics and success/failure rates
- **Admin dashboard**: Web-based monitoring interface

## Configuration

### Environment Variables

```bash
# Scheduler Configuration
SCHEDULER_MAX_CONCURRENT_JOBS=3          # Maximum concurrent processing jobs
SCHEDULER_PROCESSING_INTERVAL_MS=30000   # Processing interval in milliseconds
SCHEDULER_MAX_RETRIES=3                  # Maximum retry attempts
SCHEDULER_BASE_DELAY_MS=5000            # Base retry delay in milliseconds
SCHEDULER_BACKOFF_MULTIPLIER=2          # Exponential backoff multiplier

# Logging Configuration
SCHEDULER_LOG_LEVEL=info                # Log level (debug, info, warn, error)
SCHEDULER_LOG_FILE=/path/to/scheduler.log # Optional log file path
SCHEDULER_ENABLE_CONSOLE=true          # Enable console logging

# Auto-start Configuration
SCHEDULER_AUTO_START=true               # Auto-start scheduler in production
```

### Default Configuration

```typescript
{
  maxConcurrentJobs: 3,
  processingIntervalMs: 30000, // 30 seconds
  retryConfig: {
    maxRetries: 3,
    baseDelayMs: 5000, // 5 seconds
    backoffMultiplier: 2
  },
  logging: {
    level: 'info',
    enableConsole: true
  }
}
```

## Usage

### Starting the Scheduler

#### Programmatically
```typescript
import { BackgroundScheduler } from '@/lib/services/background-scheduler'

const scheduler = BackgroundScheduler.getInstance()
scheduler.start()
```

#### Via API
```bash
curl -X POST http://localhost:3000/api/admin/scheduler \
  -H "Content-Type: application/json" \
  -d '{"action": "start"}'
```

#### Via Script
```bash
npm run init-scheduler
```

### Monitoring

#### Web Dashboard
Visit `/admin/scheduler` in your application to access the monitoring dashboard.

#### API Endpoints
- `GET /api/admin/scheduler?action=status` - Get scheduler status
- `GET /api/admin/scheduler?action=health` - Health check
- `GET /api/admin/scheduler?action=queue` - Queue details
- `GET /api/admin/scheduler?action=logs` - Recent logs
- `POST /api/admin/scheduler` - Control actions (start, stop, process, etc.)

### Cron Setup

#### Automatic Setup
```bash
npm run setup-cron
```

#### Manual Setup
Add to crontab for processing every 5 minutes:
```bash
*/5 * * * * /usr/bin/node /path/to/your/app/scripts/process-scheduled-content.js >> /path/to/logs/scheduler.log 2>&1
```

## API Reference

### GET Endpoints

#### Get Status
```
GET /api/admin/scheduler?action=status
```
Returns current scheduler status including queue size, active jobs, and processing statistics.

#### Health Check
```
GET /api/admin/scheduler?action=health
```
Returns health status of all scheduler components.

#### Queue Details
```
GET /api/admin/scheduler?action=queue
```
Returns detailed queue information including pending items.

#### Logs
```
GET /api/admin/scheduler?action=logs&limit=100
```
Returns recent log entries.

### POST Endpoints

#### Start Scheduler
```
POST /api/admin/scheduler
Content-Type: application/json

{"action": "start"}
```

#### Stop Scheduler
```
POST /api/admin/scheduler
Content-Type: application/json

{"action": "stop"}
```

#### Force Process
```
POST /api/admin/scheduler
Content-Type: application/json

{"action": "process"}
```

#### Reset Statistics
```
POST /api/admin/scheduler
Content-Type: application/json

{"action": "reset-stats"}
```

#### Update Configuration
```
POST /api/admin/scheduler
Content-Type: application/json

{
  "action": "update-config",
  "config": {
    "maxConcurrentJobs": 5,
    "processingIntervalMs": 60000
  }
}
```

## Scripts

### Available Scripts

- `npm run init-scheduler` - Initialize and start the scheduler
- `npm run process-scheduled` - Process scheduled content once
- `npm run setup-cron` - Interactive cron job setup
- `npm run test-scheduler` - Run scheduler test suite

### Script Descriptions

#### init-scheduler.js
Initializes the background scheduler when the application starts. Includes health checks and automatic startup.

#### process-scheduled-content.js
Unified cron job script that processes all scheduled content. Includes comprehensive logging and error handling.

#### setup-cron.sh
Interactive script for setting up cron jobs with different scheduling frequencies.

#### test-scheduler.js
Comprehensive test suite for validating scheduler functionality.

## Troubleshooting

### Common Issues

#### Scheduler Not Starting
1. Check application health: `npm run test-scheduler`
2. Verify database connectivity
3. Check environment variables
4. Review logs for errors

#### Items Not Processing
1. Check queue status via API or dashboard
2. Verify scheduler is running
3. Check for stuck items in processing state
4. Review item retry counts and errors

#### High Error Rates
1. Check recent errors in logs
2. Verify API integrations (social media, email)
3. Check database connectivity
4. Review retry configuration

### Debugging

#### Enable Debug Logging
```bash
SCHEDULER_LOG_LEVEL=debug npm start
```

#### Check Queue Status
```bash
curl http://localhost:3000/api/admin/scheduler?action=queue
```

#### View Recent Logs
```bash
curl http://localhost:3000/api/admin/scheduler?action=logs&limit=50
```

#### Reset Stuck Items
The scheduler automatically resets items stuck in processing state after 30 minutes.

## Performance Considerations

### Scaling
- Adjust `maxConcurrentJobs` based on server capacity
- Monitor memory usage with large queues
- Consider database connection pooling for high throughput

### Optimization
- Use appropriate `processingIntervalMs` for your use case
- Configure retry settings based on external API reliability
- Implement proper database indexing for scheduled content queries

### Monitoring
- Set up alerts for high error rates
- Monitor queue size growth
- Track processing success rates
- Monitor memory and CPU usage

## Security

### API Security
- Implement proper authentication for admin endpoints
- Use HTTPS in production
- Validate all input parameters
- Implement rate limiting

### Data Protection
- Secure storage of API keys and credentials
- Encrypt sensitive data in logs
- Implement proper access controls
- Regular security audits

## Maintenance

### Regular Tasks
- Monitor log file sizes and implement rotation
- Clean up old completed items
- Review and update retry configurations
- Monitor external API rate limits

### Updates
- Test scheduler functionality after application updates
- Verify cron job configurations after server changes
- Update monitoring thresholds as needed
- Review and update security configurations

## Support

For issues or questions about the background scheduler system:

1. Check the troubleshooting section above
2. Review logs for error details
3. Use the test suite to validate functionality
4. Check the monitoring dashboard for system status

The scheduler is designed to be robust and self-healing, but proper monitoring and maintenance ensure optimal performance.