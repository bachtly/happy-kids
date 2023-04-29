const SYSTEM_ERROR_MESSAGE = "Hệ thống gặp sự cố, vui lòng thử lại sau";

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return String(error);
}

export { getErrorMessage, SYSTEM_ERROR_MESSAGE };
