import { Badge, Button } from "antd";
import { currencyFormatter } from "../../utils/helpers";
import ReactPlayer from "react-player";
import { LoadingOutlined, SafetyOutlined } from "@ant-design/icons";
import StripeCheckout from "react-stripe-checkout";
const SingleCourseJumbotron = ({
  course,
  showModal,
  setShowModal,
  preview,
  setPreview,
  loading,
  user,
  handleFreeEnrollment,
  handlePaidEnrollment,
  makePayment,
  enrolled,
  setEnrolled,
}) => {
  const {
    name,
    description,
    instructor,
    updatedAt,
    lessons,
    image,
    price,
    paid,
    Category,
  } = course;

  return (
    <div className="jumbotron bg-primary square ">
      <div className="row ">
        <div className=" col-md-8 ml-2">
          <h1 className="text-light font-weight-bold ">{name}</h1>
          <p className="lead">
            {description && description.substring(0, 100)}...
          </p>

          <Badge
            count={Category}
            style={{ backgroundColor: "#34b1eb", fontSize: "16px" }}
            className="pb-4 mr-2"
          />
          <p>Created By {instructor.name}</p>
          <p>Last Updated {new Date(updatedAt).toLocaleDateString()}</p>
          <h4 className="text-light">
            {paid
              ? currencyFormatter({
                  amount: price,
                  currency: "inr",
                })
              : "FREE"}
          </h4>
        </div>
        <div className="col-md-4">
          {lessons[0].video && lessons[0].video.Location ? (
            <div
              className="mt-3"
              onClick={() => {
                setPreview(lessons[0].video.Location);
                setShowModal(!showModal);
              }}
            >
              <ReactPlayer
                className="react-player-div"
                url={lessons[0].video.Location}
                light={image.Location}
                width="100%"
                height="225px"
              />
            </div>
          ) : (
            <>
              <img src={image.Location} alt={name} className="img img-fluid" />
            </>
          )}

          {loading ? (
            <div className="d-flex justify-content-center">
              <LoadingOutlined className="h1 text-danger" />
            </div>
          ) : (
            <Button
              id="rzp-button1"
              className="mb-3 mt-4"
              block
              shape="square"
              icon={<SafetyOutlined />}
              size="large"
              disabled={loading}
              // stripecheckout
              onClick={paid ? handlePaidEnrollment : handleFreeEnrollment}
            >
              {user
                ? enrolled.status
                  ? "Go to Course"
                  : "Enroll"
                : "Login to enroll"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SingleCourseJumbotron;
