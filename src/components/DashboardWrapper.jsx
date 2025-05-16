import React, { useEffect, useState } from 'react';
import Dashboard from './Dashboard';

const DashboardWrapper = () => {
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const appRoot = document.getElementById('app-root');
    if (appRoot) {
      if (modalOpen) {
        appRoot.setAttribute('inert', '');
      } else {
        appRoot.removeAttribute('inert');
      }
    }
  }, [modalOpen]);

  return (
    <div id="app-root">
      <Dashboard setParentModalOpen={setModalOpen} />
    </div>
  );
};

export default DashboardWrapper;
