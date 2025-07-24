export interface Lecture {
  id: string;
  title: string;
  instructor: string;
  description: string;
  fullDescription?: string;
  startTime: string;
  endTime: string;
  date: string;
  category: 'computer-science' | 'mathematics' | 'physics' | 'chemistry' | 'biology' | 'literature' | 'history' | 'other';
  materials?: {
    id: string;
    name: string;
    type: 'pdf' | 'image' | 'link';
    url: string;
  }[];
  location?: string;
  maxStudents?: number;
  enrolledStudents?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLectureRequest {
  title: string;
  instructor: string;
  description: string;
  fullDescription?: string;
  startTime: string;
  endTime: string;
  date: string;
  category: Lecture['category'];
  location?: string;
  maxStudents?: number;
}

export interface UpdateLectureRequest extends Partial<CreateLectureRequest> {
  id: string;
}