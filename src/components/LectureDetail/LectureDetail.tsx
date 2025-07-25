import './LectureDetail.css';

import { ArrowLeft, BookOpen, Calendar, Clock, Edit, MapPin, Trash2, User, Users } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Lecture } from '../../types/lecture';
import LectureModal from '../LectureModal/LectureModal';
import { lectureApi } from '../../services/api';
import { useLectures } from '../../hooks/useLectures';

const LectureDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { deleteLecture, updateLecture } = useLectures();
  const [lecture, setLecture] = useState<Lecture | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    const fetchLecture = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await lectureApi.getLectureById(id);
        setLecture(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch lecture');
      } finally {
        setLoading(false);
      }
    };

    fetchLecture();
  }, [id]);

  const handleEdit = () => {
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (lectureData: any) => {
    if (!lecture) return;
    
    try {
      const updatedLecture = await updateLecture({ ...lectureData, id: lecture.id });
      setLecture(updatedLecture);
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Error updating lecture:', error);
    }
  };

  const handleDelete = async () => {
    if (!lecture) return;
    
    if (window.confirm('Are you sure you want to delete this lecture?')) {
      try {
        await deleteLecture(lecture.id);
        navigate('/');
      } catch (error) {
        console.error('Error deleting lecture:', error);
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'computer-science': '#4285f4',
      'mathematics': '#34a853',
      'physics': '#ea4335',
      'chemistry': '#fbbc04',
      'biology': '#9aa0a6',
      'literature': '#ab47bc',
      'history': '#ff7043',
      'other': '#607d8b'
    };
    return colors[category] || colors.other;
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      'computer-science': 'Computer Science',
      'mathematics': 'Mathematics',
      'physics': 'Physics',
      'chemistry': 'Chemistry',
      'biology': 'Biology',
      'literature': 'Literature',
      'history': 'History',
      'other': 'Other'
    };
    return labels[category] || 'Other';
  };

  if (loading) {
    return (
      <div className="lecture-detail-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading lecture details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="lecture-detail-container">
        <div className="error-state">
          <h2>Error</h2>
          <p>{error}</p>
          <button className="btn-primary" onClick={() => navigate('/')}>
            Back to Calendar
          </button>
        </div>
      </div>
    );
  }

  if (!lecture) {
    return (
      <div className="lecture-detail-container">
        <div className="error-state">
          <h2>Lecture Not Found</h2>
          <p>The requested lecture could not be found.</p>
          <button className="btn-primary" onClick={() => navigate('/')}>
            Back to Calendar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="lecture-detail-container">
      <div className="lecture-detail-header">
        <button className="back-button" onClick={() => navigate('/')}>
          <ArrowLeft size={20} />
          Back to Calendar
        </button>
        
        <div className="action-buttons">
          <button className="btn-secondary" onClick={handleEdit}>
            <Edit size={16} />
            Edit
          </button>
          <button className="btn-danger" onClick={handleDelete}>
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      </div>

      <div className="lecture-detail-content">
        <div className="lecture-main-info">
          <div className="lecture-category">
            <span 
              className="category-badge"
              style={{ backgroundColor: getCategoryColor(lecture.category) }}
            >
              {getCategoryLabel(lecture.category)}
            </span>
          </div>

          <h1 className="lecture-title">{lecture.title}</h1>

          <div className="lecture-meta">
            <div className="meta-item">
              <User size={20} />
              <span>{lecture.instructor}</span>
            </div>
            
            <div className="meta-item">
              <Calendar size={20} />
              <span>{formatDate(lecture.date)}</span>
            </div>
            
            <div className="meta-item">
              <Clock size={20} />
              <span>{formatTime(lecture.startTime)} - {formatTime(lecture.endTime)}</span>
            </div>
            
            {lecture.location && (
              <div className="meta-item">
                <MapPin size={20} />
                <span>{lecture.location}</span>
              </div>
            )}
            
            {lecture.maxStudents && (
              <div className="meta-item">
                <Users size={20} />
                <span>Max {lecture.maxStudents} students</span>
              </div>
            )}
          </div>
        </div>

        <div className="lecture-description-section">
          <h2>
            <BookOpen size={20} />
            Description
          </h2>
          <p className="short-description">{lecture.description}</p>
          
          {lecture.fullDescription && (
            <div className="full-description">
              <h3>Details</h3>
              <p>{lecture.fullDescription}</p>
            </div>
          )}
        </div>

        {lecture.materials && lecture.materials.length > 0 && (
          <div className="lecture-materials-section">
            <h2>Course Materials</h2>
            <div className="materials-grid">
              {lecture.materials.map((material) => (
                <div key={material.id} className="material-card">
                  <div className="material-icon">
                    {material.type === 'pdf' && '📄'}
                    {material.type === 'image' && '🖼️'}
                    {material.type === 'link' && '🔗'}
                  </div>
                  <div className="material-info">
                    <h4>{material.name}</h4>
                    <p>{material.type.toUpperCase()}</p>
                  </div>
                  <a
                    href={material.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="material-link"
                  >
                    Open
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <LectureModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        lecture={lecture}
        onSubmit={handleEditSubmit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default LectureDetail;