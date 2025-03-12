// src/types/declaration.d.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import "jspdf-autotable";

declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: AutoTableOptions) => jsPDF;
  }

  // Define proper typing for autotable options
  interface AutoTableOptions {
    head?: Array<Array<unknown>>;
    body?: Array<Array<unknown>>;
    foot?: Array<Array<unknown>>;
    columns?: Array<{
      header?: string;
      dataKey?: string | number;
      [key: string]: unknown;
    }>;
    startY?: number;
    margin?: {
      top?: number;
      right?: number;
      bottom?: number;
      left?: number;
    };
    pageBreak?: "auto" | "avoid" | "always";
    rowPageBreak?: "auto" | "avoid";
    tableWidth?: "auto" | "wrap" | number;
    showHead?: "everyPage" | "firstPage" | "never";
    showFoot?: "everyPage" | "lastPage" | "never";
    tableLineWidth?: number;
    tableLineColor?: string;
    theme?: "striped" | "grid" | "plain";
    styles?: {
      font?: string;
      fontStyle?: string;
      fontSize?: number;
      cellPadding?: number;
      lineColor?: string;
      lineWidth?: number;
      cellWidth?: "auto" | "wrap" | number;
      minCellHeight?: number;
      halign?: "left" | "center" | "right";
      valign?: "top" | "middle" | "bottom";
      fillColor?: string;
      textColor?: string;
      [key: string]: unknown;
    };
    headStyles?: Record<string, unknown>;
    bodyStyles?: Record<string, unknown>;
    footStyles?: Record<string, unknown>;
    alternateRowStyles?: Record<string, unknown>;
    columnStyles?: Record<string, unknown>;
    didDrawPage?: (data: unknown) => void;
    didDrawCell?: (data: unknown) => void;
    willDrawCell?: (data: unknown) => void;
    [key: string]: unknown; // Allow for other configuration options
  }
}
