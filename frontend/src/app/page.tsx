import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Container from '@/components/Container';
import Card from '@/components/Card';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header title="Sistema de Gestão de Leads" />
      
      <main className="flex-1 py-8">
        <Container maxWidth="2xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Capture e Gerencie Seus Leads
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Sistema completo para captura, gestão e análise de leads com tracking automático de UTMs
            </p>
          </div>

          <div className="grid-responsive">
            {/* Card de Funcionalidades */}
            <Card hover className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Formulário Público</h3>
              <p className="text-gray-600 text-sm">
                Capture leads através de formulário otimizado com validações em tempo real
              </p>
            </Card>

            <Card hover className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Painel Admin</h3>
              <p className="text-gray-600 text-sm">
                Gerencie todos os leads com interface intuitiva e funcionalidades avançadas
              </p>
            </Card>

            <Card hover className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Tracking Automático</h3>
              <p className="text-gray-600 text-sm">
                Capture UTMs, GCLID, FBCLID automaticamente para análise completa
              </p>
            </Card>

            <Card hover className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Exportação CSV</h3>
              <p className="text-gray-600 text-sm">
                Exporte dados em formato CSV para análise externa e relatórios
              </p>
            </Card>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-12">
            <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white border-0">
              <h2 className="text-2xl font-bold mb-4">Pronto para Começar?</h2>
              <p className="text-blue-100 mb-6">
                Acesse o formulário público para capturar leads ou faça login no painel administrativo
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="#formulario" 
                  className="btn-primary bg-white text-blue-600 hover:bg-gray-100"
                >
                  Ver Formulário
                </a>
                <a 
                  href="/admin/login" 
                  className="btn-secondary bg-blue-500 hover:bg-blue-400 text-white border-blue-400"
                >
                  Login Admin
                </a>
              </div>
            </Card>
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}