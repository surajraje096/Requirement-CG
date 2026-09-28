export interface SampleScenario {
  id: string;
  pbiId: string;
  name: string;
  badge: string;
  domain: string;
  description: string;
  rawRequirement: string;
  confluenceContext?: string;
  scenarioSummary?: string;
  tasks?: string[];
  benefits?: string[];
}

export const SAMPLE_SCENARIOS: SampleScenario[] = [
  {
    id: 'requirement-gap-agent',
    pbiId: 'AGENT-101',
    name: 'Requirement Gap & Ambiguity Detection Agent',
    badge: 'Core Problem Statement',
    domain: 'Shift-Left QA & DevOps',
    scenarioSummary: 'Many defects originate from unclear requirements.',
    tasks: [
      'Analyze PBIs, BRDs, Confluence pages.',
      'Detect ambiguous requirements.',
      'Identify missing acceptance criteria.',
      'Highlight conflicting business rules.',
      'Suggest clarifications for Product Owners.'
    ],
    benefits: [
      'Shift-left quality.',
      'Reduced requirement defects.'
    ],
    description: 'The core mission scenario: Evaluates incoming PBIs, BRDs, and Confluence specifications, detects ambiguities, identifies missing criteria, highlights conflicts, and suggests PO clarifications.',
    rawRequirement: `The Requirement Gap & Ambiguity Detection Agent must automatically analyze PBIs, BRDs, and Confluence pages before development begins. The agent should detect ambiguous requirements, identify missing acceptance criteria, highlight conflicting business rules, and suggest clarifications for Product Owners to achieve shift-left quality and reduced requirement defects.`,
    confluenceContext: `Definition of Ready (DoR) Policy 3.1: All PBIs and stories must possess quantified acceptance criteria, resolved business boundaries, and zero unaddressed ambiguity items before sprint commitment.`
  },
  {
    id: 'money-transfer',
    pbiId: 'PAY-4028',
    name: 'High-Value Money Transfer',
    badge: 'ChatGPT Share Example',
    domain: 'Fintech & Banking',
    scenarioSummary: 'Unclear definition of large transactions and missing verification mechanisms.',
    tasks: [
      'Quantify step-up authentication thresholds.',
      'Define maximum per-transaction and velocity limits.',
      'Specify failure recovery and lockout behaviors.'
    ],
    benefits: [
      'Zero unauthorized transaction drain.',
      'Deterministic BDD test coverage.'
    ],
    description: 'The exact scenario from the ChatGPT conversation. Unclear definition of large transactions, missing verification mechanisms, undefined transfer limits, and absent error handling.',
    rawRequirement: `User can transfer money to another account. The system should allow large transactions after verification.`,
    confluenceContext: `Banking Regulations Section 4.2: High-risk transfers must comply with AML/KYC checks. Daily velocity limits apply across all digital banking channels.`
  },
  {
    id: 'checkout-discount',
    pbiId: 'COMM-1120',
    name: 'Cart Promo & Tiered Discounts',
    badge: 'E-Commerce',
    domain: 'Retail & E-Commerce',
    scenarioSummary: 'Vague promotional discount logic and coupon collision.',
    tasks: [
      'Define coupon stacking hierarchy.',
      'Specify expiration date and grace periods.',
      'Clarify inactive account privileges.'
    ],
    benefits: [
      'Accurate checkout billing.',
      'Automated discount validation tests.'
    ],
    description: 'Promotional discount logic with vague qualification rules, missing coupon stacking policy, and zero error handling for expired codes.',
    rawRequirement: `Users can apply promo codes to their cart and get instant discounts. Inactive accounts might receive special privileges, and the checkout should complete quickly.`,
    confluenceContext: `Marketing Strategy Q3: Promo codes should not stack with existing clearance markdown items unless explicitly flagged as cumulative.`
  },
  {
    id: 'hipaa-record-export',
    pbiId: 'HLTH-8831',
    name: 'Patient Diagnostic Record Export',
    badge: 'Healthcare & HIPAA',
    domain: 'Healthcare',
    scenarioSummary: 'Unclear actor authorizations, unquantified timing, and absent audit logging.',
    tasks: [
      'Specify break-glass emergency RBAC credentials.',
      'Audit log PHI export transactions.',
      'Quantify latency boundaries.'
    ],
    benefits: [
      'HIPAA compliance assurance.',
      'Security audit trail coverage.'
    ],
    description: 'Unclear actor authorizations, unquantified timing, absent audit logging, and unsafe emergency override conditions.',
    rawRequirement: `Doctors and staff can export patient diagnostic records quickly when required. Emergency access bypasses standard approvals to prevent care delays.`,
    confluenceContext: `HIPAA Security Rule § 164.312(b): Audit controls must record and examine activity in information systems containing or using PHI.`
  },
  {
    id: 'saas-tier-downgrade',
    pbiId: 'SUB-3094',
    name: 'Enterprise Subscription Downgrade',
    badge: 'B2B SaaS',
    domain: 'SaaS & Billing',
    scenarioSummary: 'Seat de-allocation ambiguity and missing race condition handling.',
    tasks: [
      'Specify seat revocation priority.',
      'Calculate proration credit schedules.',
      'Handle concurrent team member sessions.'
    ],
    benefits: [
      'Prevents revenue loss and customer support tickets.',
      'Guaranteed ledger integrity.'
    ],
    description: 'Seat de-allocation ambiguity, undefined proration formula, and missing race condition handling between active team members and plan limits.',
    rawRequirement: `When a team admin downgrades their subscription tier, adjust user seats accordingly and process prorated credit immediately.`,
    confluenceContext: `Billing Engine Specs: Invoicing cycle operates on UTC calendar month. Refunds or credits are applied toward subsequent renewal invoices.`
  }
];
