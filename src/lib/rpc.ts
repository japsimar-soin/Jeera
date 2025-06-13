import { hc } from "hono/client";
// import { AppType } from "@/app/api/[[...route]]/route";
import { AppType } from "@/lib/hono-app";


export const client = hc<AppType>(process.env.NEXT_PUBLIC_APP_URL!);
