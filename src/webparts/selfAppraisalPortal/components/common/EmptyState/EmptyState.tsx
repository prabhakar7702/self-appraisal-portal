import * as React from 'react';
import { Icon } from '@fluentui/react';
import styles from './EmptyState.module.scss';
import { IEmptyStateProps } from './IEmptyStateProps';

export const EmptyState: React.FC<IEmptyStateProps> = React.memo((props) => (
  <section className={styles.emptyState} aria-live="polite">
    <span className={styles.iconWrap} aria-hidden="true">
      <Icon iconName={props.iconName} className={styles.icon} />
    </span>
    <h2>{props.title}</h2>
    <p>{props.message}</p>
  </section>
));

