import { Hono } from "hono";
import auth from "@/features/auth/server/route";
import members from "@/features/members/server/route";
import projects from "@/features/projects/server/route";
import workspaces from "@/features/workspaces/server/route";
import tasks from "@/features/tasks/server/route";

const app = new Hono().basePath("/api");

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const routes = app
	.route("/auth", auth)
	.route("/workspaces", workspaces)
	.route("/members", members)
	.route("/projects", projects)
	.route("/tasks", tasks);

export type AppType = typeof routes;
export default app;
