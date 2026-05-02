// src/pages/Dashboard.jsx
import AppLayout from '../components/AppLayout';
import CampusLink from '../modules/CampusLink';
import InboxEscrow from '../modules/InboxEscrow';

export default function Dashboard({ user }) {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <AppLayout userRole={user.role} userName={user.name}>
      {activeTab === 'dashboard' && <DashboardHome />}
      {activeTab === 'campus' && <CampusLink />}
      {activeTab === 'escrow' && <InboxEscrow />}
      {/* Add other modules here */}
    </AppLayout>
  );
}
