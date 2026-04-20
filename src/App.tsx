/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import AMC from "./pages/AMC";
import About from "./pages/About";
import WhyCoolzo from "./pages/WhyCoolzo";
import Reviews from "./pages/Reviews";
import Blog from "./pages/Blog";
import BlogDetail from "./pages/BlogDetail";
import Contact from "./pages/Contact";
import BookingWizard from "./pages/BookingWizard";
import BookingConfirmation from "./pages/BookingConfirmation";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import PortalLayout from "./components/PortalLayout";
import Dashboard from "./pages/portal/Dashboard";
import BookingsList from "./pages/portal/BookingsList";
import BookingDetail from "./pages/portal/BookingDetail";
import AMCDashboard from "./pages/portal/AMCDashboard";
import EquipmentList from "./pages/portal/EquipmentList";
import EquipmentDetail from "./pages/portal/EquipmentDetail";
import InvoicesList from "./pages/portal/InvoicesList";
import InvoiceDetail from "./pages/portal/InvoiceDetail";
import TicketsList from "./pages/portal/TicketsList";
import TicketDetail from "./pages/portal/TicketDetail";
import NewTicket from "./pages/portal/NewTicket";
import Profile from "./pages/portal/Profile";
import Addresses from "./pages/portal/Addresses";
import Notifications from "./pages/portal/Notifications";
import Referral from "./pages/portal/Referral";
import Feedback from "./pages/portal/Feedback";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import NotFound from "./pages/NotFound";
import ErrorPage from "./pages/ErrorPage";
import SessionExpired from "./pages/SessionExpired";
import Maintenance from "./pages/Maintenance";
import { AuthProvider } from "./contexts/AuthContext";
import ErrorBoundary from "./components/ErrorBoundary";

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="services" element={<Services />} />
          <Route path="services/:id" element={<ServiceDetail />} />
          <Route path="amc" element={<AMC />} />
          <Route path="about" element={<About />} />
          <Route path="why-coolzo" element={<WhyCoolzo />} />
          <Route path="reviews" element={<Reviews />} />
          <Route path="blog" element={<Blog />} />
          <Route path="blog/:id" element={<BlogDetail />} />
          <Route path="contact" element={<Contact />} />
          <Route path="book" element={<BookingWizard />} />
          <Route path="booking-confirmation" element={<BookingConfirmation />} />
          <Route path="terms" element={<Terms />} />
          <Route path="privacy" element={<Privacy />} />
        </Route>
        
        <Route path="/portal" element={<PortalLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="bookings" element={<BookingsList />} />
          <Route path="bookings/:id" element={<BookingDetail />} />
          <Route path="amc" element={<AMCDashboard />} />
          <Route path="equipment" element={<EquipmentList />} />
          <Route path="equipment/:id" element={<EquipmentDetail />} />
          <Route path="invoices" element={<InvoicesList />} />
          <Route path="invoices/:id" element={<InvoiceDetail />} />
          <Route path="support" element={<TicketsList />} />
          <Route path="support/:id" element={<TicketDetail />} />
          <Route path="support/new" element={<NewTicket />} />
          <Route path="profile" element={<Profile />} />
          <Route path="addresses" element={<Addresses />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="referral" element={<Referral />} />
          <Route path="feedback/:id" element={<Feedback />} />
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/session-expired" element={<SessionExpired />} />
        <Route path="/maintenance" element={<Maintenance />} />
        <Route path="/error" element={<ErrorPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}
