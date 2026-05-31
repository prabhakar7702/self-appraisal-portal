import * as React from 'react';
import { DefaultButton, Icon, PrimaryButton } from '@fluentui/react';
import { ROUTES } from '../../constants/Routes';
import { DateHelper } from '../../utils/DateHelper';
import { useAppContext } from '../../context/AppContext';
import styles from './Home.module.scss';
import { IHomeProps } from './IHomeProps';

export const Home: React.FC<IHomeProps> = React.memo((props) => {
  const { employee, cycle } = useAppContext();
  const remainingDays = cycle ? DateHelper.remainingDays(cycle) : 0;

  return (
    <section className={styles.home}>
      <h1>Welcome, {employee ? employee.employeeName : 'Employee'}!</h1>
      {/* <p>Choose an action available for your role.</p> */}
      <div className={styles.cards}>
        <article className={styles.actionCard}>
          <span className={styles.iconBox}><Icon iconName="Contact" /></span>
          <div>
            <h2>Self Appraisal</h2>
            <p>Complete your self appraisal for this appraisal period.</p>
            <PrimaryButton text="Go to Self Appraisal" iconProps={{ iconName: 'Forward' }} onClick={() => props.onNavigate(ROUTES.CreateGoals)} />
          </div>
        </article>
        <article className={styles.actionCard}>
          <span className={styles.iconBox}><Icon iconName="Calendar" /></span>
          <div>
            <h2>Self Appraisal Window</h2>
            {cycle && <p>{DateHelper.formatDate(cycle.startDate)} to {DateHelper.formatDate(cycle.endDate)}</p>}
            <span className={styles.badge}>{remainingDays} Days Remaining</span>
            <div className={styles.progressLine}>
              <strong>Your progress</strong>
              <span>40% Completed</span>
            </div>
            <div className={styles.track}><span /></div>
          </div>
        </article>
      </div>
      {/* <DefaultButton text="Review Drafts & Submissions" iconProps={{ iconName: 'Save' }} onClick={() => props.onNavigate(ROUTES.Drafts)} /> */}
    </section>
  );
});

