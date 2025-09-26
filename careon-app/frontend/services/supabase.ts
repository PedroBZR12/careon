import { createClient } from '@supabase/supabase-js'
import * as FileSystem from "expo-file-system";
// inicializa o cliente
const supabase = createClient("https://gzgmekduejldtusbxbmp.supabase.co", 
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd6Z21la2R1ZWpsZHR1c2J4Ym1wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc1Mzk1NjAsImV4cCI6MjA3MzExNTU2MH0.COUxIibr0zcJ3ZFOOS0ytNHKzBN4-YJ0gV86MA3jtfQ")

export async function uploadAvatar(userId: string, fileUri: string) {
  try {
    console.log("➡️ Iniciando upload:", { userId, fileUri });

    const fileExt = fileUri.split(".").pop() || "jpg";
    const fileName = `${userId}_${Date.now()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    // monta o FormData
    const formData = new FormData();
    formData.append("file", {
      uri: fileUri,
      name: fileName,
      type: `image/${fileExt}`,
    } as any);

    // faz upload para o Supabase
    const { error } = await supabase.storage
      .from("avatars")
      .upload(filePath, formData, {
        upsert: false,
      });

    if (error) {
      console.error("❌ Erro no upload:", error);
      throw error;
    }

    // gera URL pública
    const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
    console.log("✅ URL pública:", data.publicUrl);

    return data.publicUrl;
  } catch (err) {
    console.error("🔥 Erro inesperado:", err);
    throw err;
  }
}