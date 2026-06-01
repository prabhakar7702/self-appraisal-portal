import * as React from 'react';
import { MessageBar, MessageBarType } from '@fluentui/react';
import { AppProvider } from '../../context/AppProvider';
import { ROUTES, AppRoute } from '../../constants/Routes';
import { MESSAGES } from '../../constants/Messages';
import { DateHelper } from '../../utils/DateHelper';
import { useAppContext } from '../../context/AppContext';
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
  const { cycle, employee, isCycleOpen, isLoading, errorMessage } = useAppContext();

  const content = React.useMemo(() => {
    if (isLoading) {
      return <Loader label="Loading self appraisal workspace" />;
    }
    if (errorMessage) {
      return <ErrorMessage message={errorMessage} />;
    }
    if (employee && employee.role !== 'Employee' && employee.role !== 'HRAdmin') {
      return <EmptyState iconName="Permissions" title="Access Restricted" message="This workspace is available only to employees and HR administrators." />;
    }
    if (!isCycleOpen && (activeRoute === ROUTES.AppraisalForm || activeRoute === ROUTES.CreateGoals)) {
      const dateRange = cycle ? `${DateHelper.formatDate(cycle.startDate)} and ${DateHelper.formatDate(cycle.endDate)}` : 'the configured appraisal dates';
      return <EmptyState iconName="Calendar" title={MESSAGES.WindowClosedTitle} message={`${MESSAGES.WindowClosedBody} You can access the self appraisal only between ${dateRange}.`} />;
    }
    if (activeRoute === ROUTES.CreateGoals) {
      return <GoalCreation />;
    }
    if (activeRoute === ROUTES.AppraisalForm) {
      return <SelfAppraisalForm onSaveMessage={setMessage} onGoToGoalCreation={() => setActiveRoute(ROUTES.CreateGoals)} />;
    }
    return <Home onNavigate={setActiveRoute} />;
  }, [activeRoute, cycle, employee, errorMessage, isCycleOpen, isLoading]);

  return (
    <Layout activeRoute={activeRoute} onNavigate={setActiveRoute} userDisplayName={props.userDisplayName}>
      {message && <div className={styles.floatingMessage}><MessageBar messageBarType={message === MESSAGES.Submitted || message === MESSAGES.DraftSaved ? MessageBarType.success : MessageBarType.warning} onDismiss={() => setMessage('')}>{message}</MessageBar></div>}
      {content}
    </Layout>
  );
});

export default class SelfAppraisalPortal extends React.Component<ISelfAppraisalPortalProps> {
  public render(): React.ReactElement<ISelfAppraisalPortalProps> {
    return (
      <AppProvider userEmail={this.props.userEmail} webAbsoluteUrl={this.props.webAbsoluteUrl} spHttpClient={this.props.spHttpClient}>
        <AppShell userDisplayName={this.props.userDisplayName} />
      </AppProvider>
    );
  }
}
