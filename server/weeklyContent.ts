/**
 * The current NDIG Weekly issue. While this is null the bi-weekly cron sends nothing
 * and leaves every subscriber's schedule untouched, so no placeholder text can ever
 * reach a subscriber. Set it to { subject, bodyHtml } when an issue is ready to go out.
 */
export const currentWeekly: { subject: string; bodyHtml: string } | null = null;
