import path from 'path';
import sqlite3 from 'sqlite3';

const dbPath = path.join(__dirname, '../../data/lectures.db');

// Enable verbose mode for debugging
sqlite3.verbose();

class Database {
  private db: sqlite3.Database;

  constructor() {
    this.db = new sqlite3.Database(dbPath, (err:Error | null) => {
      if (err) {
        console.error('Error opening database:', err.message);
      } else {
        console.log('Connected to SQLite database');
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
        materials TEXT, -- JSON string for materials array
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      )
    `;

    this.db.run(createLecturesTable, (err:Error | null) => {
      if (err) {
        console.error('Error creating lectures table:', err.message);
      } else {
        console.log('Lectures table initialized');
        this.seedSampleData();
      }
    });
  }

  private seedSampleData() {
    const checkQuery = 'SELECT COUNT(*) as count FROM lectures';
    
    this.db.get(checkQuery, (err:Error | null, row: any) => {
      if (err) {
        console.error('Error checking data:', err.message);
        return;
      }

      if (row.count === 0) {
        console.log('Seeding sample data...');
        const sampleLectures = [
          {
            id: '1',
            title: 'Introduction to React Hooks',
            instructor: 'Dr. Sarah Johnson',
            description: 'Learn the fundamentals of React Hooks and how they revolutionize functional components.',
            fullDescription: 'This comprehensive lecture covers useState, useEffect, useContext, and custom hooks. We\'ll build practical examples and explore best practices for modern React development.',
            startTime: '09:00',
            endTime: '10:30',
            date: '2025-01-15',
            category: 'computer-science',
            location: 'Room 201, CS Building',
            maxStudents: 45,
            enrolledStudents: 32,
            materials: JSON.stringify([
              {
                id: '1',
                name: 'React Hooks Guide.pdf',
                type: 'pdf',
                url: 'https://example.com/react-hooks-guide.pdf'
              },
              {
                id: '2',
                name: 'Code Examples',
                type: 'link',
                url: 'https://github.com/example/react-hooks-examples'
              }
            ]),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: '2',
            title: 'Advanced Calculus: Integration Techniques',
            instructor: 'Prof. Michael Chen',
            description: 'Master advanced integration methods including integration by parts, partial fractions, and trigonometric substitution.',
            fullDescription: 'This advanced mathematics lecture focuses on complex integration techniques used in engineering and physics applications. Students will solve challenging problems and learn when to apply each method.',
            startTime: '14:00',
            endTime: '15:30',
            date: '2025-01-16',
            category: 'mathematics',
            location: 'Mathematics Hall 101',
            maxStudents: 60,
            enrolledStudents: 48,
            materials: JSON.stringify([
              {
                id: '3',
                name: 'Integration Techniques Handbook',
                type: 'pdf',
                url: 'https://example.com/integration-handbook.pdf'
              }
            ]),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: '3',
            title: 'Quantum Mechanics Fundamentals',
            instructor: 'Dr. Emily Rodriguez',
            description: 'Explore the fascinating world of quantum mechanics, covering wave-particle duality and the uncertainty principle.',
            fullDescription: 'Introduction to quantum mechanics for physics majors. Topics include the Schrödinger equation, quantum states, observables, and measurement theory. Mathematical prerequisites include linear algebra and differential equations.',
            startTime: '11:00',
            endTime: '12:30',
            date: '2025-01-17',
            category: 'physics',
            location: 'Physics Laboratory A',
            maxStudents: 35,
            enrolledStudents: 28,
            materials: JSON.stringify([
              {
                id: '4',
                name: 'Quantum Mechanics Lecture Notes',
                type: 'pdf',
                url: 'https://example.com/quantum-notes.pdf'
              },
              {
                id: '5',
                name: 'Virtual Lab Simulation',
                type: 'link',
                url: 'https://quantumlab.example.com'
              }
            ]),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
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
          ], (err:Error | null) => {
            if (err) {
              console.error('Error inserting sample data:', err.message);
            }
          });
        });

        console.log('Sample data seeded successfully');
      }
    });
  }

  getDatabase(): sqlite3.Database {
    return this.db;
  }

  close(): void {
    this.db.close((err:Error | null) => {
      if (err) {
        console.error('Error closing database:', err.message);
      } else {
        console.log('Database connection closed');
      }
    });
  }
}

export default Database;