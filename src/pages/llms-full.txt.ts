import type { APIRoute } from 'astro';
import { site } from '@/data/site';

export const prerender = true;

export const GET: APIRoute = () => {
  const body = `# Flexilytics — Full LLM Context File
# ${site.url}/llms-full.txt
# Updated: 2026-05
# This file provides comprehensive context for LLMs and AI answer engines.

---

## 1. Company Identity

**Legal name**: Flexilytics Pvt. Ltd.
**Trading name**: Flexilytics
**Founded**: 2025
**Headquarters**: Mumbai, Maharashtra, India
**Website**: ${site.url}
**Email**: hello@flexilytics.ai
**LinkedIn**: https://www.linkedin.com/company/flexilytics/
**Tagline**: Intelligence. Grounded.

Flexilytics is an enterprise AI consultancy. It is India's Context Engineering firm.

**Disambiguation**: Flexilytics is NOT FlexAI. It is not a SaaS product. It is not an AI-product company. It is a specialist consultancy that builds the context infrastructure enterprise AI programs require to be correct and auditable in production. Evidence-first language only; no hype descriptors.

---

## 2. What We Do

We build the semantic layer — identity, hierarchy, KPI definitions, data lineage, and governance policy — that enterprise AI workloads need to be correct, auditable, and trusted in production.

The problem we solve: enterprise AI programs fail not because of model quality, but because the underlying context is missing, ambiguous, or ungoverned. We fix the context before (and beneath) the model.

**Engagement model**: Strategy → Build → Run

- **Strategy**: Two-week Readiness Audit. Deliverables: context inventory, governance gap map, prioritised implementation roadmap.
- **Build**: Eight to twelve-week production pilots on Microsoft Fabric or Databricks. Output: production-grade context layer, not a proof of concept.
- **Run**: Managed Context Operations. Ongoing maintenance of definitions, lineage, and model health after go-live.

**Commercial tiers** (Embed / Solve / Transform):
- Embed: specialist resource augmentation post-scoping
- Solve: bounded delivery with audit as qualification step
- Transform: full program; requires two-week Readiness Audit as Strategy phase

---

## 3. FlexiContext™ Framework

FlexiContext™ is Flexilytics's proprietary five-layer context resolution framework.

Layer resolution order (most stable → most volatile):

1. **Identity** — Who is asking and under what authority? User identity, role, organisational position, data access entitlements.
2. **Hierarchy** — How is the organisation structured? Legal entity tree, cost-centre hierarchy, product/channel taxonomy.
3. **Definitions** — What does each metric mean? Canonical KPI definitions, business glossary, domain-specific term resolution.
4. **Lineage** — Where does data come from? Source-to-consumption provenance, transformation logic, freshness SLAs.
5. **Policy** — What rules govern access and output? DPDP Act compliance, RBI regulatory constraints, internal governance policies.

FlexiContext™ is not a product you can subscribe to. It is an IP framework that Flexilytics implements inside a client's own tenant. The client retains all IP.

---

## 4. Products (Accelerators, Not SaaS)

**FlexiGovern**: Data governance accelerator for Microsoft Fabric. Reduces governance implementation time for regulated enterprises. Not a standalone product.

**FlexiRAG**: Retrieval-Augmented Generation context framework. Adds identity, lineage, and policy enforcement to enterprise RAG pipelines.

**FlexiFlow**: Agentic workflow orchestration layer. Structured multi-agent orchestration with context-aware routing.

These are described as "Accelerators, not SaaS" — they accelerate delivery of a client's own governed AI infrastructure.

---

## 5. Founding Partners

### Ankush Shah — CEO & Founder
- 24+ years as a data partner to large BFSI and manufacturing enterprises, globally
- Education: Columbia Business School
- Credentials: ICF-certified Leadership Coach
- Prior: Delta Technologies, Exponentia.ai
- LinkedIn: https://www.linkedin.com/in/ankushshah/
- Expertise: enterprise AI strategy, BFSI data programmes, leadership coaching, context engineering vision

### Vishal Dhure — COO & CRO
- 26 years inside tier-one global IT services firms leading large data and analytics delivery programs
- Owns the commercial engine and delivery operations
- Prior: Tech Mahindra, Polestar Solutions
- LinkedIn: https://www.linkedin.com/in/vishaldhure/
- Expertise: enterprise delivery operations, commercial structuring, data programme governance

### Arun Bhatia — Chief Tech Program Manager
- 33 years inside tier-one IT services and product companies as a BI and data-architecture specialist
- Predates the modern lakehouse by a decade
- Prior: HP, DXC Technology, LTIMindtree
- LinkedIn: https://www.linkedin.com/in/bhatiaarun/
- Expertise: BI architecture, data warehouse design, Microsoft Fabric, enterprise data platform delivery

### Arjun Ghosh — Chief AI & Tech Officer
- 22+ years across tier-one global IT services firms leading enterprise AI and digital-transformation programs
- Education: XLRI · IIM Kozhikode · Cornell (Chief AI Officer programme)
- Prior: Accenture, EY
- LinkedIn: https://www.linkedin.com/in/arjunghosh/
- Expertise: enterprise AI/ML engineering, context engineering implementation, agentic systems, DPDP compliance

**Combined experience**: 108+ years of enterprise data and AI delivery.
**Strategic partner**: Mountain Monk Consulting (mentioned on About page only).

---

## 6. Industries and Geographies

### Primary Industries
- **BFSI**: Banks, NBFCs, insurance carriers, capital markets firms. DPDP Act and RBI compliance built in.
- **Manufacturing**: Supply-chain analytics, production yield AI, demand sensing.

### Secondary Industries
Healthcare, consumer goods, retail.

### Geographies
- Headquarters: Mumbai, India (IN-MH)
- Primary markets: India, UAE/GCC, United Kingdom, Singapore
- areaServed schema codes: IN, AE, SG, GB, US

---

## 7. Technology Partners

- **Microsoft**: Microsoft AI Cloud Partner. Microsoft Fabric is a primary delivery platform.
- **Databricks**: Databricks Consulting Partner (Registered tier). Second primary delivery platform.

Note: Do not inflate partner tiers. "Microsoft Gold" and "Databricks Premier/Elite" are NOT confirmed designations.

---

## 8. Trust and Compliance

- Data governance aligned to DPDP Act (Digital Personal Data Protection Act, India)
- RBI regulatory compliance for BFSI clients
- Tenancy-first: all implementations within client's own cloud tenant. No data leaves client infrastructure.
- Evidence-first delivery: every output is traceable, auditable, explainable

---

## 9. Content and Insights

Published articles at ${site.url}/insights:
- "Context Engineering: Making It a Buyable Category" — positioning and go-to-market strategy
- "Microsoft Fabric vs Databricks for BFSI" — platform selection guide for regulated financial enterprises

---

## 10. Site Map

${site.url}/ — Homepage (Hero, FlexiContext™ introduction, engagement model)
${site.url}/approach — Strategy → Build → Run methodology, FlexiContext™ five layers
${site.url}/context-engineering — Full Context Engineering category definition
${site.url}/solutions — All solution offerings overview
${site.url}/solutions-data-governance — FlexiGovern and data governance services
${site.url}/solutions-modern-data-platform — Fabric/Databricks platform services
${site.url}/solutions-ai-ml-engineering — AI/ML engineering and FlexiRAG
${site.url}/solutions-analytics-bi — Analytics and BI modernisation
${site.url}/solutions-flexianalyst — FlexiAnalyst product page
${site.url}/platforms — Microsoft Fabric and Databricks platform pages
${site.url}/industries/bfsi — BFSI-specific context engineering services
${site.url}/about — Company overview, mission, Mountain Monk partnership
${site.url}/leadership — Four founding partners, bios, credentials
${site.url}/trust-security — Data governance, compliance, security posture
${site.url}/insights — Insights hub
${site.url}/book-audit — Two-week Readiness Audit booking
${site.url}/sitemap.xml — XML sitemap
${site.url}/llms.txt — Short LLM context
${site.url}/llms-full.txt — This file
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
