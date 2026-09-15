import { describe, it, expect, beforeAll } from "vitest";
import { appRouter } from "./routers";
import type { Context } from "./_core/trpc";
import type { Request, Response } from "express";

// Mock context for testing
function createMockContext(user?: any): Context {
  return {
    req: {} as Request,
    res: {
      cookie: () => {},
      clearCookie: () => {},
    } as unknown as Response,
    user: user || null,
  };
}

describe("Interest Registration System", () => {
  describe("interestRegistration.submit", () => {
    it("should successfully submit a valid registration", async () => {
      const caller = appRouter.createCaller(createMockContext());

      const result = await caller.interestRegistration.submit({
        name: "Test User",
        email: "test@example.com",
        location: "New York, USA",
        investmentCapacity: "$50k-$100k",
        message: "Interested in real estate opportunities",
      });

      expect(result.success).toBe(true);
      expect(result.message).toContain("Thank you for your interest");
    });

    it("should reject registration with invalid email", async () => {
      const caller = appRouter.createCaller(createMockContext());

      await expect(
        caller.interestRegistration.submit({
          name: "Test User",
          email: "invalid-email",
          location: "New York, USA",
          investmentCapacity: "$50k-$100k",
        })
      ).rejects.toThrow();
    });

    it("should reject registration with short name", async () => {
      const caller = appRouter.createCaller(createMockContext());

      await expect(
        caller.interestRegistration.submit({
          name: "A",
          email: "test@example.com",
          location: "New York, USA",
          investmentCapacity: "$50k-$100k",
        })
      ).rejects.toThrow();
    });

    it("should accept registration without optional message", async () => {
      const caller = appRouter.createCaller(createMockContext());

      const result = await caller.interestRegistration.submit({
        name: "Test User",
        email: "test2@example.com",
        location: "London, UK",
        investmentCapacity: "$100k-$250k",
      });

      expect(result.success).toBe(true);
    });
  });

  describe("interestRegistration.list", () => {
    it("should require admin role to list registrations", async () => {
      const regularUserCaller = appRouter.createCaller(
        createMockContext({ id: 1, role: "user" })
      );

      await expect(regularUserCaller.interestRegistration.list()).rejects.toThrow(
        "Admin access required"
      );
    });

    it("should allow admin to list registrations", async () => {
      const adminCaller = appRouter.createCaller(
        createMockContext({ id: 1, role: "admin" })
      );

      const result = await adminCaller.interestRegistration.list();

      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("interestRegistration.updateStatus", () => {
    it("should require admin role to update status", async () => {
      const regularUserCaller = appRouter.createCaller(
        createMockContext({ id: 1, role: "user" })
      );

      await expect(
        regularUserCaller.interestRegistration.updateStatus({
          id: 1,
          status: "contacted",
        })
      ).rejects.toThrow("Admin access required");
    });

    it("should allow admin to update registration status", async () => {
      const adminCaller = appRouter.createCaller(
        createMockContext({ id: 1, role: "admin" })
      );

      // First create a registration
      const publicCaller = appRouter.createCaller(createMockContext());
      await publicCaller.interestRegistration.submit({
        name: "Status Test User",
        email: "statustest@example.com",
        location: "Toronto, Canada",
        investmentCapacity: "$250k-$500k",
      });

      // Get the list to find the ID
      const registrations = await adminCaller.interestRegistration.list();
      const lastRegistration = registrations[0];

      // Update the status
      const result = await adminCaller.interestRegistration.updateStatus({
        id: lastRegistration.id,
        status: "contacted",
      });

      expect(result.success).toBe(true);
    });

    it("should reject invalid status values", async () => {
      const adminCaller = appRouter.createCaller(
        createMockContext({ id: 1, role: "admin" })
      );

      await expect(
        adminCaller.interestRegistration.updateStatus({
          id: 1,
          status: "invalid_status" as any,
        })
      ).rejects.toThrow();
    });
  });
});
