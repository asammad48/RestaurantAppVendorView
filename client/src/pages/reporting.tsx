import { FileText } from "lucide-react";

export default function Reporting() {
  return (
    <div className="flex items-center justify-center h-96" data-testid="reporting-page">
      <div className="text-center">
        <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2" data-testid="reporting-title">Reporting</h3>
        <p className="text-gray-500" data-testid="reporting-message">This section is under construction.</p>
      </div>
    </div>
  );
}
