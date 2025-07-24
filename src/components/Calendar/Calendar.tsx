import React, { useState, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { EventClickArg, DateSelectArg } from '@fullcalendar/core';
import { Lecture } from '../../types/lecture';
import { useLectures } from '../../hooks/useLectures';
import LectureModal from '../LectureModal/LectureModal';
import { useNavigate } from 'react-router-dom';
import './Calendar.css';

const Calendar: React.FC = () => {
  const navigate = useNavigate();
  const { lectures, createLecture, updateLecture, deleteLecture } = useLectures();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLecture, setSelectedLecture] = useState<Lecture | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const calendarRef = useRef<FullCalendar>(null);

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

  const events = lectures.map(lecture => ({
    id: lecture.id,
    title: lecture.title,
    start: `${lecture.date}T${lecture.startTime}`,
    end: `${lecture.date}T${lecture.endTime}`,
    backgroundColor: getCategoryColor(lecture.category),
    borderColor: getCategoryColor(lecture.category),
    extendedProps: {
      instructor: lecture.instructor,
      description: lecture.description,
      category: lecture.category,
      location: lecture.location,
    }
  }));

  const handleEventClick = (clickInfo: EventClickArg) => {
    navigate(`/lecture/${clickInfo.event.id}`);
  };

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    setSelectedDate(selectInfo.startStr.split('T')[0]);
    setSelectedLecture(null);
    setIsModalOpen(true);
  };

  const handleLectureSubmit = async (lectureData: any) => {
    try {
      if (selectedLecture) {
        await updateLecture({ ...lectureData, id: selectedLecture.id });
      } else {
        await createLecture(lectureData);
      }
      setIsModalOpen(false);
      setSelectedLecture(null);
      setSelectedDate(null);
    } catch (error) {
      console.error('Error saving lecture:', error);
    }
  };

  const handleLectureDelete = async (id: string) => {
    try {
      await deleteLecture(id);
      setIsModalOpen(false);
      setSelectedLecture(null);
    } catch (error) {
      console.error('Error deleting lecture:', error);
    }
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <h1>Lecture Calendar</h1>
        <button 
          className="btn-primary"
          onClick={() => {
            setSelectedLecture(null);
            setSelectedDate(null);
            setIsModalOpen(true);
          }}
        >
          Add Lecture
        </button>
      </div>

      <div className="calendar-wrapper">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          initialView="timeGridWeek"
          height="auto"
          selectable={true}
          selectMirror={true}
          events={events}
          select={handleDateSelect}
          eventClick={handleEventClick}
          editable={false}
          dayMaxEvents={true}
          weekends={true}
          businessHours={{
            daysOfWeek: [1, 2, 3, 4, 5],
            startTime: '08:00',
            endTime: '18:00',
          }}
          slotMinTime="07:00:00"
          slotMaxTime="20:00:00"
          allDaySlot={false}
        />
      </div>

      <LectureModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedLecture(null);
          setSelectedDate(null);
        }}
        lecture={selectedLecture}
        initialDate={selectedDate}
        onSubmit={handleLectureSubmit}
        onDelete={selectedLecture ? handleLectureDelete : undefined}
      />
    </div>
  );
};

export default Calendar;