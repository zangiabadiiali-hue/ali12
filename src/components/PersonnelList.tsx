import { Personnel } from '../database';

interface PersonnelListProps {
  personnel: Personnel[];
  onEdit: (person: Personnel) => void;
  onDelete: (id: number) => void;
}

export default function PersonnelList({ personnel, onEdit, onDelete }: PersonnelListProps) {
  if (personnel.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-700 mb-2">هنوز پرسنلی ثبت نشده</h3>
        <p className="text-gray-500">برای شروع، از تب "ثبت نام جدید" اقدام کنید</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Search & Stats */}
      <div className="p-4 bg-gradient-to-l from-indigo-50 to-blue-50 border-b border-gray-100">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium">
              مجموع: {personnel.length} نفر
            </span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">ردیف</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">عکس</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">نام و نام خانوادگی</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">کد ملی</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">سمت</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">دپارتمان</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">موبایل</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">نوع استخدام</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {personnel.map((person, index) => (
              <tr key={person.id} className="border-b border-gray-50 hover:bg-blue-50/30 transition-colors">
                <td className="px-4 py-3 text-sm text-gray-500">{index + 1}</td>
                <td className="px-4 py-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 overflow-hidden flex items-center justify-center">
                    {person.photo ? (
                      <img src={person.photo} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-indigo-600 font-bold text-sm">
                        {person.firstName?.charAt(0)}{person.lastName?.charAt(0)}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="font-medium text-gray-800">{person.firstName} {person.lastName}</div>
                  {person.fatherName && <div className="text-xs text-gray-500">پدر: {person.fatherName}</div>}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 font-mono">{person.nationalCode}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{person.position || '-'}</td>
                <td className="px-4 py-3">
                  <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-lg text-xs font-medium">
                    {person.department || '-'}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 font-mono">{person.mobile || '-'}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                    person.employmentType === 'تمام وقت' ? 'bg-emerald-50 text-emerald-700' :
                    person.employmentType === 'قراردادی' ? 'bg-amber-50 text-amber-700' :
                    'bg-gray-50 text-gray-700'
                  }`}>
                    {person.employmentType || '-'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => onEdit(person)}
                      className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors"
                      title="ویرایش"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => onDelete(person.id)}
                      className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                      title="حذف"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
