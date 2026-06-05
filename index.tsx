
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import { EntityProvider } from './contexts/EntityContext';

// Filtrar erros de extensões do Chrome no console - camada adicional
// Nota: O filtro principal já está no index.html e executa primeiro
const originalError = window.console.error || console.error;
const originalWarn = window.console.warn || console.warn;
const originalLog = window.console.log || console.log;

// Verificar se já foi interceptado pelo index.html
if (!window.__consoleErrorIntercepted) {
  window.__consoleErrorIntercepted = true;
  
  console.error = function(...args) {
    const errorString = String(args.join(' '));
    const errorObj = args.find(arg => typeof arg === 'object' && arg);
    const errorStack = errorObj?.stack || '';
    
    // Verificar especificamente por contentscript.js:31
    const hasContentscript31 = errorString.includes('contentscript.js:31');
    const hasQuerySelectorNull = errorString.includes('Cannot read properties of null') && 
                                 errorString.includes('querySelector');
    const hasContentscript = errorString.includes('contentscript.js') || 
                            errorStack.includes('contentscript.js');
    
    // Verificar mensagens de conteúdo de extensões
    const hasContentMessages = 
      errorString.includes('[Content]') ||
      errorString.includes('content.ts') ||
      errorStack.includes('content.ts') ||
      errorString.includes('Received message:') ||
      errorString.includes('Handling message:') ||
      errorString.includes('Getting tab HTML') ||
      errorString.includes('Sending tab HTML') ||
      errorString.includes('DETECT_BLACKBOARD_DOM') ||
      errorString.includes('GET_TAB_HTML');
    
    // Ignorar erros conhecidos de extensões
    const isExtensionError = 
      errorString.includes('chrome-extension://') ||
      errorString.includes('chrome-extension://aggiiclaiamajehmlfpkjmlbadmkledi') ||
      hasContentscript ||
      hasContentscript31 ||
      hasContentMessages ||
      errorString.includes('popup.js') ||
      errorString.includes('tat_popup.js') ||
      errorString.includes('web_accessible_resources') ||
      errorString.includes('chrome-extension://invalid/') ||
      errorString.includes('Denying load of chrome-extension://') ||
      errorString.includes('Failed to load resource') ||
      errorString.includes('net::ERR_FAILED') ||
      errorString.includes('Resources must be listed in the web_accessible_resources') ||
      errorString.includes('Understand this error') || // Filtro adicional para mensagens do Chrome
      (hasQuerySelectorNull && (hasContentscript || errorStack.includes('contentscript'))) ||
      errorString.includes('listener indicated an asynchronous response') ||
      errorString.includes('message channel closed') ||
      (errorString.includes('Cannot read properties of null') && 
       errorString.includes('querySelector') && 
       (hasContentscript || errorStack.includes('contentscript')));
    
    if (isExtensionError) {
      return; // Não mostrar no console
    }
    originalError.apply(console, args);
  };
  
  console.warn = function(...args) {
    const warnString = String(args.join(' '));
    const isExtensionWarning = 
      warnString.includes('chrome-extension://') ||
      warnString.includes('contentscript.js') ||
      warnString.includes('content.ts') ||
      warnString.includes('popup.js') ||
      warnString.includes('tat_popup.js') ||
      warnString.includes('web_accessible_resources') ||
      warnString.includes('[Content]');
    
    if (isExtensionWarning) {
      return; // Não mostrar
    }
    originalWarn.apply(console, args);
  };

  console.log = function(...args) {
    const logString = String(args.join(' '));
    const isExtensionLog =
      logString.includes('[Content]') ||
      logString.includes('content.ts') ||
      logString.includes('contentscript.js') ||
      logString.includes('chrome-extension://') ||
      logString.includes('popup.js') ||
      logString.includes('tat_popup.js') ||
      logString.includes('web_accessible_resources') ||
      logString.includes('DETECT_BLACKBOARD_DOM') ||
      logString.includes('GET_TAB_HTML') ||
      logString.includes('Received message:') ||
      logString.includes('Handling message:') ||
      logString.includes('Getting tab HTML') ||
      logString.includes('Sending tab HTML');

    if (isExtensionLog) {
      return; // Não mostrar
    }
    originalLog.apply(console, args);
  };
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <BrowserRouter>
    <EntityProvider>
      <App />
    </EntityProvider>
  </BrowserRouter>
);
