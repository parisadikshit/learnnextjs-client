import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import PreviewModal from "../../components/Modal/PreviewModal";

import SingleCourseJumbotron from "../../components/Cards/SingleCourseJumbotron";
import SingleCourseLessons from "../../components/Cards/SingleCourseLessons";
import { Context } from "../../context";
import { toast } from "react-toastify";
import { loadStripe } from "@stripe/stripe-js";

const SingleCourse = ({ course }) => {
  const [showModal, setShowModal] = useState(false);
  const [preview, setPreview] = useState("");
  const router = useRouter();
  const { slug } = router.query;
  const [loading, setLoading] = useState(false);
  const [enrolled, setEnrolled] = useState({});
  //context
  const {
    state: { user },
  } = useContext(Context);

  useEffect(() => {
    if (user && course) checkEnrollment();
  }, [user, course]);

  const checkEnrollment = async () => {
    const { data } = await axios.get(`/api/check-enrollment/${course._id}`);
    console.log("check enrollment", data);
    setEnrolled(data);
  };

  const makePayment = (token) => {
    console.log("in make payment");
    const body = {
      token,
    };
    const headers = {
      "Content-Type": "application/json",
    };
    // /paid-enrollment/:courseId
    return fetch(`/api/paid-enrollment/${course._id}`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    })
      .then((response) => {
        console.log("response", response);
        const { status } = response;
        console.log("status", status);
      })
      .catch((err) => console.log(err));
  };
  const handlePaidEnrollment = async (e) => {
    console.log("Handle paid enrollment");

    try {
      setLoading(true);
      console.log("shubham");
      //check user is logged in or not
      if (!user) router.push("/login");
      // check if already enrolled
      if (enrolled.status)
        return router.push(`/user/course/${enrolled.course.slug}`);

      const { data } = await axios.post(`/api/paid-enrollment/${course._id}`);
      console.log("data", data);
      console.log(
        " process.env.NEXT_PUBLIC_STRIPE_KEY",
        process.env.NEXT_PUBLIC_STRIPE_KEY
      );
      console.log("shubham");

      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);
      // const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);
      stripe.redirectToCheckout({ sessionId: data });
    } catch (err) {
      toast.error("Enrollment failed,TRY again");
      console.log(err);
      setLoading(false);
    }
  };

  const handleFreeEnrollment = async (e) => {
    console.log("Handle free enrollment");
    e.preventDefault();
    try {
      //check user is logged in or not
      if (!user) router.push("/login");
      // check if already enrolled
      if (enrolled.status)
        return router.push(`/user/course/${enrolled.course.slug}`);
      setLoading(true);
      const { data } = await axios.post(`/api/free-enrollment/${course._id}`);
      toast.success(data.message);
      setLoading(false);
      router.push(`/user/course/${data.course.slug}`);
    } catch (err) {
      toast.error("Enrollment failed. Try again");
      console.log(err);
      setLoading(false);
    }
  };

  return (
    <>
      <SingleCourseJumbotron
        course={course}
        showModal={showModal}
        setShowModal={setShowModal}
        preview={preview}
        setPreview={setPreview}
        user={user}
        loading={loading}
        handlePaidEnrollment={handlePaidEnrollment}
        handleFreeEnrollment={handleFreeEnrollment}
        enrolled={enrolled}
        setEnrolled={setEnrolled}
        makePayment={makePayment}
      />

      <PreviewModal
        showModal={showModal}
        setShowModal={setShowModal}
        preview={preview}
      />
      {course.lessons && (
        <SingleCourseLessons
          lessons={course.lessons}
          setPreview={setPreview}
          showModal={showModal}
          setShowModal={setShowModal}
        />
      )}
    </>
  );
};

export async function getServerSideProps({ query }) {
  const { data } = await axios.get(` ${process.env.API}/course/${query.slug}`);

  return {
    props: {
      course: data,
    },
  };
}

export default SingleCourse;
