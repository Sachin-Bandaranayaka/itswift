# Blog Post Scheduler Cron Job

This document describes the blog post scheduler cron job implementation, which automatically processes and publishes scheduled blog posts.

## Overview

The blog post scheduler is a Node.js cron job that runs periodically to check for scheduled blog posts and publish them automatically when their scheduled time arrives. It includes comprehensive error handling, logging, monitoring, and health checks.

## Components

### 1. Main Cron Script
- **File**: `scripts/process-scheduled-blog-posts.js`
- **Purpose**: Main executable script that processes scheduled blog posts
- **Schedule**: Runs every 5 minutes by default (configurable)

### 2. Setup Script
- **File**: `scripts/setup-blog-scheduler-cron.sh`
- **Purpose**: Installs and configures the cron job
- **Features**: Tests script, creates log directories, adds cron entry

### 3. Test Script
- **File**: `scripts/test-blog-scheduler.js`
- **Purpose**: Comprehensive testing of scheduler functionality
- **Features**: Health checks, performance tests, error handling tests

### 4. Status Check Script
- **File**: `scripts/check-blog-scheduler-status.sh`
- **Purpose**: Check scheduler status and view logs
- **Auto-generated**: Created by setup script

## API Endpoints

### Health Check
- **Endpoint**: `GET /api/admin/blog/health`
- **Purpose**: Check scheduler health and service status
- **Authentication**: Admin required

### Monitoring
- **Endpoint**: `GET /api/admin/blog/monitoring`
- **Purpose**: Get comprehensive monitoring data and metrics
- **Formats**: JSON (default) or Prometheus (`?format=prometheus`)
- **Authentication**: Admin required

### Process Scheduled Posts
- **Endpoint**: `POST /api/admin/blog/process-scheduled`
- **Purpose**: Manually trigger processing of scheduled posts
- **Authentication**: Admin required

## Installation

### 1. Setup Cron Job
```bash
# Run the setup script
./scripts/setup-blog-scheduler-cron.sh

# Or manually set environment variables and run
NEXTAUTH_URL=http://localhost:3000 \
BLOG_SCHEDULER_LOG_LEVEL=info \
./scripts/setup-blog-scheduler-cron.sh
```

### 2. Verify Installation
```bash
# Check cron job status
./scripts/check-blog-scheduler-status.sh

# Run comprehensive tests
./scripts/test-blog-scheduler.js --verbose

# View logs
tail -f logs/blog-scheduler-cron.log
tail -f logs/blog-scheduler.log
```

## Configuration

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `NEXTAUTH_URL` | `http://localhost:3000` | Base URL of the application |
| `BLOG_SCHEDULER_TIMEOUT` | `30000` | Request timeout in milliseconds |
| `BLOG_SCHEDULER_LOG_LEVEL` | `info` | Log level (debug, info, warn, error) |
| `BLOG_SCHEDULER_CRON_SCHEDULE` | `*/5 * * * *` | Cron schedule (every 5 minutes) |

### Cron Schedule Examples
```bash
# Every 5 minutes (default)
*/5 * * * *

# Every 10 minutes
*/10 * * * *

# Every hour at minute 0
0 * * * *

# Every day at 9 AM
0 9 * * *

# Every weekday at 9 AM
0 9 * * 1-5
```

## Logging

### Log Files
- **Cron Output**: `logs/blog-scheduler-cron.log`
  - Contains stdout/stderr from cron execution
  - Includes basic execution status and errors

- **Scheduler Details**: `logs/blog-scheduler.log`
  - Contains detailed execution logs in JSON format
  - Includes metrics, processing results, and errors

### Log Levels
- **debug**: Detailed debugging information
- **info**: General information about processing
- **warn**: Warning messages for non-critical issues
- **error**: Error messages for failures

### Log Rotation
Logs are appended to files and should be rotated using logrotate or similar tools:

```bash
# Example logrotate configuration
/path/to/your/app/logs/*.log {
    daily
    rotate 30
    compress
    delaycompress
    missingok
    notifempty
    create 644 www-data www-data
}
```

## Monitoring

### Health Checks
The scheduler includes comprehensive health monitoring:

- **Application Health**: Checks if the main application is responding
- **Sanity CMS Connection**: Verifies connection to content management system
- **Queue Status**: Monitors processing queue size and errors
- **Memory Usage**: Tracks memory consumption
- **Processing Times**: Monitors execution duration

### Metrics
Available metrics include:
- Total scheduled posts
- Posts ready to process
- Queue size
- Processing success/failure rates
- Memory usage
- System uptime

### Alerts
The monitoring system generates alerts for:
- High queue sizes
- Processing failures
- Memory usage issues
- Stuck processing
- Service unavailability

### Prometheus Integration
Metrics can be exported in Prometheus format:
```bash
curl http://localhost:3000/api/admin/blog/monitoring?format=prometheus
```

## Error Handling

### Retry Logic
- **Max Retries**: 3 attempts by default
- **Backoff Strategy**: Exponential backoff (5s, 10s, 20s)
- **Queue Management**: Failed items are queued for retry
- **Permanent Failures**: Items exceeding max retries are marked as failed

### Error Types
1. **Network Errors**: Connection timeouts, DNS failures
2. **API Errors**: HTTP error responses, authentication failures
3. **Processing Errors**: Invalid data, Sanity CMS errors
4. **System Errors**: Memory issues, file system errors

### Error Recovery
- Automatic retry with exponential backoff
- Queue persistence across restarts
- Health check monitoring
- Alert generation for critical issues

## Troubleshooting

### Common Issues

#### 1. Cron Job Not Running
```bash
# Check if cron job is installed
crontab -l | grep process-scheduled-blog-posts

# Check cron service status
sudo service cron status  # Ubuntu/Debian
sudo service crond status # CentOS/RHEL

# Check system logs
tail -f /var/log/syslog | grep CRON
```

#### 2. Application Not Responding
```bash
# Check application health
curl http://localhost:3000/api/health

# Check if application is running
ps aux | grep node

# Check application logs
tail -f logs/application.log
```

#### 3. High Memory Usage
```bash
# Monitor memory usage
./scripts/test-blog-scheduler.js --verbose

# Check system memory
free -h
top -p $(pgrep -f process-scheduled-blog-posts)
```

#### 4. Processing Failures
```bash
# Check scheduler health
curl http://localhost:3000/api/admin/blog/health

# View detailed logs
tail -f logs/blog-scheduler.log

# Check Sanity CMS connection
# (Check your Sanity configuration and API keys)
```

### Debug Mode
Enable debug logging for detailed troubleshooting:
```bash
BLOG_SCHEDULER_LOG_LEVEL=debug ./scripts/process-scheduled-blog-posts.js
```

## Performance Optimization

### Recommendations
1. **Adjust Cron Frequency**: Balance between responsiveness and system load
2. **Monitor Queue Size**: Increase frequency if queue grows large
3. **Memory Management**: Monitor memory usage and restart if needed
4. **Database Optimization**: Ensure Sanity CMS queries are optimized
5. **Network Timeouts**: Adjust timeouts based on network conditions

### Scaling
For high-volume scenarios:
- Consider running multiple instances with different schedules
- Implement distributed locking to prevent conflicts
- Use external queue systems (Redis, RabbitMQ)
- Monitor and alert on performance metrics

## Security Considerations

### Access Control
- All admin endpoints require authentication
- API keys should be properly secured
- Log files may contain sensitive information

### Network Security
- Use HTTPS in production
- Implement rate limiting
- Monitor for suspicious activity

### Data Protection
- Sanitize log output to prevent information leakage
- Secure storage of configuration files
- Regular security updates

## Maintenance

### Regular Tasks
1. **Log Rotation**: Implement log rotation to prevent disk space issues
2. **Health Monitoring**: Regularly check health endpoints
3. **Performance Review**: Monitor metrics and optimize as needed
4. **Security Updates**: Keep dependencies updated

### Backup and Recovery
- Backup cron configuration
- Document environment variables
- Test recovery procedures
- Monitor backup integrity

## Testing

### Manual Testing
```bash
# Run comprehensive tests
./scripts/test-blog-scheduler.js --verbose

# Test specific functionality
node -e "require('./scripts/process-scheduled-blog-posts.js').processScheduledBlogPosts()"

# Check health endpoints
curl http://localhost:3000/api/admin/blog/health
curl http://localhost:3000/api/admin/blog/monitoring
```

### Automated Testing
The test script includes:
- Health check validation
- API endpoint testing
- Performance benchmarks
- Error handling verification
- Monitoring system tests

### Load Testing
For production environments, consider:
- Stress testing with multiple scheduled posts
- Network failure simulation
- Memory pressure testing
- Concurrent request handling

## Support

### Getting Help
1. Check this documentation
2. Review log files for errors
3. Run the test script for diagnostics
4. Check health and monitoring endpoints
5. Verify environment configuration

### Reporting Issues
When reporting issues, include:
- Error messages from logs
- Environment configuration
- Steps to reproduce
- Expected vs actual behavior
- System information (OS, Node.js version)

## Changelog

### Version 1.0.0
- Initial implementation
- Basic cron job functionality
- Health checks and monitoring
- Comprehensive error handling
- Logging and alerting
- Setup and test scripts
- Documentation