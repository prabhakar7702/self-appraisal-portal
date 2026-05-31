import * as React from 'react';
import { MessageBar, MessageBarType } from '@fluentui/react';
import { IErrorMessageProps } from './IErrorMessageProps';

export const ErrorMessage: React.FC<IErrorMessageProps> = React.memo((props) => (
  <MessageBar messageBarType={MessageBarType.error}>{props.message}</MessageBar>
));

