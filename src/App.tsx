import { useState, useEffect, useCallback } from 'react';
import PersonnelForm from './components/PersonnelForm';
import PersonnelList from './components/PersonnelList';
import { initDatabase, Personnel, addPersonnel, updatePersonnel, deletePersonnel, getAllPersonnel } from './database';

function App() {
  const [dbReady, setDbReady] = useState(false);
  const [personnel, setPersonnel] = useState<Personnel[]>([]);
  const [editingPerson, setEditingPerson] = useState<Personnel | null>(null);
  const [activeTab, setActiveTab] = useState<'form' | 'list'>('form');
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    initDatabase().then(() => {
      setDbReady(true);
      loadPersonnel();
    });
  }, []);

  const loadPersonnel = () => {
    const data = getAllPersonnel();
    setPersonnel(data);
  };

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSubmit = useCallback((data: Omit<Personnel, 'id' | 'createdAt'>) => {
    try {
      if (editingPerson) {
        updatePersonnel(editingPerson.id, data);
        showNotification('اطلاعات پرسنل با موفقیت ویرایش شد', 'success');
        setEditingPerson(null);
      } else {
        addPersonnel(data);
        showNotification('پرسنل جدید با موفقیت ثبت شد', 'success');
      }
      loadPersonnel();
      setActiveTab('list');
    } catch (error) {
      showNotification('خطا در ثبت اطلاعات', 'error');
    }
  }, [editingPerson]);

  const handleEdit = (person: Personnel) => {
    setEditingPerson(person);
    setActiveTab('form');
  };

  const handleDelete = (id: number) => {
    if (confirm('آیا از حذف این پرسنل اطمینان دارید؟')) {
      deletePersonnel(id);
      loadPersonnel();
      showNotification('پرسنل با موفقیت حذف شد', 'success');
    }
  };

  const handleCancelEdit = () => {
    setEditingPerson(null);
  };

  if (!dbReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600 font-medium">در حال بارگذاری پایگاه داده...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 font-sans">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-lg text-white font-medium transition-all duration-300 ${
          notification.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'
        }`}>
          {notification.message}
        </div>
      )}

      {/* Header */}
      <header className="bg-gradient-to-l from-indigo-700 to-blue-800 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">سامانه ثبت نام پرسنل</h1>
                <p className="text-blue-200 text-sm">مدیریت اطلاعات کارکنان</p>
              </div>
            </div>
            <div className="text-white text-sm bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
              <span className="font-bold">{personnel.length}</span> نفر ثبت شده
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 mt-6">
        <div className="flex gap-2 bg-white rounded-xl p-1.5 shadow-sm border border-gray-100 w-fit">
          <button
            onClick={() => setActiveTab('form')}
            className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'form'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              {editingPerson ? 'ویرایش پرسنل' : 'ثبت نام جدید'}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('list')}
            className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'list'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              لیست پرسنل
            </span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === 'form' ? (
          <PersonnelForm
            onSubmit={handleSubmit}
            editingPerson={editingPerson}
            onCancelEdit={handleCancelEdit}
          />
        ) : (
          <PersonnelList
            personnel={personnel}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
}

export default App;
