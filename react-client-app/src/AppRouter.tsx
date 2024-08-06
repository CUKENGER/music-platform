import { Route, Routes } from "react-router-dom";
import { privateRoutes, publicRoutes } from "./routes/routes";

const AppRouter = () => {

  const isAuth = false

  return (
    <Routes>
      {isAuth 
      ? (
        privateRoutes.map((route) => (
          <Route
            key={route.path}
            path={route.exact ? route.path : `${route.path}/*`}
            element={<route.component/>}
          />
        ))
      ) 
      : (
        publicRoutes.map((route) => (
          <Route
            key={route.path}
            path={route.exact ? route.path : `${route.path}/*`}
            element={<route.component/>}
          />
        ))
      )
      }
      
      
    </Routes>
  );
};

export default AppRouter;