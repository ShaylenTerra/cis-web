import {Injectable} from '@angular/core';

export interface BadgeItem {
  type: string;
  value: string;
}
export interface Saperator {
  name: string;
  type?: string;
}
export interface SubChildren {
  state: string;
  name: string;
  type?: string;
}
export interface ChildrenItems {
  state: string;
  name: string;
  type?: string;
  child?: SubChildren[];
}

export interface Menu {
  state: string;
  name: string;
  type: string;
  icon: string;
  badge?: BadgeItem[];
  saperator?: Saperator[];
  children?: ChildrenItems[];
}

const MENUITEMS = [
  {
    state: 'dashboards',
    name: 'Dashboard',
    type: 'link',
    icon: 'dashboard',
  },
  {
    state: 'assistants',
    name: 'Assistants',
    type: 'link',
    icon: 'view_module'
  },
  {
    state: 'requests',
    name: 'Information',
    type: 'sub',
    icon: 'info_outline',
    children: [
      { state: 'search-requests', name: 'Search', type: 'link' },
      { state: 'my-requests', name: 'My Requests', type: 'link' }
    ]
  },
  {
    state: 'profile',
    name: 'Profile',
    type: 'link',
    icon: 'person_outline'
  },
  {
    state: 'queries',
    name: 'Queries',
    type: 'sub',
    icon: 'question_answer',
    children: [
      { state: 'queries-list', name: 'My Queries', type: 'link' },
      { state: 'log-query', name: 'Log New Query', type: 'link' }
    ]
  }
];

@Injectable()
export class MenuItems {
  getMenuitem(): Menu[] {
    return MENUITEMS;
  }
}
