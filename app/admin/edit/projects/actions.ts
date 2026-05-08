"use server";

import { createClient as createAdminClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

function adminClient() {
  return createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function uploadImageAction(
  formData: FormData
): Promise<{ url: string } | { error: string }> {
  const file = formData.get("file") as File | null;
  if (!file) return { error: "No file provided" };

  const supabase = adminClient();
  const ext  = file.name.split(".").pop() || "jpg";
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase.storage
    .from("project-images")
    .upload(path, file, { contentType: file.type });

  if (error) return { error: error.message };

  const { data: { publicUrl } } = supabase.storage
    .from("project-images")
    .getPublicUrl(path);

  return { url: publicUrl };
}

export async function syncProjectsAction(payload: {
  idsToDelete: string[];
  urlsToDelete: string[];
  updatedProjects: any[];
}) {
  const supabase = adminClient();

  const results = {
    deletedDb: false,
    deletedStorage: [] as string[],
    upserted: false,
    errors: [] as string[],
  };

  try {
    if (payload.idsToDelete.length > 0) {
      const { error } = await supabase
        .from("projects")
        .delete()
        .in("id", payload.idsToDelete);
      if (error) results.errors.push(`DB delete error: ${error.message}`);
      else results.deletedDb = true;
    }

    if (payload.urlsToDelete.length > 0) {
      const paths = payload.urlsToDelete
        .filter((u) => u.includes("/storage/v1/object/public/project-images/"))
        .map((u) => {
          const parts = u.split("/project-images/");
          return parts[1] ?? "";
        })
        .filter(Boolean);

      if (paths.length > 0) {
        const { error } = await supabase.storage
          .from("project-images")
          .remove(paths);
        if (error) results.errors.push(`Storage error: ${error.message}`);
        else results.deletedStorage = paths;
      }
    }

    if (payload.updatedProjects.length > 0) {
      const { error } = await supabase
        .from("projects")
        .upsert(payload.updatedProjects, { onConflict: "id" });
      if (error) results.errors.push(`Upsert error: ${error.message}`);
      else results.upserted = true;
    }

    revalidatePath("/projects");
    revalidatePath("/projectv2");

    return { success: results.errors.length === 0, results };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function deleteProjectAction(id: string, allImageUrls: string[]) {
  const supabase = adminClient();

  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) return { success: false, error: error.message };

  const paths = allImageUrls
    .filter((u) => u?.includes("/storage/v1/object/public/project-images/"))
    .map((u) => u.split("/project-images/")[1])
    .filter(Boolean);

  if (paths.length > 0) {
    await supabase.storage.from("project-images").remove(paths);
  }

  revalidatePath("/projects");
  revalidatePath("/projectv2");
  return { success: true };
}
