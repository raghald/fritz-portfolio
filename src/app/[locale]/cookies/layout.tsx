import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy - Fritz Glowacki",
  description: "Learn how we use cookies on our site and how you can manage your preferences.",
};

export default function CookiePolicyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
