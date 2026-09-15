import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { getDb } from "./db";
import { interestRegistrations } from "../drizzle/schema";
import { eq } from "drizzle-orm";

describe("Diaspora Bond Interest Registration", () => {
  let testRegistrationId: number;

  beforeAll(async () => {
    // Clean up any test data
    const db = await getDb();
    if (!db) return;
    const existing = await db.select().from(interestRegistrations).where(
      eq(interestRegistrations.email, "test-diaspora-bond@example.com")
    );
    if (existing.length > 0) {
      await db.delete(interestRegistrations).where(
        eq(interestRegistrations.id, existing[0].id)
      );
    }
  });

  afterAll(async () => {
    // Clean up test data
    const db = await getDb();
    if (!db || !testRegistrationId) return;
    await db.delete(interestRegistrations).where(
      eq(interestRegistrations.id, testRegistrationId)
    );
  });

  it("should create a new diaspora bond interest registration", async () => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");
    
    const result = await db.insert(interestRegistrations).values({
      name: "Test Diaspora Bond Investor",
      email: "test-diaspora-bond@example.com",
      location: "United States",
      investmentCapacity: "$50,000 - $100,000",
      message: "Interested in diaspora bonds",
    });

    expect(result).toBeDefined();
    
    // Retrieve the created registration
    const registrations = await db.select().from(interestRegistrations).where(
      eq(interestRegistrations.email, "test-diaspora-bond@example.com")
    );
    
    expect(registrations.length).toBeGreaterThan(0);
    expect(registrations[0].name).toBe("Test Diaspora Bond Investor");
    expect(registrations[0].location).toBe("United States");
    
    testRegistrationId = registrations[0].id;
  });

  it("should retrieve interest registrations from database", async () => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");
    
    const registrations = await db.select().from(interestRegistrations);

    expect(registrations.length).toBeGreaterThan(0);
    const testReg = registrations.find(r => r.email === "test-diaspora-bond@example.com");
    expect(testReg).toBeDefined();
    expect(testReg?.name).toBe("Test Diaspora Bond Investor");
  });

  it("should track registration timestamps", async () => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");
    
    const registration = await db.select().from(interestRegistrations).where(
      eq(interestRegistrations.email, "test-diaspora-bond@example.com")
    );

    expect(registration.length).toBeGreaterThan(0);
    expect(registration[0].createdAt).toBeDefined();
    expect(registration[0].createdAt).toBeInstanceOf(Date);
  });

  it("should have default status of 'new' for registrations", async () => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");
    
    const registration = await db.select().from(interestRegistrations).where(
      eq(interestRegistrations.email, "test-diaspora-bond@example.com")
    );

    expect(registration[0].status).toBe("new");
  });

  it("should store investment capacity information", async () => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");
    
    const registration = await db.select().from(interestRegistrations).where(
      eq(interestRegistrations.email, "test-diaspora-bond@example.com")
    );

    expect(registration[0].investmentCapacity).toBe("$50,000 - $100,000");
  });
});
