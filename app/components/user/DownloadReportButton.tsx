"use client";

import { Download } from "lucide-react";

interface Transaction {
    date: string | Date;
    description: string | null;
    category?: { CategoryName: string } | null;
    type: string;
    amount: number;
}

export default function DownloadReportButton({ 
    transactions, 
    totalIncome, 
    totalExpense 
}: { 
    transactions: Transaction[], 
    totalIncome: number, 
    totalExpense: number 
}) {
    const handleDownload = () => {
        // Generate CSV header
        let csvContent = "Date,Description,Category,Type,Amount\n";

        // Generate CSV rows
        transactions.forEach((t) => {
            const date = new Date(t.date).toLocaleDateString();
            const desc = t.description ? t.description.replace(/,/g, " ") : ""; // avoid comma issues
            const cat = t.category?.CategoryName || "Uncategorized";
            const type = t.type;
            const amount = t.amount;
            csvContent += `${date},${desc},${cat},${type},${amount}\n`;
        });
        
        // Add summary rows
        csvContent += `\nSummary,,,,,`;
        csvContent += `\nTotal Income,,,,${totalIncome}`;
        csvContent += `\nTotal Expense,,,,${totalExpense}`;
        csvContent += `\nNet Savings,,,,${totalIncome - totalExpense}\n`;

        // Create Blob and Download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", "financial_report.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <button
            onClick={handleDownload}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            title="Download Report as CSV"
        >
            <Download className="w-5 h-5" />
            Download CSV
        </button>
    );
}
