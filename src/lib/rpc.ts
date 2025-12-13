import { hc } from "hono/client";
// import { AppType } from "@/app/api/[[...route]]/route";
import { AppType } from "@/lib/hono-app";

//------------------Added to support all domains in Vercel (earlier it was supporting the default domain, and not my custom domain)------------

const baseURL =
	typeof window !== "undefined"
		? window.location.origin
		: process.env.NEXT_PUBLIC_APP_URL ??
		  (() => {
				throw new Error("NEXT_PUBLIC_APP_URL is not set");
		  })();

export const client = hc<AppType>(baseURL);

//export const client = hc<AppType>(process.env.NEXT_PUBLIC_APP_URL!);
