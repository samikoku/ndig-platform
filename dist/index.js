// server/_core/index.ts
import "dotenv/config";
import express2 from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";

// shared/const.ts
var COOKIE_NAME = "app_session_id";
var ONE_YEAR_MS = 1e3 * 60 * 60 * 24 * 365;
var AXIOS_TIMEOUT_MS = 3e4;
var UNAUTHED_ERR_MSG = "Please login (10001)";
var NOT_ADMIN_ERR_MSG = "You do not have required permission (10002)";

// server/db.ts
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";

// drizzle/schema.ts
import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";
var users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull()
});
var interestRegistrations = mysqlTable("interest_registrations", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  location: varchar("location", { length: 255 }).notNull(),
  investmentCapacity: varchar("investment_capacity", { length: 100 }).notNull(),
  message: text("message"),
  status: mysqlEnum("status", ["new", "contacted", "qualified", "converted"]).default("new").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull()
});
var investmentOpportunities = mysqlTable("investment_opportunities", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  category: mysqlEnum("category", ["real_estate", "energy", "financial_instrument", "infrastructure", "agriculture"]).notNull(),
  targetYield: varchar("target_yield", { length: 50 }).notNull(),
  minEntry: int("min_entry").notNull(),
  // in USD
  term: varchar("term", { length: 50 }).notNull(),
  status: mysqlEnum("status", ["open", "closing_soon", "closed", "draft"]).default("draft").notNull(),
  imageUrl: text("image_url"),
  featured: int("featured").default(0).notNull(),
  // 0 = not featured, 1 = featured
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
});
var demoAnalytics = mysqlTable("demo_analytics", {
  id: int("id").autoincrement().primaryKey(),
  sessionId: varchar("session_id", { length: 255 }).notNull(),
  enteredAt: timestamp("entered_at").defaultNow().notNull(),
  exitedAt: timestamp("exited_at"),
  durationSeconds: int("duration_seconds"),
  pagesViewed: int("pages_viewed").default(0).notNull(),
  convertedToRegistration: int("converted_to_registration").default(0).notNull()
  // 0 = no, 1 = yes
});
var referralTracking = mysqlTable("referral_tracking", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id"),
  // null for anonymous clicks
  referralCode: varchar("referral_code", { length: 50 }).notNull().unique(),
  targetType: mysqlEnum("target_type", ["nrbvn", "nrnia", "bank_account", "diaspora_bond", "other"]).notNull(),
  targetUrl: text("target_url").notNull(),
  clickedAt: timestamp("clicked_at").defaultNow().notNull(),
  ipAddress: varchar("ip_address", { length: 45 }),
  userAgent: text("user_agent"),
  verified: int("verified").default(0).notNull(),
  // 0 = not verified, 1 = verified
  verifiedAt: timestamp("verified_at")
});
var investmentFlows = mysqlTable("investment_flows", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  referralCode: varchar("referral_code", { length: 50 }),
  investmentType: mysqlEnum("investment_type", ["diaspora_bond", "real_estate", "energy", "stocks", "other"]).notNull(),
  amountUSD: int("amount_usd").notNull(),
  amountNGN: int("amount_ngn"),
  feeUSD: int("fee_usd").notNull(),
  feePercentage: varchar("fee_percentage", { length: 10 }).notNull(),
  status: mysqlEnum("status", ["initiated", "pending_verification", "verified", "completed", "failed"]).default("initiated").notNull(),
  nrniaAccountNumber: varchar("nrnia_account_number", { length: 50 }),
  bankName: varchar("bank_name", { length: 255 }),
  transactionReference: varchar("transaction_reference", { length: 255 }),
  verificationProof: text("verification_proof"),
  // URL to uploaded screenshot/document
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  completedAt: timestamp("completed_at")
});
var accountLinks = mysqlTable("account_links", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  accountType: mysqlEnum("account_type", ["nrnia", "nrnoa", "nrbvn", "other"]).notNull(),
  accountNumber: varchar("account_number", { length: 50 }).notNull(),
  bankName: varchar("bank_name", { length: 255 }),
  verified: int("verified").default(0).notNull(),
  // 0 = not verified, 1 = verified
  verificationProof: text("verification_proof"),
  // URL to uploaded document
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  verifiedAt: timestamp("verified_at")
});

// server/_core/env.ts
var ENV = {
  appId: process.env.VITE_APP_ID ?? "",
  cookieSecret: process.env.JWT_SECRET ?? "",
  databaseUrl: process.env.DATABASE_URL ?? "",
  oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
  isProduction: process.env.NODE_ENV === "production",
  forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
  forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? ""
};

// server/db.ts
var _db = null;
async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}
async function upsertUser(user) {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }
  try {
    const values = {
      openId: user.openId
    };
    const updateSet = {};
    const textFields = ["name", "email", "loginMethod"];
    const assignNullable = (field) => {
      const value = user[field];
      if (value === void 0) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };
    textFields.forEach(assignNullable);
    if (user.lastSignedIn !== void 0) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== void 0) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }
    if (!values.lastSignedIn) {
      values.lastSignedIn = /* @__PURE__ */ new Date();
    }
    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = /* @__PURE__ */ new Date();
    }
    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}
async function getUserByOpenId(openId) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return void 0;
  }
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : void 0;
}

// server/_core/cookies.ts
function isSecureRequest(req) {
  if (req.protocol === "https") return true;
  const forwardedProto = req.headers["x-forwarded-proto"];
  if (!forwardedProto) return false;
  const protoList = Array.isArray(forwardedProto) ? forwardedProto : forwardedProto.split(",");
  return protoList.some((proto) => proto.trim().toLowerCase() === "https");
}
function getSessionCookieOptions(req) {
  return {
    httpOnly: true,
    path: "/",
    sameSite: "none",
    secure: isSecureRequest(req)
  };
}

// shared/_core/errors.ts
var HttpError = class extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.name = "HttpError";
  }
};
var ForbiddenError = (msg) => new HttpError(403, msg);

// server/_core/sdk.ts
import axios from "axios";
import { parse as parseCookieHeader } from "cookie";
import { SignJWT, jwtVerify } from "jose";
function isNonEmptyString(value) {
  return typeof value === "string" && value.length > 0;
}
var EXCHANGE_TOKEN_PATH = `/webdev.v1.WebDevAuthPublicService/ExchangeToken`;
var GET_USER_INFO_PATH = `/webdev.v1.WebDevAuthPublicService/GetUserInfo`;
var GET_USER_INFO_WITH_JWT_PATH = `/webdev.v1.WebDevAuthPublicService/GetUserInfoWithJwt`;
var OAuthService = class {
  constructor(client) {
    this.client = client;
    console.log("[OAuth] Initialized with baseURL:", ENV.oAuthServerUrl);
    if (!ENV.oAuthServerUrl) {
      console.error(
        "[OAuth] ERROR: OAUTH_SERVER_URL is not configured! Set OAUTH_SERVER_URL environment variable."
      );
    }
  }
  decodeState(state) {
    const redirectUri = atob(state);
    return redirectUri;
  }
  async getTokenByCode(code, state) {
    const payload = {
      clientId: ENV.appId,
      grantType: "authorization_code",
      code,
      redirectUri: this.decodeState(state)
    };
    const { data } = await this.client.post(
      EXCHANGE_TOKEN_PATH,
      payload
    );
    return data;
  }
  async getUserInfoByToken(token) {
    const { data } = await this.client.post(
      GET_USER_INFO_PATH,
      {
        accessToken: token.accessToken
      }
    );
    return data;
  }
};
var createOAuthHttpClient = () => axios.create({
  baseURL: ENV.oAuthServerUrl,
  timeout: AXIOS_TIMEOUT_MS
});
var SDKServer = class {
  client;
  oauthService;
  constructor(client = createOAuthHttpClient()) {
    this.client = client;
    this.oauthService = new OAuthService(this.client);
  }
  deriveLoginMethod(platforms, fallback) {
    if (fallback && fallback.length > 0) return fallback;
    if (!Array.isArray(platforms) || platforms.length === 0) return null;
    const set = new Set(
      platforms.filter((p) => typeof p === "string")
    );
    if (set.has("REGISTERED_PLATFORM_EMAIL")) return "email";
    if (set.has("REGISTERED_PLATFORM_GOOGLE")) return "google";
    if (set.has("REGISTERED_PLATFORM_APPLE")) return "apple";
    if (set.has("REGISTERED_PLATFORM_MICROSOFT") || set.has("REGISTERED_PLATFORM_AZURE"))
      return "microsoft";
    if (set.has("REGISTERED_PLATFORM_GITHUB")) return "github";
    const first = Array.from(set)[0];
    return first ? first.toLowerCase() : null;
  }
  /**
   * Exchange OAuth authorization code for access token
   * @example
   * const tokenResponse = await sdk.exchangeCodeForToken(code, state);
   */
  async exchangeCodeForToken(code, state) {
    return this.oauthService.getTokenByCode(code, state);
  }
  /**
   * Get user information using access token
   * @example
   * const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);
   */
  async getUserInfo(accessToken) {
    const data = await this.oauthService.getUserInfoByToken({
      accessToken
    });
    const loginMethod = this.deriveLoginMethod(
      data?.platforms,
      data?.platform ?? data.platform ?? null
    );
    return {
      ...data,
      platform: loginMethod,
      loginMethod
    };
  }
  parseCookies(cookieHeader) {
    if (!cookieHeader) {
      return /* @__PURE__ */ new Map();
    }
    const parsed = parseCookieHeader(cookieHeader);
    return new Map(Object.entries(parsed));
  }
  getSessionSecret() {
    const secret = ENV.cookieSecret;
    return new TextEncoder().encode(secret);
  }
  /**
   * @example
   * const sessionToken = await sdk.createSessionToken(userInfo.openId);
   */
  async createSessionToken(openId, options = {}) {
    return this.signSession(
      {
        openId,
        appId: ENV.appId,
        name: options.name || ""
      },
      options
    );
  }
  async signSession(payload, options = {}) {
    const issuedAt = Date.now();
    const expiresInMs = options.expiresInMs ?? ONE_YEAR_MS;
    const expirationSeconds = Math.floor((issuedAt + expiresInMs) / 1e3);
    const secretKey = this.getSessionSecret();
    return new SignJWT({
      openId: payload.openId,
      appId: payload.appId,
      name: payload.name
    }).setProtectedHeader({ alg: "HS256", typ: "JWT" }).setExpirationTime(expirationSeconds).sign(secretKey);
  }
  async verifySession(cookieValue) {
    if (!cookieValue) {
      console.warn("[Auth] Missing session cookie");
      return null;
    }
    try {
      const secretKey = this.getSessionSecret();
      const { payload } = await jwtVerify(cookieValue, secretKey, {
        algorithms: ["HS256"]
      });
      const { openId, appId, name } = payload;
      if (!isNonEmptyString(openId) || !isNonEmptyString(appId) || !isNonEmptyString(name)) {
        console.warn("[Auth] Session payload missing required fields");
        return null;
      }
      return {
        openId,
        appId,
        name
      };
    } catch (error) {
      console.warn("[Auth] Session verification failed", String(error));
      return null;
    }
  }
  async getUserInfoWithJwt(jwtToken) {
    const payload = {
      jwtToken,
      projectId: ENV.appId
    };
    const { data } = await this.client.post(
      GET_USER_INFO_WITH_JWT_PATH,
      payload
    );
    const loginMethod = this.deriveLoginMethod(
      data?.platforms,
      data?.platform ?? data.platform ?? null
    );
    return {
      ...data,
      platform: loginMethod,
      loginMethod
    };
  }
  async authenticateRequest(req) {
    const cookies = this.parseCookies(req.headers.cookie);
    const sessionCookie = cookies.get(COOKIE_NAME);
    const session = await this.verifySession(sessionCookie);
    if (!session) {
      throw ForbiddenError("Invalid session cookie");
    }
    const sessionUserId = session.openId;
    const signedInAt = /* @__PURE__ */ new Date();
    let user = await getUserByOpenId(sessionUserId);
    if (!user) {
      try {
        const userInfo = await this.getUserInfoWithJwt(sessionCookie ?? "");
        await upsertUser({
          openId: userInfo.openId,
          name: userInfo.name || null,
          email: userInfo.email ?? null,
          loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
          lastSignedIn: signedInAt
        });
        user = await getUserByOpenId(userInfo.openId);
      } catch (error) {
        console.error("[Auth] Failed to sync user from OAuth:", error);
        throw ForbiddenError("Failed to sync user info");
      }
    }
    if (!user) {
      throw ForbiddenError("User not found");
    }
    await upsertUser({
      openId: user.openId,
      lastSignedIn: signedInAt
    });
    return user;
  }
};
var sdk = new SDKServer();

// server/_core/oauth.ts
function getQueryParam(req, key) {
  const value = req.query[key];
  return typeof value === "string" ? value : void 0;
}
function registerOAuthRoutes(app) {
  app.get("/api/oauth/callback", async (req, res) => {
    const code = getQueryParam(req, "code");
    const state = getQueryParam(req, "state");
    if (!code || !state) {
      res.status(400).json({ error: "code and state are required" });
      return;
    }
    try {
      const tokenResponse = await sdk.exchangeCodeForToken(code, state);
      const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);
      if (!userInfo.openId) {
        res.status(400).json({ error: "openId missing from user info" });
        return;
      }
      await upsertUser({
        openId: userInfo.openId,
        name: userInfo.name || null,
        email: userInfo.email ?? null,
        loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
        lastSignedIn: /* @__PURE__ */ new Date()
      });
      const sessionToken = await sdk.createSessionToken(userInfo.openId, {
        name: userInfo.name || "",
        expiresInMs: ONE_YEAR_MS
      });
      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });
      res.redirect(302, "/");
    } catch (error) {
      console.error("[OAuth] Callback failed", error);
      res.status(500).json({ error: "OAuth callback failed" });
    }
  });
}

// server/_core/systemRouter.ts
import { z } from "zod";

// server/_core/notification.ts
import { TRPCError } from "@trpc/server";
var TITLE_MAX_LENGTH = 1200;
var CONTENT_MAX_LENGTH = 2e4;
var trimValue = (value) => value.trim();
var isNonEmptyString2 = (value) => typeof value === "string" && value.trim().length > 0;
var buildEndpointUrl = (baseUrl) => {
  const normalizedBase = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  return new URL(
    "webdevtoken.v1.WebDevService/SendNotification",
    normalizedBase
  ).toString();
};
var validatePayload = (input) => {
  if (!isNonEmptyString2(input.title)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Notification title is required."
    });
  }
  if (!isNonEmptyString2(input.content)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Notification content is required."
    });
  }
  const title = trimValue(input.title);
  const content = trimValue(input.content);
  if (title.length > TITLE_MAX_LENGTH) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Notification title must be at most ${TITLE_MAX_LENGTH} characters.`
    });
  }
  if (content.length > CONTENT_MAX_LENGTH) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Notification content must be at most ${CONTENT_MAX_LENGTH} characters.`
    });
  }
  return { title, content };
};
async function notifyOwner(payload) {
  const { title, content } = validatePayload(payload);
  if (!ENV.forgeApiUrl) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Notification service URL is not configured."
    });
  }
  if (!ENV.forgeApiKey) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Notification service API key is not configured."
    });
  }
  const endpoint = buildEndpointUrl(ENV.forgeApiUrl);
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        accept: "application/json",
        authorization: `Bearer ${ENV.forgeApiKey}`,
        "content-type": "application/json",
        "connect-protocol-version": "1"
      },
      body: JSON.stringify({ title, content })
    });
    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.warn(
        `[Notification] Failed to notify owner (${response.status} ${response.statusText})${detail ? `: ${detail}` : ""}`
      );
      return false;
    }
    return true;
  } catch (error) {
    console.warn("[Notification] Error calling notification service:", error);
    return false;
  }
}

// server/_core/trpc.ts
import { initTRPC, TRPCError as TRPCError2 } from "@trpc/server";
import superjson from "superjson";
var t = initTRPC.context().create({
  transformer: superjson
});
var router = t.router;
var publicProcedure = t.procedure;
var requireUser = t.middleware(async (opts) => {
  const { ctx, next } = opts;
  if (!ctx.user) {
    throw new TRPCError2({ code: "UNAUTHORIZED", message: UNAUTHED_ERR_MSG });
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user
    }
  });
});
var protectedProcedure = t.procedure.use(requireUser);
var adminProcedure = t.procedure.use(
  t.middleware(async (opts) => {
    const { ctx, next } = opts;
    if (!ctx.user || ctx.user.role !== "admin") {
      throw new TRPCError2({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
    }
    return next({
      ctx: {
        ...ctx,
        user: ctx.user
      }
    });
  })
);

// server/_core/systemRouter.ts
var systemRouter = router({
  health: publicProcedure.input(
    z.object({
      timestamp: z.number().min(0, "timestamp cannot be negative")
    })
  ).query(() => ({
    ok: true
  })),
  notifyOwner: adminProcedure.input(
    z.object({
      title: z.string().min(1, "title is required"),
      content: z.string().min(1, "content is required")
    })
  ).mutation(async ({ input }) => {
    const delivered = await notifyOwner(input);
    return {
      success: delivered
    };
  })
});

// server/_core/llm.ts
var ensureArray = (value) => Array.isArray(value) ? value : [value];
var normalizeContentPart = (part) => {
  if (typeof part === "string") {
    return { type: "text", text: part };
  }
  if (part.type === "text") {
    return part;
  }
  if (part.type === "image_url") {
    return part;
  }
  if (part.type === "file_url") {
    return part;
  }
  throw new Error("Unsupported message content part");
};
var normalizeMessage = (message) => {
  const { role, name, tool_call_id } = message;
  if (role === "tool" || role === "function") {
    const content = ensureArray(message.content).map((part) => typeof part === "string" ? part : JSON.stringify(part)).join("\n");
    return {
      role,
      name,
      tool_call_id,
      content
    };
  }
  const contentParts = ensureArray(message.content).map(normalizeContentPart);
  if (contentParts.length === 1 && contentParts[0].type === "text") {
    return {
      role,
      name,
      content: contentParts[0].text
    };
  }
  return {
    role,
    name,
    content: contentParts
  };
};
var normalizeToolChoice = (toolChoice, tools) => {
  if (!toolChoice) return void 0;
  if (toolChoice === "none" || toolChoice === "auto") {
    return toolChoice;
  }
  if (toolChoice === "required") {
    if (!tools || tools.length === 0) {
      throw new Error(
        "tool_choice 'required' was provided but no tools were configured"
      );
    }
    if (tools.length > 1) {
      throw new Error(
        "tool_choice 'required' needs a single tool or specify the tool name explicitly"
      );
    }
    return {
      type: "function",
      function: { name: tools[0].function.name }
    };
  }
  if ("name" in toolChoice) {
    return {
      type: "function",
      function: { name: toolChoice.name }
    };
  }
  return toolChoice;
};
var resolveApiUrl = () => {
  if (!ENV.forgeApiUrl || ENV.forgeApiUrl.trim().length === 0) {
    throw new Error("forgeApiUrl environment variable is not configured");
  }
  return `${ENV.forgeApiUrl.replace(/\/$/, "")}/v1/chat/completions`;
};
var assertApiKey = () => {
  if (!ENV.forgeApiKey) {
    throw new Error("OPENAI_API_KEY is not configured");
  }
};
var normalizeResponseFormat = ({
  responseFormat,
  response_format,
  outputSchema,
  output_schema
}) => {
  const explicitFormat = responseFormat || response_format;
  if (explicitFormat) {
    if (explicitFormat.type === "json_schema" && !explicitFormat.json_schema?.schema) {
      throw new Error(
        "responseFormat json_schema requires a defined schema object"
      );
    }
    return explicitFormat;
  }
  const schema = outputSchema || output_schema;
  if (!schema) return void 0;
  if (!schema.name || !schema.schema) {
    throw new Error("outputSchema requires both name and schema");
  }
  return {
    type: "json_schema",
    json_schema: {
      name: schema.name,
      schema: schema.schema,
      ...typeof schema.strict === "boolean" ? { strict: schema.strict } : {}
    }
  };
};
async function invokeLLM(params) {
  assertApiKey();
  const {
    messages,
    tools,
    toolChoice,
    tool_choice,
    outputSchema,
    output_schema,
    responseFormat,
    response_format
  } = params;
  const payload = {
    model: "gemini-2.5-flash",
    messages: messages.map(normalizeMessage)
  };
  if (tools && tools.length > 0) {
    payload.tools = tools;
  }
  const normalizedToolChoice = normalizeToolChoice(
    toolChoice || tool_choice,
    tools
  );
  if (normalizedToolChoice) {
    payload.tool_choice = normalizedToolChoice;
  }
  payload.max_tokens = 32768;
  payload.thinking = {
    "budget_tokens": 128
  };
  const normalizedResponseFormat = normalizeResponseFormat({
    responseFormat,
    response_format,
    outputSchema,
    output_schema
  });
  if (normalizedResponseFormat) {
    payload.response_format = normalizedResponseFormat;
  }
  const response = await fetch(resolveApiUrl(), {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${ENV.forgeApiKey}`
    },
    body: JSON.stringify(payload)
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `LLM invoke failed: ${response.status} ${response.statusText} \u2013 ${errorText}`
    );
  }
  return await response.json();
}

// server/routers.ts
import { z as z3 } from "zod";
import { readFileSync } from "fs";
import { join } from "path";

// server/emailService.ts
async function sendWelcomeEmail(params) {
  const { name, email, location, investmentCapacity } = params;
  const emailContent = `
Welcome to NDIG - Nigeria Diaspora Investment Gateway

Dear ${name},

Thank you for registering your interest in the Nigeria Diaspora Investment Gateway (NDIG). We're excited to connect you with high-yield, government-backed productive investment opportunities in Nigeria.

YOUR REGISTRATION DETAILS:
\u2022 Name: ${name}
\u2022 Email: ${email}
\u2022 Location: ${location}
\u2022 Investment Capacity: ${investmentCapacity}

NEXT STEPS:

1. EXPLORE OPPORTUNITIES
   Visit our Investment Nexus to browse vetted opportunities in:
   - Real Estate (Eko Atlantic, Smart Cities)
   - Infrastructure Bonds
   - Collective Investment Schemes
   - Stock Market Investments

2. COMPLETE YOUR PROFILE
   Log in to your dashboard to complete your investor profile and access exclusive opportunities.

3. VERIFY YOUR IDENTITY
   For regulatory compliance, you'll need to complete KYC verification before making investments.

4. CONNECT WITH OUR TEAM
   Our investment advisors are ready to help you navigate opportunities.

PLATFORM OVERVIEW:

\u2713 Government Endorsed: Backed by NPA, NiDCOM, NIPC, CBN, and SEC
\u2713 Transparent: Full regulatory compliance and investment verification
\u2713 Secure: Bank-level security for all transactions
\u2713 Impactful: Your investments drive Nigeria's economic development

INVESTMENT TEAM CONTACT:

Email: investments@ndig.gov.ng
Phone: +234 (0) 800 NDIG-INVEST
WhatsApp: +234 (0) 803 000 0000

Office Hours: Monday - Friday, 9:00 AM - 5:00 PM (WAT)

EXPLORE THE PLATFORM:

\u2022 Investment Nexus: https://ndig.gov.ng/investment-nexus
\u2022 Trust Centre: https://ndig.gov.ng/trust-centre
\u2022 Authority Statements: https://ndig.gov.ng/authority-statements
\u2022 Dashboard: https://ndig.gov.ng/dashboard

We look forward to partnering with you to transform your remittances into generational wealth while contributing to Nigeria's growth.

Best regards,

The NDIG Investment Team
Nigeria Diaspora Investment Gateway
A Public-Private Partnership Initiative

---

This is an automated message. Please do not reply to this email.
For inquiries, contact: investments@ndig.gov.ng
  `.trim();
  try {
    await notifyOwner({
      title: `New Registration: ${name}`,
      content: `New investor registration received:

Name: ${name}
Email: ${email}
Location: ${location}
Investment Capacity: ${investmentCapacity}

Welcome email sent to registrant.`
    });
    console.log("[Email Service] Welcome email prepared for:", email);
    console.log("[Email Service] Content:", emailContent);
    return true;
  } catch (error) {
    console.error("[Email Service] Failed to send welcome email:", error);
    return false;
  }
}
async function notifyAdminNewRegistration(params) {
  const { name, email, location, investmentCapacity } = params;
  try {
    await notifyOwner({
      title: `\u{1F3AF} New NDIG Registration: ${name}`,
      content: `A new diaspora investor has registered interest in NDIG:

**Registrant Details:**
\u2022 Name: ${name}
\u2022 Email: ${email}
\u2022 Location: ${location}
\u2022 Investment Capacity: ${investmentCapacity}

**Action Required:**
1. Review registration in Admin Dashboard
2. Follow up within 48 hours
3. Schedule introductory call if qualified

View all registrations: /admin`
    });
    return true;
  } catch (error) {
    console.error("[Email Service] Failed to send admin notification:", error);
    return false;
  }
}

// server/routers.ts
import { TRPCError as TRPCError3 } from "@trpc/server";
import { eq as eq3, desc as desc2 } from "drizzle-orm";

// server/tracking.ts
import { z as z2 } from "zod";
import { eq as eq2, and, desc } from "drizzle-orm";
import { nanoid } from "nanoid";
var trackingRouter = router({
  /**
   * Generate a unique referral code for tracking external links
   */
  generateReferralCode: publicProcedure.input(
    z2.object({
      targetType: z2.enum(["nrbvn", "nrnia", "bank_account", "diaspora_bond", "other"]),
      targetUrl: z2.string().url()
    })
  ).mutation(async ({ input, ctx }) => {
    const db = await getDb();
    if (!db) throw new Error("Database connection failed");
    const referralCode = nanoid(10);
    await db.insert(referralTracking).values({
      userId: ctx.user?.id || null,
      referralCode,
      targetType: input.targetType,
      targetUrl: input.targetUrl,
      ipAddress: ctx.req?.ip || null,
      userAgent: ctx.req?.headers?.["user-agent"] || null
    });
    return { referralCode, trackingUrl: `/track/${referralCode}` };
  }),
  /**
   * Track a referral click (called when user clicks tracked link)
   */
  trackClick: publicProcedure.input(
    z2.object({
      referralCode: z2.string()
    })
  ).mutation(async ({ input, ctx }) => {
    const db = await getDb();
    if (!db) throw new Error("Database connection failed");
    const [tracking] = await db.select().from(referralTracking).where(eq2(referralTracking.referralCode, input.referralCode)).limit(1);
    if (!tracking) {
      throw new Error("Invalid referral code");
    }
    return { targetUrl: tracking.targetUrl };
  }),
  /**
   * Verify a referral (user confirms they completed the action)
   */
  verifyReferral: protectedProcedure.input(
    z2.object({
      referralCode: z2.string(),
      accountNumber: z2.string().optional(),
      verificationProof: z2.string().optional()
      // URL to uploaded screenshot
    })
  ).mutation(async ({ input, ctx }) => {
    const db = await getDb();
    if (!db) throw new Error("Database connection failed");
    await db.update(referralTracking).set({
      verified: 1,
      verifiedAt: /* @__PURE__ */ new Date()
    }).where(eq2(referralTracking.referralCode, input.referralCode));
    return { success: true };
  }),
  /**
   * Get referral statistics for admin dashboard
   */
  getReferralStats: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== "admin") {
      throw new Error("Admin access required");
    }
    const db = await getDb();
    if (!db) throw new Error("Database connection failed");
    const allReferrals = await db.select().from(referralTracking).orderBy(desc(referralTracking.clickedAt));
    const stats = {
      total: allReferrals.length,
      verified: allReferrals.filter((r) => r.verified === 1).length,
      byType: {
        nrbvn: allReferrals.filter((r) => r.targetType === "nrbvn").length,
        nrnia: allReferrals.filter((r) => r.targetType === "nrnia").length,
        bank_account: allReferrals.filter((r) => r.targetType === "bank_account").length,
        diaspora_bond: allReferrals.filter((r) => r.targetType === "diaspora_bond").length,
        other: allReferrals.filter((r) => r.targetType === "other").length
      },
      verifiedByType: {
        nrbvn: allReferrals.filter((r) => r.targetType === "nrbvn" && r.verified === 1).length,
        nrnia: allReferrals.filter((r) => r.targetType === "nrnia" && r.verified === 1).length,
        bank_account: allReferrals.filter((r) => r.targetType === "bank_account" && r.verified === 1).length,
        diaspora_bond: allReferrals.filter((r) => r.targetType === "diaspora_bond" && r.verified === 1).length,
        other: allReferrals.filter((r) => r.targetType === "other" && r.verified === 1).length
      },
      recent: allReferrals.slice(0, 10)
    };
    return stats;
  }),
  /**
   * Create an investment flow record
   */
  createInvestmentFlow: protectedProcedure.input(
    z2.object({
      investmentType: z2.enum(["diaspora_bond", "real_estate", "energy", "stocks", "other"]),
      amountUSD: z2.number().positive(),
      amountNGN: z2.number().optional(),
      referralCode: z2.string().optional(),
      nrniaAccountNumber: z2.string().optional(),
      bankName: z2.string().optional()
    })
  ).mutation(async ({ input, ctx }) => {
    const db = await getDb();
    if (!db) throw new Error("Database connection failed");
    const feePercentage = input.investmentType === "diaspora_bond" ? 2.5 : 3;
    const feeUSD = Math.round(input.amountUSD * (feePercentage / 100));
    const [flow] = await db.insert(investmentFlows).values({
      userId: ctx.user.id,
      referralCode: input.referralCode,
      investmentType: input.investmentType,
      amountUSD: input.amountUSD,
      amountNGN: input.amountNGN,
      feeUSD,
      feePercentage: `${feePercentage}%`,
      status: "initiated",
      nrniaAccountNumber: input.nrniaAccountNumber,
      bankName: input.bankName
    });
    return { flowId: flow.insertId, feeUSD, feePercentage };
  }),
  /**
   * Update investment flow status
   */
  updateInvestmentFlow: protectedProcedure.input(
    z2.object({
      flowId: z2.number(),
      status: z2.enum(["initiated", "pending_verification", "verified", "completed", "failed"]),
      transactionReference: z2.string().optional(),
      verificationProof: z2.string().optional()
    })
  ).mutation(async ({ input, ctx }) => {
    const db = await getDb();
    if (!db) throw new Error("Database connection failed");
    const updateData = {
      status: input.status
    };
    if (input.transactionReference) {
      updateData.transactionReference = input.transactionReference;
    }
    if (input.verificationProof) {
      updateData.verificationProof = input.verificationProof;
    }
    if (input.status === "completed") {
      updateData.completedAt = /* @__PURE__ */ new Date();
    }
    await db.update(investmentFlows).set(updateData).where(and(eq2(investmentFlows.id, input.flowId), eq2(investmentFlows.userId, ctx.user.id)));
    return { success: true };
  }),
  /**
   * Get user's investment flows
   */
  getMyInvestmentFlows: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new Error("Database connection failed");
    const flows = await db.select().from(investmentFlows).where(eq2(investmentFlows.userId, ctx.user.id)).orderBy(desc(investmentFlows.createdAt));
    return flows;
  }),
  /**
   * Get all investment flows (admin only)
   */
  getAllInvestmentFlows: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== "admin") {
      throw new Error("Admin access required");
    }
    const db = await getDb();
    if (!db) throw new Error("Database connection failed");
    const flows = await db.select().from(investmentFlows).orderBy(desc(investmentFlows.createdAt));
    return flows;
  }),
  /**
   * Get investment flow statistics (admin only)
   */
  getInvestmentStats: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== "admin") {
      throw new Error("Admin access required");
    }
    const db = await getDb();
    if (!db) throw new Error("Database connection failed");
    const allFlows = await db.select().from(investmentFlows);
    const stats = {
      totalInvestments: allFlows.length,
      totalAmountUSD: allFlows.reduce((sum, f) => sum + f.amountUSD, 0),
      totalFeesUSD: allFlows.reduce((sum, f) => sum + f.feeUSD, 0),
      byType: {
        diaspora_bond: allFlows.filter((f) => f.investmentType === "diaspora_bond").length,
        real_estate: allFlows.filter((f) => f.investmentType === "real_estate").length,
        energy: allFlows.filter((f) => f.investmentType === "energy").length,
        stocks: allFlows.filter((f) => f.investmentType === "stocks").length,
        other: allFlows.filter((f) => f.investmentType === "other").length
      },
      byStatus: {
        initiated: allFlows.filter((f) => f.status === "initiated").length,
        pending_verification: allFlows.filter((f) => f.status === "pending_verification").length,
        verified: allFlows.filter((f) => f.status === "verified").length,
        completed: allFlows.filter((f) => f.status === "completed").length,
        failed: allFlows.filter((f) => f.status === "failed").length
      },
      completedInvestments: allFlows.filter((f) => f.status === "completed").length,
      completedAmountUSD: allFlows.filter((f) => f.status === "completed").reduce((sum, f) => sum + f.amountUSD, 0),
      completedFeesUSD: allFlows.filter((f) => f.status === "completed").reduce((sum, f) => sum + f.feeUSD, 0)
    };
    return stats;
  }),
  /**
   * Link an account (NRNIA, NRBVN, etc.)
   */
  linkAccount: protectedProcedure.input(
    z2.object({
      accountType: z2.enum(["nrnia", "nrnoa", "nrbvn", "other"]),
      accountNumber: z2.string(),
      bankName: z2.string().optional(),
      verificationProof: z2.string().optional()
      // URL to uploaded document
    })
  ).mutation(async ({ input, ctx }) => {
    const db = await getDb();
    if (!db) throw new Error("Database connection failed");
    const [link] = await db.insert(accountLinks).values({
      userId: ctx.user.id,
      accountType: input.accountType,
      accountNumber: input.accountNumber,
      bankName: input.bankName,
      verificationProof: input.verificationProof,
      verified: input.verificationProof ? 1 : 0,
      verifiedAt: input.verificationProof ? /* @__PURE__ */ new Date() : null
    });
    return { linkId: link.insertId };
  }),
  /**
   * Get user's linked accounts
   */
  getMyLinkedAccounts: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new Error("Database connection failed");
    const links = await db.select().from(accountLinks).where(eq2(accountLinks.userId, ctx.user.id)).orderBy(desc(accountLinks.createdAt));
    return links;
  }),
  /**
   * Get all linked accounts (admin only)
   */
  getAllLinkedAccounts: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== "admin") {
      throw new Error("Admin access required");
    }
    const db = await getDb();
    if (!db) throw new Error("Database connection failed");
    const links = await db.select().from(accountLinks).orderBy(desc(accountLinks.createdAt));
    return links;
  }),
  /**
   * Verify a linked account (admin only)
   */
  verifyLinkedAccount: protectedProcedure.input(
    z2.object({
      linkId: z2.number(),
      verified: z2.boolean()
    })
  ).mutation(async ({ input, ctx }) => {
    if (ctx.user.role !== "admin") {
      throw new Error("Admin access required");
    }
    const db = await getDb();
    if (!db) throw new Error("Database connection failed");
    await db.update(accountLinks).set({
      verified: input.verified ? 1 : 0,
      verifiedAt: input.verified ? /* @__PURE__ */ new Date() : null
    }).where(eq2(accountLinks.id, input.linkId));
    return { success: true };
  })
});

// server/routers.ts
var appRouter = router({
  // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true
      };
    })
  }),
  interestRegistration: router({
    submit: publicProcedure.input(
      z3.object({
        name: z3.string().min(2, "Name must be at least 2 characters").max(255),
        email: z3.string().email("Invalid email address").max(320),
        location: z3.string().min(2, "Location must be at least 2 characters").max(255),
        investmentCapacity: z3.string().min(1, "Please select an investment capacity"),
        message: z3.string().max(1e3).optional()
      })
    ).mutation(async ({ input }) => {
      try {
        const db = await getDb();
        if (!db) {
          throw new TRPCError3({
            code: "INTERNAL_SERVER_ERROR",
            message: "Database not available"
          });
        }
        await db.insert(interestRegistrations).values({
          name: input.name,
          email: input.email,
          location: input.location,
          investmentCapacity: input.investmentCapacity,
          message: input.message || null,
          status: "new"
        });
        await sendWelcomeEmail({
          name: input.name,
          email: input.email,
          location: input.location,
          investmentCapacity: input.investmentCapacity
        });
        await notifyAdminNewRegistration({
          name: input.name,
          email: input.email,
          location: input.location,
          investmentCapacity: input.investmentCapacity
        });
        return {
          success: true,
          message: "Thank you for your interest! We'll be in touch soon."
        };
      } catch (error) {
        console.error("[Interest Registration Error]", error);
        throw new TRPCError3({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to submit registration. Please try again."
        });
      }
    }),
    list: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user?.role !== "admin") {
        throw new TRPCError3({
          code: "FORBIDDEN",
          message: "Admin access required"
        });
      }
      const db = await getDb();
      if (!db) {
        throw new TRPCError3({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available"
        });
      }
      const registrations = await db.select().from(interestRegistrations).orderBy(desc2(interestRegistrations.createdAt));
      return registrations;
    }),
    updateStatus: protectedProcedure.input(
      z3.object({
        id: z3.number(),
        status: z3.enum(["new", "contacted", "qualified", "converted"])
      })
    ).mutation(async ({ input, ctx }) => {
      if (ctx.user?.role !== "admin") {
        throw new TRPCError3({
          code: "FORBIDDEN",
          message: "Admin access required"
        });
      }
      const db = await getDb();
      if (!db) {
        throw new TRPCError3({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available"
        });
      }
      await db.update(interestRegistrations).set({ status: input.status }).where(eq3(interestRegistrations.id, input.id));
      return { success: true };
    }),
    registerDiasporaBondInterest: publicProcedure.input(
      z3.object({
        name: z3.string().min(2, "Name must be at least 2 characters").max(255),
        email: z3.string().email("Invalid email address").max(320)
      })
    ).mutation(async ({ input }) => {
      try {
        const db = await getDb();
        if (!db) {
          throw new TRPCError3({
            code: "INTERNAL_SERVER_ERROR",
            message: "Database not available"
          });
        }
        await db.insert(interestRegistrations).values({
          name: input.name,
          email: input.email,
          location: "Diaspora Bond Interest",
          investmentCapacity: "Diaspora Bond",
          message: "Interested in diaspora bond offerings",
          status: "new"
        });
        await notifyOwner({
          title: "New Diaspora Bond Interest Registration",
          content: `${input.name} (${input.email}) has registered interest in diaspora bonds.`
        });
        return {
          success: true,
          message: "Thank you! We'll notify you when the next diaspora bond offering is announced."
        };
      } catch (error) {
        console.error("[Diaspora Bond Interest Error]", error);
        throw new TRPCError3({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to register interest. Please try again."
        });
      }
    })
  }),
  chat: router({
    sendMessage: publicProcedure.input(
      z3.object({
        message: z3.string().min(1).max(1e3),
        conversationHistory: z3.array(
          z3.object({
            role: z3.enum(["user", "assistant"]),
            content: z3.string()
          })
        ).optional()
      })
    ).mutation(async ({ input }) => {
      try {
        const knowledgeBasePath = join(process.cwd(), "knowledge_base.md");
        const knowledgeBase = readFileSync(knowledgeBasePath, "utf-8");
        const messages = [
          {
            role: "system",
            content: `You are the DPIG Concierge, an AI assistant for the Diaspora Productivity & Investment Gateway (DPIG) platform. Your role is to help Nigerian diaspora members understand investment opportunities, government programs, and how to use the platform.

IMPORTANT INSTRUCTIONS:
- Be professional, warm, and encouraging
- Provide accurate information based on the knowledge base below
- If you don't know something, direct users to contact support or visit the relevant strategic partner website
- Always emphasize that DPIG is government-endorsed by NPA, NiDCOM, NIPC, CBN, and SEC
- Encourage users to register their interest and explore investment opportunities
- Use clear, accessible language (avoid excessive jargon)

KNOWLEDGE BASE:
${knowledgeBase}

Answer the user's question based on this knowledge base.`
          }
        ];
        if (input.conversationHistory && input.conversationHistory.length > 0) {
          messages.push(...input.conversationHistory.map((msg) => ({
            role: msg.role,
            content: msg.content
          })));
        }
        messages.push({
          role: "user",
          content: input.message
        });
        const response = await invokeLLM({
          messages
        });
        const assistantMessage = response.choices[0]?.message?.content || "I apologize, but I'm having trouble responding right now. Please try again or contact our support team.";
        return {
          success: true,
          message: assistantMessage
        };
      } catch (error) {
        console.error("[Chat Error]", error);
        return {
          success: false,
          message: "I apologize, but I'm experiencing technical difficulties. Please try again in a moment or contact our support team for immediate assistance."
        };
      }
    })
  }),
  tracking: trackingRouter
});

// server/_core/context.ts
async function createContext(opts) {
  let user = null;
  try {
    user = await sdk.authenticateRequest(opts.req);
  } catch (error) {
    user = null;
  }
  return {
    req: opts.req,
    res: opts.res,
    user
  };
}

// server/_core/vite.ts
import express from "express";
import fs from "fs";
import { nanoid as nanoid2 } from "nanoid";
import path2 from "path";
import { createServer as createViteServer } from "vite";

// vite.config.ts
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { defineConfig } from "vite";
var plugins = [tailwindcss(), react()];
var vite_config_default = defineConfig({
  plugins,
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  envDir: path.resolve(import.meta.dirname),
  root: path.resolve(import.meta.dirname, "client"),
  publicDir: path.resolve(import.meta.dirname, "client", "public"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    host: true,
    allowedHosts: [
      "localhost",
      "127.0.0.1"
    ],
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/_core/vite.ts
async function setupVite(app, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    server: serverOptions,
    appType: "custom"
  });
  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "../..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid2()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app) {
  const distPath = path2.resolve(import.meta.dirname, "../..", "dist", "public");
  if (!fs.existsSync(distPath)) {
    console.error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app.use(express.static(distPath));
  app.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/_core/index.ts
function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}
async function findAvailablePort(startPort = 3e3) {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}
async function startServer() {
  const app = express2();
  const server = createServer(app);
  app.use(express2.json({ limit: "50mb" }));
  app.use(express2.urlencoded({ limit: "50mb", extended: true }));
  registerOAuthRoutes(app);
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext
    })
  );
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);
  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }
  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}
startServer().catch(console.error);
