import { useUiStore } from '../stores/ui.store';

export interface AppErrorResponse {
  title: string;
  message: string;
  severity: 'toast' | 'modal';
}

/**
 * Maps a raw backend HTTP error to a user-friendly UI response
 */
export const mapApiError = (error: any): AppErrorResponse => {
  const status = error?.response?.status;
  
  if (status === 400) {
    return {
      title: 'Invalid Request',
      message: 'Please check your form inputs and try again. Some information might be missing or invalid.',
      severity: 'toast',
    };
  }
  
  if (status === 401 || status === 403) {
    return {
      title: 'Access Denied',
      message: 'You do not have permission to perform this action. Please make sure you are logged in.',
      severity: 'modal',
    };
  }
  
  if (status === 404) {
    return {
      title: 'Not Found',
      message: 'The resource you are trying to access could not be found.',
      severity: 'toast',
    };
  }

  // Network Error / Timeout
  if (!error.response && error.request) {
    return {
      title: 'Connection Error',
      message: 'Unable to reach our servers. Please check your internet connection and try again.',
      severity: 'toast',
    };
  }

  // Default Fallback
  return {
    title: 'Unexpected Error',
    message: 'We encountered an unexpected error while processing your request. Please try again later.',
    severity: 'modal',
  };
};

/**
 * Global handler to process an API error and automatically show the correct UI
 */
export const handleGlobalError = (error: any) => {
  const mappedError = mapApiError(error);
  const { showToast, showModal } = useUiStore.getState();

  if (mappedError.severity === 'modal') {
    showModal({
      title: mappedError.title,
      description: mappedError.message,
    });
  } else {
    showToast({
      title: mappedError.title,
      description: mappedError.message,
      variant: 'error',
    });
  }
};
