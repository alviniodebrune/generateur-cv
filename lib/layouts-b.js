import { prepareData } from "./layouts-a";

export function layoutMinimaliste(C, data, photoSrc, A) {
  const { Document, Page, Text, View, StyleSheet } = C;
  const { skillsList, languagesList, experiences, education, contactParts } = prepareData(data);
  const s = StyleSheet.create({
    page: { padding: 44, fontFamily: "Helvetica", fontSize: 10, color: "#1A1A1A" },
    name: { fontSize: 20, fontFamily: "Helvetica-Bold" },
    jobTitle: { fontSize: 11, color: A, marginTop: 2 },
    contactRow: { flexDirection: "row", marginTop: 8, gap: 14, flexWrap: "wrap", borderBottom: "0.5 solid #CCCCCC", paddingBottom: 12, marginBottom: 16 },
    contactItem: { fontSize: 9, color: "#444444" },
    section: { marginBottom: 13 },
    sectionTitle: { fontSize: 10.5, fontFamily: "Helvetica-Bold", color: "#1A1A1A", marginBottom: 6, textTransform: "uppercase", letterSpacing: 1.2, borderBottom: `1 solid ${A}`, paddingBottom: 3, width: 200 },
    summaryText: { fontSize: 10, lineHeight: 1.5 },
    entry: { marginBottom: 8 },
    entryTop: { flexDirection: "row", justifyContent: "space-between" },
    entryRole: { fontSize: 10, fontFamily: "Helvetica-Bold" },
    entryPeriod: { fontSize: 9, color: "#666666" },
    entryCompany: { fontSize: 9.5, color: "#444444", marginBottom: 2 },
    entryDesc: { fontSize: 9.5, lineHeight: 1.4 },
    plainLine: { fontSize: 9.5, lineHeight: 1.6 },
  });
  return (
    <Document>
      <Page size="A4" style={s.page}>
        <Text style={s.name}>{data.fullName}</Text>
        {data.title ? <Text style={s.jobTitle}>{data.title}</Text> : null}
        {contactParts.length > 0 && <View style={s.contactRow}>{contactParts.map((c, i) => <Text key={i} style={s.contactItem}>{c}</Text>)}</View>}
        {data.summary?.trim() && <View style={s.section}><Text style={s.sectionTitle}>Profil</Text><Text style={s.summaryText}>{data.summary}</Text></View>}
        {experiences.length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Expérience professionnelle</Text>
            {experiences.map((e, i) => (
              <View key={i} style={s.entry}>
                <View style={s.entryTop}><Text style={s.entryRole}>{e.role}</Text><Text style={s.entryPeriod}>{e.period}</Text></View>
                <Text style={s.entryCompany}>{e.company}</Text>
                {e.description ? <Text style={s.entryDesc}>{e.description}</Text> : null}
              </View>
            ))}
          </View>
        )}
        {education.length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Formation</Text>
            {education.map((e, i) => (
              <View key={i} style={s.entry}>
                <View style={s.entryTop}><Text style={s.entryRole}>{e.degree}</Text><Text style={s.entryPeriod}>{e.period}</Text></View>
                <Text style={s.entryCompany}>{e.school}</Text>
              </View>
            ))}
          </View>
        )}
        {skillsList.length > 0 && <View style={s.section}><Text style={s.sectionTitle}>Compétences</Text><Text style={s.plainLine}>{skillsList.join(", ")}</Text></View>}
        {languagesList.length > 0 && <View style={s.section}><Text style={s.sectionTitle}>Langues</Text><Text style={s.plainLine}>{languagesList.join(", ")}</Text></View>}
      </Page>
    </Document>
  );
}

// ---------- Layout 6 : Timeline moderne ----------
export function layoutTimeline(C, data, photoSrc, A) {
  const { Document, Page, Text, View, StyleSheet, Image } = C;
  const { skillsList, languagesList, experiences, education, contactParts } = prepareData(data);
  const s = StyleSheet.create({
    page: { padding: 40, fontFamily: "Helvetica", fontSize: 10, color: "#1A1A1A" },
    header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 20 },
    name: { fontSize: 22, fontFamily: "Helvetica-Bold", color: A },
    jobTitle: { fontSize: 11.5, color: "#5B6470", marginTop: 2 },
    contactRow: { flexDirection: "row", marginTop: 6, gap: 12, flexWrap: "wrap" },
    contactItem: { fontSize: 9, color: "#5B6470" },
    photo: { width: 64, height: 64, borderRadius: 32 },
    section: { marginBottom: 16 },
    sectionTitle: { fontSize: 11, fontFamily: "Helvetica-Bold", color: A, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 },
    summaryText: { fontSize: 10, lineHeight: 1.5 },
    tlEntry: { flexDirection: "row", marginBottom: 10 },
    tlMarker: { width: 12, alignItems: "center" },
    tlDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: A, marginTop: 3 },
    tlLine: { width: 1.5, flexGrow: 1, backgroundColor: "#DADCD6", marginTop: 2 },
    tlBody: { flex: 1, paddingLeft: 10 },
    entryTop: { flexDirection: "row", justifyContent: "space-between" },
    entryRole: { fontSize: 10.5, fontFamily: "Helvetica-Bold" },
    entryPeriod: { fontSize: 9, color: "#5B6470" },
    entryCompany: { fontSize: 9.5, color: A, marginBottom: 2 },
    entryDesc: { fontSize: 9.5, lineHeight: 1.4, color: "#333333" },
    tagsRow: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
    tag: { fontSize: 9, backgroundColor: "#F6F6F3", border: "1 solid #DADCD6", borderRadius: 3, paddingVertical: 3, paddingHorizontal: 7 },
  });
  const renderTimeline = (items, getTitle, getSub) =>
    items.map((e, i) => (
      <View key={i} style={s.tlEntry}>
        <View style={s.tlMarker}>
          <View style={s.tlDot} />
          {i < items.length - 1 ? <View style={s.tlLine} /> : null}
        </View>
        <View style={s.tlBody}>
          <View style={s.entryTop}><Text style={s.entryRole}>{getTitle(e)}</Text><Text style={s.entryPeriod}>{e.period}</Text></View>
          <Text style={s.entryCompany}>{getSub(e)}</Text>
          {e.description ? <Text style={s.entryDesc}>{e.description}</Text> : null}
        </View>
      </View>
    ));
  return (
    <Document>
      <Page size="A4" style={s.page}>
        <View style={s.header}>
          <View>
            <Text style={s.name}>{data.fullName}</Text>
            {data.title ? <Text style={s.jobTitle}>{data.title}</Text> : null}
            {contactParts.length > 0 && <View style={s.contactRow}>{contactParts.map((c, i) => <Text key={i} style={s.contactItem}>{c}</Text>)}</View>}
          </View>
          {photoSrc ? <Image src={photoSrc} style={s.photo} /> : null}
        </View>
        {data.summary?.trim() && <View style={s.section}><Text style={s.sectionTitle}>Profil</Text><Text style={s.summaryText}>{data.summary}</Text></View>}
        {experiences.length > 0 && <View style={s.section}><Text style={s.sectionTitle}>Expérience professionnelle</Text>{renderTimeline(experiences, (e) => e.role, (e) => e.company)}</View>}
        {education.length > 0 && <View style={s.section}><Text style={s.sectionTitle}>Formation</Text>{renderTimeline(education, (e) => e.degree, (e) => e.school)}</View>}
        {skillsList.length > 0 && <View style={s.section}><Text style={s.sectionTitle}>Compétences</Text><View style={s.tagsRow}>{skillsList.map((t, i) => <Text key={i} style={s.tag}>{t}</Text>)}</View></View>}
        {languagesList.length > 0 && <View style={s.section}><Text style={s.sectionTitle}>Langues</Text><View style={s.tagsRow}>{languagesList.map((t, i) => <Text key={i} style={s.tag}>{t}</Text>)}</View></View>}
      </Page>
    </Document>
  );
}

// ---------- Layout 7 : Exécutif sobre ----------
export function layoutExecutif(C, data, photoSrc, A) {
  const { Document, Page, Text, View, StyleSheet } = C;
  const { skillsList, languagesList, experiences, education, contactParts } = prepareData(data);
  const s = StyleSheet.create({
    page: { padding: 46, fontFamily: "Times-Roman", fontSize: 10, color: "#1A1A1A" },
    name: { fontSize: 22, fontFamily: "Times-Bold", textAlign: "center", letterSpacing: 1 },
    jobTitle: { fontSize: 11, color: A, textAlign: "center", marginTop: 3, fontFamily: "Times-Bold" },
    rule: { borderTop: `1.5 solid ${A}`, borderBottom: `1.5 solid ${A}`, height: 3, marginTop: 10, marginBottom: 4 },
    contactRow: { flexDirection: "row", justifyContent: "center", marginTop: 10, gap: 16, marginBottom: 18, flexWrap: "wrap" },
    contactItem: { fontSize: 9, color: "#444444" },
    section: { marginBottom: 14 },
    sectionTitle: { fontSize: 10.5, fontFamily: "Times-Bold", color: A, marginBottom: 7, textTransform: "uppercase", letterSpacing: 2, textAlign: "center" },
    summaryText: { fontSize: 10, lineHeight: 1.6, textAlign: "center" },
    entry: { marginBottom: 9 },
    entryTop: { flexDirection: "row", justifyContent: "space-between" },
    entryRole: { fontSize: 10.5, fontFamily: "Times-Bold" },
    entryPeriod: { fontSize: 9, color: "#5B6470", fontFamily: "Times-Italic" },
    entryCompany: { fontSize: 9.5, color: "#444444", marginBottom: 2, fontFamily: "Times-Italic" },
    entryDesc: { fontSize: 9.5, lineHeight: 1.4 },
    plainLine: { fontSize: 9.5, lineHeight: 1.6, textAlign: "center" },
  });
  return (
    <Document>
      <Page size="A4" style={s.page}>
        <Text style={s.name}>{data.fullName}</Text>
        {data.title ? <Text style={s.jobTit
