"use client";

import { useMemo, useState, useTransition } from "react";
import type { Dispatch, SetStateAction } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Loader2, Megaphone, Tag } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  createPromotion,
  updatePromotion,
  deletePromotion,
} from "@/lib/actions/promotion.actions";
import type { PromotionRecord } from "@/lib/actions/promotion.actions";
import { formatDateTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import DeleteDialog from "@/components/shared/delete-dialog";
import { UploadButton } from "@/lib/uploadThing";

type PromotionDraft = {
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  ctaLabel: string;
  ctaUrl: string;
  type: "OFFER" | "ADVERTISEMENT";
  placement: "HOME" | "OFFERS" | "BOTH";
  priority: string;
  isActive: boolean;
  startsAt: string;
  endsAt: string;
};

const EMPTY_DRAFT: PromotionDraft = {
  title: "",
  subtitle: "",
  description: "",
  imageUrl: "",
  ctaLabel: "",
  ctaUrl: "",
  type: "OFFER",
  placement: "BOTH",
  priority: "0",
  isActive: true,
  startsAt: "",
  endsAt: "",
};

const toDateInput = (value: string | Date | null) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 16);
};

const toDraft = (promotion: PromotionRecord): PromotionDraft => ({
  title: promotion.title ?? "",
  subtitle: promotion.subtitle ?? "",
  description: promotion.description ?? "",
  imageUrl: promotion.imageUrl ?? "",
  ctaLabel: promotion.ctaLabel ?? "",
  ctaUrl: promotion.ctaUrl ?? "",
  type: promotion.type,
  placement: promotion.placement,
  priority: String(promotion.priority ?? 0),
  isActive: Boolean(promotion.isActive),
  startsAt: toDateInput(promotion.startsAt),
  endsAt: toDateInput(promotion.endsAt),
});

const toPayload = (draft: PromotionDraft) => ({
  title: draft.title,
  subtitle: draft.subtitle || null,
  description: draft.description || null,
  imageUrl: draft.imageUrl || null,
  ctaLabel: draft.ctaLabel || null,
  ctaUrl: draft.ctaUrl || null,
  type: draft.type,
  placement: draft.placement,
  priority: Number.parseInt(draft.priority || "0", 10),
  isActive: draft.isActive,
  startsAt: draft.startsAt ? new Date(draft.startsAt) : null,
  endsAt: draft.endsAt ? new Date(draft.endsAt) : null,
});

function DraftFields({
  draft,
  setDraft,
  isPending,
  onUploadError,
}: {
  draft: PromotionDraft;
  setDraft: Dispatch<SetStateAction<PromotionDraft>>;
  isPending: boolean;
  onUploadError: (message: string) => void;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="space-y-2">
        <label className="text-sm font-medium">Title</label>
        <Input
          value={draft.title}
          onChange={(e) => setDraft((prev) => ({ ...prev, title: e.target.value }))}
          placeholder="Weekend Mega Pizza Deal"
          disabled={isPending}
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Subtitle</label>
        <Input
          value={draft.subtitle}
          onChange={(e) =>
            setDraft((prev) => ({ ...prev, subtitle: e.target.value }))
          }
          placeholder="Limited time only"
          disabled={isPending}
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Type</label>
        <select
          className="h-10 w-full rounded-md border bg-background px-3 text-sm"
          value={draft.type}
          onChange={(e) =>
            setDraft((prev) => ({
              ...prev,
              type: e.target.value as PromotionDraft["type"],
            }))
          }
          disabled={isPending}
        >
          <option value="OFFER">Offer</option>
          <option value="ADVERTISEMENT">Advertisement</option>
        </select>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Placement</label>
        <select
          className="h-10 w-full rounded-md border bg-background px-3 text-sm"
          value={draft.placement}
          onChange={(e) =>
            setDraft((prev) => ({
              ...prev,
              placement: e.target.value as PromotionDraft["placement"],
            }))
          }
          disabled={isPending}
        >
          <option value="HOME">Home</option>
          <option value="OFFERS">Offers Page</option>
          <option value="BOTH">Both</option>
        </select>
      </div>
      <div className="upload-field space-y-2 md:col-span-2">
        <label className="text-sm font-medium">Images</label>
        <Card>
          <CardContent className="space-y-2 mt-2 min-h-48">
            {draft.imageUrl ? (
              <div className="space-y-3">
                <Image
                  src={draft.imageUrl}
                  alt="Promotion image"
                  width={1280}
                  height={720}
                  className="w-full max-h-64 rounded-md object-cover border"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() =>
                    setDraft((prev) => ({
                      ...prev,
                      imageUrl: "",
                    }))
                  }
                  disabled={isPending}
                >
                  Remove Image
                </Button>
              </div>
            ) : (
              <UploadButton
                endpoint="imageUploader"
                onClientUploadComplete={(res: { url: string }[]) => {
                  if (!res?.[0]?.url) return;
                  setDraft((prev) => ({
                    ...prev,
                    imageUrl: res[0].url,
                  }));
                }}
                onUploadError={(error: Error) => {
                  onUploadError(error.message);
                }}
              />
            )}
            {/* <Input
              value={draft.imageUrl}
              onChange={(e) =>
                setDraft((prev) => ({ ...prev, imageUrl: e.target.value }))
              }
              placeholder="Or paste image URL manually"
              disabled={isPending}
            /> */}
          </CardContent>
        </Card>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Priority</label>
        <Input
          type="number"
          value={draft.priority}
          onChange={(e) =>
            setDraft((prev) => ({ ...prev, priority: e.target.value }))
          }
          min={0}
          max={1000}
          disabled={isPending}
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">CTA Label</label>
        <Input
          value={draft.ctaLabel}
          onChange={(e) =>
            setDraft((prev) => ({ ...prev, ctaLabel: e.target.value }))
          }
          placeholder="Order Now"
          disabled={isPending}
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">CTA URL</label>
        <Input
          value={draft.ctaUrl}
          onChange={(e) => setDraft((prev) => ({ ...prev, ctaUrl: e.target.value }))}
          placeholder="https://..."
          disabled={isPending}
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Starts At</label>
        <Input
          type="datetime-local"
          value={draft.startsAt}
          onChange={(e) =>
            setDraft((prev) => ({ ...prev, startsAt: e.target.value }))
          }
          disabled={isPending}
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Ends At</label>
        <Input
          type="datetime-local"
          value={draft.endsAt}
          onChange={(e) => setDraft((prev) => ({ ...prev, endsAt: e.target.value }))}
          disabled={isPending}
        />
      </div>
      <div className="space-y-2 md:col-span-2">
        <label className="text-sm font-medium">Description</label>
        <Textarea
          value={draft.description}
          onChange={(e) =>
            setDraft((prev) => ({ ...prev, description: e.target.value }))
          }
          placeholder="Add campaign details customers should know."
          className="min-h-24"
          disabled={isPending}
        />
      </div>
      <div className="flex items-center gap-2 md:col-span-2">
        <Checkbox
          checked={draft.isActive}
          onCheckedChange={(checked) =>
            setDraft((prev) => ({ ...prev, isActive: checked === true }))
          }
          disabled={isPending}
        />
        <span className="text-sm">Active and visible to customers</span>
      </div>
    </div>
  );
}

const PromotionManager = ({
  initialPromotions,
}: {
  initialPromotions: PromotionRecord[];
}) => {
  const { toast } = useToast();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [createDraft, setCreateDraft] = useState<PromotionDraft>(EMPTY_DRAFT);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<PromotionDraft>(EMPTY_DRAFT);
  const handleUploadError = (message: string) => {
    toast({
      variant: "destructive",
      description: `Upload failed: ${message}`,
    });
  };

  const promotions = useMemo(
    () =>
      [...initialPromotions].sort((a, b) => {
        if (b.priority !== a.priority) return b.priority - a.priority;
        return (
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
      }),
    [initialPromotions]
  );

  const onCreate = () => {
    startTransition(async () => {
      const res = await createPromotion(toPayload(createDraft));
      toast({
        variant: res.success ? "default" : "destructive",
        description: res.message,
      });
      if (res.success) {
        setCreateDraft(EMPTY_DRAFT);
        router.refresh();
      }
    });
  };

  const onStartEdit = (promotion: PromotionRecord) => {
    setEditingId(promotion.id);
    setEditDraft(toDraft(promotion));
  };

  const onSaveEdit = () => {
    if (!editingId) return;
    startTransition(async () => {
      const res = await updatePromotion({
        id: editingId,
        ...toPayload(editDraft),
      });
      toast({
        variant: res.success ? "default" : "destructive",
        description: res.message,
      });
      if (res.success) {
        setEditingId(null);
        setEditDraft(EMPTY_DRAFT);
        router.refresh();
      }
    });
  };

  return (
    <div className="space-y-8">
      <div className="rounded-xl border p-4 md:p-6 space-y-4">
        <h2 className="text-xl font-semibold inline-flex items-center gap-2">
          <Tag className="h-5 w-5 text-red-500" />
          Create Promotion
        </h2>
        <DraftFields
          draft={createDraft}
          setDraft={setCreateDraft}
          isPending={isPending}
          onUploadError={handleUploadError}
        />
        <Button
          onClick={onCreate}
          disabled={isPending || createDraft.title.trim().length < 3}
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Megaphone className="h-4 w-4" />
          )}
          Save Promotion
        </Button>
      </div>

      {editingId && (
        <div className="rounded-xl border p-4 md:p-6 space-y-4 bg-muted/20">
          <h2 className="text-xl font-semibold">Edit Promotion</h2>
          <DraftFields
            draft={editDraft}
            setDraft={setEditDraft}
            isPending={isPending}
            onUploadError={handleUploadError}
          />
          <div className="flex gap-2">
            <Button
              onClick={onSaveEdit}
              disabled={isPending || editDraft.title.trim().length < 3}
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Update Promotion"
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setEditingId(null);
                setEditDraft(EMPTY_DRAFT);
              }}
              disabled={isPending}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      <div className="rounded-xl border p-4 md:p-6">
        <h2 className="text-xl font-semibold mb-4">All Promotions</h2>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Placement</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Schedule</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead className="w-[220px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {promotions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground">
                    No promotions yet. Create your first offer or ad above.
                  </TableCell>
                </TableRow>
              )}
              {promotions.map((promotion) => (
                <TableRow key={promotion.id}>
                  <TableCell>
                    <div className="font-medium">{promotion.title}</div>
                    {promotion.subtitle && (
                      <div className="text-xs text-muted-foreground">
                        {promotion.subtitle}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={promotion.type === "OFFER" ? "default" : "secondary"}>
                      {promotion.type}
                    </Badge>
                  </TableCell>
                  <TableCell>{promotion.placement}</TableCell>
                  <TableCell>{promotion.priority}</TableCell>
                  <TableCell>
                    <Badge variant={promotion.isActive ? "default" : "outline"}>
                      {promotion.isActive ? "Active" : "Paused"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs">
                    <div>
                      {promotion.startsAt
                        ? `From ${formatDateTime(promotion.startsAt).dateTime}`
                        : "Starts anytime"}
                    </div>
                    <div>
                      {promotion.endsAt
                        ? `To ${formatDateTime(promotion.endsAt).dateTime}`
                        : "No end date"}
                    </div>
                  </TableCell>
                  <TableCell>{formatDateTime(promotion.updatedAt).dateTime}</TableCell>
                  <TableCell className="whitespace-nowrap">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onStartEdit(promotion)}
                      disabled={isPending}
                    >
                      Edit
                    </Button>
                    <DeleteDialog id={promotion.id} action={deletePromotion} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default PromotionManager;
