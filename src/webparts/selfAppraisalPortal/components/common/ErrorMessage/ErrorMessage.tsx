import * as React from 'react';
import { Icon, MessageBar, MessageBarType } from '@fluentui/react';
import { IErrorMessageProps } from './IErrorMessageProps';
import styles from './ErrorMessage.module.scss';

export const ErrorMessage: React.FC<IErrorMessageProps> = React.memo((props) => (
  <div className={styles.wrap}>
    <MessageBar messageBarType={MessageBarType.error} isMultiline={true}>
      <div className={styles.row}>
        <Icon iconName="StatusErrorFull" className={styles.icon} />
        <div>
          <strong className={styles.title}>We hit an issue while loading data</strong>
          <div>{props.message}</div>
          <small className={styles.hint}>Try refreshing the page. If this continues, contact your SharePoint administrator.</small>
        </div>
      </div>
    </MessageBar>
  </div>
));
