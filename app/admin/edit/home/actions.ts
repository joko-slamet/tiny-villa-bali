"use server";

import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

export async function syncHeroSlidesAction(payload: {
  idsToDelete: string[];
  urlsToDelete: string[];
  updatedSlides: any[];
}) {
  const supabase = await createClient();

  // Service role client bypasses RLS — required for storage DELETE
  const adminSupabase = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const results = {
    deletedDb: false,
    deletedStorage: [] as string[],
    upserted: false,
    errors: [] as string[],
  };

  try {
    // 1. Delete from DB
    if (payload.idsToDelete.length > 0) {
      const { error: dbError } = await supabase
        .from("hero_slides")
        .delete()
        .in("id", payload.idsToDelete);

      if (dbError) {
        results.errors.push(`DB Error: ${dbError.message}`);
      } else {
        results.deletedDb = true;
      }
    }

    // 2. Delete from Storage using admin client (bypasses RLS)
    for (const url of payload.urlsToDelete) {
      const marker = '/public/hero-images/';
      const idx = url.indexOf(marker);
      if (idx !== -1) {
        const path = decodeURIComponent(url.substring(idx + marker.length).split('?')[0]);
        const { error: storageError } = await adminSupabase.storage
          .from('hero-images')
          .remove([path]);
        if (storageError) {
          results.errors.push(`Storage Error (${path}): ${storageError.message}`);
        } else {
          results.deletedStorage.push(path);
        }
      }
    }

    // 3. Upsert remaining slides
    if (payload.updatedSlides.length > 0) {
      // Ensure all slides have an ID to avoid "null value violates not-null constraint"
      // If a slide is new, generate a UUID for it on the server
      const now = new Date().toISOString();
      const slidesWithIds = payload.updatedSlides.map(slide => ({
        ...slide,
        id: slide.id || crypto.randomUUID(),
        created_at: slide.created_at || now,
      }));

      console.log("Upserting slides:", slidesWithIds.length);
      const { error: upsertError } = await supabase
        .from("hero_slides")
        .upsert(slidesWithIds, { onConflict: 'id' });
      
      if (upsertError) {
        results.errors.push(`Upsert Error: ${upsertError.message}`);
      } else {
        results.upserted = true;
      }
    }

    revalidatePath("/admin/edit/home");
    revalidatePath("/");
    
    return { success: results.errors.length === 0, results };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
