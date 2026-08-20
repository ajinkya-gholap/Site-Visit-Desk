import { Component } from 'react';
import styles from './Analytics.module.css';

export default class AnalyticsErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    // In a real app this would report to a logging service.
    console.error('SiteAnalytics chunk failed to load:', error);
  }

  handleRetry = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className={styles.panel}>
          <p className={styles.errorText}>Couldn't load the analytics panel.</p>
          <button type="button" className={styles.retryBtn} onClick={this.handleRetry}>
            Retry
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
