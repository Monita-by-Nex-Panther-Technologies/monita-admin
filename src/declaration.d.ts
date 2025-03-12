// src/types/declaration.d.ts
import "jspdf-autotable";

declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: AutoTableOptions) => jsPDF;
  }

  // Define proper typing for autotable options
  interface AutoTableOptions {
    head?: Array<Array<any>>;
    body?: Array<Array<any>>;
    foot?: Array<Array<any>>;
    columns?: Array<{
      header?: string;
      dataKey?: string | number;
      [key: string]: any;
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
      [key: string]: any;
    };
    headStyles?: {
      [key: string]: any;
    };
    bodyStyles?: {
      [key: string]: any;
    };
    footStyles?: {
      [key: string]: any;
    };
    alternateRowStyles?: {
      [key: string]: any;
    };
    columnStyles?: {
      [key: string]: any;
    };
    didDrawPage?: (data: any) => void;
    didDrawCell?: (data: any) => void;
    willDrawCell?: (data: any) => void;
    [key: string]: any; // Allow for other configuration options
  }
}

// Alternative solution with ESLint disable comment if you prefer
// that approach instead of the full type definition above:

/*
declare module "jspdf" {
  interface jsPDF {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    autoTable: (options: any) => jsPDF;
  }
}
*/
