import * as React from 'react';
import { DefaultButton, Dropdown, Icon, IconButton, IDropdownOption, MessageBar, MessageBarType, PrimaryButton, TextField } from '@fluentui/react';
import { MESSAGES } from '../../constants/Messages';
import { useAppContext } from '../../context/AppContext';
import { IEmployeeGoal, IGoalResponse } from '../../models/Goal';
import { RatingHelper } from '../../utils/RatingHelper';
import { ValidationHelper } from '../../utils/ValidationHelper';
import { RatingControl } from '../common/RatingControl/RatingControl';
import styles from './SelfAppraisalForm.module.scss';
import { ISelfAppraisalFormProps } from './ISelfAppraisalFormProps';

const progressOptions: IDropdownOption[] = [0, 25, 50, 60, 70, 80, 90, 100].map(value => ({ key: value, text: `${value}%` }));

export const SelfAppraisalForm: React.FC<ISelfAppraisalFormProps> = React.memo((props) => {
  const { employee, appraisalResponse, mappings, goals, responses, questions, qaResponses, documents, isCycleOpen, isReadOnly, updateGoal, updateResponse, updateQaResponse, addDocument, removeDocument, saveDraft, submit } = useAppContext();
  const [localMessage, setLocalMessage] = React.useState<string>('');
  const [isDragOver, setIsDragOver] = React.useState<boolean>(false);

  const finalRating = React.useMemo(() => RatingHelper.getFinalRating(mappings, goals, responses), [goals, mappings, responses]);
  const hasMinimumGoals = React.useMemo(() => ValidationHelper.hasMinimumGoalsForEveryKra(mappings, goals.filter(goal => !goal.isDeleted), 3), [goals, mappings]);
  const completion = React.useMemo(() => {
    const activeGoals = goals.filter(goal => !goal.isDeleted);
    const goalsCompleted = activeGoals.filter(goal => {
      const response = responses.filter(item => item.goalId === goal.id)[0];
      return goal.progress >= 0 && !!response && response.selfRating > 0 && (response.selfComments || '').trim().length > 0;
    }).length;
    const questionsCompleted = qaResponses.filter(item => (item.answer || '').trim().length > 0).length;
    const documentCompleted = documents.length > 0 ? 1 : 0;
    const totalRequired = activeGoals.length + questions.length + 1;
    const done = goalsCompleted + questionsCompleted + documentCompleted;
    return totalRequired > 0 ? Math.round((done / totalRequired) * 100) : 0;
  }, [documents.length, goals, qaResponses, questions.length, responses]);

  const getResponse = React.useCallback((goal: IEmployeeGoal): IGoalResponse => (
    responses.filter(response => response.goalId === goal.id)[0] || {
      id: 0,
      appraisalResponseId: goal.appraisalResponseId || 0,
      goalId: goal.id,
      selfRating: 0,
      selfComments: ''
    }
  ), [responses]);

  const onRatingChange = React.useCallback((goal: IEmployeeGoal, rating: number): void => {
    const response = getResponse(goal);
    updateResponse({ ...response, selfRating: rating });
  }, [getResponse, updateResponse]);

  const onCommentChange = React.useCallback((goal: IEmployeeGoal, comment: string): void => {
    const response = getResponse(goal);
    updateResponse({ ...response, selfComments: comment });
  }, [getResponse, updateResponse]);

  const onProgressChange = React.useCallback((goal: IEmployeeGoal, option?: IDropdownOption): void => {
    updateGoal({ ...goal, progress: Number(option ? option.key : goal.progress) });
  }, [updateGoal]);

  const uploadFile = React.useCallback(async (file: File): Promise<void> => {
    if (!file) {
      return;
    }
    const message = await addDocument(file);
    setLocalMessage(message || 'Document uploaded successfully.');
  }, [addDocument]);

  const onUpload = React.useCallback(async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = event.currentTarget.files && event.currentTarget.files[0];
    event.currentTarget.value = '';
    if (!file) {
      return;
    }
    await uploadFile(file);
  }, [uploadFile]);

  React.useEffect(() => {
    const preventDefaults = (event: DragEvent): void => {
      event.preventDefault();
      event.stopPropagation();
    };
    window.addEventListener('dragover', preventDefaults);
    window.addEventListener('drop', preventDefaults);
    return () => {
      window.removeEventListener('dragover', preventDefaults);
      window.removeEventListener('drop', preventDefaults);
    };
  }, []);

  const onSave = React.useCallback(async (): Promise<void> => {
    const message = await saveDraft();
    props.onSaveMessage(message);
    setLocalMessage(message);
  }, [props, saveDraft]);

  const onSubmit = React.useCallback(async (): Promise<void> => {
    const message = await submit();
    props.onSaveMessage(message);
    setLocalMessage(message);
  }, [props, submit]);

  return (
    <section className={styles.form}>
      <header className={styles.header}>
        <h1>Self Appraisal</h1>
        <div className={styles.progressWrap}>
          <span>{completion}% Completed</span>
          <div className={styles.progressTrack}><div className={styles.progressBar} style={{ width: `${completion}%` }} /></div>
        </div>
      </header>

      <section className={styles.panel}>
        <h2>Employee Details</h2>
        <div className={styles.employeeRow}>
          <div><span>Employee Name</span><strong>{employee && employee.employeeName}</strong></div>
          <div><span>Employee ID</span><strong>{employee && employee.employeeId}</strong></div>
          <div><span>Department</span><strong>{employee && employee.department}</strong></div>
          <div><span>Designation</span><strong>{employee && employee.designationTitle}</strong></div>
        </div>
      </section>

      <section className={styles.panel}>
        <h2>KRAs & Goals</h2>
        <div className={styles.goalHead}>
          <span>KRA / Goal</span><span>Weightage</span><span>Goal Progress</span><span>Self Rating (1 - 5)</span><span>Comments (Achievements, learnings, challenges)</span>
        </div>
        {mappings.map((mapping, index) => {
          const kraGoals = goals.filter(goal => goal.designationKraId === mapping.id);
          return (
            <div className={styles.kraBlock} key={mapping.id}>
              <div className={styles.kraTitle}>
                <strong>{index + 1}. {mapping.kra.title}</strong>
                <strong>{mapping.weightage}%</strong>
              </div>
              {kraGoals.map(goal => {
                const response = getResponse(goal);
                return (
                  <div className={styles.goalRow} key={goal.id}>
                    <div className={styles.goalTitle}>{goal.goalTitle}</div>
                    <div className={styles.goalWeight}><span className={styles.priority}>{goal.priority}</span></div>
                    <div className={styles.goalProgress}><Dropdown options={progressOptions} selectedKey={goal.progress} onChange={(_, option) => onProgressChange(goal, option)} disabled={isReadOnly || !hasMinimumGoals} /></div>
                    <div className={styles.goalRating}><RatingControl value={response.selfRating} label={`${goal.goalTitle} self rating`} onChange={(value) => onRatingChange(goal, value)} readOnly={isReadOnly || !hasMinimumGoals} /></div>
                    <TextField className={styles.goalComment} multiline={true} rows={3} value={response.selfComments} onChange={(_, value) => onCommentChange(goal, value || '')} disabled={isReadOnly || !hasMinimumGoals} />
                  </div>
                );
              })}
            </div>
          );
        })}
        {!hasMinimumGoals && (
          <MessageBar messageBarType={MessageBarType.warning}>
            Please create at least 3 goals under each KRA before starting your appraisal.
            <DefaultButton text="Go To Goal Creation" onClick={props.onGoToGoalCreation} />
          </MessageBar>
        )}
        <div className={styles.finalRow}>
          <strong>Final Self Rating (Based on Goal Weightage)</strong>
          <RatingControl value={Math.round(finalRating)} label="Final rating" readOnly={true} />
          <strong>{finalRating.toFixed(1)} / 5</strong>
        </div>
      </section>

      <section className={styles.panel}>
        <h2>Additional Questions</h2>
        <div className={styles.questionList}>
          {questions.map((question, idx) => {
            const response = qaResponses.filter(item => item.questionId === question.id)[0];
            return (
              <div className={styles.questionRow} key={question.id}>
                <label>{idx + 1}. {question.question}</label>
                <TextField multiline={true} rows={1} value={response ? response.answer : ''} onChange={(_, value) => updateQaResponse({ id: response ? response.id : 0, appraisalResponseId: appraisalResponse ? appraisalResponse.id : 0, questionId: question.id, answer: value || '' })} disabled={isReadOnly || !hasMinimumGoals} />
              </div>
            );
          })}
        </div>
      </section>

      <section className={styles.panel}>
        <h2>Upload Appraisal Document (PDF)</h2>
        <div className={styles.uploadRow}>
          <div className={styles.uploadHint}>Upload any supporting document related to your self appraisal (optional).</div>
          <div className={styles.dropZone}>
            <Icon iconName="CloudUpload" />
            <span>Drag and drop PDF here</span>
            <input id="pdfUpload" type="file" accept="application/pdf,.pdf" className={styles.hiddenInput} onChange={onUpload} disabled={isReadOnly || !hasMinimumGoals} />
            <label
              htmlFor="pdfUpload"
              className={isDragOver ? `${styles.fileButton} ${styles.fileButtonActive}` : styles.fileButton}
              onDragEnter={(event) => { event.preventDefault(); event.stopPropagation(); setIsDragOver(true); }}
              onDragLeave={(event) => { event.preventDefault(); event.stopPropagation(); setIsDragOver(false); }}
              onDragOver={(event) => { event.preventDefault(); event.stopPropagation(); setIsDragOver(true); }}
              onDrop={(event) => {
                event.preventDefault();
                event.stopPropagation();
                setIsDragOver(false);
                if (isReadOnly) {
                  return;
                }
                const file = event.dataTransfer.files && event.dataTransfer.files[0];
                if (file) {
                  uploadFile(file).catch(() => setLocalMessage(MESSAGES.NetworkIssue));
                }
              }}
            >
              Choose File
            </label>
          </div>
          <div className={styles.fileList}>
            {documents.map(document => (
              <div className={styles.fileCard} key={document.id}>
                <Icon iconName="PDF" />
                <div>
                  <strong>{document.fileLeafRef}</strong>
                  <span>({document.sizeKb} KB)</span>
                </div>
                <IconButton iconProps={{ iconName: 'Cancel' }} ariaLabel="Remove file" onClick={() => removeDocument(document.id).then(setLocalMessage)} disabled={isReadOnly} />
              </div>
            ))}
            <small>Max file size: 5MB. Only PDF allowed.</small>
          </div>
        </div>
      </section>

      <footer className={styles.footerActions}>
        {localMessage && <MessageBar className={styles.inlineAlert} messageBarType={localMessage === MESSAGES.Submitted || localMessage === MESSAGES.DraftSaved ? MessageBarType.success : MessageBarType.warning}>{localMessage}</MessageBar>}
        <DefaultButton text="Save as Draft" iconProps={{ iconName: 'Save' }} onClick={onSave} disabled={!isCycleOpen || isReadOnly || !hasMinimumGoals} />
        <PrimaryButton text="Submit Self Appraisal" iconProps={{ iconName: 'Send' }} onClick={onSubmit} disabled={!isCycleOpen || isReadOnly || !hasMinimumGoals || !ValidationHelper.canSubmit(mappings, goals, responses, qaResponses)} />
      </footer>
    </section>
  );
});
