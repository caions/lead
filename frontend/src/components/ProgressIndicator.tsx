'use client';

interface ProgressIndicatorProps {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  message: string;
  className?: string;
}

export default function ProgressIndicator({
  isLoading,
  isSuccess,
  isError,
  message,
  className = ''
}: ProgressIndicatorProps) {
  if (!isLoading && !isSuccess && !isError) {
    return null;
  }

  return (
    <div className={`fixed top-4 right-4 z-50 max-w-sm ${className}`}>
      <div className={`rounded-lg shadow-lg p-4 transition-all duration-300 ${
        isLoading ? 'bg-blue-50 border border-blue-200' :
        isSuccess ? 'bg-green-50 border border-green-200' :
        isError ? 'bg-red-50 border border-red-200' : ''
      }`}>
        <div className="flex items-center space-x-3">
          {/* Ícone de Status */}
          <div className="flex-shrink-0">
            {isLoading && (
              <div className="w-6 h-6">
                <svg className="animate-spin h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            )}
            
            {isSuccess && (
              <div className="w-6 h-6">
                <svg className="h-6 w-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            )}
            
            {isError && (
              <div className="w-6 h-6">
                <svg className="h-6 w-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>

          {/* Mensagem */}
          <div className="flex-1">
            <p className={`text-sm font-medium ${
              isLoading ? 'text-blue-800' :
              isSuccess ? 'text-green-800' :
              isError ? 'text-red-800' : ''
            }`}>
              {message}
            </p>
            
            {isLoading && (
              <div className="mt-2">
                <div className="bg-blue-200 rounded-full h-1">
                  <div className="bg-blue-600 h-1 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                </div>
              </div>
            )}
          </div>

          {/* Botão de Fechar */}
          {(isSuccess || isError) && (
            <button
              onClick={() => window.location.reload()}
              className={`flex-shrink-0 p-1 rounded-full hover:bg-opacity-20 ${
                isSuccess ? 'hover:bg-green-600' : 'hover:bg-red-600'
              }`}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
