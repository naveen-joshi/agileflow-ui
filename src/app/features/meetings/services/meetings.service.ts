import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';

export interface Meeting {
  id: string;
  title: string;
  datetime: Date;
  duration: number;
  hostId: string;
  participants: string[];
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
}

@Injectable({ providedIn: 'root' })
export class MeetingsService {
  private http = inject(HttpClient);

  meetings = signal<Meeting[]>([]);

  async scheduleMeeting(data: Partial<Meeting>) {
    if (environment.useMockData) {
      // Mock implementation
      const meeting: Meeting = {
        id: crypto.randomUUID(),
        title: data.title!,
        datetime: data.datetime!,
        duration: data.duration!,
        hostId: 'current-user-id',
        participants: [],
        status: 'scheduled',
      };

      this.meetings.update((meetings) => [...meetings, meeting]);
      return meeting;
    }

    const meeting = await this.http
      .post<Meeting>(`${environment.apiUrl}/meetings`, data)
      .toPromise();
    this.meetings.update((meetings) => [...meetings, meeting!]);
    return meeting;
  }

  async getMeetings() {
    if (environment.useMockData) {
      return this.meetings();
    }

    const meetings = await this.http
      .get<Meeting[]>(`${environment.apiUrl}/meetings`)
      .toPromise();
    this.meetings.set(meetings || []);
    return meetings;
  }

  async updateMeeting(id: string, data: Partial<Meeting>) {
    if (environment.useMockData) {
      this.meetings.update(meetings =>
        meetings.map(m => m.id === id ? { ...m, ...data } : m)
      );
      return this.meetings().find(m => m.id === id);
    }

    const meeting = await this.http
      .patch<Meeting>(`${environment.apiUrl}/meetings/${id}`, data)
      .toPromise();
    this.meetings.update(meetings =>
      meetings.map(m => m.id === id ? meeting! : m)
    );
    return meeting;
  }

  async cancelMeeting(id: string) {
    if (environment.useMockData) {
      this.meetings.update(meetings =>
        meetings.map(m => m.id === id ? { ...m, status: 'cancelled' } : m)
      );
      return;
    }

    await this.http
      .delete(`${environment.apiUrl}/meetings/${id}`)
      .toPromise();
    this.meetings.update(meetings =>
      meetings.filter(m => m.id !== id)
    );
  }

  async deleteMeeting(id: string) {
    return this.cancelMeeting(id);
  }

  async joinMeeting(id: string) {
    if (environment.useMockData) {
      const meeting = this.meetings().find(m => m.id === id);
      if (!meeting) throw new Error('Meeting not found');
      return meeting;
    }

    return this.http
      .post<Meeting>(`${environment.apiUrl}/meetings/${id}/join`, {})
      .toPromise();
  }
}
