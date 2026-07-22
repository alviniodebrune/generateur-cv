"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";
import { TEMPLATES, buildDocument } from "../lib/templates";
import { FileText, Plus, Trash2, Download, Loader2, ArrowLeftRight, Save, Camera, X } from "lucide-react";

const emptyExperience = { role: "", company: "", period: "", description: "" };
const emptyEducation = { degree: "", school: "", period: "" };
const emptyData = {
  fullName: "", title: "", email: "", phone: "", address: "", summary: "",
  experiences: [{ ...emptyExperience }],
  education: [{ ...emptyEducation }],
  skills: "", languages: "",
};

function Section({ title, children }) {
  return (
    <div className="bg-white border border-line rounded p-5 mb-4">
      <h2 className="font-display font-bold text-xl text-navy mb-3">{title}</h2>
      {children}
    </div>
  );
}

function Field({ label, ...props }) {
  return (
    <div className="mb-3">
      <label className="text-xs text-inksoft font-semibold block mb-1">{label}</label>
      <input {...props} className="w-full px-3 py-2.5 border border-line rounded text-sm bg-paper" />
    </div>
  );
}

export default function Page() {
  const [session, setSession] = useState(undefined);
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  const [data, setData] = useState(emptyData);
  const [templateId, setTemplateId] = useState("chronologique-bleu-marine");
  const [photoSrc, setPhotoSrc] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saveMsg, setSaveMsg] = useState("");
  const [loadingCv, setLoadingCv] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, sess) => setSession(sess ?? null));
    return () => sub.subscription.unsubscribe();
  }, []);

  const loadCv = useCallback(async (userId) => {
    setLoadingCv(true);
    try {
      const { data: row, error: err } = await supabase.from("cvs").select("*").eq("user_id", userId).maybeSingle();
      if (err) throw err;
      if (row) {
        setData({ ...emptyData, ...row.data });
        setTemplateId(row.template || "chronologique-bleu-marine");
        setPhotoSrc(row.data?.photoDataUrl || null);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingCv(false);
    }
  }, []);

  useEffect(() => {
    if (session?.user) loadCv(session.user.id);
  }, [session, loadCv]);

  const signUp = async () => {
    setAuthError("");
    if (!email.trim() || !password) {
      setAuthError("Renseigne ton e-mail et ton mot de passe.");
      return;
    }
    setAuthLoading(true);
    const { error: err } = await supabase.auth.signUp({ email: email.trim(), password });
    setAuthLoading(false);
    if (err) {
      setAuthError(err.message);
      return;
    }
    setAuthError("Compte créé. Si la confirmation par e-mail est activée, vérifie ta boîte mail avant de te connecter.");
  };

  const logIn = async () => {
    setAuthError("");
    if (!email.trim() || !password) {
      setAuthError("Renseigne ton e-mail et ton mot de passe.");
      return;
    }
    setAuthLoading(true);
    const { error: err } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setAuthLoading(false);
    if (err) setAuthError("Connexion impossible : " + err.message);
  };

  const logOut = async () => {
    await supabase.auth.signOut();
    setData(emptyData);
    setPhotoSrc(null);
    setTemplateId("chronologique-bleu-marine");
  };

  const update = (field, value) => setData((d) => ({ ...d, [field]: value }));

  const updateExp = (i, field, value) =>
    setData((d) => {
      const experiences = [...d.experiences];
      experiences[i] = { ...experiences[i], [field]: value };
      return { ...d, experiences };
    });
  const addExp = () => setData((d) => ({ ...d, experiences: [...d.experiences, { ...emptyExperience }] }));
  const removeExp = (i) => setData((d) => ({ ...d, experiences: d.experiences.filter((_, idx) => idx !== i) }));

  const updateEdu = (i, field, value) =>
    setData((d) => {
      const education = [...d.education];
      education[i] = { ...education[i], [field]: value };
      return { ...d, education };
    });
  const addEdu = () => setData((d) => ({ ...d, education: [...d.education, { ...emptyEducation }] }));
  const removeEdu = (i) => setData((d) => ({ ...d, education: d.education.filter((_, idx) => idx !== i) }));

  const handlePhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhotoSrc(reader.result);
    reader.readAsDataURL(file);
  };

  const saveCv = async () => {
    if (!session?.user) return;
    setSaving(true);
    setSaveMsg("");
    try {
      const payload = { ...data, photoDataUrl: photoSrc };
      const { error: err } = await supabase
        .from("cvs")
        .upsert({ user_id: session.user.id, template: templateId, data: payload, updated_at: new Date().toISOString() });
      if (err) throw err;
      setSaveMsg("CV enregistré.");
    } catch (e) {
      setSaveMsg("Échec de l'enregistrement : " + e.message);
    } finally {
      setSaving(false);
    }
  };

  const generatePdf = async () => {
    setError("");
    if (!data.fullName.trim()) {
      setError("Indique au moins ton nom complet.");
      return;
    }
    setGenerating(true);
    try {
      const mod = await import("@react-pdf/renderer");
      const doc = buildDocument(mod, templateId, data, photoSrc);
      const blob = await mod.pdf(doc).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `CV-${data.fullName.trim().replace(/\s+/g, "-") || "sans-nom"}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      setError("La génération du PDF a échoué. Réessaie.");
    } finally {
      setGenerating(false);
    }
  };

  if (session === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-inksoft" size={28} />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center p-5">
        <div className="bg-white border border-line rounded max-w-sm w-full p-7">
          <div className="flex justify-center mb-2">
            <FileText size={28} className="text-gold" />
          </div>
          <h1 className="font-display font-bold text-2xl text-center text-navy mb-1">Générateur de CV</h1>
          <p className="text-center text-inksoft text-sm mb-5">Crée un compte pour sauvegarder ton CV et le reprendre plus tard.</p>

          <div className="flex gap-2 mb-4">
            <button onClick={() => setMode("login")} className={`flex-1 py-2 rounded text-sm font-display font-bold border ${mode === "login" ? "bg-navy text-white border-navy" : "bg-white text-ink border-line"}`}>
              CONNEXION
            </button>
            <button onClick={() => setMode("signup")} className={`flex-1 py-2 rounded text-sm font-display font-bold border ${mode === "signup" ? "bg-navy text-white border-navy" : "bg-white text-ink border-line"}`}>
              INSCRIPTION
            </button>
          </div>

          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-mail" type="email" className="w-full px-3 py-3 border border-line rounded text-sm mb-3 bg-paper" />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mot de passe"
            type="password"
            onKeyDown={(e) => e.key === "Enter" && (mode === "login" ? logIn() : signUp())}
            className="w-full px-3 py-3 border border-line rounded text-sm mb-3 bg-paper"
          />

          <button onClick={mode === "login" ? logIn : signUp} disabled={authLoading} className="w-full py-3 bg-gold text-white rounded font-display font-bold text-lg flex items-center justify-center gap-2 disabled:opacity-60">
            {authLoading ? <Loader2 size={18} className="animate-spin" /> : <ArrowLeftRight size={18} />}
            {mode === "login" ? "SE CONNECTER" : "CRÉER MON COMPTE"}
          </button>

          {authError && <p className="text-red text-sm mt-3 text-center">{authError}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="bg-navy text-white px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText size={22} className="text-gold" />
          <span className="font-display font-bold text-xl">Générateur de CV</span>
        </div>
        <button onClick={logOut} className="text-xs opacity-70">{session.user.email} · quitter</button>
      </div>

      <div className="max-w-xl mx-auto px-4 py-6 pb-16">
        {loadingCv && (
          <div className="flex items-center gap-2 text-inksoft text-sm mb-4">
            <Loader2 size={14} className="animate-spin" /> Chargement de ton CV...
          </div>
        )}

        <Section title="Modèle de CV">
          <div className="grid grid-cols-2 gap-2">
            {TEMPLATES.map((t) => (
              <button
                key={t.id}
                onClick={() => setTemplateId(t.id)}
                className={`p-3 rounded border text-left ${templateId === t.id ? "border-navy" : "border-line"}`}
                style={{ borderWidth: templateId === t.id ? 2 : 1 }}
              >
                <div className="w-full h-3 rounded mb-2" style={{ backgroundColor: t.color }} />
                <span className="text-xs font-semibold">{t.label}</span>
              </button>
            ))}
          </div>
        </Section>

        <Section title="Photo (optionnelle)">
          {photoSrc ? (
            <div className="flex items-center gap-3">
              <img src={photoSrc} alt="Photo de profil" className="w-16 h-16 rounded-full object-cover border border-line" />
              <button onClick={() => setPhotoSrc(null)} className="flex items-center gap-1 text-red text-sm border border-red rounded px-2.5 py-1.5">
                <X size={14} /> Retirer
              </button>
            </div>
          ) : (
            <label className="flex items-center gap-2 border border-dashed border-navy text-navy rounded px-3 py-2.5 text-sm font-semibold w-fit cursor-pointer">
              <Camera size={16} /> Choisir une photo
              <input type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
            </label>
          )}
        </Section>

        <Section title="Informations personnelles">
          <Field label="NOM COMPLET" value={data.fullName} onChange={(e) => update("fullName", e.target.value)} placeholder="Alvinio Debrune" />
          <Field label="TITRE / POSTE RECHERCHÉ" value={data.title} onChange={(e) => update("title", e.target.value)} placeholder="Développeur web" />
          <Field label="E-MAIL" value={data.email} onChange={(e) => update("email", e.target.value)} placeholder="toi@email.com" type="email" />
          <Field label="TÉLÉPHONE" value={data.phone} onChange={(e) => update("phone", e.target.value)} placeholder="06 12 34 56 78" />
          <Field label="ADRESSE / VILLE" value={data.address} onChange={(e) => update("address", e.target.value)} placeholder="Paris, France" />
        </Section>

        <Section title="Profil">
          <label className="text-xs text-inksoft font-semibold block mb-1">RÉSUMÉ EN QUELQUES PHRASES</label>
          <textarea value={data.summary} onChange={(e) => update("summary", e.target.value)} rows={4} className="w-full px-3 py-2.5 border border-line rounded text-sm bg-paper" placeholder="Décris rapidement ton profil, ton objectif professionnel..." />
        </Section>

        <Section title="Expérience professionnelle">
          {data.experiences.map((exp, i) => (
            <div key={i} className="border border-line rounded p-3 mb-3 relative">
              {data.experiences.length > 1 && (
                <button onClick={() => removeExp(i)} className="absolute top-2 right-2 text-red"><Trash2 size={16} /></button>
              )}
              <Field label="POSTE" value={exp.role} onChange={(e) => updateExp(i, "role", e.target.value)} placeholder="Développeur front-end" />
              <Field label="ENTREPRISE" value={exp.company} onChange={(e) => updateExp(i, "company", e.target.value)} placeholder="Nom de l'entreprise" />
              <Field label="PÉRIODE" value={exp.period} onChange={(e) => updateExp(i, "period", e.target.value)} placeholder="2022 - 2024" />
              <label className="text-xs text-inksoft font-semibold block mb-1">DESCRIPTION</label>
              <textarea value={exp.description} onChange={(e) => updateExp(i, "description", e.target.value)} rows={3} className="w-full px-3 py-2.5 border border-line rounded text-sm bg-paper" placeholder="Tes missions principales, réalisations..." />
            </div>
          ))}
          <button onClick={addExp} className="flex items-center gap-1.5 text-navy text-sm font-semibold border border-dashed border-navy rounded px-3 py-2">
            <Plus size={15} /> Ajouter une expérience
          </button>
        </Section>

        <Section title="Formation">
          {data.education.map((edu, i) => (
            <div key={i} className="border border-line rounded p-3 mb-3 relative">
              {data.education.length > 1 && (
                <button onClick={() => removeEdu(i)} className="absolute top-2 right-2 text-red"><Trash2 size={16} /></button>
              )}
              <Field label="DIPLÔME" value={edu.degree} onChange={(e) => updateEdu(i, "degree", e.target.value)} placeholder="Master en informatique" />
              <Field label="ÉTABLISSEMENT" value={edu.school} onChange={(e) => updateEdu(i, "school", e.target.value)} placeholder="Nom de l'école" />
              <Field label="PÉRIODE" value={edu.period} onChange={(e) => updateEdu(i, "period", e.target.value)} placeholder="2019 - 2022" />
            </div>
          ))}
          <button onClick={addEdu} className="flex items-center gap-1.5 text-navy text-sm font-semibold border border-dashed border-navy rounded px-3 py-2">
            <Plus size={15} /> Ajouter une formation
          </button>
        </Section>

        <Section title="Compétences & langues">
          <label className="text-xs text-inksoft font-semibold block mb-1">COMPÉTENCES (séparées par des virgules)</label>
          <input value={data.skills} onChange={(e) => update("skills", e.target.value)} placeholder="JavaScript, Gestion de projet, Photoshop..." className="w-full px-3 py-2.5 border border-line rounded text-sm bg-paper mb-3" />
          <label className="text-xs text-inksoft font-semibold block mb-1">LANGUES (séparées par des virgules)</label>
          <input value={data.languages} onChange={(e) => update("languages", e.target.value)} placeholder="Français (natif), Anglais (courant)..." className="w-full px-3 py-2.5 border border-line rounded text-sm bg-paper" />
        </Section>

        {error && <div className="bg-red/10 text-red px-3 py-2 rounded text-sm mb-3">{error}</div>}
        {saveMsg && <div className="bg-navy/10 text-navy px-3 py-2 rounded text-sm mb-3">{saveMsg}</div>}

        <div className="flex gap-2">
          <button onClick={saveCv} disabled={saving} className="flex-1 py-3.5 bg-white border border-navy text-navy rounded font-display font-bold text-base flex items-center justify-center gap-2 disabled:opacity-70">
            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            Enregistrer
          </button>
          <button onClick={generatePdf} disabled={generating} className="flex-1 py-3.5 bg-gold text-white rounded font-display font-bold text-base flex items-center justify-center gap-2 disabled:opacity-70">
            {generating ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
            Télécharger
          </button>
        </div>
      </div>
    </div>
  );
  }
