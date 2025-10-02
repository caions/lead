'use client';

import { useUTMCapture } from '@/hooks/useUTMCapture';
import Card from '@/components/Card';

interface UTMDisplayProps {
  show?: boolean;
  className?: string;
}

export default function UTMDisplay({ show = false, className = '' }: UTMDisplayProps) {
  const { utmData, getUTMSummary } = useUTMCapture();

  if (!show) return null;

  return (
    <Card className={`bg-blue-50 border-blue-200 ${className}`}>
      <div className="text-sm">
        <h4 className="font-semibold text-blue-900 mb-2">📊 Dados de Tracking</h4>
        <div className="space-y-1 text-blue-800">
          <p><strong>Origem:</strong> {getUTMSummary()}</p>
          {utmData.referrer && (
            <p><strong>Referrer:</strong> {utmData.referrer}</p>
          )}
          {utmData.landing_page && (
            <p><strong>Página:</strong> {utmData.landing_page}</p>
          )}
          {utmData.timestamp && (
            <p><strong>Capturado em:</strong> {new Date(utmData.timestamp).toLocaleString('pt-BR')}</p>
          )}
        </div>
        
        {/* Detalhes técnicos */}
        <details className="mt-3">
          <summary className="cursor-pointer text-blue-700 font-medium">
            Ver detalhes técnicos
          </summary>
          <div className="mt-2 p-2 bg-blue-100 rounded text-xs font-mono">
            <pre>{JSON.stringify(utmData, null, 2)}</pre>
          </div>
        </details>
      </div>
    </Card>
  );
}
