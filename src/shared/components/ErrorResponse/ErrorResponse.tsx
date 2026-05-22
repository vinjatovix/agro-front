import React from 'react';
import type { UiError } from './types';

import './errorResponse.css';

export const ErrorResponse: React.FC<UiError> = ({ message, details }) => {
  return (
    <div role="alert" className="error-response">
      <p className="error-response__message">🚨 {message}</p>

      {details?.length ? (
        <ul className="error-response__details">
          {details.map((d, i) => (
            <li key={i}>{d}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
};
