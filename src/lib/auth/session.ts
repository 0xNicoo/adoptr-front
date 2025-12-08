import "server-only";
import { cookies } from "next/headers";

export async function getAccessToken() {
  return (await cookies()).get("access_token")?.value ?? null;
}

export async function setAccessToken({
  token
}: {
  token: string;
}) {
    (await cookies()).set("access_token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
    });
  }