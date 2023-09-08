import React from "react";
import { Route } from "react-router-dom";

const RouteWithLayout: React.FC<{
  layout: any;
  component: any;
  path: any;
  exact: any;
}> = (props) => {
  const { layout: Layout, component: Component, ...rest } = props;

  return (
    <Route
      {...rest}
      render={(matchProps) => (
        <Layout>
          <Component {...matchProps} />
        </Layout>
      )}
    />
  );
};

export default RouteWithLayout;
