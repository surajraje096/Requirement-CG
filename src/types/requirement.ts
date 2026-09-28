export type Severity = 'high' | 'medium' | 'low';
export type QuestionPriority = 'P1' | 'P2' | 'P3';

export interface AmbiguityFinding {
  id: string;
  phrase: string;
  category: 'vague_term' | 'undefined_boundary' | 'unclear_actor' | 'unclear_timing' | 'non_testable';
  severity: Severity;
  explanation: string;
  impactOnQA: string;
  suggestedClarification: string;
}

export interface GapFinding {
  id: string;
  category: 'missing_acceptance_criteria' | 'missing_negative_path' | 'missing_business_rule' | 'missing_validation' | 'missing_error_handling' | 'missing_dependency';
  severity: Severity;
  title: string;
  description: string;
  suggestedAddition: string;
}

export interface ConflictFinding {
  id: string;
  title: string;
  conflictingElements: string[];
  severity: 'high' | 'medium';
  explanation: string;
  recommendedResolution: string;
}

export interface QualityDimension {
  score: number; // 0 - 100
  rationale: string;
  status: 'critical' | 'needs_work' | 'good' | 'excellent';
}

export interface QualityMetrics {
  overallScore: number; // 0 - 100
  grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  completeness: QualityDimension;
  testability: QualityDimension;
  clarity: QualityDimension;
  consistency: QualityDimension;
  traceability: QualityDimension;
  riskSummary: string;
  estimatedReworkHours: number;
  defectLeakageRisk: 'High' | 'Moderate' | 'Low';
}

export interface ClarificationQuestion {
  id: string;
  priority: QuestionPriority;
  question: string;
  targetRole: 'Product Owner' | 'Business Analyst' | 'Security Architect' | 'System Architect';
  context: string;
  suggestedAnswers: string[];
  resolvedAnswer?: string;
}

export interface AcceptanceCriterion {
  id: string;
  title: string;
  type: 'happy_path' | 'negative_path' | 'edge_case' | 'security_boundary';
  given: string;
  when: string;
  then: string;
}

export interface QAPipelineArtifacts {
  gherkinFeature: string;
  cypressOrPlaywrightTest: string;
  apiTestScript: string;
  jiraMarkdown: string;
  confluenceWikiMarkup: string;
}

export interface AgentTraceStep {
  agentName: string;
  role: string;
  status: 'completed' | 'in_progress' | 'flagged';
  durationMs: number;
  findingsCount: number;
  summary: string;
}

export interface RequirementAnalysisResult {
  pbiId: string;
  title: string;
  originalText: string;
  domain: string;
  extractedActors: string[];
  identifiedTriggers: string[];
  metrics: QualityMetrics;
  ambiguities: AmbiguityFinding[];
  gaps: GapFinding[];
  conflicts: ConflictFinding[];
  questions: ClarificationQuestion[];
  suggestedClarifiedRequirement: string;
  acceptanceCriteria: AcceptanceCriterion[];
  qaArtifacts: QAPipelineArtifacts;
  agentTrace: AgentTraceStep[];
  timestamp: string;
}
