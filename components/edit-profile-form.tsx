
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSupabase } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function EditProfileForm({ profile, onSave, onCancel }) {
  const { supabase, user } = useSupabase();
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [region, setRegion] = useState("");
  const [comuna, setComuna] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name ?? "");
      setAddress(profile.address ?? "");
      setRegion(profile.region ?? "");
      setComuna(profile.comuna ?? "");
    }
  }, [profile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: fullName,
        address: address,
        region: region,
        comuna: comuna,
      })
      .eq("id", user.id);

    if (error) {
      console.error("Error updating user:", error);
      // Handle error appropriately
    } else {
      onSave();
      router.refresh(); // Refresh the page to get the latest user data
    }

    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="fullName">Nombre Completo</Label>
        <Input
          id="fullName"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="address">Calle y Número</Label>
        <Input
          id="address"
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="region">Región</Label>
          <Input
            id="region"
            type="text"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="comuna">Comuna</Label>
          <Input
            id="comuna"
            type="text"
            value={comuna}
            onChange={(e) => setComuna(e.target.value)}
          />
        </div>
      </div>
      <div className="flex justify-end space-x-4 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Guardando..." : "Guardar Cambios"}
        </Button>
      </div>
    </form>
  );
}
