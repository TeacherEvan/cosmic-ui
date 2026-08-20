import { useRoutes } from "react-router";
import App from "@/App";

function Router() {
  const routes = [
    {
      path: "/",
      element: <App />,
    },
  ];

  return useRoutes(routes);
}

export default Router;
