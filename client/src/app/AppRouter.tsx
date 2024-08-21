import { useUserStore } from "@/entities";
import { privateRoutes, publicRoutes } from "@/shared";
import { Route, Routes } from "react-router-dom";

const AppRouter = () => {

  const {isAuth} = useUserStore()

  return (
    <Routes>
      {isAuth ? (
        privateRoutes.map((route) => (
          <Route
            key={route.path}
            path={route.exact ? route.path : `${route.path}/*`}
            element={<route.component/>}
          />
        ))) : (
        publicRoutes.map((route) => (
          <Route
            key={route.path}
            path={route.exact ? route.path : `${route.path}/*`}
            element={<route.component/>}
          />
        )))}
    </Routes>
  );
};

export default AppRouter;