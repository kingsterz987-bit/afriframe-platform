import { useEffect, useMemo, useState } from "react";
import { ImagePlus, Loader2, Trash2, Upload, Video } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

type MediaKind = "photos" | "videos";
type MediaRow = { id: string; storage_path: string; thumbnail_path?: string | null; title: string; description: string | null; category: string | null; display_order: number };
const tableFor = (kind: MediaKind) => kind === "photos" ? "gallery_photos" : "gallery_videos";
const bucketFor = (kind: MediaKind) => kind === "photos" ? "photography" : "videos";

export default function GalleryCMS() {
  const { toast } = useToast();
  const [kind, setKind] = useState<MediaKind>("photos");
  const [rows, setRows] = useState<MediaRow[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [form, setForm] = useState({ title: "", description: "", category: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const table = useMemo(() => tableFor(kind), [kind]);

  const load = async () => {
    setLoading(true);
    const { data, error } = await (supabase as any).from(table).select("*").order("display_order").order("created_at", { ascending: false });
    if (error) toast({ title: "Gallery unavailable", description: error.message, variant: "destructive" });
    setRows((data as MediaRow[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { void load(); }, [table]);

  const save = async () => {
    if (!file || !form.title.trim()) return toast({ title: "Choose a file and title", variant: "destructive" });
    setSaving(true);
    const path = `${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "-")}`;
    const upload = await supabase.storage.from(bucketFor(kind)).upload(path, file, { upsert: false, contentType: file.type });
    if (upload.error) { toast({ title: "Upload failed", description: upload.error.message, variant: "destructive" }); setSaving(false); return; }
    const insert = await (supabase as any).from(table).insert({ storage_path: path, title: form.title.trim(), description: form.description.trim() || null, category: form.category.trim() || null, display_order: rows.length }).select().single();
    if (insert.error) { await supabase.storage.from(bucketFor(kind)).remove([path]); toast({ title: "Could not save media", description: insert.error.message, variant: "destructive" }); }
    else { setForm({ title: "", description: "", category: "" }); setFile(null); toast({ title: "Media added" }); await load(); }
    setSaving(false);
  };

  const remove = async (row: MediaRow) => {
    const result = await (supabase as any).from(table).delete().eq("id", row.id);
    if (result.error) return toast({ title: "Could not delete media", description: result.error.message, variant: "destructive" });
    await supabase.storage.from(bucketFor(kind)).remove([row.storage_path]);
    await load();
  };

  const publicUrl = (row: MediaRow) => supabase.storage.from(bucketFor(kind)).getPublicUrl(row.storage_path).data.publicUrl;

  return <main className="min-h-screen bg-background px-6 py-10 text-foreground"><div className="mx-auto max-w-6xl space-y-8">
    <header><p className="text-sm uppercase tracking-[0.25em] text-primary">Afriframe CMS</p><h1 className="mt-3 text-4xl font-semibold">Gallery library</h1><p className="mt-2 text-muted-foreground">Manage photography and video assets without changing the public site yet.</p></header>
    <Tabs value={kind} onValueChange={(value) => setKind(value as MediaKind)}><TabsList><TabsTrigger value="photos"><ImagePlus className="mr-2 h-4 w-4" />Photography</TabsTrigger><TabsTrigger value="videos"><Video className="mr-2 h-4 w-4" />Videos</TabsTrigger></TabsList>
      <TabsContent value={kind} className="space-y-6">
        <section className="grid gap-4 rounded-xl border border-border bg-card p-5 md:grid-cols-[1fr_1fr_1fr_auto]">
          <Input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <Input placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
          <Textarea className="md:col-span-1" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <div className="flex flex-col gap-2"><Input type="file" accept={kind === "photos" ? "image/*" : "video/*,image/*"} onChange={(e) => setFile(e.target.files?.[0] ?? null)} /><Button onClick={save} disabled={saving}>{saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}Add media</Button></div>
        </section>
        {loading ? <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" />Loading gallery</div> : <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{rows.map((row) => <article key={row.id} className="overflow-hidden rounded-xl border border-border bg-card"><div className="aspect-video bg-muted">{kind === "photos" ? <img src={publicUrl(row)} alt={row.title} className="h-full w-full object-cover" /> : <video src={publicUrl(row)} controls className="h-full w-full object-cover" />}</div><div className="space-y-3 p-4"><div><h2 className="font-medium">{row.title}</h2><p className="text-sm text-muted-foreground">{row.category ?? "Uncategorized"}</p></div><p className="line-clamp-2 text-sm text-muted-foreground">{row.description}</p><Button variant="destructive" size="sm" onClick={() => remove(row)}><Trash2 className="mr-2 h-4 w-4" />Delete</Button></div></article>)}</div>}
      </TabsContent></Tabs>
  </div></main>;
}
