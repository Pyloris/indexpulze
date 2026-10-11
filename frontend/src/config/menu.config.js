import { ROUTES } from '../constants/routes';

export const SIDEBAR_MENU_CONFIG = [
  {
    id: 'overview',
    label: 'Overview',
    to: ROUTES.DASHBOARD,
    icon: 'Home',
    matchPaths: [ROUTES.APP, `${ROUTES.APP}/`, '/app/dashboard']
  },
  // {
  //   id: 'treemap',
  //   label: 'Constituent Treemap',
  //   to: ROUTES.TREEMAP,
  //   icon: 'LayoutGrid',
  //   matchPaths: [ROUTES.TREEMAP, `${ROUTES.TREEMAP}/`]
  // },
  {
    id: 'volume-profile',
    label: 'Volume Profile',
    to: ROUTES.VOLUME_PROFILE,
    icon: 'BarChart2',
    matchPaths: [ROUTES.VOLUME_PROFILE, `${ROUTES.VOLUME_PROFILE}/`]
  },
  {
    id: 'settings',
    label: 'Settings',
    to: ROUTES.SETTINGS,
    icon: 'Settings2',
    matchPaths: [ROUTES.SETTINGS, `${ROUTES.SETTINGS}/`]
  }
];

export default SIDEBAR_MENU_CONFIG;
