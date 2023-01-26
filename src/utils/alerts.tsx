import React from 'react';
import FlashMessage, { showMessage } from 'react-native-flash-message'

interface MessageDataProps {
  message: string
  description?: string
}

export const successMessage = ({ message, description = '' }: MessageDataProps) => {
  showMessage({
    message: message,
    description: description,
    type: 'success',
    duration: 3000,
  });
};

export const errorMessage = ({ message, description = '' }: MessageDataProps) => {
  showMessage({
    message: message,
    description: description,
    type: 'danger',
    duration: 2000,
  });
};

export const FlashMessageOnModal = React.forwardRef((props, ref) => (<FlashMessage position="top" />));
