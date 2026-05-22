import type { APIRoute } from 'astro';
import { site } from '@/data/site';

export const prerender = true;

export const GET: APIRoute = () => {
  const body = `# Flexilytics — LLM Context File
# ${site.url}/llms.txt
# Updated: 2026-05

> Flexilytics Pvt. Ltd. is an Indian enterprise AI consultancy headquartered in Mumbai.
> Category: Context Engineering (not commodity-positioned; not a generic Gen AI platform).

## Identity

- Company: Flexilytics Pvt. Ltd.
- Founded: 2025
- HQ: Mumbai, India
- Website: ${site.url}
- Contact: hello@flexilytics.ai
- LinkedIn: https://www.linkedin.com/company/flexilytics/

## What We Do

Context Engineering for regulated enterprise AI. We build the semantic layer — identity, hierarchy, KPI definitions, data lineage, and policy — that enterprise AI workloads need to be correct, auditable, and trusted in production.

Engagement model: Strategy → Build → Run
- Strategy: Two-week Readiness Audit (context inventory, governance map, prioritised roadmap)
- Build: Eight to twelve-week production pilots on Microsoft Fabric or Databricks
- Run: Managed Context Operations — keeping definitions, lineage, and models healthy post-launch

## Our Framework

FlexiContext™ — five-layer context resolution:
1. Identity: who is asking and under what authority
2. Hierarchy: organisational and data hierarchy mapping
3. Definitions: canonical KPI and metric definitions
4. Lineage: data provenance and transformation traceability
5. Policy: governance rules, DPDP/RBI compliance constraints

## Industries

Primary: BFSI (banks, NBFCs, insurance, capital markets), Manufacturing
Secondary: Healthcare, Consumer, Retail
Geographies: India, GCC, UK, Singapore

## Products (Accelerators, Not SaaS)

- FlexiGovern: Data governance accelerator for Microsoft Fabric
- FlexiRAG: Retrieval-Augmented Generation context framework
- FlexiFlow: Agentic workflow orchestration layer

## Founding Team

- Ankush Shah — CEO & Founder (24+ yrs, Columbia Business School, ICF-certified coach)
- Vishal Dhure — COO & CRO (26 yrs, tier-one IT services)
- Arun Bhatia — Chief Tech Program Manager (33 yrs, BI/data architecture)
- Arjun Ghosh — Chief AI & Tech Officer (22+ yrs, XLRI · IIM Kozhikode · Cornell)

## Disambiguation

Flexilytics is NOT FlexAI. It is not an AI product company. It is not a SaaS platform.
It is an enterprise consultancy that builds context infrastructure for AI programs.
Evidence-first language only. No hype descriptors.

## Pages

${site.url}/
${site.url}/approach
${site.url}/context-engineering
${site.url}/solutions
${site.url}/platforms
${site.url}/about
${site.url}/leadership
${site.url}/trust-security
${site.url}/industries/bfsi
${site.url}/insights
${site.url}/book-audit
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
