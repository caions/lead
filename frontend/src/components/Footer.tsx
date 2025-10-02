export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="container-responsive">
        <div className="py-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-xs">L</span>
              </div>
              <span className="text-sm text-gray-600">
                Sistema de Gestão de Leads
              </span>
            </div>
            
            <div className="text-sm text-gray-500">
              © 2024 Sistema de Leads. Todos os direitos reservados.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
