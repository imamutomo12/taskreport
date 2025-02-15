
    import './App.css'
    import { Login } from './pages/login'
    import {BrowserRouter, Route, Routes} from "react-router-dom";
    import {About} from "./pages/about.jsx";
    import {Dashboard} from "./pages/Dashboard.jsx";
    import {AuthProvider, useAuth} from "./context/AuthProvider.jsx";
    import RequireAuth from "./components/RequireAuth.jsx";
    import Departments from "./pages/DepartmentPage.jsx";
    import TaskTypes from "./pages/TaskTypes.jsx";
    import PerformanceRatings from "./pages/PerformanceRatings.jsx";
    import IncentivePayments from "./pages/IncentivePayments.jsx";
    import UserPaymentSummary from "./pages/UserPaymentSummary.jsx";
    import {Register} from "./pages/Register.jsx";
    import EmployeeTaskRecord from "./pages/EmployeeTaskRecord.jsx";
    import EmployeeProfilePage from "./pages/EmployeeProfilePage.jsx";
    function App() {
        const { auth } = useAuth();
        const ROLES = {
            'Employee': "employee",
            'Admin': "admin"
        };

      return (

          <BrowserRouter>
              <Routes>
                  <Route path="/about" element={<About />} />
                  <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>

                      <Route path="/department" element={<Departments />} />
                      <Route path="/tasktypes" element={<TaskTypes />} />
                      <Route path="/performanceratings" element={<PerformanceRatings />} />
                      <Route path="/incentivepayments" element={<IncentivePayments />} />
                      <Route path="/paymentsummary" element={<UserPaymentSummary />} />
                  </Route>

                  <Route element={<RequireAuth allowedRoles={[ROLES.Employee, ROLES.Admin]} />}>
                      <Route
                          path="/dashboard"
                          element={auth.role === "admin" ? <Dashboard /> : <EmployeeTaskRecord />}
                      />
                  </Route>

                  <Route element={<RequireAuth allowedRoles={[ROLES.Employee]} />}>

                      <Route path="/profile" element={<EmployeeProfilePage />} />

                  </Route>

                    <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
              </Routes>
          </BrowserRouter>

      )
    }

    export default App
