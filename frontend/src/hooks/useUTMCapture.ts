import { useState, useEffect } from 'react';

interface UTMParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  gclid?: string;
  fbclid?: string;
}

interface UTMData extends UTMParams {
  referrer?: string;
  landing_page?: string;
  timestamp?: string;
}

export function useUTMCapture() {
  const [utmData, setUtmData] = useState<UTMData>({});

  const captureUTMsFromURL = (): UTMParams => {
    if (typeof window === 'undefined') return {};

    const urlParams = new URLSearchParams(window.location.search);
    const utmParams: UTMParams = {};

    // Capturar parâmetros UTM padrão
    const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
    utmKeys.forEach(key => {
      const value = urlParams.get(key);
      if (value) {
        utmParams[key as keyof UTMParams] = value;
      }
    });

    // Capturar GCLID (Google Ads)
    const gclid = urlParams.get('gclid');
    if (gclid) {
      utmParams.gclid = gclid;
    }

    // Capturar FBCLID (Facebook Ads)
    const fbclid = urlParams.get('fbclid');
    if (fbclid) {
      utmParams.fbclid = fbclid;
    }

    return utmParams;
  };

  const saveUTMsToStorage = (utms: UTMData) => {
    if (typeof window === 'undefined') return;

    try {
      // Salvar no localStorage com timestamp
      const utmDataWithTimestamp = {
        ...utms,
        timestamp: new Date().toISOString(),
        landing_page: window.location.href,
        referrer: document.referrer || 'direct',
      };

      localStorage.setItem('utm_data', JSON.stringify(utmDataWithTimestamp));
      
      // Também salvar no sessionStorage para uso imediato
      sessionStorage.setItem('utm_data', JSON.stringify(utmDataWithTimestamp));
    } catch (error) {
      console.warn('Erro ao salvar UTMs no storage:', error);
    }
  };

  const getUTMsFromStorage = (): UTMData | null => {
    if (typeof window === 'undefined') return null;

    try {
      // Primeiro tentar sessionStorage (mais recente)
      const sessionData = sessionStorage.getItem('utm_data');
      if (sessionData) {
        return JSON.parse(sessionData);
      }

      // Depois tentar localStorage
      const localData = localStorage.getItem('utm_data');
      if (localData) {
        return JSON.parse(localData);
      }
    } catch (error) {
      console.warn('Erro ao recuperar UTMs do storage:', error);
    }

    return null;
  };

  const clearUTMs = () => {
    if (typeof window === 'undefined') return;

    try {
      localStorage.removeItem('utm_data');
      sessionStorage.removeItem('utm_data');
      setUtmData({});
    } catch (error) {
      console.warn('Erro ao limpar UTMs:', error);
    }
  };

  const isUTMDataExpired = (timestamp: string): boolean => {
    const now = new Date();
    const utmTime = new Date(timestamp);
    const diffInHours = (now.getTime() - utmTime.getTime()) / (1000 * 60 * 60);
    
    // UTMs expiram após 30 dias
    return diffInHours > 24 * 30;
  };

  useEffect(() => {
    // Capturar UTMs da URL atual
    const urlUTMs = captureUTMsFromURL();
    
    // Verificar se há UTMs na URL
    const hasURLUTMs = Object.keys(urlUTMs).length > 0;
    
    if (hasURLUTMs) {
      // Se há UTMs na URL, usar eles e salvar
      const newUTMData: UTMData = {
        ...urlUTMs,
        referrer: document.referrer || 'direct',
        landing_page: window.location.href,
        timestamp: new Date().toISOString(),
      };
      
      setUtmData(newUTMData);
      saveUTMsToStorage(newUTMData);
    } else {
      // Se não há UTMs na URL, tentar recuperar do storage
      const storedUTMs = getUTMsFromStorage();
      
      if (storedUTMs && !isUTMDataExpired(storedUTMs.timestamp || '')) {
        setUtmData(storedUTMs);
      } else {
        // UTMs expirados ou não encontrados, limpar
        clearUTMs();
      }
    }
  }, []);

  const getUTMData = (): UTMData => {
    return utmData;
  };

  const getUTMString = (): string => {
    const params = new URLSearchParams();
    
    Object.entries(utmData).forEach(([key, value]) => {
      if (value && ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid'].includes(key)) {
        params.append(key, value);
      }
    });

    return params.toString();
  };

  const getUTMSummary = (): string => {
    const parts: string[] = [];
    
    if (utmData.utm_source) parts.push(`Source: ${utmData.utm_source}`);
    if (utmData.utm_medium) parts.push(`Medium: ${utmData.utm_medium}`);
    if (utmData.utm_campaign) parts.push(`Campaign: ${utmData.utm_campaign}`);
    if (utmData.gclid) parts.push('Google Ads');
    if (utmData.fbclid) parts.push('Facebook Ads');
    
    return parts.length > 0 ? parts.join(' | ') : 'Direct/Organic';
  };

  return {
    utmData,
    getUTMData,
    getUTMString,
    getUTMSummary,
    clearUTMs,
    captureUTMsFromURL,
  };
}
