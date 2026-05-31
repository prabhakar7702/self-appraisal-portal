import { AppRoute } from '../../constants/Routes';

export interface INavigationProps {
  activeRoute: AppRoute;
  onNavigate: (route: AppRoute) => void;
}

