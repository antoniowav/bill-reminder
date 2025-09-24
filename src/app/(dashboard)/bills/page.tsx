import { PageHeader } from "@/components/PageHeader/PageHeader";
import BillsContainer from "@/containers/BillsContainer";

export default function BillsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Bills"
        subtitle="Track subscriptions and invoices. We’ll nudge you before renewals."
      />
      <BillsContainer />
    </div>
  );
}
