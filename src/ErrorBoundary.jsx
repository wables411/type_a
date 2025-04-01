import React, { Component } from 'react';

class ErrorBoundary extends Component {
  state = { hasError: false, error: null, errorInfo: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.children !== this.props.children) {
      const prevChildKey = prevProps.children?.key;
      const currentChildKey = this.props.children?.key;
      const prevChildType = prevProps.children?.type;
      const currentChildType = this.props.children?.type;

      if (prevChildKey !== currentChildKey || prevChildType !== currentChildType) {
        this.setState({ hasError: false, error: null, errorInfo: null });
        console.log('ErrorBoundary reset due to children change');
      }
    }
  }

  componentDidMount() {
    // Catch unhandled promise rejections
    window.addEventListener('unhandledrejection', this.handleUnhandledRejection);
  }

  componentWillUnmount() {
    window.removeEventListener('unhandledrejection', this.handleUnhandledRejection);
  }

  handleUnhandledRejection = (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    this.setState({
      hasError: true,
      error: event.reason,
      errorInfo: { componentStack: event.reason.stack || '' },
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ color: 'white', textAlign: 'center', padding: '20px' }}>
          <h2>Something went wrong with the MP3 Player.</h2>
          <p>{this.state.error?.message || 'Unknown error'}</p>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo?.componentStack}
          </details>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;