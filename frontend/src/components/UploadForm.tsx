import { useState } from "react";

import { useQuery } from "@apollo/client";

import { queryWhoAmI } from "@/api/WhoAmI";

import { Button } from "@/components/ui/button";

const UploadForm = () => {
  const [file, setFile] = useState<File | null>(null);

  const { data: whoAmIData, loading, refetch } = useQuery(queryWhoAmI);
  const me = whoAmIData?.whoami;
  if (loading) return <p>Chargement...</p>;
  if (!me) return;

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/upload", {
      method: "POST",
      body: formData,
    });

    await refetch();
    if (!res.ok) {
      console.error("Erreur lors de l'envoi du fichier");
      return;
    }
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
      {me?.profilePicture ? (
        <img
          src={`http://localhost:8080/${me.profilePicture}`}
          alt="Photo de profil"
          style={{ width: 50, height: 50, borderRadius: "50%" }}
        />
      ) : (
        <p>Aucune photo de profil</p>
      )}
    </div>
  );
};

export default UploadForm;
