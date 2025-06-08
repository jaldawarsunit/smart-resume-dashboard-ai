
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';
import { Resume } from '@/types/resume';

export const downloadResumeAsPDF = async (elementId: string, filename: string) => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('Resume element not found');
    }

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    const imgX = (pdfWidth - imgWidth * ratio) / 2;
    const imgY = 0;

    pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
    pdf.save(`${filename}.pdf`);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};

export const downloadResumeAsDOCX = async (resume: Resume, filename: string) => {
  try {
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          // Header
          new Paragraph({
            children: [
              new TextRun({
                text: resume.basicInfo.name,
                bold: true,
                size: 32,
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
          }),
          
          // Contact Info
          new Paragraph({
            children: [
              new TextRun({
                text: `${resume.basicInfo.email} | ${resume.basicInfo.phone}`,
                size: 22,
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
          }),

          // Professional Summary
          new Paragraph({
            children: [
              new TextRun({
                text: "PROFESSIONAL SUMMARY",
                bold: true,
                size: 24,
              }),
            ],
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 200 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Seeking a position as ${resume.targetJobRole} where I can leverage my skills and experience to contribute to organizational success.`,
                size: 22,
              }),
            ],
            spacing: { after: 400 },
          }),

          // Skills
          new Paragraph({
            children: [
              new TextRun({
                text: "CORE COMPETENCIES",
                bold: true,
                size: 24,
              }),
            ],
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 200 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: resume.skills.join(' • '),
                size: 22,
              }),
            ],
            spacing: { after: 400 },
          }),

          // Projects
          ...(resume.projects.length > 0 ? [
            new Paragraph({
              children: [
                new TextRun({
                  text: "KEY PROJECTS",
                  bold: true,
                  size: 24,
                }),
              ],
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 200, after: 200 },
            }),
            ...resume.projects.flatMap(project => [
              new Paragraph({
                children: [
                  new TextRun({
                    text: project.title,
                    bold: true,
                    size: 22,
                  }),
                ],
                spacing: { after: 100 },
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: project.description,
                    size: 20,
                  }),
                ],
                spacing: { after: 100 },
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: `Technologies: ${project.technologies.join(', ')}`,
                    size: 20,
                    italics: true,
                  }),
                ],
                spacing: { after: 300 },
              }),
            ])
          ] : []),

          // Education
          new Paragraph({
            children: [
              new TextRun({
                text: "EDUCATION",
                bold: true,
                size: 24,
              }),
            ],
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 200 },
          }),
          ...(resume.education.collegeName ? [
            new Paragraph({
              children: [
                new TextRun({
                  text: resume.education.collegeName,
                  bold: true,
                  size: 22,
                }),
              ],
              spacing: { after: 100 },
            }),
            ...(resume.education.cgpa ? [
              new Paragraph({
                children: [
                  new TextRun({
                    text: `CGPA: ${resume.education.cgpa}`,
                    size: 20,
                  }),
                ],
                spacing: { after: 200 },
              }),
            ] : []),
          ] : []),

          // Certifications
          ...(resume.certifications.length > 0 ? [
            new Paragraph({
              children: [
                new TextRun({
                  text: "CERTIFICATIONS",
                  bold: true,
                  size: 24,
                }),
              ],
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 200, after: 200 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: resume.certifications.join(' • '),
                  size: 22,
                }),
              ],
              spacing: { after: 400 },
            }),
          ] : []),
        ],
      }],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `${filename}.docx`);
  } catch (error) {
    console.error('Error generating DOCX:', error);
    throw error;
  }
};
