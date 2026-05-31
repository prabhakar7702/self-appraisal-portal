import * as React from 'react';
import { AppRoute } from '../../constants/Routes';

export interface ILayoutProps {
  activeRoute: AppRoute;
  onNavigate: (route: AppRoute) => void;
  userDisplayName: string;
  children: React.ReactNode;
}
