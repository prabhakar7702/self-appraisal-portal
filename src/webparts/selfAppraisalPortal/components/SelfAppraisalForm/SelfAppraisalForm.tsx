import * as React from 'react';
import { DefaultButton, Dropdown, IDropdownOption, PrimaryButton, TextField } from '@fluentui/react';
import { useAppContext } from '../../context/AppContext';
import { IEmployeeGoal, IGoalResponse } from '../../models/Goal';
import { RatingHelper } from '../../utils/RatingHelper';
import { AppraisalSummary } from '../AppraisalSummary/AppraisalSummary';
import { RatingControl } from '../common/RatingControl/RatingControl';
import styles from './SelfAppraisalForm.module.scss';
import { ISelfAppraisalFormProps } from './ISelfAppraisalFormProps';

const progressOptions: IDropdownOption[] = [0, 25, 50, 60, 70, 80, 90, 100].map(value => ({
  key: value,
  text: `${value}%`
}));

export const SelfAppraisalForm: React.FC<ISelfAppraisalFormProps> = React.memo((props) => {
  const { employee, mappings, goals, responses, updateGoal, updateResponse, saveDraft, submit, isCycleOpen } = useAppContext();
  const finalRating = React.useMemo(() => RatingHelper.getFinalRating(mappings, goals, responses), [goals, mappings, responses]);

  const getResponse = React.useCallback((goal: IEmployeeGoal): IGoalResponse => {
    return responses.filter(response => response.goalId === goal.id)[0] || {
      id: Date.now(),
      appraisalHeaderId: goal.appraisalHeaderId,
      goalId: goal.id,
      selfRating: 0,
      selfComments: ''
    };
  }, [responses]);

  const onProgressChange = React.useCallback((goal: IEmployeeGoal, option?: IDropdownOption): void => {
    updateGoal({ ...goal, progress: Number(option ? option.key : goal.progress) });
  }, [updateGoal]);

  const onRatingChange = React.useCallback((goal: IEmployeeGoal, rating: number): void => {
    const response = getResponse(goal);
    updateResponse({ ...response, selfRating: rating });
  }, [getResponse, updateResponse]);

  const onCommentChange = React.useCallback((goal: IEmployeeGoal, value?: string): void => {
    const response = getResponse(goal);
    updateResponse({ ...response, selfComments: value || '' });
  }, [getResponse, updateResponse]);

  const save = React.useCallback(async (): Promise<void> => {
    props.onSaveMessage(await saveDraft());
  }, [props, saveDraft]);

  const submitForm = React.useCallback(async (): Promise<void> => {
    props.onSaveMessage(await submit());
  }, [props, submit]);

  return (
    <section className={styles.page}>
      <div className={styles.main}>
        <div className={styles.topRow}>
          <div>
            <h1>Self Appraisal Form</h1>
            <p>Provide rating and comments for each goal under the KRAs.</p>
          </div>
          <div className={styles.actions}>
            <DefaultButton text="Save as Draft" iconProps={{ iconName: 'Save' }} onClick={save} disabled={!isCycleOpen} />
            <PrimaryButton text="Submit Self Appraisal" iconProps={{ iconName: 'Send' }} onClick={submitForm} disabled={!isCycleOpen} />
          </div>
        </div>
        {employee && (
          <section className={styles.employeePanel} aria-label="Employee details">
            <div><span>Employee Name</span><strong>{employee.employeeName}</strong></div>
            <div><span>Employee ID</span><strong>{employee.employeeId}</strong></div>
            <div><span>Department</span><strong>{employee.department}</strong></div>
            <div><span>Designation</span><strong>{employee.designationTitle}</strong></div>
          </section>
        )}
        {mappings.map(mapping => {
          const kraGoals = goals.filter(goal => goal.designationKraId === mapping.id);
          const kraRating = RatingHelper.getKraRating(mapping.id, goals, responses);
          return (
            <article className={styles.kraCard} key={mapping.id}>
              <header className={styles.kraHeader}>
                <h2>{mapping.displayOrder}. {mapping.kra.name} <span>(Weightage: {mapping.weightage}%)</span></h2>
                <div className={styles.kraRating}>
                  <span>KRA Rating</span>
                  <RatingControl value={Math.round(kraRating)} label={`${mapping.kra.name} rating`} readOnly={true} />
                  <strong>{kraRating.toFixed(1)} / 5</strong>
                </div>
              </header>
              <div className={styles.tableHeader}>
                <span>#</span><span>Goal Title</span><span>Goal Progress (%)</span><span>Self Rating (1 - 5)</span><span>Comments</span>
              </div>
              {kraGoals.map((goal, index) => {
                const response = getResponse(goal);
                return (
                  <div className={styles.tableRow} key={goal.id}>
                    <span>{index + 1}</span>
                    <strong>{goal.goalTitle}</strong>
                    <Dropdown ariaLabel={`${goal.goalTitle} progress`} options={progressOptions} selectedKey={goal.progress} onChange={(_, option) => onProgressChange(goal, option)} />
                    <RatingControl value={response.selfRating} label={`${goal.goalTitle} self rating`} onChange={(rating) => onRatingChange(goal, rating)} />
                    <TextField ariaLabel={`${goal.goalTitle} comments`} multiline={true} rows={3} value={response.selfComments} onChange={(_, value) => onCommentChange(goal, value)} />
                  </div>
                );
              })}
            </article>
          );
        })}
        <section className={styles.finalRating}>
          <strong>Final Self Rating (Based on KRA Weightage)</strong>
          <RatingControl value={Math.round(finalRating)} label="Final self rating" readOnly={true} />
          <strong>{finalRating.toFixed(1)} / 5</strong>
        </section>
      </div>
      <AppraisalSummary />
    </section>
  );
});

