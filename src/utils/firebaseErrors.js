// Firebase errors carry a machine-readable `code` (e.g. "auth/invalid-credential").
// The default `error.message` is long and technical ("Firebase: Error (auth/...)"),
// so we map the common codes to short messages that are safe to show to users.

const messages = {
  // Authentication
  "auth/invalid-credential": "Incorrect email or password.",
  "auth/invalid-email": "Please enter a valid email address.",
  "auth/user-not-found": "No account found with this email.",
  "auth/wrong-password": "Incorrect email or password.",
  "auth/email-already-in-use": "An account with this email already exists.",
  "auth/weak-password": "Password should be at least 6 characters.",
  "auth/too-many-requests": "Too many attempts. Please try again later.",
  "auth/network-request-failed": "Network error. Please check your internet connection.",
  "auth/requires-recent-login": "For security, please log in again and then retry.",

  // Firestore
  "permission-denied": "You don't have permission to do that.",
  unavailable: "Service temporarily unavailable. Please try again.",
};

export function getErrorMessage(error) {
  return messages[error?.code] || "Something went wrong. Please try again.";
}
