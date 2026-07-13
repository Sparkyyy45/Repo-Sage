import { AlertTriangle } from "lucide-react";
import type { RateLimitInfo } from "@/lib/rate-limit";
import { formatResetTime } from "@/lib/rate-limit";

export function RateLimitBanner({ info }: { info: RateLimitInfo }) {
  if (!info.isLimited && !info.isNearLimit) return null;


  return (
    <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm">
      <AlertTriangle className="size-4 mt-0.5 shrink-0 text-amber-600" />
      <div>
        <p className="font-medium text-amber-800">{info.isLimited ? "GitHub API rate limit exceeded"
    : "GitHub API rate limit nearly reached"}</p>
        <p className="mt-0.5 text-amber-700/80 text-xs">{info.isLimited
    ? `GitHub API requests have been exhausted. Resets in ${formatResetTime(
        info.reset
      )}. Some data may be temporarily unavailable.`
    : `${info.remaining} of ${info.total} requests remaining.`}</p>
      </div>
    </div>
  );
}
