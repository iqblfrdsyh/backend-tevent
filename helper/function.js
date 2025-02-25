export function trimmedValue(text) {
  return typeof text === "string" && text.trim().length > 0;
}

export function handleError(res, statusCode, message) {
  return res.status(statusCode).json({ message });
}
