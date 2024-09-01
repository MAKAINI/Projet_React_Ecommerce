import React, { Component, ErrorInfo} from 'react';

interface ErrorBoundaryProps {
  fallback: React.ReactNode;
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_error: Error): ErrorBoundaryState {
    // Mettre à jour l'état pour indiquer qu'il y a une erreur
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Ici, tu peux aussi envoyer l'erreur à un service de suivi d'erreurs comme Sentry, etc.
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Affiche un fallback si une erreur est détectée
      return this.props.fallback;
    }

    // Affiche normalement les enfants s'il n'y a pas d'erreur
    return this.props.children;
  }
}

export default ErrorBoundary;