import * as React from 'react';
import { DefaultButton, IconButton, MessageBar, MessageBarType, PrimaryButton, TextField } from '@fluentui/react';
import { useAppContext } from '../../context/AppContext';
import { IEmployeeGoal } from '../../models/Goal';
import { ValidationHelper } from '../../utils/ValidationHelper';
import styles from './GoalCreation.module.scss';
import { IGoalCreationProps } from './IGoalCreationProps';

export const GoalCreation: React.FC<IGoalCreationProps> = React.memo((props) => {
  const { appraisalResponse, mappings, goals, updateGoal, removeGoal, isReadOnly } = useAppContext();
  const [message, setMessage] = React.useState<string>('');

  const addGoal = React.useCallback((mappingId: number): void => {
    const id = -Date.now();
    const goal: IEmployeeGoal = {
      id: id,
      appraisalResponseId: appraisalResponse ? appraisalResponse.id : 0,
      designationKraId: mappingId,
      kraId: mappingId,
      goal: '',
      description: '',
      goalTitle: '',
      goalDescription: '',
      priority: 'Medium',
      progress: 0
    };
    updateGoal(goal);
  }, [appraisalResponse, updateGoal]);

  const onUpdateGoal = React.useCallback((goal: IEmployeeGoal, goalTitle: string, goalDescription: string): void => {
    updateGoal({
      ...goal,
      goal: goalTitle,
      description: goalDescription,
      goalTitle: goalTitle,
      goalDescription: goalDescription
    });
  }, [updateGoal]);

  const onDelete = React.useCallback(async (goal: IEmployeeGoal): Promise<void> => {
    if (goal.id > 0) {
      await removeGoal(goal.id);
    } else {
      updateGoal({ ...goal, isDeleted: true });
    }
    setMessage('Goal removed.');
  }, [removeGoal, updateGoal]);

  return (
    <section className={styles.goalCreation}>
      <header className={styles.headerRow}>
        <div>
          <h1>Create Goals Under KRAs</h1>
          <p>Add at least one goal under each KRA before submission.</p>
        </div>
        <PrimaryButton text="Continue to Self Appraisal" onClick={props.onContinue} />
      </header>

      {!ValidationHelper.hasGoalForEveryKra(mappings, goals.filter(goal => !goal.isDeleted)) && (
        <MessageBar messageBarType={MessageBarType.warning}>At least one goal is required under every KRA before submission.</MessageBar>
      )}
      {message && <MessageBar messageBarType={MessageBarType.success} onDismiss={() => setMessage('')}>{message}</MessageBar>}

      {mappings.map((mapping, index) => {
        const kraGoals = goals.filter(goal => (goal.designationKraId || goal.kraId) === mapping.id && !goal.isDeleted);
        return (
          <article className={styles.kraCard} key={mapping.id}>
            <header className={styles.kraHeader}>
              <strong>{index + 1}. {mapping.kra.title} ({mapping.weightage}%)</strong>
              <DefaultButton text="Add Goal" onClick={() => addGoal(mapping.id)} disabled={isReadOnly} />
            </header>
            <div className={styles.goalList}>
              {kraGoals.map((goal, goalIndex) => (
                <div className={styles.goalItem} key={goal.id}>
                  <div className={styles.goalNum}>{goalIndex + 1}</div>
                  <TextField
                    label="Goal Title"
                    value={goal.goalTitle || goal.goal}
                    onChange={(_, value) => onUpdateGoal(goal, value || '', goal.goalDescription || goal.description || '')}
                    disabled={isReadOnly}
                    required={true}
                  />
                  <TextField
                    label="Goal Description"
                    value={goal.goalDescription || goal.description}
                    multiline={true}
                    rows={2}
                    onChange={(_, value) => onUpdateGoal(goal, goal.goalTitle || goal.goal, value || '')}
                    disabled={isReadOnly}
                  />
                  <IconButton ariaLabel="Delete goal" iconProps={{ iconName: 'Delete' }} onClick={() => onDelete(goal)} disabled={isReadOnly} />
                </div>
              ))}
              {kraGoals.length === 0 && <div className={styles.emptyGoal}>No goals yet for this KRA.</div>}
            </div>
          </article>
        );
      })}
    </section>
  );
});

