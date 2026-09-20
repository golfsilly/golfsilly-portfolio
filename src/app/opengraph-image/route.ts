import { createSocialImage } from "@/lib/social-image";

// Explicit asset route avoids root metadata inference without a root app layout.
export const dynamic = "force-static";

export function GET() {
  return createSocialImage();
}
