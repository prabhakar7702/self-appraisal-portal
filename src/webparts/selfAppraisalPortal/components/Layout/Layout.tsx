import * as React from 'react';
import { Icon } from '@fluentui/react';
import { Navigation } from '../Navigation/Navigation';
import styles from './Layout.module.scss';
import { ILayoutProps } from './ILayoutProps';

export const Layout: React.FC<ILayoutProps> = React.memo((props) => (
  <div className={styles.shell}>
    <header className={styles.header}>
      <div className={styles.brand}>
        <span className={styles.logo} aria-hidden="true">
          <Icon iconName="HexaditeInvestigation" />
        </span>
        <strong>Self Appraisal System</strong>
      </div>
      <div className={styles.user}>
        <span>{props.userDisplayName}</span>
        <Icon iconName="Contact" />
      </div>
    </header>
    <div className={styles.body}>
      <Navigation activeRoute={props.activeRoute} onNavigate={props.onNavigate} />
      <main className={styles.content}>{props.children}</main>
    </div>
  </div>
));

