"use client";

import { useRef, useState } from "react";

type Props = {
  name?: string;
  initialUrl?: string | null;
  label?: string;
};

export default function CloudinaryImageUpload({ name = "image_url", initialUrl = "", label = "Event image" }: Props) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "";
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "";
  const [url, setUrl] = useState(initialUrl || "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function upload(file: File) {
    setError("");
    if (!cloudName || !uploadPreset) {
      setError("Cloudinary is not configured yet. Add the Cloudinary environment variables in Vercel.");
      return;
    }
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("Please choose an image smaller than 10 MB.");
      return;
    }

    setUploading(true);
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("upload_preset", uploadPreset);
      body.append("folder", "shiftleft/events");

      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body,
      });
      const result = await response.json();
      if (!response.ok || !result.secure_url) throw new Error(result?.error?.message || "Image upload failed.");
      setUrl(String(result.secure_url));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Image upload failed.");
    } finally {
      setUploading(false);
    }
  }

  return <div style={{display:"grid",gap:10}}>
    <label>{label}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        disabled={uploading}
        onChange={e => { const file = e.target.files?.[0]; if (file) void upload(file); }}
      />
      <small>{uploading ? "Uploading to Cloudinary…" : "JPG, PNG, WEBP or GIF · max 10 MB"}</small>
    </label>
    <input type="hidden" name={name} value={url} />
    {url && <div style={{display:"grid",gap:8}}>
      <img src={url} alt="Event preview" style={{width:"100%",maxWidth:440,aspectRatio:"16/9",objectFit:"cover",borderRadius:14}} />
      <button type="button" className="button secondary" style={{width:"fit-content"}} onClick={() => { setUrl(""); if (inputRef.current) inputRef.current.value = ""; }}>Remove image</button>
    </div>}
    {error && <p style={{color:"#b42318",margin:0}}>{error}</p>}
  </div>;
}
