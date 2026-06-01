import * as React from 'react';
import { DatePicker, DayOfWeek, DefaultButton, Dialog, DialogFooter, DialogType, Dropdown, IDropdownOption, Icon, IconButton, MessageBar, MessageBarType, Panel, PanelType, PrimaryButton, TextField } from '@fluentui/react';
import { useAppContext } from '../../context/AppContext';
import { IEmployeeGoal } from '../../models/Goal';
import { ValidationHelper } from '../../utils/ValidationHelper';
import styles from './GoalCreation.module.scss';
import { IGoalCreationProps } from './IGoalCreationProps';

const priorityOptions: IDropdownOption[] = ['High', 'Medium', 'Low'].map(value => ({ key: value, text: value }));
const MAX_MID_YEAR_DUE_DATE = new Date('2026-06-10T23:59:59');

export const GoalCreation: React.FC<IGoalCreationProps> = React.memo(() => {
  const { appraisalResponse, cycle, mappings, goals, updateGoal, removeGoal, isReadOnly } = useAppContext();
  const [selectedGoalId, setSelectedGoalId] = React.useState<number | undefined>();
  const [confirmDeleteGoalId, setConfirmDeleteGoalId] = React.useState<number | undefined>();
  const [localMessage, setLocalMessage] = React.useState<{ type: MessageBarType; text: string } | undefined>();

  const activeGoals = React.useMemo(() => goals.filter(goal => !goal.isDeleted), [goals]);
  const selectedGoal = React.useMemo(() => activeGoals.filter(goal => goal.id === selectedGoalId)[0], [activeGoals, selectedGoalId]);

  const createBlankGoal = React.useCallback((kraId: number): IEmployeeGoal => ({
    id: -Date.now(),
    appraisalResponseId: appraisalResponse ? appraisalResponse.id : 0,
    designationKraId: kraId,
    kraId: kraId,
    goal: '',
    description: '',
    goalTitle: '',
    goalDescription: '',
    priority: 'Medium',
    startDate: new Date().toISOString().slice(0, 10),
    dueDate: '',
    progress: 0
  }), [appraisalResponse]);

  const openNewGoal = React.useCallback((): void => {
    if (!mappings.length) {
      return;
    }
    const goal = createBlankGoal(mappings[0].id);
    updateGoal(goal);
    setSelectedGoalId(goal.id);
  }, [createBlankGoal, mappings, updateGoal]);

  const updateSelectedGoal = React.useCallback((patch: Partial<IEmployeeGoal>): void => {
    if (!selectedGoal) {
      return;
    }
    const updated = { ...selectedGoal, ...patch };
    updated.goal = updated.goalTitle || updated.goal;
    updated.description = updated.goalDescription || updated.description;
    updateGoal(updated);
  }, [selectedGoal, updateGoal]);

  const saveGoal = React.useCallback((): void => {
    if (!selectedGoal) {
      return;
    }
    if (!(selectedGoal.goalTitle || '').trim() || !(selectedGoal.goalDescription || '').trim() || !selectedGoal.priority || !(selectedGoal.startDate || '').trim() || !(selectedGoal.dueDate || '').trim() || !(selectedGoal.designationKraId || selectedGoal.kraId)) {
      setLocalMessage({ type: MessageBarType.error, text: 'Please fill all required goal fields before saving.' });
      return;
    }
    const dueDate = new Date(selectedGoal.dueDate || '');
    if (dueDate.getTime() > MAX_MID_YEAR_DUE_DATE.getTime()) {
      setLocalMessage({ type: MessageBarType.error, text: 'Due Date cannot be later than 10-Jun-2026.' });
      return;
    }
    setLocalMessage({ type: MessageBarType.success, text: 'Goal saved successfully.' });
  }, [cycle, selectedGoal]);

  const askDelete = React.useCallback((goal: IEmployeeGoal): void => {
    if (goal.isMandatory) {
      setLocalMessage({ type: MessageBarType.warning, text: 'Mandatory goal cannot be deleted.' });
      return;
    }
    setConfirmDeleteGoalId(goal.id);
  }, []);

  const confirmDelete = React.useCallback(async (): Promise<void> => {
    const goal = activeGoals.filter(item => item.id === confirmDeleteGoalId)[0];
    if (!goal) {
      setConfirmDeleteGoalId(undefined);
      return;
    }
    if (goal.id > 0) {
      await removeGoal(goal.id);
    } else {
      updateGoal({ ...goal, isDeleted: true });
    }
    if (selectedGoalId === goal.id) {
      setSelectedGoalId(undefined);
    }
    setConfirmDeleteGoalId(undefined);
    setLocalMessage({ type: MessageBarType.success, text: 'Goal deleted successfully.' });
  }, [activeGoals, confirmDeleteGoalId, removeGoal, selectedGoalId, updateGoal]);

  const hasMinimum = ValidationHelper.hasMinimumGoalsForEveryKra(mappings, activeGoals, 3);
  const mandatoryExists = activeGoals.some(goal => (goal.goalTitle || goal.goal).toLowerCase().indexOf('improving presentation skill') >= 0);

  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1>Create & Manage Goals</h1>
          <p>Add, update, or delete goals under each KRA. Each KRA must have at least 3 goals.</p>
        </div>
        <div className={styles.headerMeta}>
          <span>Cycle: {cycle ? cycle.cycle : '-'}</span>
          <span>Goal Due Date must be on or before 10-Jun-2026</span>
        </div>
      </header>

      {!mandatoryExists && <MessageBar messageBarType={MessageBarType.warning}>Mandatory Goal: &quot;Improving Presentation Skill&quot; under &quot;Org or CoE Contributions&quot; is required for all employees.</MessageBar>}
      {!hasMinimum && <MessageBar messageBarType={MessageBarType.warning}>Every KRA must contain at least 3 goals before appraisal submission.</MessageBar>}
      {localMessage && <MessageBar messageBarType={localMessage.type} onDismiss={() => setLocalMessage(undefined)}>{localMessage.text}</MessageBar>}

      <div className={styles.actions}>
        <PrimaryButton text="Add Goal" onClick={openNewGoal} disabled={isReadOnly} />
      </div>

      <div className={styles.kraList}>
        {mappings.map(mapping => {
          const kraGoals = activeGoals.filter(goal => (goal.designationKraId || goal.kraId) === mapping.id);
          return (
            <article className={styles.kraCard} key={mapping.id}>
              <div className={styles.kraHead}>
                <strong>{mapping.kra.title}</strong>
                <span>{kraGoals.length} Goals</span>
              </div>
              <div className={styles.table}>
                <div className={styles.rowHead}>
                  <span>Goal</span><span>Description</span><span>Priority</span><span>Start Date</span><span>Due Date</span><span>Progress</span><span>Actions</span>
                </div>
                {kraGoals.map(goal => (
                  <div className={styles.row} key={goal.id}>
                    <span>{goal.isMandatory && <Icon iconName="LockSolid" className={styles.lock} />} {goal.goalTitle || goal.goal}</span>
                    <span>{goal.goalDescription || goal.description}</span>
                    <span>{goal.priority}</span>
                    <span>{goal.startDate || '-'}</span>
                    <span>{goal.dueDate || '-'}</span>
                    <span>{goal.progress}%</span>
                    <span>
                      <IconButton ariaLabel="Edit goal" iconProps={{ iconName: 'Edit' }} onClick={() => setSelectedGoalId(goal.id)} disabled={isReadOnly} />
                      <IconButton ariaLabel="Delete goal" iconProps={{ iconName: 'Delete' }} onClick={() => askDelete(goal)} disabled={isReadOnly || goal.isMandatory} />
                    </span>
                  </div>
                ))}
              </div>
            </article>
          );
        })}
      </div>

      <Panel
        isOpen={!!selectedGoal}
        onDismiss={() => setSelectedGoalId(undefined)}
        type={PanelType.smallFixedFar}
        headerText={selectedGoal && selectedGoal.id > 0 ? 'Edit Goal' : 'Add Goal'}
      >
        {selectedGoal && (
          <div className={styles.editor}>
            <Dropdown
              label="KRA"
              options={mappings.map(mapping => ({ key: mapping.id, text: mapping.kra.title }))}
              selectedKey={selectedGoal.designationKraId || selectedGoal.kraId}
              onChange={(_, option) => updateSelectedGoal({ designationKraId: Number(option && option.key), kraId: Number(option && option.key) })}
              disabled={isReadOnly}
              required={true}
            />
            <TextField label="Goal" value={selectedGoal.goalTitle || selectedGoal.goal} onChange={(_, value) => updateSelectedGoal({ goalTitle: value || '', goal: value || '' })} disabled={isReadOnly} required={true} />
            <TextField label="Description" multiline={true} rows={3} value={selectedGoal.goalDescription || selectedGoal.description} onChange={(_, value) => updateSelectedGoal({ goalDescription: value || '', description: value || '' })} disabled={isReadOnly} required={true} />
            <Dropdown
              label="Priority"
              options={priorityOptions}
              selectedKey={selectedGoal.priority}
              onChange={(_, option) => updateSelectedGoal({ priority: String(option && option.key) as 'High' | 'Medium' | 'Low' })}
              disabled={isReadOnly}
              required={true}
            />
            <DatePicker
              label="Start Date"
              firstDayOfWeek={DayOfWeek.Monday}
              value={selectedGoal.startDate ? new Date(selectedGoal.startDate) : undefined}
              onSelectDate={(date) => updateSelectedGoal({ startDate: date ? date.toISOString().slice(0, 10) : '' })}
              disabled={isReadOnly}
            />
            <DatePicker
              label="Due Date"
              firstDayOfWeek={DayOfWeek.Monday}
              value={selectedGoal.dueDate ? new Date(selectedGoal.dueDate) : undefined}
              onSelectDate={(date) => updateSelectedGoal({ dueDate: date ? date.toISOString().slice(0, 10) : '' })}
              disabled={isReadOnly}
            />
            <TextField
              label="Progress (%)"
              type="number"
              value={String(selectedGoal.progress)}
              onChange={(_, value) => updateSelectedGoal({ progress: Math.max(0, Math.min(100, Number(value || '0'))) })}
              disabled={isReadOnly}
            />
            <DialogFooter>
              <DefaultButton text="Cancel" onClick={() => setSelectedGoalId(undefined)} />
              <PrimaryButton text="Save Goal" onClick={saveGoal} disabled={isReadOnly} />
            </DialogFooter>
          </div>
        )}
      </Panel>

      <Dialog
        hidden={!confirmDeleteGoalId}
        dialogContentProps={{
          type: DialogType.normal,
          title: 'Delete Goal?',
          subText: 'Are you sure you want to delete this goal? This action cannot be undone.'
        }}
        onDismiss={() => setConfirmDeleteGoalId(undefined)}
      >
        <DialogFooter>
          <DefaultButton text="Cancel" onClick={() => setConfirmDeleteGoalId(undefined)} />
          <PrimaryButton text="Delete" onClick={() => confirmDelete().catch(() => setLocalMessage({ type: MessageBarType.error, text: 'Unable to delete goal. Please try again.' }))} />
        </DialogFooter>
      </Dialog>
    </section>
  );
});
