import { prisma } from "@/lib/db";
import FAQManager from "@/components/admin/FAQManager";

export const dynamic = "force-dynamic";

export default async function FAQAdminPage() {
  const items = await prisma.fAQ.findMany({ orderBy: { order: "asc" } });
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold">FAQ</h1>
        <p className="text-black/60 text-sm">Questions shown on the homepage accordion.</p>
      </div>
      <FAQManager
        initial={items.map((f) => ({ id: f.id, question: f.question, answer: f.answer, order: f.order }))}
      />
    </div>
  );
}
