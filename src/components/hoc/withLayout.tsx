import React from 'react';
import Layout from '@/components/Layout';

const withLayout = (Page: React.ElementType, useLayout: boolean = true) => {
  const PageWithLayout = (props: any) => {
    if (useLayout) {
      return (
        <Layout>
          <Page {...props} />
        </Layout>
      );
    } else {
      return <Page {...props} />;
    }
  };

  return PageWithLayout;
};

export default withLayout;
