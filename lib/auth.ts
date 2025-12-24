import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function checkAuth() {
  const cookieStore = await cookies(); // ⭐ ต้อง await
  const token = cookieStore.get("token")?.value;

  if (!token) {
    throw new Error("UNAUTHORIZED");
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    );

    return decoded;
  } catch {
    throw new Error("UNAUTHORIZED");
  }
}
