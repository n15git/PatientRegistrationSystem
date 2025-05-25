import React, { useState } from 'react';
import { registerPatient } from '../services/DatabaseService';
import { useDatabaseContext } from '../context/DatabaseContext';

interface PatientFormData {
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: string;
  email: string;
  phone: string;
  address: string;
  medical_notes: string;
  insurance_provider: string;
  insurance_id: string;
}

const initialFormData: PatientFormData = {
  first_name: '',
  last_name: '',
  date_of_birth: '',
  gender: '',
  email: '',
  phone: '',
  address: '',
  medical_notes: '',
  insurance_provider: '',
  insurance_id: '',
};

const PatientRegistration: React.FC = () => {
  const { isInitialized } = useDatabaseContext();
  const [formData, setFormData] = useState<PatientFormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<PatientFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name as keyof PatientFormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<PatientFormData> = {};
    
    if (!formData.first_name.trim()) {
      newErrors.first_name = 'First name is required';
    }
    
    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Last name is required';
    }
    
    if (!formData.date_of_birth.trim()) {
      newErrors.date_of_birth = 'Date of birth is required';
    }
    
    if (!formData.gender) {
      newErrors.gender = 'Gender is required';
    }
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await registerPatient(formData);
      setSubmitSuccess(true);
      setFormData(initialFormData);
      
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error registering patient:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isInitialized) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="page-transition">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Register New Patient</h1>
        <p className="mt-2 text-sm text-gray-600">
          Enter patient information to add them to the system
        </p>
      </header>

      {submitSuccess && (
        <div className="mb-6 bg-success-50 border-l-4 border-success-500 p-4 slide-in">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-success-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-success-700">
                Patient registered successfully!
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <form onSubmit={handleSubmit}>
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* Personal Information */}
              <div className="sm:col-span-2">
                <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
                <div className="mt-1 h-px bg-gray-200"></div>
              </div>

              <div className="form-group">
                <label htmlFor="first_name" className="form-label">
                  First Name <span className="text-error-500">*</span>
                </label>
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  className={`form-input ${errors.first_name ? 'border-error-500 focus:ring-error-500 focus:border-error-500' : ''}`}
                  required
                />
                {errors.first_name && (
                  <p className="mt-1 text-sm text-error-600">{errors.first_name}</p>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="last_name" className="form-label">
                  Last Name <span className="text-error-500">*</span>
                </label>
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  className={`form-input ${errors.last_name ? 'border-error-500 focus:ring-error-500 focus:border-error-500' : ''}`}
                  required
                />
                {errors.last_name && (
                  <p className="mt-1 text-sm text-error-600">{errors.last_name}</p>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="date_of_birth" className="form-label">
                  Date of Birth <span className="text-error-500">*</span>
                </label>
                <input
                  type="date"
                  id="date_of_birth"
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                  className={`form-input ${errors.date_of_birth ? 'border-error-500 focus:ring-error-500 focus:border-error-500' : ''}`}
                  required
                />
                {errors.date_of_birth && (
                  <p className="mt-1 text-sm text-error-600">{errors.date_of_birth}</p>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="gender" className="form-label">
                  Gender <span className="text-error-500">*</span>
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className={`form-input ${errors.gender ? 'border-error-500 focus:ring-error-500 focus:border-error-500' : ''}`}
                  required
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer_not_to_say">Prefer not to say</option>
                </select>
                {errors.gender && (
                  <p className="mt-1 text-sm text-error-600">{errors.gender}</p>
                )}
              </div>

              {/* Contact Information */}
              <div className="sm:col-span-2">
                <h3 className="text-lg font-medium text-gray-900">Contact Information</h3>
                <div className="mt-1 h-px bg-gray-200"></div>
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`form-input ${errors.email ? 'border-error-500 focus:ring-error-500 focus:border-error-500' : ''}`}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-error-600">{errors.email}</p>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="phone" className="form-label">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="(123) 456-7890"
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="address" className="form-label">
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Street address, city, state, zip"
                />
              </div>

              {/* Medical Information */}
              <div className="sm:col-span-2">
                <h3 className="text-lg font-medium text-gray-900">Medical Information</h3>
                <div className="mt-1 h-px bg-gray-200"></div>
              </div>

              <div className="form-group">
                <label htmlFor="insurance_provider" className="form-label">
                  Insurance Provider
                </label>
                <input
                  type="text"
                  id="insurance_provider"
                  name="insurance_provider"
                  value={formData.insurance_provider}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="insurance_id" className="form-label">
                  Insurance ID
                </label>
                <input
                  type="text"
                  id="insurance_id"
                  name="insurance_id"
                  value={formData.insurance_id}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="medical_notes" className="form-label">
                  Medical Notes
                </label>
                <textarea
                  id="medical_notes"
                  name="medical_notes"
                  rows={3}
                  value={formData.medical_notes}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Any relevant medical history or notes"
                ></textarea>
              </div>
            </div>
          </div>
          <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
            <button
              type="button"
              className="mr-3 btn btn-outline text-gray-700"
              onClick={() => setFormData(initialFormData)}
            >
              Reset
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                'Register Patient'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PatientRegistration;
