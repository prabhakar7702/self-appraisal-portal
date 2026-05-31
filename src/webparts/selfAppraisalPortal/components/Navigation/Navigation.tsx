import * as React from 'react';
import { Icon } from '@fluentui/react';
import { ROUTES } from '../../constants/Routes';
import styles from './Navigation.module.scss';
import { INavigationProps } from './INavigationProps';

const navItems = [
  { route: ROUTES.Home, label: 'Home', iconName: 'Home' },
  { route: ROUTES.CreateGoals, label: 'Create Goals', iconName: 'CircleAddition' },
  { route: ROUTES.AppraisalForm, label: 'Self Appraisal Form', iconName: 'Completed' },
  { route: ROUTES.AdditionalQuestions, label: 'Additional Questions', iconName: 'Questionnaire' },
  { route: ROUTES.UploadDocuments, label: 'Upload Documents', iconName: 'PageAdd' },
];

export const Navigation: React.FC<INavigationProps> = React.memo((props) => (
  <nav className={styles.navigation} aria-label="Self appraisal navigation">
    {navItems.map(item => (
      <button
        aria-current={props.activeRoute === item.route ? 'page' : undefined}
        className={props.activeRoute === item.route ? styles.activeNavButton : styles.navButton}
        key={item.route}
        onClick={() => props.onNavigate(item.route)}
        type="button"
      >
        <Icon iconName={item.iconName} />
        <span>{item.label}</span>
      </button>
    ))}
    {/* <div className={styles.help}>
      <Icon iconName="Help" />
      <span>Help & Support</span>
    </div> */}
  </nav>
));

