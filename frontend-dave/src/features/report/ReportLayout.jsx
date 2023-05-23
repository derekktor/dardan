import { Outlet } from "react-router-dom";
import ReportHeader from "./ReportHeader";

const DashLayout = () => {
  return (
    <>
      <ReportHeader />
      <div>
        <Outlet />
      </div>
    </>
  );
};

export default DashLayout;
