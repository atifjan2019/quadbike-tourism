import { prisma } from "@/lib/db";
import SettingsForm from "@/components/admin/SettingsForm";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const rows = await prisma.setting.findMany();
  const settings = Object.fromEntries(rows.map((r) => [r.key, r.value])) as Record<string, unknown>;
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold">Settings</h1>
        <p className="text-black/60 text-sm">Site-wide settings.</p>
      </div>
      <SettingsForm initial={settings} />
    </div>
  );
}
