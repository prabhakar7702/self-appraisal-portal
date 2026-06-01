import * as React from 'react';
import { DefaultButton, PrimaryButton } from '@fluentui/react';
import { ROUTES } from '../../constants/Routes';
import { DateHelper } from '../../utils/DateHelper';
import { useAppContext } from '../../context/AppContext';
import styles from './Home.module.scss';
import { IHomeProps } from './IHomeProps';

export const Home: React.FC<IHomeProps> = React.memo((props) => {
  const { employee, cycle, appraisalResponse, goals, responses, isCycleOpen, isReadOnly } = useAppContext();
  const goalsCreated = goals.length;
  const goalsRated = responses.filter(response => response.selfRating > 0).length;
  const completion = goalsCreated > 0 ? Math.round((goalsRated / goalsCreated) * 100) : 0;

  const actionLabel = React.useMemo(() => {
    if (!appraisalResponse) {
      return isCycleOpen ? 'Start Appraisal' : 'Appraisal Closed';
    }
    if (appraisalResponse.status === 'Submitted') {
      return 'View Appraisal';
    }
    return 'Continue Appraisal';
  }, [appraisalResponse, isCycleOpen]);

  return (
    <section className={styles.home}>
      <h1>Self Appraisal Dashboard</h1>
      <article className={styles.dashboardCard}>
        <div className={styles.metaGrid}>
          <div><span>Employee</span><strong>{employee && employee.employeeName}</strong></div>
          <div><span>Designation</span><strong>{employee && employee.designationTitle}</strong></div>
          <div><span>Cycle</span><strong>{cycle && cycle.cycle}</strong></div>
          <div><span>Window</span><strong>{cycle && `${DateHelper.formatDate(cycle.startDate)} - ${DateHelper.formatDate(cycle.endDate)}`}</strong></div>
          <div><span>Status</span><strong>{appraisalResponse ? appraisalResponse.status : 'Not Started'}</strong></div>
          <div><span>Completion</span><strong>{completion}%</strong></div>
          <div><span>Goals Created</span><strong>{goalsCreated}</strong></div>
          <div><span>Goals Rated</span><strong>{goalsRated}</strong></div>
          <div><span>Final Rating</span><strong>{appraisalResponse && appraisalResponse.finalRating ? `${appraisalResponse.finalRating}/5` : 'N/A'}</strong></div>
          <div><span>Last Saved</span><strong>{appraisalResponse && appraisalResponse.draftSavedDate ? DateHelper.formatDate(appraisalResponse.draftSavedDate) : 'N/A'}</strong></div>
          <div><span>Submitted Date</span><strong>{appraisalResponse && appraisalResponse.submittedDate ? DateHelper.formatDate(appraisalResponse.submittedDate) : 'N/A'}</strong></div>
        </div>
        {isReadOnly ? (
          <DefaultButton text={actionLabel} onClick={() => props.onNavigate(ROUTES.AppraisalForm)} />
        ) : (
          <PrimaryButton text={actionLabel} onClick={() => props.onNavigate(ROUTES.AppraisalForm)} disabled={!isCycleOpen} />
        )}
      </article>
    </section>
  );
});
