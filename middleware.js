// export { default } from "next-auth/middleware";

// export const config = {
//   matcher: [
//     "/((?!$|api|_next/static|_next/image|favicon.ico).*)",
//     "/properties/add",
//     "/profile",
//     "/properties/saved",
//     "/messages",
//   ],
// };

// middleware.ts
import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/api/auth/signin",
  },
});

export const config = {
  // Explicitly list only the protected routes — nothing else
  matcher: ["/profile", "/properties/add", "/properties/saved", "/messages"],
};
