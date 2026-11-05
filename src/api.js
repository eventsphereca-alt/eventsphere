const sessionKey = "eventsphere_session";

function readAccessToken() {
  if (typeof window === "undefined") return "";

  try {
    const stored = JSON.parse(window.localStorage.getItem(sessionKey) || "null");
    return stored?.accessToken || "";
  } catch {
    return "";
  }
}

export async function api(path, options = {}) {
  const accessToken = readAccessToken();
  const response = await fetch(path, {
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...(options.headers || {})
    },
    ...options
  });

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(data?.error || "Request failed");
  }

  return data;
}
