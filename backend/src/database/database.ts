import { Lecture } from '../types/lecture';
import fs from 'fs';
import path from 'path';
import sqlite3 from 'sqlite3';

// Ensure data folder exists
const dataDir = path.resolve(__dirname, '../../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'lectures.db');

// Enable verbose mode for debugging
sqlite3.verbose();

class Database {
  private db: sqlite3.Database;

  constructor() {
    this.db = new sqlite3.Database(dbPath, (err: Error | null) => {
      if (err) {
        console.error('Error opening database:', err.message);
      } else {
        console.log('✅ Connected to SQLite database');
        this.initializeDatabase();
      }
    });
  }

  private initializeDatabase() {
    const createLecturesTable = `
      CREATE TABLE IF NOT EXISTS lectures (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        instructor TEXT NOT NULL,
        description TEXT NOT NULL,
        fullDescription TEXT,
        startTime TEXT NOT NULL,
        endTime TEXT NOT NULL,
        date TEXT NOT NULL,
        category TEXT NOT NULL,
        location TEXT,
        maxStudents INTEGER,
        enrolledStudents INTEGER DEFAULT 0,
        materials TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      );
    `;

    this.db.run(createLecturesTable, (err: Error | null) => {
      if (err) {
        console.error('❌ Error creating lectures table:', err.message);
      } else {
        console.log('📚 Lectures table initialized');
        this.seedSampleData();
      }
    });
  }

  private seedSampleData() {
    const checkQuery = 'SELECT COUNT(*) as count FROM lectures';

    this.db.get(checkQuery, (err: Error | null, row: any) => {
      if (err) {
        console.error('❌ Error checking data:', err.message);
        return;
      }

      if (row.count === 0) {
        console.log('🌱 Seeding sample data...');
        const sampleLectures :Lecture[]= [
          {
            id: '1',
            title: 'Introduction to React Hooks',
            instructor: 'Dr. Sarah Johnson',
            description: 'Learn the fundamentals of React Hooks and how to manage state effectively.',
            fullDescription: 'This comprehensive lecture will cover useState, useEffect, useContext, and custom hooks in detail.',
            startTime: '09:00',
            endTime: '10:30',
            date: '2025-07-30',
            category: 'computer-science',
            materials: [
              {
                id: 'mat-1',
                name: 'React Hooks Guide.pdf',
                type: 'pdf',
                url: 'https://example.com/hooks-guide.pdf'
              }
            ],
            location: 'Room 101',
            maxStudents: 50,
            enrolledStudents: 30,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          // Add more lectures...
        ];
         

        const insertQuery = `
          INSERT INTO lectures (
            id, title, instructor, description, fullDescription, startTime, endTime,
            date, category, location, maxStudents, enrolledStudents, materials,
            createdAt, updatedAt
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        sampleLectures.forEach((lecture) => {
          this.db.run(insertQuery, [
            lecture.id,
            lecture.title,
            lecture.instructor,
            lecture.description,
            lecture.fullDescription,
            lecture.startTime,
            lecture.endTime,
            lecture.date,
            lecture.category,
            lecture.location,
            lecture.maxStudents,
            lecture.enrolledStudents,
            lecture.materials,
            lecture.createdAt,
            lecture.updatedAt
          ], (err: Error | null) => {
            if (err) {
              console.error('❌ Error inserting sample data:', err.message);
            }
          });
        });

        console.log('✅ Sample data seeded');
      }
    });
  }

  public getDatabase(): sqlite3.Database {
    return this.db;
  }

  public close(): void {
    this.db.close((err: Error | null) => {
      if (err) {
        console.error('❌ Error closing database:', err.message);
      } else {
        console.log('🔌 Database connection closed');
      }
    });
  }
}

export default new Database(); // Export an instance
