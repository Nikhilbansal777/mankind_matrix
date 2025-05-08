import React from 'react';
import MainLayout from '../../layouts/MainLayout';

const withLayout = (WrappedComponent) => {
  return (props) => (
    <MainLayout>
      <WrappedComponent {...props} />
    </MainLayout>
  );
};

export default withLayout;