import SettingsContainer from "@/containers/SettingsContainer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings",
};

export default function SettingsPage() {
  return <SettingsContainer />;
}
