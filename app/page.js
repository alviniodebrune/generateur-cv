"use client";

import { useState } from "react";
import { FileText, Plus, Trash2, Download, Loader2 } from "lucide-react";

const emptyExperience = { role: "", company: "", period: "", description: "" };
const emptyEducation = { degree: "", school: "", period: "" };

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
      <input
        {...props}
        className="w-full px-3 py-2.5 border border-line rounded text-sm bg-paper"
      />
    </div>
  );
}

export default function Page() {
  const [data, setData] = useState({
    fullName: "",
    title: "",
    email: "",
    phone: "",
    address: "",
    summary: "",
    experiences: [{ ...emptyExperience }],
    education: [{ ...emptyEducation }],
    skills: "",
    languages: "",
  });
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

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

  const generatePdf = async () => {
    setError("");
    if (!data.fullName.trim()) {
      setError("Indique au moins ton nom complet.");
      return;
    }
    setGenerating(true);
    try {
      const { pdf, Document, Page, Text, View, StyleSheet, Font } = await import("@react-pdf/renderer");

      const styles = StyleSheet.create({
        page: { padding: 40, fontFamily: "Helvetica", fontSize: 10, color: "#1A1A1A" },
        header: { marginBottom: 18, borderBottom: "2 solid #1E3A5F", paddingBottom: 12 },
        name: { fontSize: 24, fontFamily: "Helvetica-Bold", color: "#1E3A5F" },
        jobTitle: { fontSize: 12, color: "#B8912F", marginTop: 2, fontFamily: "Helvetica-Bold" },
        contactRow: { flexDirection: "row", marginTop: 8, gap: 14 },
        contactItem: { fontSize: 9, color: "#5B6470" },
        section: { marginBottom: 14 },
        sectionTitle: {
          fontSize: 11,
          fontFamily: "Helvetica-Bold",
          color: "#1E3A5F",
          marginBottom: 6,
          textTransform: "uppercase",
          letterSpacing: 1,
        },
        summaryText: { fontSize: 10, lineHeight: 1.5, color: "#1A1A1A" },
        entry: { marginBottom: 9 },
        entryTop: { flexDirection: "row", justifyContent: "space-between" },
        entryRole: { fontSize: 10.5, fontFamily: "Helvetica-Bold" },
        entryPeriod: { fontSize: 9, color: "#5B6470" },
        entryCompany: { fontSize: 9.5, color: "#B8912F", marginBottom: 2 },
        entryDesc: { fontSize: 9.5, lineHeight: 1.4, color: "#333333" },
        tagsRow: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
        tag: {
          fontSize: 9,
          backgroundColor: "#F6F6F3",
          border: "1 solid #DADCD6",
          borderRadius: 3,
          paddingVertical: 3,
          paddingHorizontal: 7,
        },
      });

      const skillsList = data.skills.split(",").map((s) => s.trim()).filter(Boolean);
      const languagesList = data.languages.split(",").map((s) => s.trim()).filter(Boolean);
      const contactParts = [data.email, data.phone, data.address].filter((p) => p && p.trim());

      const doc = (
        <Document>
          <Page size="A4" style={styles.page}>
            <View style={styles.header}>
              <Text style={styles.name}>{data.fullName}</Text>
              {data.title ? <Text style={styles.jobTitle}>{data.title}</Text> : null}
              {contactParts.length > 0 && (
                <View style={styles.contactRow}>
                  {contactParts.map((c, i) => (
                    <Text key={i} style={styles.contactItem}>
                      {c}
                    </Text>
                  ))}
                </View>
              )}
            </View>

            {data.summary.trim() && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Profil</Text>
                <Text style={styles.summaryText}>{data.summary}</Text>
              </View>
            )}

            {data.experiences.some((e) => e.role || e.company) && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Expérience professionnelle</Text>
                {data.experiences
                  .filter((e) => e.role || e.company)
                  .map((e, i) => (
                    <View key={i} style={styles.entry}>
                      <View style={styles.entryTop}>
                        <Text style={styles.entryRole}>{e.role}</Text>
                        <Text style={styles.entryPeriod}>{e.period}</Text>
                      </View>
                      <Text style={styles.entryCompany}>{e.company}</Text>
                      {e.description ? <Text style={styles.entryDesc}>{e.description}</Text> : null}
                    </View>
                  ))}
              </View>
            )}

            {data.education.some((e) => e.degree || e.school) && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Formation</Text>
                {data.education
                  .filter((e) => e.degree || e.school)
                  .map((e, i) => (
                    <View key={i} style={styles.entry}>
                      <View style={styles.entryTop}>
                        <Text style={styles.entryRole}>{e.degree}</Text>
                        <Text style={styles.entryPeriod}>{e.period}</Text>
                      </View>
                      <Text style={styles.entryCompany}>{e.school}</Text>
                    </View>
                  ))}
              </View>
            )}

            {skillsList.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Compétences</Text>
                <View style={styles.tagsRow}>
                  {skillsList.map((s, i) => (
                    <Text key={i} style={styles.tag}>
                      {s}
                    </Text>
                  ))}
                </View>
              </View>
            )}

            {languagesList.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Langues</Text>
                <View style={styles.tagsRow}>
                  {languagesList.map((s, i) => (
                    <Text key={i} style={styles.tag}>
                      {s}
                    </Text>
                  ))}
                </View>
              </View>
            )}
          </Page>
        </Document>
      );

      const blob = await pdf(doc).toBlob();
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

  return (
    <div className="min-h-screen">
      <div className="bg-navy text-white px-4 py-4 flex items-center gap-2">
        <FileText size={22} className="text-gold" />
        <span className="font-display font-bold text-xl">Générateur de CV</span>
      </div>

      <div className="max-w-xl mx-auto px-4 py-6 pb-16">
        <p className="text-inksoft text-sm mb-5">
          Remplis le formulaire, ton CV est généré directement sur ton téléphone — rien n'est envoyé ni stocké en ligne.
        </p>

        <Section title="Informations personnelles">
          <Field label="NOM COMPLET" value={data.fullName} onChange={(e) => update("fullName", e.target.value)} placeholder="Alvinio Debrune" />
          <Field label="TITRE / POSTE RECHERCHÉ" value={data.title} onChange={(e) => update("title", e.target.value)} placeholder="Développeur web" />
          <Field label="E-MAIL" value={data.email} onChange={(e) => update("email", e.target.value)} placeholder="toi@email.com" type="email" />
          <Field label="TÉLÉPHONE" value={data.phone} onChange={(e) => update("phone", e.target.value)} placeholder="06 12 34 56 78" />
          <Field label="ADRESSE / VILLE" value={data.address} onChange={(e) => update("address", e.target.value)} placeholder="Paris, France" />
        </Section>

        <Section title="Profil">
          <label className="text-xs text-inksoft font-semibold block mb-1">RÉSUMÉ EN QUELQUES PHRASES</label>
          <textarea
            value={data.summary}
            onChange={(e) => update("summary", e.target.value)}
            placeholder="Décris rapidement ton profil, ton objectif professionnel..."
            rows={4}
            className="w-full px-3 py-2.5 border border-line rounded text-sm bg-paper"
          />
        </Section>

        <Section title="Expérience professionnelle">
          {data.experiences.map((exp, i) => (
            <div key={i} className="border border-line rounded p-3 mb-3 relative">
              {data.experiences.length > 1 && (
                <button onClick={() => removeExp(i)} className="absolute top-2 right-2 text-red">
                  <Trash2 size={16} />
                </button>
              )}
              <Field label="POSTE" value={exp.role} onChange={(e) => updateExp(i, "role", e.target.value)} placeholder="Développeur front-end" />
              <Field label="ENTREPRISE" value={exp.company} onChange={(e) => updateExp(i, "company", e.target.value)} placeholder="Nom de l'entreprise" />
              <Field label="PÉRIODE" value={exp.period} onChange={(e) => updateExp(i, "period", e.target.value)} placeholder="2022 - 2024" />
              <label className="text-xs text-inksoft font-semibold block mb-1">DESCRIPTION</label>
              <textarea
                value={exp.description}
                onChange={(e) => updateExp(i, "description", e.target.value)}
                rows={3}
                className="w-full px-3 py-2.5 border border-line rounded text-sm bg-paper"
                placeholder="Tes missions principales, réalisations..."
              />
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
                <button onClick={() => removeEdu(i)} className="absolute top-2 right-2 text-red">
                  <Trash2 size={16} />
                </button>
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
          <input
            value={data.skills}
            onChange={(e) => update("skills", e.target.value)}
            placeholder="JavaScript, Gestion de projet, Photoshop..."
            className="w-full px-3 py-2.5 border border-line rounded text-sm bg-paper mb-3"
          />
          <label className="text-xs text-inksoft font-semibold block mb-1">LANGUES (séparées par des virgules)</label>
          <input
            value={data.languages}
            onChange={(e) => update("languages", e.target.value)}
            placeholder="Français (natif), Anglais (courant)..."
            className="w-full px-3 py-2.5 border border-line rounded text-sm bg-paper"
          />
        </Section>

        {error && <div className="bg-red/10 text-red px-3 py-2 rounded text-sm mb-3">{error}</div>}

        <button
          onClick={generatePdf}
          disabled={generating}
          className="w-full py-3.5 bg-gold text-white rounded font-display font-bold text-base flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {generating ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
          {generating ? "Génération..." : "Télécharger mon CV en PDF"}
        </button>
      </div>
    </div>
  );
                        }
