import * as React from 'react';
import { DefaultButton, Icon, IconButton, PrimaryButton } from '@fluentui/react';
import { MESSAGES } from '../../constants/Messages';
import { useAppContext } from '../../context/AppContext';
import { IEmployeeGoal } from '../../models/Goal';
import { ValidationHelper } from '../../utils/ValidationHelper';
import styles from './GoalCreation.module.scss';
import { IGoalCreationProps } from './IGoalCreationProps';

export const GoalCreation: React.FC<IGoalCreationProps> = React.memo((props) => {
  const { mappings, goals, updateGoal } = useAppContext();
  const hasAllGoals = ValidationHelper.hasGoalForEveryKra(mappings, goals);
  const getPriorityClass = React.useCallback((priority: string): string => {
    if (priority === 'High') {
      return styles.high;
    }

    if (priority === 'Low') {
      return styles.low;
    }

    return styles.medium;
  }, []);

  const addGoal = React.useCallback((mappingId: number): void => {
    const goal: IEmployeeGoal = {
      id: Date.now(),
      appraisalHeaderId: 501,
      designationKraId: mappingId,
      goalTitle: 'New measurable goal',
      goalDescription: 'Describe the goal and success criteria.',
      priority: 'Medium',
      targetOutcome: 'Define the expected measurable outcome.',
      progress: 0,
      isDeleted: false
    };
    updateGoal(goal);
  }, [updateGoal]);

  return (
    <section className={styles.goalCreation}>
      <div className={styles.headerRow}>
        <div>
          <h1>Create Goals Under KRAs</h1>
          <p>Add meaningful goals under each KRA. At least one goal is required under every KRA.</p>
        </div>
        <PrimaryButton text="Continue to Form" iconProps={{ iconName: 'Forward' }} onClick={props.onContinue} disabled={!hasAllGoals} />
      </div>
      <div className={styles.info}><Icon iconName="Info" />{MESSAGES.GoalRequirement}</div>
      {mappings.map(mapping => {
        const kraGoals = goals.filter(goal => goal.designationKraId === mapping.id);
        return (
          <article className={styles.kraCard} key={mapping.id}>
            <header className={styles.kraHeader}>
              <div>
                <h2>{mapping.displayOrder}. {mapping.kra.name} <span>{mapping.weightage}%</span></h2>
                <p>{mapping.kra.description}</p>
              </div>
              <div className={styles.kraActions}>
                <strong>Goals Added: {kraGoals.length}</strong>
                <DefaultButton text="Add Goal" iconProps={{ iconName: 'Add' }} onClick={() => addGoal(mapping.id)} />
              </div>
            </header>
            <div className={styles.goalTable} role="table" aria-label={`${mapping.kra.name} goals`}>
              <div className={styles.tableHeader} role="row">
                <span>#</span><span>Goal Title</span><span>Goal Description</span><span>Priority</span><span>Target / Expected Outcome</span><span>Actions</span>
              </div>
              {kraGoals.map((goal, index) => (
                <div className={styles.tableRow} role="row" key={goal.id}>
                  <span>{index + 1}</span>
                  <span>{goal.goalTitle}</span>
                  <span>{goal.goalDescription}</span>
                  <span><mark className={getPriorityClass(goal.priority)}>{goal.priority}</mark></span>
                  <span>{goal.targetOutcome}</span>
                  <span className={styles.actionIcons}>
                    <IconButton ariaLabel="Edit goal" iconProps={{ iconName: 'Edit' }} />
                    <IconButton ariaLabel="Delete goal" iconProps={{ iconName: 'Delete' }} />
                  </span>
                </div>
              ))}
            </div>
          </article>
        );
      })}
      <div className={hasAllGoals ? styles.success : styles.warning}>
        <Icon iconName={hasAllGoals ? 'Completed' : 'Warning'} />
        {hasAllGoals ? MESSAGES.GoalSuccess : MESSAGES.GoalRequirement}
      </div>
    </section>
  );
});
