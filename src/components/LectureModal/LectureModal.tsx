import './LectureModal.css';

import { BookOpen, Clock, MapPin, User, Users, X } from 'lucide-react';
import { CreateLectureRequest, Lecture } from '../../types/lecture';
import React, { useEffect, useState } from 'react';

interface LectureModalProps {
  isOpen: boolean;
  onClose: () => void;
  lecture?: Lecture | null;
  initialDate?: string | null;
  onSubmit: (lecture: CreateLectureRequest) => void;
  onDelete?: (id: string) => void;
}

const LectureModal: React.FC<LectureModalProps> = ({
  isOpen,
  onClose,
  lecture,
  initialDate,
  onSubmit,
  onDelete
}) => {
  const [formData, setFormData] = useState<CreateLectureRequest>({
    title: '',
    instructor: '',
    description: '',
    fullDescription: '',
    startTime: '09:00',
    endTime: '10:30',
    date: '',
    category: 'other',
    location: '',
    maxStudents: 30,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (lecture) {
      setFormData({
        title: lecture.title,
        instructor: lecture.instructor,
        description: lecture.description,
        fullDescription: lecture.fullDescription || '',
        startTime: lecture.startTime,
        endTime: lecture.endTime,
        date: lecture.date,
        category: lecture.category,
        location: lecture.location || '',
        maxStudents: lecture.maxStudents || 30,
      });
    } else if (initialDate) {
      setFormData(prev => ({
        ...prev,
        date: initialDate,
        title: '',
        instructor: '',
        description: '',
        fullDescription: '',
        location: '',
      }));
    } else {
      // Reset form for new lecture
      setFormData({
        title: '',
        instructor: '',
        description: '',
        fullDescription: '',
        startTime: '09:00',
        endTime: '10:30',
        date: new Date().toISOString().split('T')[0],
        category: 'other',
        location: '',
        maxStudents: 30,
      });
    }
    setErrors({});
  }, [lecture, initialDate, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.instructor.trim()) {
      newErrors.instructor = 'Instructor name is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    if (formData.startTime >= formData.endTime) {
      newErrors.time = 'End time must be after start time';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleDelete = () => {
    if (lecture && onDelete && window.confirm('Are you sure you want to delete this lecture?')) {
      onDelete(lecture.id);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{lecture ? 'Edit Lecture' : 'Create New Lecture'}</h2>
          <button className="close-button" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="lecture-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="title">
                <BookOpen size={16} />
                Lecture Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Introduction to React"
                className={errors.title ? 'error' : ''}
              />
              {errors.title && <span className="error-message">{errors.title}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="instructor">
                <User size={16} />
                Instructor *
              </label>
              <input
                type="text"
                id="instructor"
                name="instructor"
                value={formData.instructor}
                onChange={handleInputChange}
                placeholder="Dr. Jane Smith"
                className={errors.instructor ? 'error' : ''}
              />
              {errors.instructor && <span className="error-message">{errors.instructor}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Short Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Brief overview of the lecture content..."
              rows={3}
              className={errors.description ? 'error' : ''}
            />
            {errors.description && <span className="error-message">{errors.description}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="fullDescription">Full Description</label>
            <textarea
              id="fullDescription"
              name="fullDescription"
              value={formData.fullDescription}
              onChange={handleInputChange}
              placeholder="Detailed description including objectives, prerequisites, etc..."
              rows={4}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="date">Date *</label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className={errors.date ? 'error' : ''}
              />
              {errors.date && <span className="error-message">{errors.date}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="startTime">
                <Clock size={16} />
                Start Time *
              </label>
              <input
                type="time"
                id="startTime"
                name="startTime"
                value={formData.startTime}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="endTime">End Time *</label>
              <input
                type="time"
                id="endTime"
                name="endTime"
                value={formData.endTime}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {errors.time && <span className="error-message">{errors.time}</span>}

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
              >
                <option value="computer-science">Computer Science</option>
                <option value="mathematics">Mathematics</option>
                <option value="physics">Physics</option>
                <option value="chemistry">Chemistry</option>
                <option value="biology">Biology</option>
                <option value="literature">Literature</option>
                <option value="history">History</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="location">
                <MapPin size={16} />
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Room 101, Building A"
              />
            </div>

            <div className="form-group">
              <label htmlFor="maxStudents">
                <Users size={16} />
                Max Students
              </label>
              <input
                type="number"
                id="maxStudents"
                name="maxStudents"
                value={formData.maxStudents}
                onChange={handleInputChange}
                min="1"
                max="500"
              />
            </div>
          </div>

          <div className="modal-actions">
            {lecture && onDelete && (
              <button
                type="button"
                className="btn-danger"
                onClick={handleDelete}
              >
                Delete Lecture
              </button>
            )}
            <div className="action-buttons">
              <button type="button" className="btn-secondary" onClick={onClose}>
            Cancel    
              </button>
              <button type="submit" className="btn-primary">
                {lecture ? 'Update Lecture' : 'Create Lecture'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LectureModal;