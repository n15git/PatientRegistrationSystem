import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import PatientRegistration from './pages/PatientRegistration';
import PatientQuery from './pages/PatientQuery';
import PatientList from './pages/PatientList';
import { DatabaseProvider } from './context/DatabaseContext';

function App() {
  return (
    <DatabaseProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="register" element={<PatientRegistration />} />
            <Route path="query" element={<PatientQuery />} />
            <Route path="patients" element={<PatientList />} />
          </Route>
        </Routes>
      </Router>
    </DatabaseProvider>
  );
}

export default App;
