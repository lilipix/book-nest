import { useState } from "react";
import { Button } from "@/components/ui/button";

const UploadForm = () => {
  const [file, setFile] = useState<File | null>(null);

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/upload", {
      method: "POST",
      body: formData,
    });

    const result = await res.json();
    console.log("Réponse backend :", result);
  };

  return (
    <div>
      <>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        <Button onClick={handleUpload}>Envoyer</Button>
      </>
      {user?.profilePicture ? (
        <img
          src={`http://localhost:8080/${user.profilePicture}`}
          alt="Photo de profil"
          style={{ width: 150, borderRadius: "50%" }}
        />
      ) : (
        <p>Aucune photo de profil</p>
      )}
    </div>
  );
};

export default UploadForm;
