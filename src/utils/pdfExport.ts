import { jsPDF } from 'jspdf';
import { RequirementAnalysisResult } from '../types/requirement';

export function exportExecutiveAuditPDF(result: RequirementAnalysisResult): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - 16) {
      doc.addPage();
      y = margin;
      drawPageHeader();
    }
  };

  const drawPageHeader = () => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(130, 140, 155);
    doc.text(`Requirement Quality Agent • Executive Audit • ${result.pbiId}`, margin, 9);
    doc.text(`Confidential • Shift-Left QA`, pageWidth - margin, 9, { align: 'right' });
    doc.setDrawColor(220, 226, 235);
    doc.setLineWidth(0.3);
    doc.line(margin, 11, pageWidth - margin, 11);
    y = Math.max(y, 16);
  };

  const addPageFooter = () => {
    const pageCount = (doc.internal as any).getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(140, 150, 165);
      doc.setDrawColor(225, 232, 240);
      doc.setLineWidth(0.3);
      doc.line(margin, pageHeight - 10, pageWidth - margin, pageHeight - 10);
      doc.text(
        `Generated on ${new Date().toLocaleDateString()} via Requirement Quality Agent (ISO 29148 Standard)`,
        margin,
        pageHeight - 6
      );
      doc.text(`Page ${i} of ${pageCount}`, pageWidth - margin, pageHeight - 6, { align: 'right' });
    }
  };

  // ==========================================
  // PAGE 1: TITLE & EXECUTIVE SCORECARD
  // ==========================================

  // Header Banner Box
  doc.setFillColor(15, 23, 42); // slate-900
  doc.roundedRect(margin, y, contentWidth, 34, 3, 3, 'F');

  // Accent Tag
  doc.setFillColor(79, 70, 229); // indigo-600
  doc.roundedRect(margin + 6, y + 6, 32, 5.5, 1.5, 1.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(255, 255, 255);
  doc.text('SHIFT-LEFT AUDIT', margin + 8, y + 9.8);

  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(255, 255, 255);
  doc.text(`EXECUTIVE QUALITY REPORT: ${result.pbiId}`, margin + 6, y + 19);

  // Subtitle
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(203, 213, 225); // slate-300
  doc.text(`${result.title} • Domain: ${result.domain}`, margin + 6, y + 25);
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184); // slate-400
  doc.text(`Audit Timestamp: ${new Date(result.timestamp || Date.now()).toLocaleString()}`, margin + 6, y + 30);

  y += 39;

  // Key KPI Cards Grid (4 boxes)
  const cardW = (contentWidth - 6) / 3;
  const cardH = 22;

  // Box 1: Overall Quality Score & Grade
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, cardW, cardH, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('QUALITY INDEX', margin + 4, y + 6);
  doc.setFontSize(16);
  const isGood = result.metrics.overallScore >= 80;
  if (isGood) {
    doc.setTextColor(16, 185, 129); // emerald
  } else if (result.metrics.overallScore >= 60) {
    doc.setTextColor(217, 119, 6); // amber
  } else {
    doc.setTextColor(225, 29, 72); // rose
  }
  doc.text(`${result.metrics.overallScore}/100`, margin + 4, y + 14);
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text(`Grade: ${result.metrics.grade}`, margin + 4, y + 19);

  // Box 2: Defect Leakage Risk
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin + cardW + 3, y, cardW, cardH, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('DEFECT LEAKAGE RISK', margin + cardW + 7, y + 6);
  doc.setFontSize(13);
  if (result.metrics.defectLeakageRisk === 'Low') {
    doc.setTextColor(16, 185, 129);
  } else if (result.metrics.defectLeakageRisk === 'Moderate') {
    doc.setTextColor(217, 119, 6);
  } else {
    doc.setTextColor(225, 29, 72);
  }
  doc.text(`${result.metrics.defectLeakageRisk.toUpperCase()} RISK`, margin + cardW + 7, y + 13.5);
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text(`${result.ambiguities.length} Ambiguities • ${result.gaps.length} Gaps`, margin + cardW + 7, y + 18.5);

  // Box 3: Shift-Left Rework Savings
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin + (cardW + 3) * 2, y, cardW, cardH, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('ESTIMATED REWORK SAVED', margin + (cardW + 3) * 2 + 4, y + 6);
  doc.setFontSize(16);
  doc.setTextColor(79, 70, 229); // indigo
  doc.text(`~${result.metrics.estimatedReworkHours} hrs`, margin + (cardW + 3) * 2 + 4, y + 14);
  doc.setFontSize(7.5);
  doc.setTextColor(16, 185, 129);
  doc.text('Defect Prevention in Sprint 0', margin + (cardW + 3) * 2 + 4, y + 19);

  y += cardH + 7;

  // Section: Executive Clarified Requirement
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('APPROVED CLARIFIED SPECIFICATION', margin, y);
  y += 4;

  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(199, 210, 254);
  const clarifiedLines = doc.splitTextToSize(`"${result.suggestedClarifiedRequirement}"`, contentWidth - 8);
  const clarifiedH = Math.max(16, clarifiedLines.length * 4.5 + 8);
  doc.roundedRect(margin, y, contentWidth, clarifiedH, 2, 2, 'FD');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);
  doc.text(clarifiedLines, margin + 4, y + 6);

  y += clarifiedH + 7;

  // Section: Shift-Left Quality Dimensions (IEEE 830 / ISO 29148)
  checkPageBreak(38);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 42);
  doc.text('QUALITY DIMENSIONS EVALUATION (ISO 29148)', margin, y);
  y += 5;

  const dimensions = [
    { label: 'Completeness', data: result.metrics.completeness },
    { label: 'Testability', data: result.metrics.testability },
    { label: 'Clarity', data: result.metrics.clarity },
    { label: 'Consistency', data: result.metrics.consistency },
    { label: 'Traceability', data: result.metrics.traceability },
  ];

  dimensions.forEach((dim) => {
    checkPageBreak(12);
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, y, contentWidth, 10.5, 1.5, 1.5, 'FD');

    // Label & Score
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text(dim.label, margin + 3.5, y + 4.5);

    const scoreStr = `${dim.data.score}%`;
    if (dim.data.score >= 80) doc.setTextColor(16, 185, 129);
    else if (dim.data.score >= 60) doc.setTextColor(217, 119, 6);
    else doc.setTextColor(225, 29, 72);
    doc.text(scoreStr, margin + 35, y + 4.5);

    // Progress bar
    const barX = margin + 47;
    const barW = 35;
    doc.setFillColor(226, 232, 240);
    doc.roundedRect(barX, y + 2, barW, 2.5, 1, 1, 'F');
    if (dim.data.score >= 80) doc.setFillColor(16, 185, 129);
    else if (dim.data.score >= 60) doc.setFillColor(217, 119, 6);
    else doc.setFillColor(225, 29, 72);
    doc.roundedRect(barX, y + 2, (barW * dim.data.score) / 100, 2.5, 1, 1, 'F');

    // Rationale
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(71, 85, 105);
    const ratLines = doc.splitTextToSize(dim.data.rationale, contentWidth - 92);
    doc.text(ratLines[0] || '', margin + 88, y + 4.5);

    y += 12;
  });

  // ==========================================
  // PAGE 2: AUDIT FINDINGS (AMBIGUITIES & GAPS)
  // ==========================================
  checkPageBreak(50);
  y += 4;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text(`FLAGGED AMBIGUITIES & VAGUE TERMS (${result.ambiguities.length})`, margin, y);
  y += 5;

  result.ambiguities.forEach((amb) => {
    checkPageBreak(20);
    doc.setFillColor(254, 242, 242); // rose-50
    doc.setDrawColor(254, 205, 211);
    doc.roundedRect(margin, y, contentWidth, 18, 1.5, 1.5, 'FD');

    // Tag
    doc.setFillColor(225, 29, 72);
    doc.roundedRect(margin + 3, y + 2.5, 16, 4.5, 1, 1, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(255, 255, 255);
    doc.text(amb.severity.toUpperCase(), margin + 4.5, y + 5.7);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(159, 18, 57);
    doc.text(`"${amb.phrase}"`, margin + 22, y + 5.8);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(51, 65, 85);
    const expLines = doc.splitTextToSize(`Issue: ${amb.explanation}`, contentWidth - 8);
    doc.text(expLines[0] || '', margin + 4, y + 10.5);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(67, 56, 202); // indigo-700
    const fixLines = doc.splitTextToSize(`Fix: ${amb.suggestedClarification}`, contentWidth - 8);
    doc.text(fixLines[0] || '', margin + 4, y + 15);

    y += 20;
  });

  // Gaps Section
  checkPageBreak(40);
  y += 4;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text(`CRITICAL REQUIREMENT GAPS & MISSING CRITERIA (${result.gaps.length})`, margin, y);
  y += 5;

  result.gaps.forEach((gap) => {
    checkPageBreak(19);
    doc.setFillColor(255, 251, 235); // amber-50
    doc.setDrawColor(253, 230, 138);
    doc.roundedRect(margin, y, contentWidth, 17, 1.5, 1.5, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(146, 64, 14); // amber-800
    doc.text(`${gap.id}: ${gap.title}`, margin + 4, y + 5.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(71, 85, 105);
    const desc = doc.splitTextToSize(`Risk: ${gap.description}`, contentWidth - 8);
    doc.text(desc[0] || '', margin + 4, y + 10);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(180, 83, 9);
    const add = doc.splitTextToSize(`Remedy: ${gap.suggestedAddition}`, contentWidth - 8);
    doc.text(add[0] || '', margin + 4, y + 14.5);

    y += 19;
  });

  // ==========================================
  // PAGE 3: PO DECISIONS & TESTABLE CRITERIA
  // ==========================================
  checkPageBreak(45);
  y += 4;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text(`PRODUCT OWNER CLARIFICATIONS & SIGN-OFFS (${result.questions.length})`, margin, y);
  y += 5;

  result.questions.forEach((q, idx) => {
    checkPageBreak(17);
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, y, contentWidth, 15, 1.5, 1.5, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(30, 41, 59);
    doc.text(`Q${idx + 1} [${q.priority}] (${q.targetRole}): ${q.question}`, margin + 4, y + 5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(16, 185, 129); // emerald
    const ans = q.resolvedAnswer || q.suggestedAnswers[0] || 'Pending Sign-Off';
    doc.text(`PO Resolution Decision: ${ans}`, margin + 4, y + 10.5);

    y += 17;
  });

  // Acceptance Criteria (Given-When-Then)
  checkPageBreak(50);
  y += 4;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text(`FORMAL ACCEPTANCE CRITERIA (${result.acceptanceCriteria.length})`, margin, y);
  y += 5;

  result.acceptanceCriteria.forEach((ac) => {
    checkPageBreak(22);
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(margin, y, contentWidth, 20, 1.5, 1.5, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(15, 23, 42);
    doc.text(`${ac.id} - ${ac.title} [${ac.type.replace('_', ' ').toUpperCase()}]`, margin + 4, y + 4.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(71, 85, 105);

    doc.setFont('helvetica', 'bold');
    doc.text('GIVEN', margin + 4, y + 8.5);
    doc.setFont('helvetica', 'normal');
    doc.text(ac.given, margin + 17, y + 8.5);

    doc.setFont('helvetica', 'bold');
    doc.text('WHEN', margin + 4, y + 12.5);
    doc.setFont('helvetica', 'normal');
    doc.text(ac.when, margin + 17, y + 12.5);

    doc.setFont('helvetica', 'bold');
    doc.text('THEN', margin + 4, y + 16.5);
    doc.setFont('helvetica', 'normal');
    doc.text(ac.then, margin + 17, y + 16.5);

    y += 22;
  });

  // ==========================================
  // STAKEHOLDER SIGN-OFF / APPROVAL BLOCK
  // ==========================================
  checkPageBreak(38);
  y += 6;

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, y, contentWidth, 30, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text('STAKEHOLDER SIGN-OFF & SPRINT COMMITMENT APPROVAL', margin + 5, y + 6);

  const colW = (contentWidth - 16) / 3;
  const sigY = y + 14;

  const stakeholders = [
    { title: 'Product Owner (PO)', name: 'Requirements & Scope Approved' },
    { title: 'QA Automation Lead', name: 'Testability & Scenarios Verified' },
    { title: 'Tech Lead / Architect', name: 'Architecture & Constraints Feasible' },
  ];

  stakeholders.forEach((s, i) => {
    const sx = margin + 5 + i * (colW + 5);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(51, 65, 85);
    doc.text(s.title, sx, sigY);

    doc.setDrawColor(148, 163, 184);
    doc.setLineWidth(0.3);
    doc.line(sx, sigY + 8, sx + colW - 4, sigY + 8);

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(6.5);
    doc.setTextColor(100, 116, 139);
    doc.text(s.name, sx, sigY + 12);
  });

  y += 34;

  // Add footers on all pages
  addPageFooter();

  // Save PDF file
  const filename = `Executive-Quality-Audit-${result.pbiId.toLowerCase()}-${Date.now().toString().slice(-4)}.pdf`;
  doc.save(filename);
}
