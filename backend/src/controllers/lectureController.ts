import { CreateLectureRequest, Lecture, UpdateLectureRequest } from '../types/lecture';
import { Request, Response } from 'express';

import dbInstance from '../database/database';
import { v4 as uuidv4 } from 'uuid';

const db = dbInstance.getDatabase();

export class LectureController {
  // Get all lectures
  static getAllLectures(req: Request, res: Response): void {
    const { start, end } = req.query;
    
    let query = 'SELECT * FROM lectures';
    let params: any[] = [];

    if (start && end) {
      query += ' WHERE date BETWEEN ? AND ?';
      params = [start, end];
    }

    query += ' ORDER BY date ASC, startTime ASC';

    db.all(query, params, (err: Error | null, rows: any[]) => {
      if (err) {
        console.error('Error fetching lectures:', err.message);
        res.status(500).json({ error: 'Failed to fetch lectures' });
        return;
      }

      const lectures: Lecture[] = rows.map(row => ({
        ...row,
        materials: typeof row.materials === 'string'
        ? JSON.parse(row.materials)
        : Array.isArray(row.materials)
          ? row.materials
          : []
      }));

      res.json(lectures);
    });
  }

  // Get lecture by ID
  static getLectureById(req: Request, res: Response): void {
    const { id } = req.params;

    db.get('SELECT * FROM lectures WHERE id = ?', [id], (err: Error | null, row: any) => {
      if (err) {
        console.error('Error fetching lecture:', err.message);
        res.status(500).json({ error: 'Failed to fetch lecture' });
        return;
      }

      if (!row) {
        res.status(404).json({ error: 'Lecture not found' });
        return;
      }

      const lecture: Lecture = {
        ...row,
        materials: row.materials ? JSON.parse(row.materials) : []
      };

      res.json(lecture);
    });
  }

  // Create new lecture
  static createLecture(req: Request, res: Response): void {
    const lectureData: CreateLectureRequest = req.body;

    // Validate required fields
    const requiredFields = ['title', 'instructor', 'description', 'startTime', 'endTime', 'date', 'category'];
    const missingFields = requiredFields.filter(field => !lectureData[field as keyof CreateLectureRequest]);

    if (missingFields.length > 0) {
      res.status(400).json({ 
        error: 'Missing required fields', 
        missingFields 
      });
      return;
    }

    // Validate time format
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(lectureData.startTime) || !timeRegex.test(lectureData.endTime)) {
      res.status(400).json({ error: 'Invalid time format. Use HH:MM' });
      return;
    }

    // Validate date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(lectureData.date)) {
      res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD' });
      return;
    }

    const newLecture: Lecture = {
      id: uuidv4(),
      ...lectureData,
      enrolledStudents: 0,
      materials: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const insertQuery = `
      INSERT INTO lectures (
        id, title, instructor, description, fullDescription, startTime, endTime, 
        date, category, location, maxStudents, enrolledStudents, materials, 
        createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.run(insertQuery, [
      newLecture.id,
      newLecture.title,
      newLecture.instructor,
      newLecture.description,
      newLecture.fullDescription || null,
      newLecture.startTime,
      newLecture.endTime,
      newLecture.date,
      newLecture.category,
      newLecture.location || null,
      newLecture.maxStudents || null,
      newLecture.enrolledStudents,
      JSON.stringify(newLecture.materials),
      newLecture.createdAt,
      newLecture.updatedAt
    ], function(err: Error | null) {
      if (err) {
        console.error('Error creating lecture:', err.message);
        res.status(500).json({ error: 'Failed to create lecture' });
        return;
      }

      res.status(201).json(newLecture);
    });
  }

  // Update lecture
  static updateLecture(req: Request, res: Response): void {
    const { id } = req.params;
    const updateData: Partial<CreateLectureRequest> = req.body;

    // Check if lecture exists
    db.get('SELECT * FROM lectures WHERE id = ?', [id], (err:Error | null, existingLecture: any) => {
      if (err) {
        console.error('Error fetching lecture for update:', err.message);
        res.status(500).json({ error: 'Failed to update lecture' });
        return;
      }

      if (!existingLecture) {
        res.status(404).json({ error: 'Lecture not found' });
        return;
      }

      // Validate time format if provided
      const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
      if (updateData.startTime && !timeRegex.test(updateData.startTime)) {
        res.status(400).json({ error: 'Invalid start time format. Use HH:MM' });
        return;
      }
      if (updateData.endTime && !timeRegex.test(updateData.endTime)) {
        res.status(400).json({ or: 'Invalid end time format. Use HH:MM' });
        return;
      }

      // Validate date format if provided
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (updateData.date && !dateRegex.test(updateData.date)) {
        res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD' });
        return;
      }

      const updatedAt = new Date().toISOString();

      // Build dynamic update query
      const updateFields = [];
      const updateValues = [];

      Object.keys(updateData).forEach(key => {
        if (key !== 'id' && updateData[key as keyof CreateLectureRequest] !== undefined) {
          updateFields.push(`${key} = ?`);
          updateValues.push(updateData[key as keyof CreateLectureRequest]);
        }
      });

      updateFields.push('updatedAt = ?');
      updateValues.push(updatedAt, id);

      const updateQuery = `UPDATE lectures SET ${updateFields.join(', ')} WHERE id = ?`;

      db.run(updateQuery, updateValues, function(err:Error | null) {
        if (err) {
          console.error('Error updating lecture:', err.message);
          res.status(500).json({ error: 'Failed to update lecture' });
          return;
        }

        // Fetch and return updated lecture
        db.get('SELECT * FROM lectures WHERE id = ?', [id], (err: Error | null, updatedRow: any) => {
          if (err) {
            console.error('Error fetching updated lecture:', err.message);
            res.status(500).json({ error: 'Failed to fetch updated lecture' });
            return;
          }

          const updatedLecture: Lecture = {
            ...updatedRow,
            materials: updatedRow.materials ? JSON.parse(updatedRow.materials) : []
          };

          res.json(updatedLecture);
        });
      });
    });
  }

  // Delete lecture
  static deleteLecture(req: Request, res: Response): void {
    const { id } = req.params;

    // Check if lecture exists
    db.get('SELECT id FROM lectures WHERE id = ?', [id], (err: Error | null, row: any) => {
      if (err) {
        console.error('Error checking lecture existence:', err.message);
        res.status(500).json({ error: 'Failed to delete lecture' });
        return;
      }

      if (!row) {
        res.status(404).json({ error: 'Lecture not found' });
        return;
      }

      // Delete the lecture
      db.run('DELETE FROM lectures WHERE id = ?', [id], function(err: Error | null) {
        if (err) {
          console.error('Error deleting lecture:', err.message);
          res.status(500).json({ error: 'Failed to delete lecture' });
          return;
        }

        res.status(204).send();
      });
    });
  }
}