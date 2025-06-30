"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { motion, AnimatePresence } from "framer-motion"

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // After mounting, we can safely show the UI
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const isDark = resolvedTheme === "dark"
  
  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark")
  }

  return (
    <motion.button
      onClick={toggleTheme}
      className={`
        relative overflow-hidden rounded-full p-1 md:p-2
        bg-gradient-to-br 
        ${isDark 
          ? "from-blue-800 to-purple-900 text-yellow-300" 
          : "from-yellow-300 to-orange-400 text-blue-900"}
        shadow-lg hover:shadow-xl
        transition-all duration-300 ease-out
      `}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={isDark ? "dark" : "light"}
          initial={{ y: 20, opacity: 0, rotate: -30 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: -20, opacity: 0, rotate: 30 }}
          transition={{ duration: 0.3 }}
          className="relative w-6 h-6 flex items-center justify-center"
        >
          {isDark ? (
            <Moon className="h-5 w-5" />
          ) : (
            <Sun className="h-5 w-5" />
          )}
        </motion.div>
      </AnimatePresence>
    </motion.button>
  )
}
