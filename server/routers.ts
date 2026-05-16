import { router } from "./trpc.js";
import { authRouter } from "./routers/auth.js";
import { menuRouter } from "./routers/menu.js";
import { tokensRouter } from "./routers/tokens.js";
import { ordersRouter } from "./routers/orders.js";
import { codesRouter } from "./routers/codes.js";
import { adminRouter } from "./routers/admin.js";
import { reservationsRouter } from "./routers/reservations.js";

export const appRouter = router({
  auth: authRouter,
  menu: menuRouter,
  tokens: tokensRouter,
  orders: ordersRouter,
  codes: codesRouter,
  admin: adminRouter,
  reservations: reservationsRouter,
});

export type AppRouter = typeof appRouter;
