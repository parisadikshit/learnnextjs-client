import { useContext, useState, useEffect } from "react";
import axios from "axios";
import { Context } from "../../context";
import { Button } from "antd";
import {
  SettingOutlined,
  UserSwitchOutlined,
  SyncOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import UserRoute from "../../components/routes/UserRoute";

const BecomeInstructor = () => {
  const router = useRouter();
  //STATE
  const [loading, setLoading] = useState(false);
  const [bankName, setBankName] = useState("");
  const [bankAcc, setBankAcc] = useState("");
  const [ifsc, setIfsc] = useState("");

  const {
    state: { user },
    dispatch,
  } = useContext(Context);

  // useEffect(() => {
  //   //  if (user) handleSubmit();
  // }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.table({name,email,password});
    try {
      setLoading(true);

      const { data } = await axios
        .post("/api/make-instructor", {
          bankName,
          bankAcc,
          ifsc,
        })
        .then((res) => {
          dispatch({
            type: "LOGIN",
            payload: res.data,
          });
          window.localStorage.setItem("user", JSON.stringify(res.data));
          window.location.href = "/instructor";
        });
      console.log("data", data);
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };
  const becomeInstructor = () => {
    console.log("become instructor");
    setLoading(true);
    const { data } = axios.post("/api/make-instructor", {});

    axios
      .post("/api/make-instructor")
      .then((res) => {
        console.log(res);
        window.location.href = res.data;
      })
      .catch((err) => {
        console.log(err.response.status);
        toast.error("stripe onboarding failed try again");
        setLoading(false);
      });
    console.log("not become");
  };

  return (
    <>
      <h1 className="jumbotron text-center square">Become Instructor </h1>
      <div className="container">
        <div className="row">
          <div className="col-md-6 offset-md-3 text-center">
            <div className="pt-4">
              <UserSwitchOutlined className="display-1 pb-3" />
              <br />
              <h2>
                Give bank details so we can transfer your earnings to your bank
                account
              </h2>
              <p className=" text-danger font-weight-bold ">
                To help us process your request quickly and accurately, could
                you please review the form and make sure all the required fields
                are filled out correctly?
              </p>
              {/* <p className="lead text-danger ">Please Fill this form corecc</p> */}
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  className="form-control mb-4 p-4"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  placeholder="Bank Name"
                  required
                />
                <input
                  type="text"
                  className="form-control mb-4 p-4"
                  value={bankAcc}
                  onChange={(e) => setBankAcc(e.target.value)}
                  placeholder="Bank Account No."
                  required
                />

                <input
                  type="text"
                  className="form-control mb-4 p-4"
                  value={ifsc}
                  onChange={(e) => setIfsc(e.target.value)}
                  placeholder="IFSC CODE"
                  required
                />

                <div className="d-grid gap-2">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={!ifsc || !bankAcc || loading}
                  >
                    {loading ? <SyncOutlined spin /> : "Submit"}
                  </button>
                </div>
              </form>

              {/* 
              <Button
                className="mb-3"
                type="primary"
                block
                shape="round"
                icon={loading ? <LoadingOutlined /> : <SettingOutlined />}
                size="large"
                onClick={becomeInstructor}
                disabled={
                  (user && user.role && user.role.includes("Instructor")) ||
                  loading
                }
              >
                {loading ? "processing..." : "Payout setup"}
              </Button> */}
              {/* <p className="lead">
                You will be redirected to stripe to complete onboarding process
              </p> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BecomeInstructor;
