import React, { useState } from 'react';
import { executeQuery } from '../services/DatabaseService';
import { useDatabaseContext } from '../context/DatabaseContext';
import { Database, Clipboard, Copy, Download } from 'lucide-react';

interface QueryResult {
  success: boolean;
  data: any[];
  error: string | null;
}

const PatientQuery: React.FC = () => {
  const { isInitialized } = useDatabaseContext();
  const [sqlQuery, setSqlQuery] = useState<string>('SELECT * FROM patients LIMIT 10');
  const [queryResult, setQueryResult] = useState<QueryResult | null>(null);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const handleQueryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSqlQuery(e.target.value);
  };

  const executeCustomQuery = async () => {
    if (!sqlQuery.trim()) return;

    setIsExecuting(true);

    try {
      const result = await executeQuery(sqlQuery);
      setQueryResult(result);
    } catch (error: any) {
      setQueryResult({
        success: false,
        data: [],
        error: error.message || 'An error occurred while executing the query',
      });
    } finally {
      setIsExecuting(false);
    }
  };

  const handleLoadExample = (example: string) => {
    setSqlQuery(example);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const downloadResults = () => {
    if (!queryResult?.data || queryResult.data.length === 0) return;

    const jsonStr = JSON.stringify(queryResult.data, null, 2);
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(jsonStr);
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "patient_query_results.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  if (!isInitialized) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="page-transition">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-black-900">Patient Query</h1>
        <p className="mt-2 text-sm text-black-700">
          Run custom SQL queries against the patient database
        </p>
      </header>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
        <div className="px-4 py-5 sm:p-6">
          <div className="mb-4">
            <label htmlFor="sqlQuery" className="form-label text-blue-800">
              SQL Query
            </label>
            <textarea
              id="sqlQuery"
              rows={5}
              className="form-input font-mono text-sm border border-blue-300 focus:ring-blue-500 focus:border-blue-500"
              value={sqlQuery}
              onChange={handleQueryChange}
              placeholder="Enter your SQL query here..."
            ></textarea>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleLoadExample('SELECT * FROM patients ORDER BY last_name LIMIT 10')}
                className="inline-flex items-center px-3 py-2 border border-blue-300 text-sm leading-4 font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Clipboard className="h-4 w-4 mr-1" /> Basic query
              </button>
              <button
                type="button"
                onClick={() => handleLoadExample("SELECT * FROM patients WHERE last_name LIKE 'S%' ORDER BY last_name")}
                className="inline-flex items-center px-3 py-2 border border-blue-300 text-sm leading-4 font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Clipboard className="h-4 w-4 mr-1" /> Filter by name
              </button>
            </div>
            <button
              type="button"
              onClick={executeCustomQuery}
              disabled={isExecuting}
              className="btn btn-primary bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isExecuting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Executing...
                </>
              ) : (
                <>
                  <Database className="h-4 w-4 mr-1" /> Run Query
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {queryResult && (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-blue-900">Query Results</h3>
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => copyToClipboard(JSON.stringify(queryResult.data, null, 2))}
                  className="inline-flex items-center px-3 py-2 border border-blue-300 text-sm leading-4 font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  disabled={!queryResult.success || queryResult.data.length === 0}
                >
                  {copied ? (
                    <>
                      <svg className="h-4 w-4 mr-1 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-1" /> Copy JSON
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={downloadResults}
                  className="inline-flex items-center px-3 py-2 border border-blue-300 text-sm leading-4 font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  disabled={!queryResult.success || queryResult.data.length === 0}
                >
                  <Download className="h-4 w-4 mr-1" /> Download JSON
                </button>
              </div>
            </div>

            {!queryResult.success ? (
              <div className="bg-red-50 border-l-4 border-red-600 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">
                      {queryResult.error || 'An error occurred while executing the query'}
                    </p>
                  </div>
                </div>
              </div>
            ) : queryResult.data.length === 0 ? (
              <div className="text-center py-10">
                <svg className="mx-auto h-12 w-12 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v10l5-5-5-5z" />
                </svg>
                <p className="mt-2 text-sm text-blue-600">No results found</p>
              </div>
            ) : (
              <div className="overflow-x-auto max-h-96 border border-blue-200 rounded-md">
                <table className="min-w-full divide-y divide-blue-200 text-sm">
                  <thead className="bg-blue-50 sticky top-0 z-10">
                    <tr>
                      {Object.keys(queryResult.data[0]).map((col) => (
                        <th
                          key={col}
                          scope="col"
                          className="px-3 py-2 text-left font-semibold text-blue-700"
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-blue-100">
                    {queryResult.data.map((row, i) => (
                      <tr key={i} className="hover:bg-blue-100">
                        {Object.keys(row).map((col) => (
                          <td key={col} className="px-3 py-2 whitespace-nowrap text-blue-900 font-mono">
                            {String(row[col])}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientQuery;
