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
    // Only reset if the children prop's identity changes in a meaningful way
    if (prevProps.children !== this.props.children) {
      // Check if the child's key or type has changed
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

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h2>Something went wrong.</h2>
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