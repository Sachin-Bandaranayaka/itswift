"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="bg-white rounded-lg shadow-lg p-4 mb-4 w-72"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Chat with us</h3>
              <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="h-64 bg-gray-100 rounded-md mb-4 p-2 overflow-y-auto">
              {/* Chat messages would go here */}
              <p className="text-gray-600">How can we help you today?</p>
            </div>
            <div className="flex">
              <input
                type="text"
                placeholder="Type your message..."
                className="flex-grow px-3 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-[#FF6B38]"
              />
              <Button className="rounded-l-none">Send</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <Button className="rounded-full w-12 h-12 shadow-lg" onClick={() => setIsOpen(!isOpen)}>
        <MessageCircle className="h-6 w-6" />
      </Button>
    </div>
  )
}

