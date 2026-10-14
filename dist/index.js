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
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

// drizzle/schema.ts
import { integer, pgEnum, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";
var userRoleEnum = pgEnum("user_role", ["user", "admin"]);
var registrationStatusEnum = pgEnum("registration_status", ["new", "contacted", "qualified", "converted"]);
var familyInNigeriaEnum = pgEnum("family_in_nigeria", ["yes", "no"]);
var investmentCategoryEnum = pgEnum("investment_category", ["real_estate", "energy", "financial_instrument", "infrastructure", "agriculture"]);
var investmentOpportunityStatusEnum = pgEnum("investment_opportunity_status", ["open", "closing_soon", "closed", "draft"]);
var referralTargetTypeEnum = pgEnum("referral_target_type", ["nrbvn", "nrnia", "bank_account", "diaspora_bond", "other"]);
var investmentTypeEnum = pgEnum("investment_type", ["diaspora_bond", "real_estate", "energy", "stocks", "other"]);
var investmentFlowStatusEnum = pgEnum("investment_flow_status", ["initiated", "pending_verification", "verified", "completed", "failed"]);
var accountTypeEnum = pgEnum("account_type", ["nrnia", "nrnoa", "nrbvn", "other"]);
var countryAnchorStatusEnum = pgEnum("country_anchor_status", ["new", "reviewing", "approved", "declined"]);
var mentorshipRoleEnum = pgEnum("mentorship_role", ["mentor", "mentee"]);
var mentorshipStatusEnum = pgEnum("mentorship_status", ["new", "matched", "closed"]);
var joinSignupStatusEnum = pgEnum("join_signup_status", ["pending", "confirmed"]);
var users = pgTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: serial("id").primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: userRoleEnum("role").default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().$onUpdate(() => /* @__PURE__ */ new Date()).notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull()
});
var interestRegistrations = pgTable("interest_registrations", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  location: varchar("location", { length: 255 }).notNull(),
  investmentCapacity: varchar("investment_capacity", { length: 100 }).notNull(),
  message: text("message"),
  phone: varchar("phone", { length: 50 }),
  country: varchar("country", { length: 100 }),
  sectorInterest: varchar("sector_interest", { length: 100 }),
  riskAppetite: varchar("risk_appetite", { length: 50 }),
  familyInNigeria: familyInNigeriaEnum("family_in_nigeria"),
  referralCode: varchar("referral_code", { length: 50 }).unique(),
  status: registrationStatusEnum("status").default("new").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull()
});
var investmentOpportunities = pgTable("investment_opportunities", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  category: investmentCategoryEnum("category").notNull(),
  targetYield: varchar("target_yield", { length: 50 }).notNull(),
  minEntry: integer("min_entry").notNull(),
  // in USD
  term: varchar("term", { length: 50 }).notNull(),
  status: investmentOpportunityStatusEnum("status").default("draft").notNull(),
  imageUrl: text("image_url"),
  featured: integer("featured").default(0).notNull(),
  // 0 = not featured, 1 = featured
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().$onUpdate(() => /* @__PURE__ */ new Date()).notNull()
});
var demoAnalytics = pgTable("demo_analytics", {
  id: serial("id").primaryKey(),
  sessionId: varchar("session_id", { length: 255 }).notNull(),
  enteredAt: timestamp("entered_at").defaultNow().notNull(),
  exitedAt: timestamp("exited_at"),
  durationSeconds: integer("duration_seconds"),
  pagesViewed: integer("pages_viewed").default(0).notNull(),
  convertedToRegistration: integer("converted_to_registration").default(0).notNull()
  // 0 = no, 1 = yes
});
var referralTracking = pgTable("referral_tracking", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  // null for anonymous clicks
  referralCode: varchar("referral_code", { length: 50 }).notNull().unique(),
  targetType: referralTargetTypeEnum("target_type").notNull(),
  targetUrl: text("target_url").notNull(),
  clickedAt: timestamp("clicked_at").defaultNow().notNull(),
  ipAddress: varchar("ip_address", { length: 45 }),
  userAgent: text("user_agent"),
  verified: integer("verified").default(0).notNull(),
  // 0 = not verified, 1 = verified
  verifiedAt: timestamp("verified_at")
});
var investmentFlows = pgTable("investment_flows", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  referralCode: varchar("referral_code", { length: 50 }),
  investmentType: investmentTypeEnum("investment_type").notNull(),
  amountUSD: integer("amount_usd").notNull(),
  amountNGN: integer("amount_ngn"),
  feeUSD: integer("fee_usd").notNull(),
  feePercentage: varchar("fee_percentage", { length: 10 }).notNull(),
  status: investmentFlowStatusEnum("status").default("initiated").notNull(),
  nrniaAccountNumber: varchar("nrnia_account_number", { length: 50 }),
  bankName: varchar("bank_name", { length: 255 }),
  transactionReference: varchar("transaction_reference", { length: 255 }),
  verificationProof: text("verification_proof"),
  // URL to uploaded screenshot/document
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  completedAt: timestamp("completed_at")
});
var accountLinks = pgTable("account_links", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  accountType: accountTypeEnum("account_type").notNull(),
  accountNumber: varchar("account_number", { length: 50 }).notNull(),
  bankName: varchar("bank_name", { length: 255 }),
  verified: integer("verified").default(0).notNull(),
  // 0 = not verified, 1 = verified
  verificationProof: text("verification_proof"),
  // URL to uploaded document
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  verifiedAt: timestamp("verified_at")
});
var countryAnchorApplications = pgTable("country_anchor_applications", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 50 }).notNull(),
  countryOfResidence: varchar("country_of_residence", { length: 100 }).notNull(),
  yearsInDiaspora: varchar("years_in_diaspora", { length: 50 }).notNull(),
  professionalBackground: text("professional_background").notNull(),
  communityInvolvement: text("community_involvement"),
  whyNdig: text("why_ndig").notNull(),
  status: countryAnchorStatusEnum("status").default("new").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull()
});
var newsletterSignups = pgTable("newsletter_signups", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  createdAt: timestamp("createdAt").defaultNow().notNull()
});
var joinSignups = pgTable("join_signups", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  country: varchar("country", { length: 120 }).notNull(),
  association: varchar("association", { length: 200 }),
  source: varchar("source", { length: 120 }).default("/join").notNull(),
  status: joinSignupStatusEnum("status").default("pending").notNull(),
  confirmationToken: varchar("confirmationToken", { length: 64 }).notNull().unique(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  confirmedAt: timestamp("confirmedAt"),
  briefSentAt: timestamp("briefSentAt"),
  nextWeeklyAt: timestamp("nextWeeklyAt"),
  lastWeeklySentAt: timestamp("lastWeeklySentAt"),
  unsubscribedAt: timestamp("unsubscribedAt"),
  lastWeeklyIssue: integer("lastWeeklyIssue")
});
var weeklyIssues = pgTable("weekly_issues", {
  id: serial("id").primaryKey(),
  issueNumber: integer("issueNumber").notNull().unique(),
  contentHash: varchar("contentHash", { length: 64 }).notNull().unique(),
  subject: text("subject").notNull(),
  bodyHtml: text("bodyHtml").notNull(),
  sentAt: timestamp("sentAt").defaultNow().notNull(),
  recipientCount: integer("recipientCount").default(0).notNull(),
  archivedAt: timestamp("archivedAt"),
  archivePath: varchar("archivePath", { length: 200 })
});
var mentorshipRequests = pgTable("mentorship_requests", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  role: mentorshipRoleEnum("role").notNull(),
  areaOfExpertise: varchar("area_of_expertise", { length: 255 }).notNull(),
  message: text("message"),
  status: mentorshipStatusEnum("status").default("new").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull()
});
var verificationStatusEnum = pgEnum("verification_status", ["pending", "confirmed", "flagged", "rejected"]);
var verificationRequests = pgTable("verification_requests", {
  id: serial("id").primaryKey(),
  reference: varchar("reference", { length: 32 }).notNull().unique(),
  subject: varchar("subject", { length: 300 }).notNull(),
  regulatorClaimed: varchar("regulatorClaimed", { length: 100 }),
  sourceLink: varchar("sourceLink", { length: 500 }),
  details: text("details"),
  checkedAgainst: varchar("checkedAgainst", { length: 500 }).notNull(),
  status: verificationStatusEnum("status").default("pending").notNull(),
  requesterName: varchar("requesterName", { length: 200 }).notNull(),
  requesterEmail: varchar("requesterEmail", { length: 320 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull()
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
      _db = drizzle(neon(process.env.DATABASE_URL));
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
    await db.insert(users).values(values).onConflictDoUpdate({
      target: users.openId,
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
  if (!ENV.forgeApiUrl || !ENV.forgeApiKey) {
    console.warn("[Notification] Skipped: service URL or API key not configured.");
    return false;
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
import { z as z4 } from "zod";
import { readFileSync } from "fs";
import { join } from "path";

// server/emailService.ts
function escapeHtml(value) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
function buildResendPayload(mail) {
  return {
    from: mail.from || process.env.JOIN_EMAIL_FROM || "NDIG Weekly <weekly@ndigateway.org>",
    to: mail.to,
    reply_to: mail.replyTo || process.env.JOIN_EMAIL_REPLY_TO || "ndig@nakachiconsulting.com.ng",
    subject: mail.subject,
    html: mail.html,
    ...mail.unsubscribeUrl ? {
      headers: {
        "List-Unsubscribe": `<${mail.unsubscribeUrl}>`,
        "List-Unsubscribe-Post": "List-Unsubscribe=One-Click"
      }
    } : {}
  };
}
async function sendResendEmail(mail) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[Email] RESEND_API_KEY not configured \u2014 skipping send for", mail.to);
    return null;
  }
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify(buildResendPayload(mail))
    });
    if (!response.ok) {
      console.error("[Email] Resend API error", response.status, await response.text());
      return null;
    }
    const data = await response.json();
    return data.id ?? "sent";
  } catch (error) {
    console.error("[Email] Failed to send:", error);
    return null;
  }
}
async function sendResendBatch(mails) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[Email] RESEND_API_KEY not configured \u2014 skipping batch of", mails.length);
    return false;
  }
  try {
    const response = await fetch("https://api.resend.com/emails/batch", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify(mails.map(buildResendPayload))
    });
    if (!response.ok) {
      console.error("[Email] Resend batch error", response.status, await response.text());
      return false;
    }
    return true;
  } catch (error) {
    console.error("[Email] Batch failed:", error);
    return false;
  }
}
async function sendJoinConfirmationEmail(params) {
  const { name, email, confirmUrl } = params;
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.JOIN_EMAIL_FROM || "NDIG Weekly <weekly@ndigateway.org>";
  const replyTo = process.env.JOIN_EMAIL_REPLY_TO || "ndig@nakachiconsulting.com.ng";
  if (!apiKey) {
    console.warn("[Join Confirmation Email] RESEND_API_KEY not configured \u2014 skipping send for", email);
    return false;
  }
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        from,
        to: email,
        reply_to: replyTo,
        subject: "Confirm your NDIG Weekly subscription",
        html: `<p>Hi ${escapeHtml(name)},</p><p>Confirm your subscription to NDIG. Once confirmed, you will receive our launch article, \u201CTwo Layers of Failed Trust\u201D, first, followed by the NDIG Weekly every two weeks thereafter.</p><p><a href="${confirmUrl}">Confirm my subscription</a></p><p>If you didn't request this, you can ignore this email.</p>`
      })
    });
    if (!response.ok) {
      console.error("[Join Confirmation Email] Resend API error", response.status, await response.text());
      return false;
    }
    return true;
  } catch (error) {
    console.error("[Join Confirmation Email] Failed to send:", error);
    return false;
  }
}
async function sendWelcomeEmail(params) {
  const { name, email, location, investmentCapacity } = params;
  const emailContent = `
Welcome to NDIG - Nigeria Diaspora Investment Gateway

Dear ${name},

Thank you for registering your interest. NDIG is a private-sector, independent verification institution for the Nigerian diaspora. It is regulator-vetted and independent of government.

YOUR REGISTRATION DETAILS:
\u2022 Name: ${name}
\u2022 Email: ${email}
\u2022 Location: ${location}
\u2022 Investment Capacity: ${investmentCapacity}

NDIG does not hold funds, sell products or give investment advice. Any opportunity is transacted directly with the licensed institution named.

Contact: info@ndigateway.org
More: https://www.ndigateway.org

The NDIG Team
Nigeria Diaspora Investment Gateway
  `.trim();
  try {
    await notifyOwner({
      title: `New Registration: ${name}`,
      content: `New investor registration received:

Name: ${name}
Email: ${email}
Location: ${location}
Investment Capacity: ${investmentCapacity}

No email was sent to the registrant.`
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
import { TRPCError as TRPCError4 } from "@trpc/server";
import { eq as eq4, desc as desc3, count } from "drizzle-orm";

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
    }).returning({ id: investmentFlows.id });
    return { flowId: flow.id, feeUSD, feePercentage };
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
    }).returning({ id: accountLinks.id });
    return { linkId: link.id };
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

// server/verification.ts
import { randomBytes } from "crypto";
import { desc as desc2, eq as eq3, sql } from "drizzle-orm";
import { TRPCError as TRPCError3 } from "@trpc/server";
import { z as z3 } from "zod";

// server/mailRouting.ts
var FORBIDDEN = /* @__PURE__ */ new Set(["smi@ndigateway.org"]);
var MAIL_ROUTES = {
  verification: { to: "info@ndigateway.org", subjectPrefix: "[VERIFY]", replyFrom: "NDIG <info@ndigateway.org>" },
  execution: { to: "execution@ndigateway.org", subjectPrefix: "[EXECUTION]", replyFrom: "NDIG Execution <execution@ndigateway.org>" },
  redress: { to: "redress@ndigateway.org", subjectPrefix: "[REDRESS]", replyFrom: "NDIG Redress <redress@ndigateway.org>" },
  press: { to: "press@ndigateway.org", subjectPrefix: "[PRESS]", replyFrom: "NDIG Press <press@ndigateway.org>" }
};
function assertRoutable(address) {
  const bare = address.replace(/^.*<|>.*$/g, "").trim().toLowerCase();
  if (FORBIDDEN.has(bare)) throw new Error(`Automated mail may not route to ${bare}`);
  return address;
}
function routeInternal(category, subject, html) {
  const route = MAIL_ROUTES[category];
  return sendResendEmail({ to: assertRoutable(route.to), subject: `${route.subjectPrefix} ${subject}`, html });
}
var esc = (v) => v.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
var THIRD_PARTY = "NDIG does not deliver this service itself. Execution and redress services are always delivered through verified third parties, and NDIG will tell you which third party is handling your matter before any work begins. NDIG never holds funds, sells products or gives investment advice.";
var AUTO_REPLY_TEMPLATES = {
  verification: ({ name, reference }) => ({
    subject: `${MAIL_ROUTES.verification.subjectPrefix} We have opened your dossier${reference ? ` ${reference}` : ""}`,
    html: `<p>Dear ${esc(name)},</p>
<p>NDIG has opened a verification dossier${reference ? ` with reference <strong>${esc(reference)}</strong>` : ""}. We check the institution or offer against public regulatory records and record the verdict in the dossier. You can check its status at https://ndigateway.org/verify.</p>
<p>A dossier records what public records show on the date of the check. It is not investment advice.</p>
<p>NDIG \u2014 Nigeria Diaspora Investment Gateway</p>`
  }),
  execution: ({ name, reference }) => ({
    subject: `${MAIL_ROUTES.execution.subjectPrefix} We have received your request${reference ? ` ${reference}` : ""}`,
    html: `<p>Dear ${esc(name)},</p>
<p>NDIG has received your execution service request${reference ? ` (reference <strong>${esc(reference)}</strong>)` : ""}.</p>
<p>${THIRD_PARTY}</p>
<p>NDIG \u2014 Nigeria Diaspora Investment Gateway</p>`
  }),
  redress: ({ name, reference }) => ({
    subject: `${MAIL_ROUTES.redress.subjectPrefix} We have received your submission${reference ? ` ${reference}` : ""}`,
    html: `<p>Dear ${esc(name)},</p>
<p>NDIG has received your grievance or redress submission${reference ? ` (reference <strong>${esc(reference)}</strong>)` : ""}. Keep this email as your record.</p>
<p>${THIRD_PARTY}</p>
<p>NDIG \u2014 Nigeria Diaspora Investment Gateway</p>`
  }),
  press: ({ name }) => ({
    subject: `${MAIL_ROUTES.press.subjectPrefix} We have received your enquiry`,
    html: `<p>Dear ${esc(name)},</p>
<p>NDIG has received your press or media enquiry and will respond from press@ndigateway.org.</p>
<p>NDIG \u2014 Nigeria Diaspora Investment Gateway</p>`
  })
};
function sendAutoReply(category, to, p) {
  const t2 = AUTO_REPLY_TEMPLATES[category](p);
  return sendResendEmail({ to, subject: t2.subject, html: t2.html, from: assertRoutable(MAIL_ROUTES[category].replyFrom), replyTo: MAIL_ROUTES[category].to });
}

// server/verification.ts
var tableReady = false;
async function ensureTable(db) {
  if (tableReady) return;
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE verification_status AS ENUM ('pending', 'confirmed', 'flagged', 'rejected');
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  `);
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS verification_requests (
      id SERIAL PRIMARY KEY,
      reference VARCHAR(32) NOT NULL UNIQUE,
      subject VARCHAR(300) NOT NULL,
      "regulatorClaimed" VARCHAR(100),
      "sourceLink" VARCHAR(500),
      details TEXT,
      "checkedAgainst" VARCHAR(500) NOT NULL,
      status verification_status NOT NULL DEFAULT 'pending',
      "requesterName" VARCHAR(200) NOT NULL,
      "requesterEmail" VARCHAR(320) NOT NULL,
      "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
      "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
    );
  `);
  tableReady = true;
}
async function requireDb() {
  const db = await getDb();
  if (!db) {
    throw new TRPCError3({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
  }
  await ensureTable(db);
  return db;
}
function generateDossierReference(now = /* @__PURE__ */ new Date()) {
  return `NDIG-${now.getUTCFullYear()}-${randomBytes(3).toString("hex").toUpperCase()}`;
}
var REFERENCE_PATTERN = /^NDIG-\d{4}-[0-9A-F]{4,8}$/;
var REGULATOR_RECORDS = {
  SEC: "SEC Nigeria register",
  CBN: "CBN register of licensed institutions",
  NAICOM: "NAICOM register of insurers",
  PenCom: "PenCom register of licensed operators",
  NUPRC: "NUPRC licence records",
  NIPC: "NIPC records"
};
function checkedAgainstFor(regulator) {
  const records = regulator && REGULATOR_RECORDS[regulator] ? [REGULATOR_RECORDS[regulator]] : ["Relevant regulator's public register"];
  return [...records, "CAC public search"].join("; ");
}
function esc2(v) {
  return v.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}
var publicDossier = {
  reference: verificationRequests.reference,
  subject: verificationRequests.subject,
  checkedAgainst: verificationRequests.checkedAgainst,
  status: verificationRequests.status,
  createdAt: verificationRequests.createdAt,
  updatedAt: verificationRequests.updatedAt
};
var verificationRouter = router({
  submit: publicProcedure.input(
    z3.object({
      name: z3.string().trim().min(2).max(200),
      email: z3.string().trim().email().max(320),
      subject: z3.string().trim().min(3, "Tell us what to verify").max(300),
      regulatorClaimed: z3.string().trim().max(100).optional(),
      sourceLink: z3.string().trim().max(500).optional(),
      details: z3.string().trim().max(2e3).optional()
    })
  ).mutation(async ({ input }) => {
    const db = await requireDb();
    const reference = generateDossierReference();
    const checkedAgainst = checkedAgainstFor(input.regulatorClaimed);
    const [row] = await db.insert(verificationRequests).values({
      reference,
      subject: input.subject,
      regulatorClaimed: input.regulatorClaimed || null,
      sourceLink: input.sourceLink || null,
      details: input.details || null,
      checkedAgainst,
      requesterName: input.name,
      requesterEmail: input.email
    }).returning(publicDossier);
    await routeInternal(
      "verification",
      `${reference}: ${input.subject}`,
      `<p><strong>${esc2(reference)}</strong></p>
<p>Subject: ${esc2(input.subject)}<br/>Regulator claimed: ${esc2(input.regulatorClaimed || "Not stated")}<br/>Link/contact: ${esc2(input.sourceLink || "None")}</p>
<p>${esc2(input.details || "")}</p>
<p>Requester: ${esc2(input.name)} &lt;${esc2(input.email)}&gt;</p>`
    ).catch(() => null);
    await sendAutoReply("verification", input.email, { name: input.name, reference }).catch(() => null);
    return row;
  }),
  lookup: publicProcedure.input(z3.object({ reference: z3.string().trim().toUpperCase().regex(REFERENCE_PATTERN, "Enter a reference like NDIG-2026-948A1C") })).query(async ({ input }) => {
    const db = await requireDb();
    const [row] = await db.select(publicDossier).from(verificationRequests).where(eq3(verificationRequests.reference, input.reference)).limit(1);
    return row ?? null;
  }),
  list: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user?.role !== "admin") throw new TRPCError3({ code: "FORBIDDEN", message: "Admin access required" });
    const db = await requireDb();
    return db.select().from(verificationRequests).orderBy(desc2(verificationRequests.createdAt));
  }),
  updateStatus: protectedProcedure.input(
    z3.object({
      reference: z3.string().regex(REFERENCE_PATTERN),
      status: z3.enum(["pending", "confirmed", "flagged", "rejected"]),
      checkedAgainst: z3.string().trim().min(3).max(500).optional()
    })
  ).mutation(async ({ input, ctx }) => {
    if (ctx.user?.role !== "admin") throw new TRPCError3({ code: "FORBIDDEN", message: "Admin access required" });
    const db = await requireDb();
    await db.update(verificationRequests).set({
      status: input.status,
      ...input.checkedAgainst ? { checkedAgainst: input.checkedAgainst } : {},
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq3(verificationRequests.reference, input.reference));
    return { success: true };
  })
});

// server/routers.ts
import { randomBytes as randomBytes2 } from "crypto";
function generateReferralCode() {
  return `NDIG-${randomBytes2(4).toString("hex").toUpperCase()}`;
}
var appRouter = router({
  // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  verification: verificationRouter,
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
      z4.object({
        name: z4.string().min(2, "Name must be at least 2 characters").max(255),
        email: z4.string().email("Invalid email address").max(320),
        location: z4.string().min(2, "Location must be at least 2 characters").max(255),
        investmentCapacity: z4.string().min(1, "Please select an investment capacity"),
        message: z4.string().max(1e3).optional(),
        phone: z4.string().max(50).optional(),
        country: z4.string().max(100).optional(),
        sectorInterest: z4.string().max(100).optional(),
        riskAppetite: z4.string().max(50).optional(),
        familyInNigeria: z4.enum(["yes", "no"]).optional()
      })
    ).mutation(async ({ input }) => {
      try {
        const db = await getDb();
        if (!db) {
          throw new TRPCError4({
            code: "INTERNAL_SERVER_ERROR",
            message: "Database not available"
          });
        }
        const referralCode = generateReferralCode();
        await db.insert(interestRegistrations).values({
          name: input.name,
          email: input.email,
          location: input.location,
          investmentCapacity: input.investmentCapacity,
          message: input.message || null,
          phone: input.phone || null,
          country: input.country || null,
          sectorInterest: input.sectorInterest || null,
          riskAppetite: input.riskAppetite || null,
          familyInNigeria: input.familyInNigeria || null,
          referralCode,
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
          message: "Thank you for your interest! We'll be in touch soon.",
          referralCode
        };
      } catch (error) {
        console.error("[Interest Registration Error]", error);
        throw new TRPCError4({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to submit registration. Please try again."
        });
      }
    }),
    list: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user?.role !== "admin") {
        throw new TRPCError4({
          code: "FORBIDDEN",
          message: "Admin access required"
        });
      }
      const db = await getDb();
      if (!db) {
        throw new TRPCError4({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available"
        });
      }
      const registrations = await db.select().from(interestRegistrations).orderBy(desc3(interestRegistrations.createdAt));
      return registrations;
    }),
    updateStatus: protectedProcedure.input(
      z4.object({
        id: z4.number(),
        status: z4.enum(["new", "contacted", "qualified", "converted"])
      })
    ).mutation(async ({ input, ctx }) => {
      if (ctx.user?.role !== "admin") {
        throw new TRPCError4({
          code: "FORBIDDEN",
          message: "Admin access required"
        });
      }
      const db = await getDb();
      if (!db) {
        throw new TRPCError4({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available"
        });
      }
      await db.update(interestRegistrations).set({ status: input.status }).where(eq4(interestRegistrations.id, input.id));
      return { success: true };
    }),
    registerDiasporaBondInterest: publicProcedure.input(
      z4.object({
        name: z4.string().min(2, "Name must be at least 2 characters").max(255),
        email: z4.string().email("Invalid email address").max(320)
      })
    ).mutation(async ({ input }) => {
      try {
        const db = await getDb();
        if (!db) {
          throw new TRPCError4({
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
        throw new TRPCError4({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to register interest. Please try again."
        });
      }
    })
  }),
  chat: router({
    sendMessage: publicProcedure.input(
      z4.object({
        message: z4.string().min(1).max(1e3),
        conversationHistory: z4.array(
          z4.object({
            role: z4.enum(["user", "assistant"]),
            content: z4.string()
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
            content: `You are the NDIG Concierge, an AI assistant for the Nigeria Diaspora Investment Gateway (NDIG) platform. Your role is to help Nigerian diaspora members understand investment opportunities, government programs, and how to use the platform.

IMPORTANT INSTRUCTIONS:
- Be professional, warm, and encouraging
- Provide accurate information based on the knowledge base below
- If you don't know something, direct users to contact support or visit the relevant strategic partner website
- NDIG is an independent, private-sector verification institution, not a government agency. It checks institutions and opportunities against public regulatory records. It never sells products, never holds investor funds and never gives investment advice. Investments settle through licensed banks and custodians; NIPC and NDIG point the way, and money never passes through either. Never describe NDIG as endorsed, approved or backed by any government body.
- Never give investment advice, never recommend a specific investment, and never state, estimate or project returns or yields. Never describe any investment as guaranteed or without risk.
- Only quote dates and figures that appear in the knowledge base with a source. If asked for a figure that is not there, say NDIG has not verified it and point to the official source.
- Encourage users to verify an opportunity with NDIG (/verify-opportunity) or check a dossier reference (/verify) before they invest.
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
  tracking: trackingRouter,
  countryAnchor: router({
    submitApplication: publicProcedure.input(
      z4.object({
        name: z4.string().min(2).max(255),
        email: z4.string().email().max(320),
        phone: z4.string().min(3).max(50),
        countryOfResidence: z4.string().min(2).max(100),
        yearsInDiaspora: z4.string().min(1).max(50),
        professionalBackground: z4.string().min(10).max(2e3),
        communityInvolvement: z4.string().max(2e3).optional(),
        whyNdig: z4.string().min(10).max(2e3)
      })
    ).mutation(async ({ input }) => {
      try {
        const db = await getDb();
        if (!db) {
          throw new TRPCError4({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
        }
        await db.insert(countryAnchorApplications).values({
          name: input.name,
          email: input.email,
          phone: input.phone,
          countryOfResidence: input.countryOfResidence,
          yearsInDiaspora: input.yearsInDiaspora,
          professionalBackground: input.professionalBackground,
          communityInvolvement: input.communityInvolvement || null,
          whyNdig: input.whyNdig,
          status: "new"
        });
        await notifyOwner({
          title: "New Country Anchor Application",
          content: `${input.name} (${input.email}) from ${input.countryOfResidence} applied to become a Country Anchor.`
        });
        return { success: true, message: "Thank you for applying. Our team will be in touch." };
      } catch (error) {
        console.error("[Country Anchor Application Error]", error);
        throw new TRPCError4({ code: "INTERNAL_SERVER_ERROR", message: "Failed to submit application. Please try again." });
      }
    })
  }),
  newsletter: router({
    subscribe: publicProcedure.input(z4.object({ email: z4.string().email().max(320) })).mutation(async ({ input }) => {
      try {
        const db = await getDb();
        if (!db) {
          throw new TRPCError4({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
        }
        await db.insert(newsletterSignups).values({ email: input.email }).onConflictDoNothing();
        return { success: true, message: "You're subscribed." };
      } catch (error) {
        console.error("[Newsletter Signup Error]", error);
        throw new TRPCError4({ code: "INTERNAL_SERVER_ERROR", message: "Failed to subscribe. Please try again." });
      }
    })
  }),
  mentorship: router({
    request: publicProcedure.input(
      z4.object({
        name: z4.string().min(2).max(255),
        email: z4.string().email().max(320),
        role: z4.enum(["mentor", "mentee"]),
        areaOfExpertise: z4.string().min(2).max(255),
        message: z4.string().max(1e3).optional()
      })
    ).mutation(async ({ input }) => {
      try {
        const db = await getDb();
        if (!db) {
          throw new TRPCError4({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
        }
        await db.insert(mentorshipRequests).values({
          name: input.name,
          email: input.email,
          role: input.role,
          areaOfExpertise: input.areaOfExpertise,
          message: input.message || null,
          status: "new"
        });
        return { success: true, message: "Thanks - we'll match you and follow up by email." };
      } catch (error) {
        console.error("[Mentorship Request Error]", error);
        throw new TRPCError4({ code: "INTERNAL_SERVER_ERROR", message: "Failed to submit request. Please try again." });
      }
    })
  }),
  investmentIndex: router({
    counters: publicProcedure.query(async () => {
      const db = await getDb();
      if (!db) {
        return { registrations: 0, nrbvn: 0, nrnia: 0 };
      }
      const [[registrationRow], [nrbvnRow], [nrniaRow]] = await Promise.all([
        db.select({ value: count() }).from(interestRegistrations),
        db.select({ value: count() }).from(referralTracking).where(eq4(referralTracking.targetType, "nrbvn")),
        db.select({ value: count() }).from(referralTracking).where(eq4(referralTracking.targetType, "nrnia"))
      ]);
      return {
        registrations: registrationRow?.value ?? 0,
        nrbvn: nrbvnRow?.value ?? 0,
        nrnia: nrniaRow?.value ?? 0
      };
    })
  })
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
import path from "path";
import { defineConfig } from "vite";
var plugins = [react()];
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
    outDir: path.resolve(import.meta.dirname, "public"),
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
      const page2 = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page2);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app) {
  console.log("=== serveStatic initialization ===");
  console.log(`CWD: ${process.cwd()}`);
  console.log(`import.meta.dirname: ${import.meta.dirname}`);
  const possiblePaths = [
    path2.resolve(import.meta.dirname, "../..", "dist", "public"),
    path2.resolve(process.cwd(), "dist", "public"),
    path2.resolve("/var/task", "dist", "public")
  ];
  console.log("Checking possible paths:");
  let distPath = null;
  for (const p of possiblePaths) {
    const exists = fs.existsSync(p);
    console.log(`  ${exists ? "\u2713" : "\u2717"} ${p}`);
    if (exists) {
      distPath = p;
    }
  }
  if (!distPath) {
    console.error("Could not find any dist folder!");
    distPath = possiblePaths[0];
  } else {
    console.log(`Using distPath: ${distPath}`);
  }
  app.use(express.static(distPath, { index: false }));
  app.use("*", (_req, res) => {
    const indexPath = path2.resolve(distPath, "index.html");
    console.log(`Serving index.html from: ${indexPath}`);
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.sendFile(indexPath);
  });
}

// server/joinRoutes.ts
import { z as z5 } from "zod";

// server/joinSignups.ts
import { randomUUID } from "crypto";
import { and as and2, eq as eq5, inArray, isNotNull, isNull, lt, or, sql as sql2 } from "drizzle-orm";
var tableReady2 = false;
async function ensureTable2(db) {
  if (tableReady2) return;
  await db.execute(sql2`
    DO $$ BEGIN
      CREATE TYPE join_signup_status AS ENUM ('pending', 'confirmed');
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  `);
  await db.execute(sql2`
    CREATE TABLE IF NOT EXISTS join_signups (
      id SERIAL PRIMARY KEY,
      name VARCHAR(200) NOT NULL,
      email VARCHAR(320) NOT NULL UNIQUE,
      country VARCHAR(120) NOT NULL,
      association VARCHAR(200),
      source VARCHAR(120) NOT NULL DEFAULT '/join',
      status join_signup_status NOT NULL DEFAULT 'pending',
      "confirmationToken" VARCHAR(64) NOT NULL UNIQUE,
      "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
      "confirmedAt" TIMESTAMP
    );
  `);
  for (const column of ["briefSentAt", "nextWeeklyAt", "lastWeeklySentAt", "unsubscribedAt"]) {
    await db.execute(sql2.raw(`ALTER TABLE join_signups ADD COLUMN IF NOT EXISTS "${column}" TIMESTAMP`));
  }
  await db.execute(sql2`ALTER TABLE join_signups ADD COLUMN IF NOT EXISTS "lastWeeklyIssue" INTEGER`);
  await db.execute(sql2`
    CREATE TABLE IF NOT EXISTS weekly_issues (
      id SERIAL PRIMARY KEY,
      "issueNumber" INTEGER NOT NULL UNIQUE,
      "contentHash" VARCHAR(64) NOT NULL UNIQUE,
      subject TEXT NOT NULL,
      "bodyHtml" TEXT NOT NULL,
      "sentAt" TIMESTAMP NOT NULL DEFAULT now(),
      "recipientCount" INTEGER NOT NULL DEFAULT 0,
      "archivedAt" TIMESTAMP,
      "archivePath" VARCHAR(200)
    );
  `);
  tableReady2 = true;
}
var WEEKLY_INTERVAL_MS = 14 * 24 * 60 * 60 * 1e3;
async function claimBriefSend(token) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await ensureTable2(db);
  const now = /* @__PURE__ */ new Date();
  const rows = await db.update(joinSignups).set({ briefSentAt: now, nextWeeklyAt: new Date(now.getTime() + WEEKLY_INTERVAL_MS) }).where(
    and2(
      eq5(joinSignups.confirmationToken, token),
      eq5(joinSignups.status, "confirmed"),
      isNull(joinSignups.briefSentAt),
      isNull(joinSignups.unsubscribedAt)
    )
  ).returning();
  return rows[0] ?? null;
}
async function releaseBriefClaim(token) {
  const db = await getDb();
  if (!db) return;
  await db.update(joinSignups).set({ briefSentAt: null, nextWeeklyAt: null }).where(eq5(joinSignups.confirmationToken, token));
}
async function getDueWeeklySubscribers(issueNumber, limit = 100) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await ensureTable2(db);
  return db.select().from(joinSignups).where(
    and2(
      eq5(joinSignups.status, "confirmed"),
      isNull(joinSignups.unsubscribedAt),
      isNotNull(joinSignups.briefSentAt),
      or(isNull(joinSignups.lastWeeklyIssue), lt(joinSignups.lastWeeklyIssue, issueNumber))
    )
  ).limit(limit);
}
async function advanceWeekly(ids, issueNumber) {
  if (ids.length === 0) return;
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const now = /* @__PURE__ */ new Date();
  await db.update(joinSignups).set({
    lastWeeklySentAt: now,
    lastWeeklyIssue: issueNumber,
    nextWeeklyAt: new Date(now.getTime() + WEEKLY_INTERVAL_MS)
  }).where(inArray(joinSignups.id, ids));
}
async function unsubscribeByToken(token) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await ensureTable2(db);
  const rows = await db.update(joinSignups).set({ unsubscribedAt: /* @__PURE__ */ new Date(), nextWeeklyAt: null }).where(eq5(joinSignups.confirmationToken, token)).returning({ id: joinSignups.id });
  return rows.length > 0;
}
async function upsertJoinSignup(input) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await ensureTable2(db);
  const values = {
    name: input.name,
    email: input.email,
    country: input.country,
    association: input.association || null,
    source: input.source || "/join",
    confirmationToken: randomUUID()
  };
  await db.insert(joinSignups).values(values).onConflictDoUpdate({
    target: joinSignups.email,
    set: {
      name: values.name,
      country: values.country,
      association: values.association,
      source: values.source
    }
  });
  const [row] = await db.select().from(joinSignups).where(eq5(joinSignups.email, input.email)).limit(1);
  if (row.unsubscribedAt) {
    const [reset] = await db.update(joinSignups).set({
      status: "pending",
      confirmationToken: randomUUID(),
      unsubscribedAt: null,
      briefSentAt: null,
      nextWeeklyAt: null,
      confirmedAt: null
    }).where(eq5(joinSignups.id, row.id)).returning();
    return reset;
  }
  return row;
}
async function confirmJoinSignup(token) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await ensureTable2(db);
  const [row] = await db.select().from(joinSignups).where(eq5(joinSignups.confirmationToken, token)).limit(1);
  if (!row) return null;
  if (row.status === "confirmed") return row;
  const confirmedAt = /* @__PURE__ */ new Date();
  await db.update(joinSignups).set({ status: "confirmed", confirmedAt }).where(eq5(joinSignups.confirmationToken, token));
  return { ...row, status: "confirmed", confirmedAt };
}

// server/briefArticle.ts
var BRIEF_ARTICLE_TEXT = `Two Layers of Failed Trust: Why Diaspora Investment
Remains Wishful Thinking \u2014 Until Now

By Dr. Sam Ikoku
Founder, Nigeria Diaspora Investment Gateway (NDIG)

---

I recently pivoted my focus to a question I believe is central to Nigeria's
economic future: how can the enormous financial and human capital of the Nigerian
diaspora be mobilised to catalyse national development?

The numbers are staggering. In 2024, Nigerians abroad sent home $20.98 billion \u2014
the highest level in five years, according to the Central Bank of Nigeria \u2014 nearly
twenty times the $1.08 billion Nigeria attracted in foreign direct investment in
the same year. In Q1 2026 alone, formal remittance inflows reached $5.30 billion.
Formal-channel inflows through licensed international money transfer operators
surged 43.5% to $4.73 billion in 2024 alone \u2014 diaspora Nigerians are not leaving
the system; they are running toward its safest rails.

And yet, the large majority of this capital flows into household consumption \u2014
school fees, rent, medical bills, food. This is not a failure. It is development
finance in its own right, sustaining millions of households through currency
crises and economic shocks.

But it is not investment. It does not compound. It does not build factories,
create jobs, or expand Nigeria's productive base.

THE PRESIDENTIAL ASSIGNMENT

In August 2026, at the Nigeria Diaspora Investment Conference in Toronto,
President Tinubu did something no Nigerian president has done with this much
precision before: he defined the assignment.

Remittances, he said, must become "the floor of Diaspora engagement rather
than its ceiling."

Then he went further. He challenged diaspora Nigerians to move beyond
atomised, individual investing \u2014 to embrace "professionally managed
investment clubs, sector funds, co-investment vehicles and venture
networks." And he named the discipline such vehicles demand: "pool
resources, demand audited accounts, enforce corporate governance and
conduct proper due diligence."

Read that list slowly. Professionally managed. Audited accounts. Corporate
governance. Proper due diligence.

Every one of those four is a rejection of the informal, unaccountable
intermediation that has failed the diaspora for decades. The umbrella-body
model \u2014 in which nobody is screened, nobody signs a covenant, nobody
attests, and nobody can be removed \u2014 cannot pass a single one of the four
tests. The President did not ask the diaspora to wait for its organisations
to reform. He described a different architecture altogether: pooled,
governed, verified.

That architecture is exactly what this article is about. The Country Anchor
is what "professionally managed" looks like at the human layer \u2014 named,
screened, certified, covenant-bound, revocable. The verification dossier is
what "proper due diligence" looks like at the institutional layer. The
presidential assignment and the NDIG design are the same sentence, written
by two different people.

And his closing words in Toronto are the ones this launch answers: "Nigeria
sees you. Nigeria values you. Nigeria needs you."

Nigeria needs you \u2014 as investors, not only as senders.

That is what opens on 1 October.

So why, after decades of exhortation, does diaspora capital still refuse to cross
the line from survival to investment?

The answer is not a lack of interest. It is not a lack of capital. It is a lack
of trust.

THE FIRST LAYER OF FAILED TRUST \u2014 INSTRUMENTS AND PROCESS

For years, the conventional wisdom held that diaspora Nigerians simply needed
better marketing. Show them the opportunities, the reasoning went, and the
capital would flow.

That analysis was wrong. The barriers are rational and well-documented:

\xB7 Disputed land titles and abandoned developments that have trapped diaspora
  capital in unfinished concrete shells.
\xB7 Incomplete documentation and weak on-ground supervision that amplify risk
  across distance.
\xB7 Predatory actors operating with impunity. In March 2025 alone, the EFCC
  flagged 58 companies "posturing as investing entities" \u2014 registered with
  neither the CBN nor the SEC. Five have already been convicted.

This is the layer the infrastructure is beginning to address. Piece by piece,
the rails are being laid:

\xB7 In May 2025, the Central Bank \u2014 through NIBSS \u2014 launched the Non-Resident
  Bank Verification Number, allowing eligible Nigerians abroad to obtain a BVN
  remotely, supported by the Non-Resident Nigerian Ordinary Account and the
  Non-Resident Nigerian Investment Account for naira and foreign-currency
  holdings.
\xB7 In 2017, Nigeria issued a $300 million Diaspora Bond. It was 130%
  oversubscribed, and in June 2022 it was redeemed at maturity \u2014 investors were
  paid in full.
\xB7 In August 2024, the Debt Management Office opened a $2 billion domestic
  US-dollar bond programme. The first $500 million tranche closed at 180%
  oversubscription, raising over $900 million.

These are the rails. But rails are not a railway. Access without verification
is how the 58 get to market. The missing piece is an institution that converts
access into informed choice \u2014 a gate on the rails. That is what the Nigeria
Diaspora Investment Gateway was built to be.

THE SECOND LAYER OF FAILED TRUST \u2014 THE ORGANISATIONS THEMSELVES

When I began preparing for NDIG's launch, I assumed the natural partners would
be the diaspora umbrella bodies \u2014 the organisations that represent Nigerians
across Europe, the Americas, and beyond. Surely, I thought, they are aware of
these opportunities. Surely they are ready to partner.

What I found was disheartening.

The Nigerians in Diaspora Organisation (NIDO) Europe \u2014 the umbrella body for
Nigerians across the continent \u2014 has spent years in factional dispute. Elections
have been contested; rival executives have each claimed legitimacy; factions
have carried their disputes into the courts, publicly. In Germany, one chapter
found itself fighting not a rival faction but a self-appointed "caretaker
committee" \u2014 a battle that ran through the courts for the better part of a year
before the elected executive prevailed in 2025, constitution in hand.

The pattern is not confined to continental politics. In the United Kingdom, a
community association leader known as "Oluomo of Derby" was forced to step down
in February 2025 following press-documented allegations that he had collected
thousands of pounds from multiple Nigerians \u2014 \xA310,500 in one reported case \u2014
under the pretext of securing Certificates of Sponsorship for UK work visas. He
has denied wrongdoing. The Nigerian High Commission publicly dissociated itself,
stating he represented the Mission in no capacity whatsoever.

I make no generalisation about the thousands of volunteers who serve diaspora
communities honourably. But the pattern is difficult to ignore: institutions that
publicly accuse the Nigerian government of corruption and mismanagement have too
often replicated the same behaviours internally \u2014 opacity, impunity, disregard
for governance.

TWO LAYERS \u2014 AND A STRUCTURAL CONSEQUENCE

This is the hidden challenge, and it has a structural consequence that no one
in this conversation has named plainly.

The diaspora investor who wants to move beyond consumption must clear two
gates of distrust: first, the instruments and processes at home; second, the
organisations abroad that should be the trusted intermediaries. Fail either
gate, and the money stays in consumption \u2014 rationally.

The consequence is severe: without trusted intermediation, diaspora investment
stays atomised and non-strategic. Individuals acting alone cannot aggregate
capital at scale, cannot negotiate institutional terms, cannot access the best
projects, and cannot exercise meaningful oversight.

And here is the uncomfortable part. The instinctive response \u2014 "bypass the
organisations entirely and engage individuals directly" \u2014 fails too. Capital at
scale always needs intermediaries. The question was never whether we need them.
The question is what kind.

THE ANSWER: ACCOUNTABLE INDIVIDUALS, NOT UNACCOUNTABLE INSTITUTIONS

Layer two fails because the organisations answer to no one. The remedy is not
to eliminate intermediation \u2014 it is to replace unaccountable institutions with
accountable individuals.

This is the architecture the Nigeria Diaspora Investment Gateway is building,
and it launches on 1 October 2026:

Country Anchors. Named, screened, and compliance-shielded individuals \u2014
embedded in cities across the diaspora \u2014 who serve as the verified human gateway
between their communities and the Nigerian investment corridor. Not committees.
Not executives of contested umbrella bodies. Individuals whose names, records,
and obligations are on file; who are trained and certified; who operate under a
signed covenant \u2014 introducer only, never selling, never holding funds, never
advising \u2014 and who can be revoked at a stroke if they breach it. The Chapter
Chairman who answers to no one is replaced by the Anchor who answers to the
verification record.

The verification rail. Beneath every Anchor sits NDIG's core: every opportunity
offered to diaspora investors is checked against corporate registries, title
records, and regulatory standing before a single dollar is invited. The same
standard for everyone \u2014 the President's "proper due diligence," made
institutional.

The evidence already exists that this model works. For over sixty years, Israel
has issued diaspora bonds through the Development Corporation for Israel \u2014 not
through communal umbrella bodies, but through direct, professional engagement:
a substantial staff maintaining close contact with diaspora communities,
understanding investor profiles, hosting events whose purpose is maintaining
ties and selling bonds. When the intermediary is professional, transparent,
and accountable, diaspora capital moves at scale.

WHY THIS MATTERS NOW

The rails are being laid. The presidential assignment is on record. The
professionals \u2014 the doctors, engineers, technologists, entrepreneurs, and
financiers of the diaspora \u2014 are ready.

What has been missing is the connective tissue: an institution that verifies on
one end and accountable human beings on the other. Two layers of failed trust
require two layers of new infrastructure. Build only one, and the capital stays
home in Houston, in London, in Toronto \u2014 safe, rational, and wasted.

The Nigeria Diaspora Investment Gateway is one institution trying to build both
layers properly. On 1 October, the first Country Anchors take their seats, the
first verifications begin, and the corridor gets its gate.

The capital is there. The instruments are emerging. The professionals are ready.

The only question left is whether we build the trust architecture to connect
them \u2014 or spend another decade wondering why the money never came.

---

Dr. Sam Ikoku is the founder of the Nigeria Diaspora Investment Gateway (NDIG),
launching 1 October 2026. He writes on diaspora capital, trust infrastructure,
and Nigeria's economic future.`;

// server/emailTemplates.ts
var PUBLIC_BASE_URL = process.env.PUBLIC_BASE_URL || "https://www.ndigateway.org";
var DISCLOSURE = "NDIG does not provide investment advice, and does not collect or hold investor funds. All investments are made directly with the licensed institutions named.";
function escapeHtml2(value) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
function unsubscribeUrl(token) {
  return `${PUBLIC_BASE_URL}/api/unsubscribe?token=${encodeURIComponent(token)}`;
}
var F = "Georgia,'Times New Roman',serif";
function shell(innerHtml, unsubUrl) {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f7f5ef;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f7f5ef;"><tr><td align="center" style="padding:24px 12px;">
<table role="presentation" width="640" cellpadding="0" cellspacing="0" style="max-width:640px;width:100%;background:#ffffff;border-radius:6px;overflow:hidden;">
<tr><td style="background:#03381d;padding:22px 32px;border-bottom:3px solid #c9a227;">
<img src="${PUBLIC_BASE_URL}/ndig-logo.png" alt="NDIG" width="44" height="44" style="vertical-align:middle;border-radius:50%;background:#fff;">
<span style="font-family:${F};color:#ffffff;font-size:17px;letter-spacing:.06em;vertical-align:middle;margin-left:12px;">Nigeria Diaspora Investment Gateway</span>
</td></tr>
<tr><td style="padding:32px;font-family:${F};color:#12231a;font-size:16px;line-height:1.7;">${innerHtml}</td></tr>
<tr><td style="background:#f7f5ef;padding:22px 32px;font-family:${F};font-size:12px;line-height:1.6;color:#5b6b60;border-top:1px solid #e3dfd0;">
<p style="margin:0 0 10px;">${escapeHtml2(DISCLOSURE)}</p>
<p style="margin:0;">You are receiving this because you subscribed at ndigateway.org. Replies go to our team. <a href="${unsubUrl}" style="color:#0b6b3a;">Unsubscribe</a>.</p>
</td></tr>
</table></td></tr></table></body></html>`;
}
function renderArticle(text2) {
  const blocks = text2.split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);
  const out = [];
  blocks.forEach((block, i) => {
    if (i === 0) {
      out.push(`<h1 style="font-family:${F};font-size:26px;line-height:1.25;margin:0 0 14px;color:#054d28;font-weight:normal;">${escapeHtml2(block.replace(/\s*\n\s*/g, " "))}</h1>`);
      return;
    }
    if (i === 1 && /^By /.test(block)) {
      out.push(`<p style="margin:0 0 18px;color:#5b6b60;font-size:14px;">${block.split("\n").map((l) => escapeHtml2(l.trim())).join("<br>")}</p>`);
      return;
    }
    if (block === "---") {
      out.push(`<hr style="border:none;border-top:1px solid #e3dfd0;margin:22px 0;">`);
      return;
    }
    if (/^[A-Z0-9 ,.'’—:\-]+$/.test(block) && block.length > 6) {
      out.push(`<h2 style="font-family:'Courier New',monospace;font-size:13px;letter-spacing:.14em;color:#0b6b3a;margin:28px 0 10px;">${escapeHtml2(block)}</h2>`);
      return;
    }
    if (block.startsWith("\xB7")) {
      const items = block.split(/\n(?=·)/).map((it) => it.replace(/^·\s*/, "").replace(/\s*\n\s*/g, " "));
      out.push(`<ul style="margin:0 0 16px;padding-left:20px;">${items.map((it) => `<li style="margin-bottom:8px;">${escapeHtml2(it)}</li>`).join("")}</ul>`);
      return;
    }
    out.push(`<p style="margin:0 0 16px;">${escapeHtml2(block.replace(/\s*\n\s*/g, " "))}</p>`);
  });
  return out.join("\n");
}
var BRIEF_SUBJECT = "Two Layers of Failed Trust";
function renderBriefEmail(name, unsubUrl) {
  const intro = `<p style="margin:0 0 6px;">Hi ${escapeHtml2(name)},</p>
<p style="margin:0 0 22px;">Your subscription is confirmed. Below is <strong>\u201CTwo Layers of Failed Trust\u201D</strong> \u2014 the first article every confirmed subscriber receives. The NDIG Weekly follows every two weeks thereafter.</p>
<hr style="border:none;border-top:1px solid #e3dfd0;margin:0 0 24px;">`;
  return shell(intro + renderArticle(BRIEF_ARTICLE_TEXT), unsubUrl);
}
function renderWeeklyArchive(subject, bodyHtml, sentAt) {
  const banner = `<p style="margin:0 0 18px;font-size:13px;color:#5b6b60;">Archived copy \u2014 NDIG Weekly, sent ${sentAt.toISOString().slice(0, 10)}. <a href="${PUBLIC_BASE_URL}/join" style="color:#0b6b3a;">Subscribe</a></p>`;
  return shell(banner + bodyHtml, `${PUBLIC_BASE_URL}/join`).replace("<head>", `<head><title>${escapeHtml2(subject)}</title>`);
}
function renderWeeklyEmail(name, bodyHtml, unsubUrl) {
  return shell(`<p style="margin:0 0 18px;">Hi ${escapeHtml2(name)},</p>${bodyHtml}`, unsubUrl);
}

// server/weeklyContent.ts
var currentWeekly = {
  subject: "NDIG Weekly #1: The $21 Billion Question Nobody Could Answer",
  bodyHtml: `<h1 style="font-family:Georgia,'Times New Roman',serif;font-size:26px;line-height:1.25;margin:0 0 8px;color:#054d28;font-weight:normal;">The $21 Billion Question Nobody Could Answer</h1>
<p style="margin:0 0 22px;color:#5b6b60;font-size:14px;font-style:italic;">NDIG Weekly \xB7 Issue #1 \xB7 Thursday 8 October 2026</p>
<p style="margin:0 0 16px;">Every year, Nigerians abroad send home more than twenty billion dollars. The exact figure changes with the source. The Central Bank says one number. The World Bank says another. The International Monetary Fund has its own count. What does not change is this: nobody can tell you, with certainty, where all that money goes.</p>
<p style="margin:0 0 16px;">Not the regulators. Not the banks. Not the receiving families. And certainly not the senders.</p>
<p style="margin:0 0 16px;">I have spent years watching this flow. I have sat with diaspora Nigerians in London, in Houston, in Johannesburg, who send money home every month and still cannot answer the simplest questions. Did the money arrive? Did it arrive whole? Did it go where it was supposed to go? Was the person who received it the person who was supposed to receive it?</p>
<p style="margin:0 0 16px;">These are not trick questions. They are the most basic questions in finance. And for the Nigerian diaspora, they have no reliable answer.</p>
<p style="margin:0 0 16px;">This is not a story about corruption. It is not a story about incompetence. It is a story about infrastructure. The pipes exist. The money moves. What is missing is the layer that answers those questions \u2014 a verification layer, a trust layer, a way to know.</p>
<p style="margin:0 0 16px;">That layer is what NDIG was built to provide.</p>
<p style="margin:0 0 16px;">NDIG does not move your money. It does not hold your money. It does not advise you where to put your money. What it does is verify. It verifies the people you deal with. It verifies the institutions that claim to serve you. It verifies the claims that are made to you, in your name, with your funds.</p>
<p style="margin:0 0 16px;">The twenty-one billion dollars is not the problem. The problem is that twenty-one billion dollars moves every year through a system where trust is assumed, not proven. NDIG exists to change that assumption into a standard.</p>
<p style="margin:0 0 16px;">This is the first issue of the NDIG Weekly. Every fortnight, we will take one question the diaspora cannot answer and answer it. Not with opinion. Not with promotion. With verification.</p>
<p style="margin:0 0 16px;">The next issue lands on 22 October. We will look at what changed in May, when the Central Bank changed the rules on how your remittances arrive \u2014 and why most of you never noticed.</p>
<p style="margin:0 0 16px;">Until then, ask yourself the only question that matters: when you send money home, do you know, or do you trust?</p>
<hr style="border:none;border-top:1px solid #e3dfd0;margin:22px 0;">
<p style="margin:0;color:#5b6b60;font-size:14px;font-style:italic;">NDIG \u2014 The Nigeria Diaspora Investment Gateway</p>`
};

// server/newsletterRouting.ts
var VERDICT_WORD = /\b(VERIFIED|FAILED)\b/;
var BRIEF_MENTION = /intelligence\s+brief|NDIG[-–\s]+NAKACHI/i;
function plainParagraphs(html) {
  return html.split(/<\/(?:p|li|h[1-6]|div|blockquote)>|<br\s*\/?>/i).map((chunk) => chunk.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim()).filter(Boolean);
}
function checkBeforeSend(draft) {
  const blocked = [];
  for (const claim of draft.claims ?? []) {
    const gated = claim.verdict === "VERIFIED" || claim.verdict === "FAILED";
    if (gated && claim.source === "INTEL_BRIEF") {
      blocked.push(`A ${claim.verdict} verdict cites the Intelligence Brief as its source.`);
    }
    if (gated && !claim.logEntryId) {
      blocked.push(`A ${claim.verdict} verdict has no verification log entry.`);
    }
  }
  for (const paragraph of plainParagraphs(draft.bodyHtml)) {
    if (VERDICT_WORD.test(paragraph) && BRIEF_MENTION.test(paragraph)) {
      blocked.push(`Paragraph pairs a VERIFIED/FAILED verdict with the Intelligence Brief: "${paragraph.slice(0, 120)}"`);
    }
  }
  return { ok: blocked.length === 0, blocked };
}

// server/weeklySchedule.ts
var FIRST_ISSUE_DATE = "2026-10-08";
var ISSUE_INTERVAL_DAYS = 14;
var DAY_MS = 24 * 60 * 60 * 1e3;
function utcDateString(date) {
  return date.toISOString().slice(0, 10);
}
function isScheduledSendDate(date = /* @__PURE__ */ new Date()) {
  const days = Math.round((Date.parse(`${utcDateString(date)}T00:00:00Z`) - Date.parse(`${FIRST_ISSUE_DATE}T00:00:00Z`)) / DAY_MS);
  return days >= 0 && days % ISSUE_INTERVAL_DAYS === 0;
}

// server/weeklyArchive.ts
import { createHash } from "crypto";
import { eq as eq6, sql as sql3 } from "drizzle-orm";
var REPO = process.env.ARCHIVE_GITHUB_REPO || "samikoku/ndig-platform";
var BRANCH = process.env.ARCHIVE_GITHUB_BRANCH || "main";
function hashContent(subject, bodyHtml) {
  return createHash("sha256").update(`${subject}
${bodyHtml}`).digest("hex");
}
function archivePathFor(sentAt, issueNumber) {
  return `archive/weekly/${sentAt.toISOString().slice(0, 10)}-issue-${String(issueNumber).padStart(3, "0")}.html`;
}
async function findIssueByContent(subject, bodyHtml) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await ensureTable2(db);
  const [row] = await db.select().from(weeklyIssues).where(eq6(weeklyIssues.contentHash, hashContent(subject, bodyHtml))).limit(1);
  return row ?? null;
}
async function issueNumberFor(subject, bodyHtml) {
  const existing = await findIssueByContent(subject, bodyHtml);
  if (existing) return existing.issueNumber;
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.execute(sql3`SELECT COALESCE(MAX("issueNumber"), 0) + 1 AS next FROM weekly_issues`);
  return Number(result.rows[0].next);
}
async function ensureIssueRecord(subject, bodyHtml, issueNumber) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await ensureTable2(db);
  await db.insert(weeklyIssues).values({ issueNumber, contentHash: hashContent(subject, bodyHtml), subject, bodyHtml }).onConflictDoNothing();
  const issue = await findIssueByContent(subject, bodyHtml);
  if (!issue) throw new Error("Failed to record Weekly issue");
  return issue;
}
async function addRecipients(issueId, count2) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(weeklyIssues).set({ recipientCount: sql3`${weeklyIssues.recipientCount} + ${count2}` }).where(eq6(weeklyIssues.id, issueId));
}
async function commitFileToRepo(path3, content, message) {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    console.warn("[Weekly Archive] GITHUB_TOKEN not configured \u2014 cannot commit", path3);
    return "failed";
  }
  try {
    const response = await fetch(`https://api.github.com/repos/${REPO}/contents/${path3}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message, content: Buffer.from(content, "utf8").toString("base64"), branch: BRANCH })
    });
    if (response.ok) return "created";
    if (response.status === 422) return "exists";
    console.error("[Weekly Archive] GitHub API error", response.status, await response.text());
    return "failed";
  } catch (error) {
    console.error("[Weekly Archive] Commit failed:", error);
    return "failed";
  }
}
async function archiveIssue(issue) {
  if (issue.archivedAt) return true;
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const path3 = archivePathFor(issue.sentAt, issue.issueNumber);
  const html = renderWeeklyArchive(issue.subject, issue.bodyHtml, issue.sentAt);
  const result = await commitFileToRepo(path3, html, `Archive NDIG Weekly issue ${String(issue.issueNumber).padStart(3, "0")} [skip ci]`);
  if (result === "failed") return false;
  await db.update(weeklyIssues).set({ archivedAt: /* @__PURE__ */ new Date(), archivePath: path3 }).where(eq6(weeklyIssues.id, issue.id));
  console.log("[Weekly Archive] Archived issue", issue.issueNumber, "to", path3);
  return true;
}

// server/joinRoutes.ts
var joinSchema = z5.object({
  name: z5.string().trim().min(1).max(200),
  email: z5.string().trim().email().max(320),
  country: z5.string().trim().min(1).max(120),
  association: z5.string().trim().max(200).optional()
});
function page(title, message, success, extra = "") {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>NDIG Weekly</title>
<style>body{font-family:Georgia,'Times New Roman',serif;background:#f7f5ef;color:#12231a;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;padding:24px;text-align:center}
.card{max-width:480px;padding:40px;background:#fff;border-radius:6px;border-top:4px solid ${success ? "#0b6b3a" : "#c9a227"}}
h1{font-size:1.3rem;margin:0 0 12px}a{color:#0b6b3a}button{background:#0b6b3a;color:#fff;border:0;padding:12px 26px;border-radius:3px;font-size:1rem;cursor:pointer}</style></head>
<body><div class="card"><h1>${title}</h1><p>${message}</p>${extra}<p><a href="https://www.ndigateway.org/join">Return to NDIG</a></p></div></body></html>`;
}
function registerJoinRoutes(app) {
  app.post("/api/join", async (req, res) => {
    const parsed = joinSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, message: "Please enter your name and a valid email address." });
      return;
    }
    try {
      const row = await upsertJoinSignup({ ...parsed.data, source: "/join" });
      if (row.status === "pending") {
        const proto = req.headers["x-forwarded-proto"] || req.protocol;
        const confirmUrl = `${proto}://${req.headers.host}/api/confirm?token=${row.confirmationToken}`;
        const sent = await sendJoinConfirmationEmail({ name: row.name, email: row.email, confirmUrl });
        if (!sent) {
          console.warn("[Join] Confirmation email not sent for", row.email);
        }
      }
      res.status(200).json({ success: true, message: "You're on the list." });
    } catch (error) {
      console.error("[Join Signup Error]", error);
      res.status(500).json({ success: false, message: "Something went wrong. Please try again." });
    }
  });
  app.get("/api/confirm", async (req, res) => {
    const token = typeof req.query.token === "string" ? req.query.token : "";
    if (!token) {
      res.status(400).send(page("Confirmation issue", "Missing confirmation token.", false));
      return;
    }
    try {
      const row = await confirmJoinSignup(token);
      if (!row) {
        res.status(404).send(page("Confirmation issue", "This confirmation link is invalid or has expired.", false));
        return;
      }
      if (row.unsubscribedAt) {
        res.status(200).send(page("Subscription cancelled", "This subscription was cancelled. You can sign up again at any time from the NDIG page.", false));
        return;
      }
      const claimed = await claimBriefSend(token);
      if (!claimed) {
        res.status(200).send(page("You're already confirmed", "Your subscription is active and the article \u201CTwo Layers of Failed Trust\u201D has already been sent to your inbox. The NDIG Weekly follows every two weeks thereafter.", true));
        return;
      }
      const messageId = await sendResendEmail({
        to: claimed.email,
        subject: BRIEF_SUBJECT,
        html: renderBriefEmail(claimed.name, unsubscribeUrl(claimed.confirmationToken)),
        unsubscribeUrl: unsubscribeUrl(claimed.confirmationToken)
      });
      if (!messageId) {
        await releaseBriefClaim(token);
        res.status(502).send(page("Almost there", "Your subscription is confirmed, but we couldn't send the article just now. Please click your confirmation link again in a few minutes.", false));
        return;
      }
      console.log("[Join] Brief sent to", claimed.email, "resend id", messageId);
      res.status(200).send(page("You're confirmed", "The article \u201CTwo Layers of Failed Trust\u201D is on its way to your inbox now, followed by the NDIG Weekly every two weeks thereafter.", true));
    } catch (error) {
      console.error("[Join Confirm Error]", error);
      res.status(500).send(page("Confirmation issue", "Something went wrong confirming your subscription. Please try again.", false));
    }
  });
  app.get("/api/unsubscribe", (req, res) => {
    const token = typeof req.query.token === "string" ? req.query.token : "";
    if (!token) {
      res.status(400).send(page("Unsubscribe", "Missing unsubscribe token.", false));
      return;
    }
    res.status(200).send(
      page(
        "Unsubscribe",
        "Click below to stop receiving the NDIG Weekly.",
        true,
        `<form method="POST" action="/api/unsubscribe?token=${encodeURIComponent(token)}"><button type="submit">Unsubscribe</button></form>`
      )
    );
  });
  app.post("/api/unsubscribe", async (req, res) => {
    const token = typeof req.query.token === "string" ? req.query.token : "";
    if (!token) {
      res.status(400).send(page("Unsubscribe", "Missing unsubscribe token.", false));
      return;
    }
    try {
      const ok = await unsubscribeByToken(token);
      if (!ok) {
        res.status(404).send(page("Unsubscribe", "This unsubscribe link is invalid.", false));
        return;
      }
      res.status(200).send(page("You're unsubscribed", "You will not receive further emails from NDIG.", true));
    } catch (error) {
      console.error("[Join Unsubscribe Error]", error);
      res.status(500).send(page("Unsubscribe", "Something went wrong. Please try again.", false));
    }
  });
  app.get("/api/cron/weekly", async (req, res) => {
    const secret = process.env.CRON_SECRET;
    if (secret && req.headers.authorization !== `Bearer ${secret}`) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    const weekly = currentWeekly;
    const now = /* @__PURE__ */ new Date();
    const onSendDate = isScheduledSendDate(now);
    try {
      if (!onSendDate) {
        let archived2 = null;
        if (weekly) {
          const recorded2 = await findIssueByContent(weekly.subject, weekly.bodyHtml);
          if (recorded2 && recorded2.recipientCount > 0 && !recorded2.archivedAt) archived2 = await archiveIssue(recorded2);
        }
        res.status(200).json({ sent: 0, skipped: "not a scheduled send date", archived: archived2 });
        return;
      }
      if (!weekly) {
        console.error("[Cron Weekly] MISSING \u2014 scheduled send date", utcDateString(now), "but no issue is configured in server/weeklyContent.ts");
        res.status(503).json({ status: "MISSING", reason: "no issue content configured", date: utcDateString(now) });
        return;
      }
      const gate = checkBeforeSend(weekly);
      if (!gate.ok) {
        console.error("[Cron Weekly] BLOCKED \u2014 flagged for desk review:", gate.blocked.join(" | "));
        res.status(503).json({ status: "BLOCKED", reason: "flagged for desk review", details: gate.blocked, date: utcDateString(now) });
        return;
      }
      const existing = await findIssueByContent(weekly.subject, weekly.bodyHtml);
      if (existing && utcDateString(existing.sentAt) < utcDateString(now)) {
        console.error("[Cron Weekly] MISSING \u2014 configured content was already sent as issue", existing.issueNumber, "on", utcDateString(existing.sentAt), "and has not been replaced");
        res.status(503).json({ status: "MISSING", reason: `content unchanged since issue ${existing.issueNumber}`, date: utcDateString(now) });
        return;
      }
      const issueNumber = await issueNumberFor(weekly.subject, weekly.bodyHtml);
      let sent = 0;
      for (let batch = 0; batch < 5; batch++) {
        const due = await getDueWeeklySubscribers(issueNumber, 100);
        if (due.length === 0) break;
        const issue = await ensureIssueRecord(weekly.subject, weekly.bodyHtml, issueNumber);
        const ok = await sendResendBatch(
          due.map((s) => ({
            to: s.email,
            subject: weekly.subject,
            html: renderWeeklyEmail(s.name, weekly.bodyHtml, unsubscribeUrl(s.confirmationToken)),
            unsubscribeUrl: unsubscribeUrl(s.confirmationToken)
          }))
        );
        if (!ok) {
          res.status(502).json({ sent, error: "batch send failed; remaining subscribers unchanged" });
          return;
        }
        await advanceWeekly(due.map((s) => s.id), issueNumber);
        await addRecipients(issue.id, due.length);
        sent += due.length;
      }
      console.log("[Cron Weekly] Issue", issueNumber, "sent to", sent, "subscribers");
      const recorded = await findIssueByContent(weekly.subject, weekly.bodyHtml);
      let archived = null;
      if (recorded && recorded.recipientCount > 0 && !recorded.archivedAt) {
        archived = await archiveIssue(recorded);
      }
      res.status(200).json({ sent, issue: recorded?.issueNumber ?? null, archived });
    } catch (error) {
      console.error("[Cron Weekly Error]", error);
      res.status(500).json({ error: "cron failed" });
    }
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
  registerJoinRoutes(app);
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
