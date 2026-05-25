import Link from "next/link";
import { prisma } from "@/lib/db";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Plus, Pencil, ExternalLink } from "lucide-react";
import { format } from "date-fns";

export const dynamic = "force-dynamic";

export default async function BlogsPage() {
  const posts = await prisma.blogPost.findMany({
    orderBy: { updatedAt: "desc" },
    include: { category: { select: { name: true } } },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold">Blogs</h1>
          <p className="text-black/60 text-sm">
            {posts.length} post{posts.length === 1 ? "" : "s"}
          </p>
        </div>
        <Button href="/admin/blogs/new">
          <Plus className="w-4 h-4" />
          NEW POST
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <THead>
              <TR>
                <TH>Title</TH>
                <TH>Category</TH>
                <TH>Author</TH>
                <TH>Status</TH>
                <TH>Published</TH>
                <TH>Updated</TH>
                <TH className="text-right">Actions</TH>
              </TR>
            </THead>
            <TBody>
              {posts.length === 0 ? (
                <TR>
                  <TD className="py-10 text-center text-black/50" colSpan={7}>
                    No blog posts yet. Create your first one.
                  </TD>
                </TR>
              ) : (
                posts.map((p) => (
                  <TR key={p.id}>
                    <TD>
                      <Link href={`/admin/blogs/${p.id}`} className="font-bold hover:underline">
                        {p.title}
                      </Link>
                      <div className="text-xs text-black/50">/blog/{p.slug}/</div>
                    </TD>
                    <TD className="text-sm">{p.category?.name ?? "—"}</TD>
                    <TD>{p.author ?? "—"}</TD>
                    <TD>
                      <Badge variant={p.status === "PUBLISHED" ? "success" : "muted"}>
                        {p.status}
                      </Badge>
                    </TD>
                    <TD className="text-sm text-black/70">
                      {p.publishedAt ? format(p.publishedAt, "yyyy-MM-dd") : "—"}
                    </TD>
                    <TD className="text-sm text-black/70">
                      {format(p.updatedAt, "yyyy-MM-dd HH:mm")}
                    </TD>
                    <TD className="text-right">
                      <div className="inline-flex items-center gap-3 justify-end">
                        <Link
                          href={`/admin/blogs/${p.id}`}
                          aria-label="Edit"
                          title="Edit"
                          className="p-1.5 rounded hover:bg-black/10"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/blog/${p.slug}/`}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="View public page"
                          title="View public page"
                          className="p-1.5 rounded hover:bg-black/10"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                      </div>
                    </TD>
                  </TR>
                ))
              )}
            </TBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
