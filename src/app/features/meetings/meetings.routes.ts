import { Routes } from '@angular/router';
import { MeetingsLayoutComponent } from './components/meetings-layout/meetings-layout.component';
import { MeetingsListComponent } from './components/meetings-list/meetings-list.component';
import { MeetingSchedulerComponent } from './components/meeting-scheduler/meeting-scheduler.component';
import { MeetingRoomComponent } from './components/meeting-room/meeting-room.component';

export const MEETING_ROUTES: Routes = [
  {
    path: '',
    component: MeetingsLayoutComponent,
    children: [
      {
        path: '',
        component: MeetingsListComponent,
      },
      {
        path: 'schedule',
        component: MeetingSchedulerComponent,
      },
      {
        path: 'join/:id',
        component: MeetingRoomComponent,
      }
    ],
  },
];
