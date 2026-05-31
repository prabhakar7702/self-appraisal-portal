import * as React from 'react';
import { Icon, IconButton } from '@fluentui/react';
import { Navigation } from '../Navigation/Navigation';
import styles from './Layout.module.scss';
import { ILayoutProps } from './ILayoutProps';

export const Layout: React.FC<ILayoutProps> = React.memo((props) => {
  const [mobileNavOpen, setMobileNavOpen] = React.useState<boolean>(false);

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <div className={styles.brand}>
          <IconButton ariaLabel="Toggle navigation menu" iconProps={{ iconName: 'GlobalNavButton' }} className={styles.menuButton} onClick={() => setMobileNavOpen(previous => !previous)} />
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
        <div className={mobileNavOpen ? styles.navOpen : styles.navClosed}>
          <Navigation activeRoute={props.activeRoute} onNavigate={props.onNavigate} />
        </div>
        <main className={styles.content}>{props.children}</main>
      </div>
    </div>
  );
});

