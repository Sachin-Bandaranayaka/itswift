export enum LogLevel {
    ERROR = 'error',
    WARN = 'warn',
    INFO = 'info',
    DEBUG = 'debug'
}

export interface LogEntry {
    timestamp: string
    level: LogLevel
    message: string
    context?: string
    metadata?: Record<string, any>
    error?: {
        name: string
        message: string
        stack?: string
    }
}

class Logger {
    private isDevelopment = process.env.NODE_ENV === 'development'
    private logLevel = process.env.LOG_LEVEL || (this.isDevelopment ? LogLevel.DEBUG : LogLevel.INFO)

    private shouldLog(level: LogLevel): boolean {
        const levels = [LogLevel.ERROR, LogLevel.WARN, LogLevel.INFO, LogLevel.DEBUG]
        const currentLevelIndex = levels.indexOf(this.logLevel as LogLevel)
        const messageLevelIndex = levels.indexOf(level)

        return messageLevelIndex <= currentLevelIndex
    }

    private formatLogEntry(entry: LogEntry): string {
        const { timestamp, level, message, context, metadata, error } = entry

        let logMessage = `[${timestamp}] ${level.toUpperCase()}`

        if (context) {
            logMessage += ` [${context}]`
        }

        logMessage += `: ${message}`

        if (metadata && Object.keys(metadata).length > 0) {
            logMessage += ` | Metadata: ${JSON.stringify(metadata)}`
        }

        if (error) {
            logMessage += ` | Error: ${error.name} - ${error.message}`
            if (this.isDevelopment && error.stack) {
                logMessage += `\nStack: ${error.stack}`
            }
        }

        return logMessage
    }

    private createLogEntry(
        level: LogLevel,
        message: string,
        context?: string,
        metadata?: Record<string, any>,
        error?: Error
    ): LogEntry {
        return {
            timestamp: new Date().toISOString(),
            level,
            message,
            context,
            metadata,
            error: error ? {
                name: error.name,
                message: error.message,
                stack: error.stack
            } : undefined
        }
    }

    private writeLog(entry: LogEntry): void {
        if (!this.shouldLog(entry.level)) {
            return
        }

        const formattedMessage = this.formatLogEntry(entry)

        // In development, use console methods for better formatting
        if (this.isDevelopment) {
            switch (entry.level) {
                case LogLevel.ERROR:
                    console.error(formattedMessage)
                    break
                case LogLevel.WARN:
                    console.warn(formattedMessage)
                    break
                case LogLevel.INFO:
                    console.info(formattedMessage)
                    break
                case LogLevel.DEBUG:
                    console.debug(formattedMessage)
                    break
            }
        } else {
            // In production, use structured logging
            console.log(JSON.stringify(entry))
        }
    }

    error(message: string, context?: string, metadata?: Record<string, any>, error?: Error): void {
        const entry = this.createLogEntry(LogLevel.ERROR, message, context, metadata, error)
        this.writeLog(entry)
    }

    warn(message: string, context?: string, metadata?: Record<string, any>): void {
        const entry = this.createLogEntry(LogLevel.WARN, message, context, metadata)
        this.writeLog(entry)
    }

    info(message: string, context?: string, metadata?: Record<string, any>): void {
        const entry = this.createLogEntry(LogLevel.INFO, message, context, metadata)
        this.writeLog(entry)
    }

    debug(message: string, context?: string, metadata?: Record<string, any>): void {
        const entry = this.createLogEntry(LogLevel.DEBUG, message, context, metadata)
        this.writeLog(entry)
    }

    // Convenience methods for common logging scenarios
    apiRequest(method: string, path: string, metadata?: Record<string, any>): void {
        this.info(`${method} ${path}`, 'API', metadata)
    }

    apiResponse(method: string, path: string, statusCode: number, duration?: number): void {
        const metadata: Record<string, any> = { statusCode }
        if (duration !== undefined) {
            metadata.duration = `${duration}ms`
        }

        const level = statusCode >= 400 ? LogLevel.WARN : LogLevel.INFO
        const message = `${method} ${path} - ${statusCode}`

        if (level === LogLevel.WARN) {
            this.warn(message, 'API', metadata)
        } else {
            this.info(message, 'API', metadata)
        }
    }

    databaseQuery(query: string, duration?: number, metadata?: Record<string, any>): void {
        const logMetadata: Record<string, any> = { ...metadata }
        if (duration !== undefined) {
            logMetadata.duration = `${duration}ms`
        }

        this.debug(`Database query executed`, 'DATABASE', logMetadata)
    }

    externalApiCall(service: string, endpoint: string, statusCode?: number, duration?: number): void {
        const metadata: Record<string, any> = { service, endpoint }
        if (statusCode !== undefined) {
            metadata.statusCode = statusCode
        }
        if (duration !== undefined) {
            metadata.duration = `${duration}ms`
        }

        const level = statusCode && statusCode >= 400 ? LogLevel.WARN : LogLevel.INFO
        const message = `External API call to ${service}`

        if (level === LogLevel.WARN) {
            this.warn(message, 'EXTERNAL_API', metadata)
        } else {
            this.info(message, 'EXTERNAL_API', metadata)
        }
    }

    securityEvent(event: string, metadata?: Record<string, any>): void {
        this.warn(`Security event: ${event}`, 'SECURITY', metadata)
    }

    performanceMetric(metric: string, value: number, unit: string = 'ms'): void {
        this.info(`Performance metric: ${metric}`, 'PERFORMANCE', { value, unit })
    }
}

// Export singleton instance
export const logger = new Logger()

// Export types for external use
export type { LogEntry }