import { describe, it, expect, vi, beforeEach } from "vitest";
import { sendWelcomeEmail, notifyAdminNewRegistration } from "./emailService";
import * as notificationModule from "./_core/notification";

// Mock the notification module
vi.mock("./_core/notification", () => ({
  notifyOwner: vi.fn(),
}));

describe("Email Automation System", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("sendWelcomeEmail", () => {
    it("should send welcome email with all required information", async () => {
      const mockNotifyOwner = vi.spyOn(notificationModule, "notifyOwner");
      mockNotifyOwner.mockResolvedValue(true);

      const params = {
        name: "Test Investor",
        email: "test@example.com",
        location: "New York, USA",
        investmentCapacity: "$50k-$100k",
      };

      const result = await sendWelcomeEmail(params);

      expect(result).toBe(true);
      expect(mockNotifyOwner).toHaveBeenCalledTimes(1);
      expect(mockNotifyOwner).toHaveBeenCalledWith(
        expect.objectContaining({
          title: expect.stringContaining("New Registration: Test Investor"),
          content: expect.stringContaining("test@example.com"),
        })
      );
    });

    it("should handle email sending failures gracefully", async () => {
      const mockNotifyOwner = vi.spyOn(notificationModule, "notifyOwner");
      mockNotifyOwner.mockRejectedValue(new Error("Network error"));

      const params = {
        name: "Test Investor",
        email: "test@example.com",
        location: "New York, USA",
        investmentCapacity: "$50k-$100k",
      };

      const result = await sendWelcomeEmail(params);

      expect(result).toBe(false);
    });

    it("should include all registration details in welcome email", async () => {
      const mockNotifyOwner = vi.spyOn(notificationModule, "notifyOwner");
      mockNotifyOwner.mockResolvedValue(true);

      const params = {
        name: "Dr. Adebayo Ogunlesi",
        email: "adebayo@example.com",
        location: "London, UK",
        investmentCapacity: "$250k-$500k",
      };

      await sendWelcomeEmail(params);

      const callArgs = mockNotifyOwner.mock.calls[0][0];
      expect(callArgs.content).toContain("Dr. Adebayo Ogunlesi");
      expect(callArgs.content).toContain("adebayo@example.com");
      expect(callArgs.content).toContain("London, UK");
      expect(callArgs.content).toContain("$250k-$500k");
    });
  });

  describe("notifyAdminNewRegistration", () => {
    it("should send admin notification with registration details", async () => {
      const mockNotifyOwner = vi.spyOn(notificationModule, "notifyOwner");
      mockNotifyOwner.mockResolvedValue(true);

      const params = {
        name: "Test Investor",
        email: "test@example.com",
        location: "New York, USA",
        investmentCapacity: "$50k-$100k",
      };

      const result = await notifyAdminNewRegistration(params);

      expect(result).toBe(true);
      expect(mockNotifyOwner).toHaveBeenCalledTimes(1);
      expect(mockNotifyOwner).toHaveBeenCalledWith(
        expect.objectContaining({
          title: expect.stringContaining("New NDIG Registration"),
          content: expect.stringContaining("Test Investor"),
        })
      );
    });

    it("should include action items in admin notification", async () => {
      const mockNotifyOwner = vi.spyOn(notificationModule, "notifyOwner");
      mockNotifyOwner.mockResolvedValue(true);

      const params = {
        name: "Test Investor",
        email: "test@example.com",
        location: "New York, USA",
        investmentCapacity: "$50k-$100k",
      };

      await notifyAdminNewRegistration(params);

      const callArgs = mockNotifyOwner.mock.calls[0][0];
      expect(callArgs.content).toContain("Action Required");
      expect(callArgs.content).toContain("Review registration");
      expect(callArgs.content).toContain("Follow up");
    });

    it("should handle notification failures gracefully", async () => {
      const mockNotifyOwner = vi.spyOn(notificationModule, "notifyOwner");
      mockNotifyOwner.mockRejectedValue(new Error("Service unavailable"));

      const params = {
        name: "Test Investor",
        email: "test@example.com",
        location: "New York, USA",
        investmentCapacity: "$50k-$100k",
      };

      const result = await notifyAdminNewRegistration(params);

      expect(result).toBe(false);
    });
  });

  describe("Email Integration with Registration Flow", () => {
    it("should trigger both welcome email and admin notification on registration", async () => {
      const mockNotifyOwner = vi.spyOn(notificationModule, "notifyOwner");
      mockNotifyOwner.mockResolvedValue(true);

      const params = {
        name: "Integration Test User",
        email: "integration@example.com",
        location: "Toronto, Canada",
        investmentCapacity: "$100k-$250k",
      };

      // Simulate the registration flow
      await sendWelcomeEmail(params);
      await notifyAdminNewRegistration(params);

      // Both functions should have called notifyOwner
      expect(mockNotifyOwner).toHaveBeenCalledTimes(2);

      // First call: welcome email notification
      expect(mockNotifyOwner.mock.calls[0][0].title).toContain("New Registration");

      // Second call: admin notification
      expect(mockNotifyOwner.mock.calls[1][0].title).toContain("New NDIG Registration");
    });
  });
});
