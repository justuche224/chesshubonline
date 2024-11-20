const isDevelopment = process.env.NODE_ENV === "development";

const logger = {
  log: (...args) => {
    if (isDevelopment) {
      console.log("[LOG]:", ...args);
    }
  },
  info: (...args) => {
    if (isDevelopment) {
      console.info("[INFO]:", ...args);
    }
  },
  warn: (...args) => {
    if (isDevelopment) {
      console.warn("[WARN]:", ...args);
    }
  },
  error: (...args) => {
    if (isDevelopment) {
      console.error("[ERROR]:", ...args);
    }
  },
};

export default logger;
