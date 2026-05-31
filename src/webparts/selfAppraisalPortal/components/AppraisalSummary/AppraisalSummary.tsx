import * as React from 'react';
import { DateHelper } from '../../utils/DateHelper';
import { RatingHelper } from '../../utils/RatingHelper';
import { useAppContext } from '../../context/AppContext';
import { RatingControl } from '../common/RatingControl/RatingControl';
import styles from './AppraisalSummary.module.scss';
import { IAppraisalSummaryProps } from './IAppraisalSummaryProps';

export const AppraisalSummary: React.FC<IAppraisalSummaryProps> = React.memo((props) => {
  const { cycle, mappings, goals, responses, questions, qaResponses } = useAppContext();
  const finalRating = React.useMemo(() => RatingHelper.getFinalRating(mappings, goals, responses), [goals, mappings, responses]);
  const ratedGoals = responses.filter(response => response.selfRating > 0).length;
  const remainingDays = cycle ? DateHelper.remainingDays(cycle) : 0;

  return (
    <aside className={props.compact ? styles.compactPanel : styles.panel}>
      {cycle && (
        <section className={styles.card}>
          <h3>Self Appraisal Window</h3>
          <p>{DateHelper.formatDate(cycle.startDate)} to {DateHelper.formatDate(cycle.endDate)}</p>
          <span className={styles.badge}>{remainingDays} Days Remaining</span>
          <div className={styles.progressLabel}>
            <span>Your Progress</span>
            <strong>40% Completed</strong>
          </div>
          <div className={styles.track}><span className={styles.bar} /></div>
        </section>
      )}
      <section className={styles.card}>
        <h3>Appraisal Summary</h3>
        <dl className={styles.metrics}>
          <dt>Total KRAs</dt><dd>{mappings.length}</dd>
          <dt>Total Goals</dt><dd>{goals.length}</dd>
          <dt>Goals Rated</dt><dd>{ratedGoals} / {goals.length}</dd>
          <dt>Additional Questions</dt><dd>{qaResponses.filter(response => response.answer.trim()).length} / {questions.length}</dd>
        </dl>
        <div className={styles.finalRating}>
          <span>Final Self Rating</span>
          <RatingControl value={Math.round(finalRating)} label="Final self rating" readOnly={true} />
          <strong>{finalRating.toFixed(1)} / 5</strong>
        </div>
      </section>
    </aside>
  );
});

