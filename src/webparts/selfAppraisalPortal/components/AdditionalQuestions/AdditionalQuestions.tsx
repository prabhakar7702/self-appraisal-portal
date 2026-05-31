import * as React from 'react';
import { PrimaryButton, TextField } from '@fluentui/react';
import { useAppContext } from '../../context/AppContext';
import styles from './AdditionalQuestions.module.scss';
import { IAdditionalQuestionsProps } from './IAdditionalQuestionsProps';

export const AdditionalQuestions: React.FC<IAdditionalQuestionsProps> = React.memo((props) => {
  const { questions, qaResponses, updateQaResponse } = useAppContext();

  return (
    <section className={styles.questions}>
      <div className={styles.headerRow}>
        <div>
          <h1>Additional Questions</h1>
          <p>Answer all appraisal questions before submitting your self appraisal.</p>
        </div>
        <PrimaryButton text="Continue to Documents" iconProps={{ iconName: 'Forward' }} onClick={props.onContinue} />
      </div>
      <div className={styles.questionList}>
        {questions.map((question, index) => {
          const response = qaResponses.filter(item => item.questionId === question.id)[0];
          return (
            <div className={styles.questionRow} key={question.id}>
              <label htmlFor={`question-${question.id}`}>{index + 1}. {question.question}</label>
              <TextField
                id={`question-${question.id}`}
                multiline={true}
                rows={2}
                value={response ? response.answer : ''}
                onChange={(_, value) => response && updateQaResponse({ ...response, answer: value || '' })}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
});

