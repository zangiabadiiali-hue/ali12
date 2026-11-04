import { useState, useEffect } from 'react';
import { Personnel } from '../database';

interface PersonnelFormProps {
  onSubmit: (data: Omit<Personnel, 'id' | 'createdAt'>) => void;
  editingPerson: Personnel | null;
  onCancelEdit: () => void;
}

const departments = [
  'مدیریت', 'فناوری اطلاعات', 'مالی و حسابداری', 'منابع انسانی',
  'فروش و بازاریابی', 'تولید', 'کنترل کیفیت', 'پشتیبانی',
  'تحقیق و توسعه', 'لجستیک و انبار', 'حقوقی', 'اداری'
];

const educationLevels = [
  'زیر دیپلم', 'دیپلم', 'فوق دیپلم', 'کارشناسی',
  'کارشناسی ارشد', 'دکتری', 'حوزوی'
];

const employmentTypes = [
  'تمام وقت', 'پاره وقت', 'قراردادی', 'پروژه‌ای', 'کارآموزی'
];

const genderOptions = ['مرد', 'زن'];
const maritalOptions = ['مجرد', 'متأهل'];

export default function PersonnelForm({ onSubmit, editingPerson, onCancelEdit }: PersonnelFormProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    nationalCode: '',
    fatherName: '',
    birthDate: '',
    gender: '',
    maritalStatus: '',
    education: '',
    phone: '',
    mobile: '',
    email: '',
    address: '',
    position: '',
    department: '',
    employmentDate: '',
    employmentType: '',
    salary: 0,
    insuranceNumber: '',
    emergencyContact: '',
    emergencyPhone: '',
    photo: '',
    notes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    if (editingPerson) {
      setFormData({
        firstName: editingPerson.firstName || '',
        lastName: editingPerson.lastName || '',
        nationalCode: editingPerson.nationalCode || '',
        fatherName: editingPerson.fatherName || '',
        birthDate: editingPerson.birthDate || '',
        gender: editingPerson.gender || '',
        maritalStatus: editingPerson.maritalStatus || '',
        education: editingPerson.education || '',
        phone: editingPerson.phone || '',
        mobile: editingPerson.mobile || '',
        email: editingPerson.email || '',
        address: editingPerson.address || '',
        position: editingPerson.position || '',
        department: editingPerson.department || '',
        employmentDate: editingPerson.employmentDate || '',
        employmentType: editingPerson.employmentType || '',
        salary: editingPerson.salary || 0,
        insuranceNumber: editingPerson.insuranceNumber || '',
        emergencyContact: editingPerson.emergencyContact || '',
        emergencyPhone: editingPerson.emergencyPhone || '',
        photo: editingPerson.photo || '',
        notes: editingPerson.notes || ''
      });
    }
  }, [editingPerson]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'نام الزامی است';
    if (!formData.lastName.trim()) newErrors.lastName = 'نام خانوادگی الزامی است';
    if (!formData.nationalCode.trim()) {
      newErrors.nationalCode = 'کد ملی الزامی است';
    } else if (!/^\d{10}$/.test(formData.nationalCode)) {
      newErrors.nationalCode = 'کد ملی باید ۱۰ رقم باشد';
    }
    if (formData.mobile && !/^09\d{9}$/.test(formData.mobile)) {
      newErrors.mobile = 'شماره موبایل معتبر نیست (مثال: 09123456789)';
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'ایمیل معتبر نیست';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(formData);
    if (!editingPerson) {
      setFormData({
        firstName: '', lastName: '', nationalCode: '', fatherName: '',
        birthDate: '', gender: '', maritalStatus: '', education: '',
        phone: '', mobile: '', email: '', address: '', position: '',
        department: '', employmentDate: '', employmentType: '',
        salary: 0, insuranceNumber: '', emergencyContact: '',
        emergencyPhone: '', photo: '', notes: ''
      });
      setCurrentStep(1);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, photo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const steps = [
    { num: 1, title: 'اطلاعات فردی', icon: '👤' },
    { num: 2, title: 'اطلاعات تماس', icon: '📞' },
    { num: 3, title: 'اطلاعات شغلی', icon: '💼' },
    { num: 4, title: 'سایر اطلاعات', icon: '📋' },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Steps */}
      <div className="bg-gradient-to-l from-indigo-50 to-blue-50 px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          {steps.map((step, idx) => (
            <div key={step.num} className="flex items-center">
              <button
                type="button"
                onClick={() => setCurrentStep(step.num)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                  currentStep === step.num
                    ? 'bg-indigo-600 text-white shadow-md scale-105'
                    : currentStep > step.num
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-white text-gray-500 hover:bg-gray-50'
                }`}
              >
                <span className="text-lg">{step.icon}</span>
                <span className="font-medium text-sm hidden sm:inline">{step.title}</span>
              </button>
              {idx < steps.length - 1 && (
                <div className={`w-8 h-0.5 mx-2 ${currentStep > step.num ? 'bg-emerald-300' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        {/* Step 1: Personal Info */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-fadeIn">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <span className="bg-indigo-100 p-2 rounded-lg">👤</span>
              اطلاعات فردی
            </h3>

            {/* Photo */}
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-gray-100 border-4 border-indigo-100 overflow-hidden flex items-center justify-center">
                {formData.photo ? (
                  <img src={formData.photo} alt="عکس" className="w-full h-full object-cover" />
                ) : (
                  <svg className="w-12 h-12 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                )}
              </div>
              <label className="cursor-pointer bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-4 py-2 rounded-lg transition-colors border border-indigo-200">
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  انتخاب عکس
                </span>
                <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <InputField label="نام *" name="firstName" value={formData.firstName} onChange={handleChange} error={errors.firstName} placeholder="نام" />
              <InputField label="نام خانوادگی *" name="lastName" value={formData.lastName} onChange={handleChange} error={errors.lastName} placeholder="نام خانوادگی" />
              <InputField label="نام پدر" name="fatherName" value={formData.fatherName} onChange={handleChange} placeholder="نام پدر" />
              <InputField label="کد ملی *" name="nationalCode" value={formData.nationalCode} onChange={handleChange} error={errors.nationalCode} placeholder="۰۰۱۲۳۴۵۶۷۸" maxLength={10} />
              <InputField label="تاریخ تولد" name="birthDate" value={formData.birthDate} onChange={handleChange} type="date" />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">جنسیت</label>
                <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white">
                  <option value="">انتخاب کنید</option>
                  {genderOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">وضعیت تأهل</label>
                <select name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white">
                  <option value="">انتخاب کنید</option>
                  {maritalOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">تحصیلات</label>
                <select name="education" value={formData.education} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white">
                  <option value="">انتخاب کنید</option>
                  {educationLevels.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Contact Info */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-fadeIn">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <span className="bg-indigo-100 p-2 rounded-lg">📞</span>
              اطلاعات تماس
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField label="تلفن ثابت" name="phone" value={formData.phone} onChange={handleChange} placeholder="۰۲۱-۱۲۳۴۵۶۷۸" />
              <InputField label="شماره موبایل" name="mobile" value={formData.mobile} onChange={handleChange} error={errors.mobile} placeholder="۰۹۱۲۳۴۵۶۷۸۹" />
              <InputField label="ایمیل" name="email" value={formData.email} onChange={handleChange} error={errors.email} placeholder="example@email.com" type="email" />
              <InputField label="شماره بیمه" name="insuranceNumber" value={formData.insuranceNumber} onChange={handleChange} placeholder="شماره بیمه تأمین اجتماعی" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">آدرس</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none"
                placeholder="آدرس کامل محل سکونت"
              />
            </div>
          </div>
        )}

        {/* Step 3: Employment Info */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-fadeIn">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <span className="bg-indigo-100 p-2 rounded-lg">💼</span>
              اطلاعات شغلی
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <InputField label="سمت شغلی" name="position" value={formData.position} onChange={handleChange} placeholder="مثال: مهندس نرم‌افزار" />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">دپارتمان / واحد</label>
                <select name="department" value={formData.department} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white">
                  <option value="">انتخاب کنید</option>
                  {departments.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>

              <InputField label="تاریخ استخدام" name="employmentDate" value={formData.employmentDate} onChange={handleChange} type="date" />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">نوع استخدام</label>
                <select name="employmentType" value={formData.employmentType} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white">
                  <option value="">انتخاب کنید</option>
                  {employmentTypes.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>

              <InputField label="حقوق (تومان)" name="salary" value={formData.salary.toString()} onChange={handleChange} type="number" placeholder="مبلغ حقوق" />
            </div>
          </div>
        )}

        {/* Step 4: Other Info */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-fadeIn">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <span className="bg-indigo-100 p-2 rounded-lg">📋</span>
              سایر اطلاعات
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField label="شخص تماس اضطراری" name="emergencyContact" value={formData.emergencyContact} onChange={handleChange} placeholder="نام شخص" />
              <InputField label="تلفن اضطراری" name="emergencyPhone" value={formData.emergencyPhone} onChange={handleChange} placeholder="شماره تماس" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">توضیحات</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none"
                placeholder="توضیحات اضافی..."
              />
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
          <div>
            {currentStep > 1 && (
              <button
                type="button"
                onClick={() => setCurrentStep(prev => prev - 1)}
                className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
              >
                ← مرحله قبل
              </button>
            )}
          </div>

          <div className="flex gap-3">
            {editingPerson && (
              <button
                type="button"
                onClick={onCancelEdit}
                className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
              >
                انصراف
              </button>
            )}

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(prev => prev + 1)}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors shadow-md"
              >
                مرحله بعد →
              </button>
            ) : (
              <button
                type="submit"
                className="px-8 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-colors shadow-md flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {editingPerson ? 'ذخیره تغییرات' : 'ثبت نام'}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}

// Reusable Input Field Component
function InputField({ label, name, value, onChange, error, type = 'text', placeholder = '', maxLength }: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  type?: string;
  placeholder?: string;
  maxLength?: number;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        maxLength={maxLength}
        className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all ${
          error ? 'border-red-300 bg-red-50' : 'border-gray-200'
        }`}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
