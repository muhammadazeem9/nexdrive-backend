export const authConfig = {
  accessToken: {
    expiresIn: "15m",
  },

  refreshToken: {
    expiresIn: "7d",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  },

  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "lax" : "lax",
    path: "/",
  },

  refresh: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/api/auth",
  },
};
