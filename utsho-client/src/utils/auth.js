export const getUser = () => {
  try {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  } catch (err) {
    console.error("Error parsing user:", err);
    return null;
  }
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  return !!token && !isTokenExpired(token);
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  // ✅ ADDED: Instantly replace the history stack and redirect
  window.location.replace("/"); 
};

export const isTokenExpired = (token) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};