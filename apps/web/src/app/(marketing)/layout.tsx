import { MarketingNav } from "@/components/MarketingNav"
import { MarketingFooter } from "@/components/MarketingFooter"

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-col">
      <MarketingNav />
      <main className="flex-1">{children}</main>
      <MarketingFooter />
    </div>
  )
}
