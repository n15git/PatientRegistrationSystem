import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, Search, Users, DatabaseIcon } from 'lucide-react';
import { getAllPatients } from '../services/DatabaseService';
import { useDatabaseContext } from '../context/DatabaseContext';

const Dashboard: React.FC = () => {
  const { isLoading, isInitialized, error } = useDatabaseContext();
  const [patientCount, setPatientCount] = useState<number>(0);

  useEffect(() => {
    const loadData = async () => {
      if (isInitialized) {
        try {
          const patients = await getAllPatients();
          setPatientCount(patients.length);
        } catch (err) {
          console.error('Error loading dashboard data:', err);
        }
      }
    };

    loadData();
  }, [isInitialized]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-transition">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-sm text-gray-600">
          Welcome to your patient registration system
        </p>
      </header>

      <div className="mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-teal-100 rounded-md p-3">
                <Users className="h-6 w-6 text-teal-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Patients
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">{patientCount}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3 flex items-center justify-between">
            <div className="text-sm">
              <Link
                to="/patients"
                className="font-medium text-teal-600 hover:text-teal-500"
              >
                View all patients
              </Link>
            </div>
            <span className="inline-flex rounded-md shadow-sm">
              <Link
                to="/register"
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
              >
                <UserPlus className="h-4 w-4 mr-1" /> Register New
              </Link>
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Register Patients Card */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-teal-100 rounded-md p-3">
                <UserPlus className="h-6 w-6 text-teal-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <h3 className="text-lg font-medium text-gray-900">Register Patients</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Add new patients to the system 
                </p>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link
                to="/register"
                className="font-medium text-teal-600 hover:text-teal-500"
              >
                Register new patient →
              </Link>
            </div>
          </div>
        </div>

        {/* Query Patients Card */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-amber-100 rounded-md p-3">
                <Search className="h-6 w-6 text-amber-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <h3 className="text-lg font-medium text-gray-900">Query Records</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Search and filter patient records using custom SQL queries
                </p>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link
                to="/query"
                className="font-medium text-amber-600 hover:text-amber-500"
              >
                Go to query interface →
              </Link>
            </div>
          </div>
        </div>

        {/* Database Info Card */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-violet-100 rounded-md p-3">
                <DatabaseIcon className="h-6 w-6 text-violet-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <h3 className="text-lg font-medium text-gray-900">Database Status</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Using Pglite for in-browser storage with multi-tab support
                </p>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm flex items-center">
              <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
              <span className="text-gray-600">Database initialized successfully</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
