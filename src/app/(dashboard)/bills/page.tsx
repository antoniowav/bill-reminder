import BillsContainer from "@/containers/BillsContainer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bills",
};
export default function BillsPage() {
  return (
    <div className="space-y-6">
      <BillsContainer />
    </div>
  );
}
