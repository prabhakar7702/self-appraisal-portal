import * as React from 'react';
import { MessageBar, MessageBarType } from '@fluentui/react';
import { AppProvider } from '../../context/AppProvider';
import { ROUTES, AppRoute } from '../../constants/Routes';
import { MESSAGES } from '../../constants/Messages';
import { DateHelper } from '../../utils/DateHelper';
import { useAppContext } from '../../context/AppContext';
import { AdditionalQuestions } from '../AdditionalQuestions/AdditionalQuestions';
import { AppraisalSummary } from '../AppraisalSummary/AppraisalSummary';
import { DocumentUpload } from '../DocumentUpload/DocumentUpload';
import { GoalCreation } from '../GoalCreation/GoalCreation';
import { Home } from '../Home/Home';
import { Layout } from '../Layout/Layout';
import { SelfAppraisalForm } from '../SelfAppraisalForm/SelfAppraisalForm';
import { EmptyState } from '../common/EmptyState/EmptyState';
import { ErrorMessage } from '../common/ErrorMessage/ErrorMessage';
import { Loader } from '../common/Loader/Loader';
import type { ISelfAppraisalPortalProps } from './ISelfAppraisalPortal';
import styles from './SelfAppraisalPortal.module.scss';

const AppShell: React.FC<{ userDisplayName: string }> = React.memo((props) => {
  const [activeRoute, setActiveRoute] = React.useState<AppRoute>(ROUTES.Home);
  const [message, setMessage] = React.useState<string>('');
  const { cycle, employee, isCycleOpen, isLoading, errorMessage, header } = useAppContext();

  const onMessage = React.useCallback((value: string): void => {
    setMessage(value);
  }, []);

  const content = React.useMemo(() => {
    if (isLoading) {
      return <Loader label="Loading self appraisal workspace" />;
    }

    if (errorMessage) {
      return <ErrorMessage message={errorMessage} />;
    }

    if (employee && employee.role !== 'Employee' && employee.role !== 'HRAdmin') {
      return (
        <EmptyState
          iconName="Permissions"
          title="Access Restricted"
          message="This Phase 1 employee self-appraisal workspace is available only to employees and HR administrators."
        />
      );
    }

    if (!isCycleOpen) {
      const dateRange = cycle ? `${DateHelper.formatDate(cycle.startDate)} and ${DateHelper.formatDate(cycle.endDate)}` : 'the configured appraisal dates';
      return (
        <EmptyState
          iconName="Calendar"
          title={MESSAGES.WindowClosedTitle}
          message={`${MESSAGES.WindowClosedBody} You can access the self appraisal only between ${dateRange}.`}
        />
      );
    }

    switch (activeRoute) {
      case ROUTES.CreateGoals:
        return <GoalCreation onContinue={() => setActiveRoute(ROUTES.AppraisalForm)} />;
      case ROUTES.AppraisalForm:
        return <SelfAppraisalForm onSaveMessage={onMessage} />;
      case ROUTES.AdditionalQuestions:
        return <AdditionalQuestions onContinue={() => setActiveRoute(ROUTES.UploadDocuments)} />;
      case ROUTES.UploadDocuments:
        return <DocumentUpload onMessage={onMessage} />;
      case ROUTES.Home:
      default:
        return <Home onNavigate={setActiveRoute} />;
    }
  }, [activeRoute, cycle, employee, errorMessage, isCycleOpen, isLoading, onMessage]);

  return (
    <Layout activeRoute={activeRoute} onNavigate={setActiveRoute} userDisplayName={props.userDisplayName}>
      {message && (
        <div className={styles.message}>
          <MessageBar messageBarType={message === MESSAGES.Submitted || message === MESSAGES.DraftSaved ? MessageBarType.success : MessageBarType.warning} onDismiss={() => setMessage('')}>
            {message}
          </MessageBar>
        </div>
      )}
      {header && header.status === 'Submitted' && (
        <div className={styles.message}>
          <MessageBar messageBarType={MessageBarType.success}>Submitted appraisal is locked for employee edits.</MessageBar>
        </div>
      )}
      {content}
    </Layout>
  );
});

export default class SelfAppraisalPortal extends React.Component<ISelfAppraisalPortalProps> {
  public render(): React.ReactElement<ISelfAppraisalPortalProps> {
    return (
      <AppProvider userDisplayName={this.props.userDisplayName}>
        <AppShell userDisplayName={this.props.userDisplayName} />
      </AppProvider>
    );
  }
}
