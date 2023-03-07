import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/router";
import { SyncOutlined } from "@ant-design/icons";
// import UserNav from "../nav/UserNav";
import UserNavigation from "../nav/UserNavigation";
const UserRoute = ({ children, showNav = true }) => {
  //state
  const [ok, setOk] = useState(false);

  //router
  const router = useRouter();

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const { data } = await axios.get("/api/current-user");

      // console.log(data.ok);
      if (data.ok) setOk(true);
    } catch (err) {
      // console.log(err);
      // console.log("error aali");
      setOk(false);
      router.push("/login");
    }
  };
  return (
    <>
      {!ok ? (
        <SyncOutlined
          spin
          className="d-flex justify-content-center display-1 text-primary p-5"
        />
      ) : (
        <>
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-2">{showNav && <UserNavigation />}</div>

              <div className="col-md-10">{children}</div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default UserRoute;
