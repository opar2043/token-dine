import api from "@/lib/api";
import type { AttendanceEntry, AttendanceStatus } from "@/lib/types";

export interface ListAttendanceParams {
  workerId?: string;
  date?: string;
}

export const attendanceService = {
  getAttendance: async (
    params: ListAttendanceParams = {}
  ): Promise<AttendanceEntry[]> => {
    const { data } = await api.get<{ items: AttendanceEntry[] }>("/attendance", { params });
    return data.items;
  },

  checkInAttendance: async (workerId: string): Promise<AttendanceEntry> => {
    const { data } = await api.post<AttendanceEntry>("/attendance/checkin", { workerId });
    return data;
  },

  updateAttendanceStatus: async (
    id: string,
    status: AttendanceStatus
  ): Promise<AttendanceEntry> => {
    const { data } = await api.patch<AttendanceEntry>(`/attendance/${id}/status`, { status });
    return data;
  },
};
