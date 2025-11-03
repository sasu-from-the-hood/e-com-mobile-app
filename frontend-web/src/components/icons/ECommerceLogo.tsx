import { motion } from "framer-motion"

interface ECommerceLogoProps {
  className?: string
}

export function ECommerceLogo({ className = "w-12 h-12" }: ECommerceLogoProps) {
  return (
    <motion.svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      animate={{ y: [0, -4, 0] }}
      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
    >
      {/* Shopping bag top arc */}
      <motion.path
        d="M6 7V6a6 6 0 1 1 12 0v1"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: [0, 1, 1, 0] }}
        transition={{
          duration: 4,
          ease: "easeInOut",
          repeat: Infinity,
          repeatDelay: 0.3,
        }}
      />

      {/* Shopping bag body */}
      <motion.path
        d="M5 7h14l-1 10H6L5 7z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: [0, 1, 1, 0] }}
        transition={{
          duration: 4,
          delay: 0.2,
          ease: "easeInOut",
          repeat: Infinity,
          repeatDelay: 0.3,
        }}
      />

      {/* Handle connection */}
      <motion.path
        d="M12 7v3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: [0, 1, 1, 0] }}
        transition={{
          duration: 4,
          delay: 0.4,
          ease: "easeInOut",
          repeat: Infinity,
          repeatDelay: 0.3,
        }}
      />

      {/* Letter "e" swinging & appearing */}
      <motion.g
        animate={{
          rotate: [-10, 10, -10],
          transformOrigin: "12px 7px",
        }}
        transition={{
          duration: 2,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      >
        <motion.circle
          cx="12"
          cy="12"
          r="2"
          fill="currentColor"
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1, 1, 0] }}
          transition={{
            duration: 4,
            delay: 0.6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.path
          d="M10.5 12h3"
          stroke="white"
          strokeWidth="0.8"
          strokeLinecap="round"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 1, 0] }}
          transition={{
            duration: 4,
            delay: 0.8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.g>
    </motion.svg>
  )
}
