"use client"

import { useState, useEffect } from "react"
import { useSession, signOut } from "next-auth/react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Clock, AlertTriangle } from "lucide-react"

interface SessionInfo {
  isValid: boolean
  timeUntilExpiry: number
  timeUntilIdle: number
}

export function SessionTimeoutWarning() {
  const { data: session } = useSession()
  const [sessionInfo, setSessionInfo] = useState<SessionInfo | null>(null)
  const [showWarning, setShowWarning] = useState(false)
  const [showDialog, setShowDialog] = useState(false)

  useEffect(() => {
    if (!session) return

    const checkSession = async () => {
      try {
        const response = await fetch('/api/admin/auth/session-info')
        if (response.ok) {
          const info: SessionInfo = await response.json()
          setSessionInfo(info)

          // Show warning if less than 5 minutes until idle timeout
          const fiveMinutes = 5 * 60 * 1000
          if (info.timeUntilIdle < fiveMinutes && info.timeUntilIdle > 0) {
            setShowWarning(true)
          } else {
            setShowWarning(false)
          }

          // Show dialog if less than 2 minutes until idle timeout
          const twoMinutes = 2 * 60 * 1000
          if (info.timeUntilIdle < twoMinutes && info.timeUntilIdle > 0) {
            setShowDialog(true)
          }

          // Auto logout if session expired
          if (!info.isValid) {
            await signOut({ callbackUrl: '/admin/login' })
          }
        }
      } catch (error) {
        console.error('Error checking session:', error)
      }
    }

    // Check immediately
    checkSession()

    // Check every 30 seconds
    const interval = setInterval(checkSession, 30000)

    return () => clearInterval(interval)
  }, [session])

  const extendSession = async () => {
    // Make a request to refresh the session
    try {
      await fetch('/api/admin/auth/session-info')
      setShowWarning(false)
      setShowDialog(false)
    } catch (error) {
      console.error('Error extending session:', error)
    }
  }

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/admin/login' })
  }

  const formatTime = (milliseconds: number) => {
    const minutes = Math.floor(milliseconds / (1000 * 60))
    const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  if (!session || !sessionInfo) return null

  return (
    <>
      {/* Warning banner */}
      {showWarning && !showDialog && (
        <Alert className="mb-4 border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20">
          <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
          <AlertDescription className="text-yellow-800 dark:text-yellow-200">
            Your session will expire in {formatTime(sessionInfo.timeUntilIdle)} due to inactivity.
            <Button
              variant="link"
              size="sm"
              onClick={extendSession}
              className="ml-2 p-0 h-auto text-yellow-800 dark:text-yellow-200 underline"
            >
              Stay logged in
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Timeout dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Session Expiring Soon
            </DialogTitle>
            <DialogDescription>
              Your session will expire in {sessionInfo ? formatTime(sessionInfo.timeUntilIdle) : '0:00'} due to inactivity.
              You will be automatically logged out to protect your account.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={handleLogout}>
              Logout Now
            </Button>
            <Button onClick={extendSession}>
              Stay Logged In
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}