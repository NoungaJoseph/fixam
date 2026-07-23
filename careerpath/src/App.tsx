import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import CatalogPage from './pages/CatalogPage';
import OpportunitiesPage from './pages/OpportunitiesPage';
import ProgramInfoPage from './pages/ProgramInfoPage';
import DetailPage from './pages/DetailPage';
import CertificatesPage from './pages/CertificatesPage';
import ForProvidersPage from './pages/ForProvidersPage';
import ScrollToTop from './components/ScrollToTop';

import HowItWorksPage from './pages/HowItWorksPage';
import FAQPage from './pages/FAQPage';
import AboutUsPage from './pages/AboutUsPage';
import CareersPage from './pages/CareersPage';
import BlogPage from './pages/BlogPage';
import ContactPage from './pages/ContactPage';
import HelpCenterPage from './pages/HelpCenterPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfUsePage from './pages/TermsOfUsePage';

import ForgotPasswordPage from './pages/ForgotPasswordPage';
import TaskFlowPage from './pages/TaskFlowPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import ReferralPage from './pages/ReferralPage';

function App() {
  return (
    <div className="min-h-screen bg-white text-gray-800 antialiased font-sans">
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/catalog" element={<CatalogPage />} />
        <Route path="/opportunities" element={<OpportunitiesPage />} />
        <Route path="/info/:categoryKey" element={<ProgramInfoPage />} />
        <Route path="/career-paths/:categoryKey" element={<DetailPage />} />
        <Route path="/career-paths/:categoryKey/flow" element={<TaskFlowPage />} />
        <Route path="/certificates" element={<CertificatesPage />} />
        <Route path="/for-providers" element={<ForProvidersPage />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="/faqs" element={<FAQPage />} />
        <Route path="/about" element={<AboutUsPage />} />
        <Route path="/careers" element={<CareersPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/help" element={<HelpCenterPage />} />
        <Route path="/privacy" element={<PrivacyPolicyPage />} />
        <Route path="/terms" element={<TermsOfUsePage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/referrals" element={<ReferralPage />} />
      </Routes>
    </div>
  );
}

export default App;
