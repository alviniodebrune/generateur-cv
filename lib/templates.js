export function prepareData(data) {
  const skillsList = (data.skills || "").split(",").map((s) => s.trim()).filter(Boolean);
  const languagesList = (data.languages || "").split(",").map((s) => s.trim()).filter(Boolean);
  const experiences = (data.experiences || []).filter((e) => e.role || e.company);
  const education = (data.education || []).filter((e) => e.degree || e.school);
  const contactParts = [data.email, data.phone, data.address].filter((p) => p && p.trim());
  return { skillsList, languagesList, experiences, education, contactParts };
}

// ---------- Layout 1 : Chronologique classique ----------
function layoutChronologique(C, data, photoSrc, A) {
  const { Document, Page, Text, View, StyleSheet, Image } = C;
  const { skillsList, languagesList, experiences, education, contactParts } = prepareData(data);
  const s = StyleSheet.create({
    page: { padding: 40, fontFamily: "Helvetica", fontSize: 10, color: "#1A1A1A" },
    header: { flexDirection: "row", alignItems: "center", gap: 14, marginBottom: 18, borderBottom: `2 solid ${A}`, paddingBottom: 14 },
    photo: { width: 62, height: 62, borderRadius: 31 },
    name: { fontSize: 22, fontFamily: "Helvetica-Bold", color: A },
    jobTitle: { fontSize: 12, color: "#5B6470", marginTop: 2, fontFamily: "Helvetica-Bold" },
    contactRow: { flexDirection: "row", marginTop: 6, gap: 14, flexWrap: "wrap" },
    contactItem: { fontSize: 9, color: "#5B6470" },
    section: { marginBottom: 14 },
    sectionTitle: { fontSize: 11, fontFamily: "Helvetica-Bold", color: A, marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 },
    summaryText: { fontSize: 10, lineHeight: 1.5 },
    entry: { marginBottom: 9 },
    entryTop: { flexDirection: "row", justifyContent: "space-between" },
    entryRole: { fontSize: 10.5, fontFamily: "Helvetica-Bold" },
    entryPeriod: { fontSize: 9, color: "#5B6470" },
    entryCompany: { fontSize: 9.5, color: A, marginBottom: 2 },
    entryDesc: { fontSize: 9.5, lineHeight: 1.4, color: "#333333" },
    tagsRow: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
    tag: { fontSize: 9, backgroundColor: "#F6F6F3", border: "1 solid #DADCD6", borderRadius: 3, paddingVertical: 3, paddingHorizontal: 7 },
  });
  return (
    <Document>
      <Page size="A4" style={s.page}>
        <View style={s.header}>
          {photoSrc ? <Image src={photoSrc} style={s.photo} /> : null}
          <View>
            <Text style={s.name}>{data.fullName}</Text>
            {data.title ? <Text style={s.jobTitle}>{data.title}</Text> : null}
            {contactParts.length > 0 && <View style={s.contactRow}>{contactParts.map((c, i) => <Text key={i} style={s.contactItem}>{c}</Text>)}</View>}
          </View>
        </View>
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
        {skillsList.length > 0 && <View style={s.section}><Text style={s.sectionTitle}>Compétences</Text><View style={s.tagsRow}>{skillsList.map((t, i) => <Text key={i} style={s.tag}>{t}</Text>)}</View></View>}
        {languagesList.length > 0 && <View style={s.section}><Text style={s.sectionTitle}>Langues</Text><View style={s.tagsRow}>{languagesList.map((t, i) => <Text key={i} style={s.tag}>{t}</Text>)}</View></View>}
      </Page>
    </Document>
  );
}

// ---------- Layout 2 : Sidebar moderne (gauche) ----------
function layoutSidebar(C, data, photoSrc, A) {
  const { Document, Page, Text, View, StyleSheet, Image } = C;
  const { skillsList, languagesList, experiences, education, contactParts } = prepareData(data);
  const s = StyleSheet.create({
    page: { flexDirection: "row", fontFamily: "Helvetica", fontSize: 10, color: "#1A1A1A" },
    sidebar: { width: 170, backgroundColor: A, color: "#FFFFFF", padding: 20 },
    photo: { width: 80, height: 80, borderRadius: 40, marginBottom: 14, alignSelf: "center" },
    sideTitle: { fontSize: 9.5, fontFamily: "Helvetica-Bold", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6, marginTop: 16, color: "#FFFFFF" },
    sideText: { fontSize: 8.5, color: "#FFFFFF", marginBottom: 4, lineHeight: 1.4 },
    sideTag: { fontSize: 8.5, backgroundColor: "rgba(255,255,255,0.18)", borderRadius: 3, paddingVertical: 2.5, paddingHorizontal: 6, marginBottom: 4, alignSelf: "flex-start" },
    main: { flex: 1, padding: 28 },
    name: { fontSize: 21, fontFamily: "Helvetica-Bold", color: A },
    jobTitle: { fontSize: 11.5, color: "#4B5A5C", marginTop: 2, marginBottom: 14, fontFamily: "Helvetica-Bold" },
    sectionTitle: { fontSize: 11, fontFamily: "Helvetica-Bold", color: A, marginBottom: 6, textTransform: "uppercase", letterSpacing: 1, borderBottom: "1 solid #DADCD6", paddingBottom: 3 },
    section: { marginBottom: 14 },
    summaryText: { fontSize: 10, lineHeight: 1.5 },
    entry: { marginBottom: 9 },
    entryTop: { flexDirection: "row", justifyContent: "space-between" },
    entryRole: { fontSize: 10.5, fontFamily: "Helvetica-Bold" },
    entryPeriod: { fontSize: 9, color: "#5B6470" },
    entryCompany: { fontSize: 9.5, color: A, marginBottom: 2 },
    entryDesc: { fontSize: 9.5, lineHeight: 1.4, color: "#333333" },
  });
  return (
    <Document>
      <Page size="A4" style={s.page}>
        <View style={s.sidebar}>
          {photoSrc ? <Image src={photoSrc} style={s.photo} /> : null}
          {contactParts.length > 0 && <><Text style={s.sideTitle}>Contact</Text>{contactParts.map((c, i) => <Text key={i} style={s.sideText}>{c}</Text>)}</>}
          {skillsList.length > 0 && <><Text style={s.sideTitle}>Compétences</Text>{skillsList.map((t, i) => <Text key={i} style={s.sideTag}>{t}</Text>)}</>}
          {languagesList.length > 0 && <><Text style={s.sideTitle}>Langues</Text>{languagesList.map((t, i) => <Text key={i} style={s.sideTag}>{t}</Text>)}</>}
        </View>
        <View style={s.main}>
          <Text style={s.name}>{data.fullName}</Text>
          {data.title ? <Text style={s.jobTitle}>{data.title}</Text> : null}
          {data.summary?.trim() && <View style={s.section}><Text style={s.sectionTitle}>Profil</Text><Text style={s.summaryText}>{data.summary}</Text></View>}
          {experiences.length > 0 && (
            <View style={s.section}>
              <Text style={s.sectionTitle}>Expérience</Text>
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
        </View>
      </Page>
    </Document>
  );
}

// ---------- Layout 3 : Sobre / international (Europass-like) ----------
function layoutEuropass(C, data, photoSrc, A) {
  const { Document, Page, Text, View, StyleSheet, Image } = C;
  const { skillsList, languagesList, experiences, education, contactParts } = prepareData(data);
  const s = StyleSheet.create({
    page: { padding: 42, fontFamily: "Helvetica", fontSize: 9.5, color: "#1A1A1A" },
    topRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 },
    name: { fontSize: 19, fontFamily: "Helvetica-Bold", color: A },
    jobTitle: { fontSize: 10.5, color: "#5B6470", marginTop: 2 },
    photo: { width: 66, height: 82 },
    rule: { borderBottom: `1.5 solid ${A}`, marginTop: 10, marginBottom: 14 },
    tableTitle: { fontSize: 10, fontFamily: "Helvetica-Bold", color: A, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 },
    row: { flexDirection: "row", marginBottom: 3 },
    label: { width: 130, fontSize: 9, color: "#5B6470", fontFamily: "Helvetica-Bold" },
    value: { flex: 1, fontSize: 9.5 },
    section: { marginBottom: 14 },
    entry: { flexDirection: "row", marginBottom: 8 },
    entryPeriod: { width: 90, fontSize: 9, color: "#5B6470" },
    entryBody: { flex: 1 },
    entryRole: { fontSize: 10, fontFamily: "Helvetica-Bold" },
    entryCompany: { fontSize: 9.5, color: "#5B6470", marginBottom: 2 },
    entryDesc: { fontSize: 9, lineHeight: 1.4 },
    tagLine: { fontSize: 9.5, lineHeight: 1.6 },
  });
  return (
    <Document>
      <Page size="A4" style={s.page}>
        <View style={s.topRow}>
          <View><Text style={s.name}>{data.fullName}</Text>{data.title ? <Text style={s.jobTitle}>{data.title}</Text> : null}</View>
          {photoSrc ? <Image src={photoSrc} style={s.photo} /> : null}
        </View>
        <View style={s.rule} />
        {contactParts.length > 0 && (
          <View style={s.section}>
            <Text style={s.tableTitle}>Informations personnelles</Text>
            {data.email ? <View style={s.row}><Text style={s.label}>E-mail</Text><Text style={s.value}>{data.email}</Text></View> : null}
            {data.phone ? <View style={s.row}><Text style={s.label}>Téléphone</Text><Text style={s.value}>{data.phone}</Text></View> : null}
            {data.address ? <View style={s.row}><Text style={s.label}>Adresse</Text><Text style={s.value}>{data.address}</Text></View> : null}
          </View>
        )}
        {data.summary?.trim() && <View style={s.section}><Text style={s.tableTitle}>Profil</Text><Text style={s.tagLine}>{data.summary}</Text></View>}
        {experiences.length > 0 && (
          <View style={s.section}>
            <Text style={s.tableTitle}>Expérience professionnelle</Text>
            {experiences.map((e, i) => (
              <View key={i} style={s.entry}>
                <Text style={s.entryPeriod}>{e.period}</Text>
                <View style={s.entryBody}><Text style={s.entryRole}>{e.role}</Text><Text style={s.entryCompany}>{e.company}</Text>{e.description ? <Text style={s.entryDesc}>{e.description}</Text> : null}</View>
              </View>
            ))}
          </View>
        )}
        {education.length > 0 && (
          <View style={s.section}>
            <Text style={s.tableTitle}>Formation</Text>
            {education.map((e, i) => (
              <View key={i} style={s.entry}>
                <Text style={s.entryPeriod}>{e.period}</Text>
                <View style={s.entryBody}><Text style={s.entryRole}>{e.degree}</Text><Text style={s.entryCompany}>{e.school}</Text></View>
              </View>
            ))}
          </View>
        )}
        {skillsList.length > 0 && <View style={s.section}><Text style={s.tableTitle}>Compétences</Text><Text style={s.tagLine}>{skillsList.join(" · ")}</Text></View>}
        {languagesList.length > 0 && <View style={s.section}><Text style={s.tableTitle}>Langues</Text><Text style={s.tagLine}>{languagesList.join(" · ")}</Text></View>}
      </Page>
    </Document>
  );
}

// ---------- Layout 4 : Étudiant créatif ----------
function layoutEtudiant(C, data, photoSrc, A) {
  const { Document, Page, Text, View, StyleSheet, Image } = C;
  const { skillsList, languagesList, experiences, education, contactParts } = prepareData(data);
  const s = StyleSheet.create({
    page: { padding: 38, fontFamily: "Helvetica", fontSize: 10, color: "#1A1A1A" },
    header: { flexDirection: "row", alignItems: "center", gap: 14, marginBottom: 20 },
    photo: { width: 70, height: 70, borderRadius: 35 },
    name: { fontSize: 23, fontFamily: "Helvetica-Bold", color: A },
    jobTitle: { fontSize: 11.5, color: "#5B6470", marginTop: 2 },
    contactRow: { flexDirection: "row", marginTop: 6, gap: 12, flexWrap: "wrap" },
    contactItem: { fontSize: 9, color: "#5B6470" },
    section: { marginBottom: 15 },
    sectionTitle: { fontSize: 11.5, fontFamily: "Helvetica-Bold", color: "#FFFFFF", backgroundColor: A, paddingVertical: 4, paddingHorizontal: 8, borderRadius: 3, marginBottom: 8, alignSelf: "flex-start" },
    summaryText: { fontSize: 10, lineHeight: 1.55 },
    entry: { marginBottom: 9 },
    entryTop: { flexDirection: "row", justifyContent: "space-between" },
    entryRole: { fontSize: 10.5, fontFamily: "Helvetica-Bold" },
    entryPeriod: { fontSize: 9, color: "#5B6470" },
    entryCompany: { fontSize: 9.5, color: A, marginBottom: 2 },
    entryDesc: { fontSize: 9.5, lineHeight: 1.4, color: "#333333" },
    tagsRow: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
    tag: { fontSize: 9, color: "#FFFFFF", backgroundColor: A, borderRadius: 10, paddingVertical: 3, paddingHorizontal: 9 },
  });
  return (
    <Document>
      <Page size="A4" style={s.page}>
        <View style={s.header}>
          {photoSrc ? <Image src={photoSrc} style={s.photo} /> : null}
          <View>
            <Text style={s.name}>{data.fullName}</Text>
            {data.title ? <Text style={s.jobTitle}>{data.title}</Text> : null}
            {contactParts.length > 0 && <View style={s.contactRow}>{contactParts.map((c, i) => <Text key={i} style={s.contactItem}>{c}</Text>)}</View>}
          </View>
        </View>
        {data.summary?.trim() && <View style={s.section}><Text style={s.sectionTitle}>Profil</Text><Text style={s.summaryText}>{data.summary}</Text></View>}
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
        {experiences.length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Expérience</Text>
            {experiences.map((e, i) => (
              <View key={i} style={s.entry}>
                <View style={s.entryTop}><Text style={s.entryRole}>{e.role}</Text><Text style={s.entryPeriod}>{e.period}</Text></View>
                <Text style={s.entryCompany}>{e.company}</Text>
                {e.description ? <Text style={s.entryDesc}>{e.description}</Text> : null}
              </View>
            ))}
          </View>
        )}
        {skillsList.length > 0 && <View style={s.section}><Text style={s.sectionTitle}>Compétences</Text><View style={s.tagsRow}>{skillsList.map((t, i) => <Text key={i} style={s.tag}>{t}</Text>)}</View></View>}
        {languagesList.length > 0 && <View style={s.section}><Text style={s.sectionTitle}>Langues</Text><View style={s.tagsRow}>{languagesList.map((t, i) => <Text key={i} style={s.tag}>{t}</Text>)}</View></View>}
      </Page>
    </Document>
  );
}

// ---------- Layout 5 : Minimaliste ATS ----------
function layoutMinimaliste(C, data, photoSrc, A) {
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
function layoutTimeline(C, data, photoSrc, A) {
  const { Document, Page, Text, View, StyleSheet, Image } = C;
  const { skillsList, languagesList, experiences, education, contactParts } = prepareData(data);
  const s = StyleSheet.create({
    page: { padding: 40, fontFamily: "Helvetica", fontSize: 10, color: "#1A1A1A" },
    header: { flexDirection: "row", alignItems: "center", just
