import React from 'react';
import withLayout from '../../layouts/HOC/withLayout';
import DashboardPage from './pages/dashboard/DashboardPage';

const AdminPage = () => {
  return <DashboardPage />;
};

export default withLayout(AdminPage);
