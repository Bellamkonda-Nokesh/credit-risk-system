/**
 * Shared logger utility for the backend.
 * Kept in a separate file to avoid circular imports when seed/api files
 * need logging without pulling in the full Express server entry point.
 */
export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}
