// @ts-ignore
import initSqlJs from 'sql.js';

interface Database {
  run(sql: string, params?: any[]): void;
  exec(sql: string): { columns: string[]; values: any[][] }[];
  export(): Uint8Array;
}

let db: Database | null = null;

export interface Personnel {
  id: number;
  firstName: string;
  lastName: string;
  nationalCode: string;
  fatherName: string;
  birthDate: string;
  gender: string;
  maritalStatus: string;
  education: string;
  phone: string;
  mobile: string;
  email: string;
  address: string;
  position: string;
  department: string;
  employmentDate: string;
  employmentType: string;
  salary: number;
  insuranceNumber: string;
  emergencyContact: string;
  emergencyPhone: string;
  photo?: string;
  notes?: string;
  createdAt: string;
}

export async function initDatabase(): Promise<void> {
  const SQL = await initSqlJs({
    locateFile: (file: string) => `https://sql.js.org/dist/${file}`
  });

  // Try to load existing database from localStorage
  const savedDb = localStorage.getItem('personnel_db');
  if (savedDb) {
    const buf = Uint8Array.from(atob(savedDb), c => c.charCodeAt(0));
    db = new SQL.Database(buf);
  } else {
    db = new SQL.Database();
  }

  // Create table
  db!.run(`
    CREATE TABLE IF NOT EXISTS personnel (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      firstName TEXT NOT NULL,
      lastName TEXT NOT NULL,
      nationalCode TEXT UNIQUE NOT NULL,
      fatherName TEXT,
      birthDate TEXT,
      gender TEXT,
      maritalStatus TEXT,
      education TEXT,
      phone TEXT,
      mobile TEXT,
      email TEXT,
      address TEXT,
      position TEXT,
      department TEXT,
      employmentDate TEXT,
      employmentType TEXT,
      salary REAL DEFAULT 0,
      insuranceNumber TEXT,
      emergencyContact TEXT,
      emergencyPhone TEXT,
      photo TEXT,
      notes TEXT,
      createdAt TEXT DEFAULT (datetime('now'))
    )
  `);

  saveDatabase();
}

function saveDatabase(): void {
  if (!db) return;
  const data = db.export();
  const binary = Array.from(data).map(b => String.fromCharCode(b)).join('');
  const base64 = btoa(binary);
  localStorage.setItem('personnel_db', base64);
}

export function addPersonnel(data: Omit<Personnel, 'id' | 'createdAt'>): void {
  if (!db) throw new Error('Database not initialized');

  db.run(`
    INSERT INTO personnel (firstName, lastName, nationalCode, fatherName, birthDate, gender, maritalStatus, education, phone, mobile, email, address, position, department, employmentDate, employmentType, salary, insuranceNumber, emergencyContact, emergencyPhone, photo, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    data.firstName, data.lastName, data.nationalCode, data.fatherName || '',
    data.birthDate || '', data.gender || '', data.maritalStatus || '',
    data.education || '', data.phone || '', data.mobile || '',
    data.email || '', data.address || '', data.position || '',
    data.department || '', data.employmentDate || '', data.employmentType || '',
    data.salary || 0, data.insuranceNumber || '', data.emergencyContact || '',
    data.emergencyPhone || '', data.photo || '', data.notes || ''
  ]);

  saveDatabase();
}

export function updatePersonnel(id: number, data: Omit<Personnel, 'id' | 'createdAt'>): void {
  if (!db) throw new Error('Database not initialized');

  db.run(`
    UPDATE personnel SET
      firstName=?, lastName=?, nationalCode=?, fatherName=?, birthDate=?,
      gender=?, maritalStatus=?, education=?, phone=?, mobile=?, email=?,
      address=?, position=?, department=?, employmentDate=?, employmentType=?,
      salary=?, insuranceNumber=?, emergencyContact=?, emergencyPhone=?,
      photo=?, notes=?
    WHERE id=?
  `, [
    data.firstName, data.lastName, data.nationalCode, data.fatherName || '',
    data.birthDate || '', data.gender || '', data.maritalStatus || '',
    data.education || '', data.phone || '', data.mobile || '',
    data.email || '', data.address || '', data.position || '',
    data.department || '', data.employmentDate || '', data.employmentType || '',
    data.salary || 0, data.insuranceNumber || '', data.emergencyContact || '',
    data.emergencyPhone || '', data.photo || '', data.notes || '', id
  ]);

  saveDatabase();
}

export function deletePersonnel(id: number): void {
  if (!db) throw new Error('Database not initialized');
  db.run('DELETE FROM personnel WHERE id=?', [id]);
  saveDatabase();
}

export function getAllPersonnel(): Personnel[] {
  if (!db) return [];

  const results = db.exec('SELECT * FROM personnel ORDER BY id DESC');
  if (results.length === 0) return [];

  const columns = results[0].columns;
  return results[0].values.map(row => {
    const obj: any = {};
    columns.forEach((col, idx) => {
      obj[col] = row[idx];
    });
    return obj as Personnel;
  });
}
