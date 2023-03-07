import { useRouter } from "next/router";
import { useState, useEffect, createElement } from "react";
import axios from "axios";
import StudentRoute from "../../../components/routes/StudentRoute";
import { Container } from "react-bootstrap";

import { Button, Menu, Avatar } from "antd";
import ReactPlayer from "react-player";
import ReactMarkdown from "react-markdown";
import {
  PlayCircleOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  CheckCircleFilled,
  MinusCircleFilled,
} from "@ant-design/icons";

const { Item } = Menu;
const SingleCourse = () => {
  const [clicked, setClicked] = useState(-1);
  const [collapsed, SetCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [course, setCourse] = useState({ lessons: [] });
  const [completedLessons, setCompletedLessons] = useState([]);

  const [updateState, setUpdateState] = useState(false);
  //router
  const router = useRouter();
  const { slug } = router.query;

  useEffect(() => {
    if (slug) loadCourse();
  }, [slug]);

  useEffect(() => {
    if (course) loadCompletedLessons();
  }, [course]);

  const loadCourse = async () => {
    const { data } = await axios.get(`/api/user/course/${slug}`);
    setCourse(data);
  };

  const loadCompletedLessons = async () => {
    const { data } = await axios.post(`/api/list-completed`, {
      courseId: course._id,
    });

    console.log("completed lessons data =>", data);
    setCompletedLessons[data];
  };

  const markCompleted = async () => {
    console.log("in mark complete");
    const { data } = await axios.post(`/api/mark-completed`, {
      courseId: course._id,
      lessonId: course.lessons[clicked]._id,
    });
    console.log(data);
    setCompletedLessons([...completedLessons, course.lessons[clicked]._id]);
  };
  const markInCompleted = async () => {
    console.log("in mark incomlop");
    console.log(
      "course is and lesson id",
      course._id,
      course.lessons[clicked]._id
    );
    try {
      const { data } = await axios.post(`/api/mark-incomplete`, {
        courseId: course._id,
        lessonId: course.lessons[clicked]._id,
      });
      console.log("data =>", data);
      const all = completedLessons;
      console.log("all", all);
      const index = all.indexOf(course.lessons[clicked]._id);
      if (index > -1) {
        all.splice(index, 1);
        console.log("all without removed", all);
        setCompletedLessons(all);
        setUpdateState(!updateState);
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <StudentRoute>
      <div className="row">
        <div style={{ maxWidth: 250 }}>
          <Button
            style={{ textAlign: "center" }}
            class="btn btn-primary mt-1 btn-block mb-2"
            onClick={() => SetCollapsed(!collapsed)}
            className="text-primary mt-1 btn-block mb-2"
          >
            {createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined)}{" "}
            {!collapsed && "Lessons"}
          </Button>
          {/* <p className="justify-content-center">Lessons</p> */}
          <Menu
            defaultSelectedKeys={[clicked]}
            inlineCollapsed={collapsed}
            // style={{ height: "91vh", overflow: "auto" }}
          >
            {course.lessons.map((lesson, index) => (
              <Item
                onClick={() => setClicked(index)}
                key={index}
                icon={<Avatar>{index + 1}</Avatar>}
              >
                {lesson.title.substring(0, 20)}{" "}
                <div className="float-end">
                  {completedLessons.includes(lesson._id) ? (
                    <CheckCircleFilled
                      className="float-end text-primary"
                      style={{ marginTop: "13px" }}
                    />
                  ) : (
                    <MinusCircleFilled
                      className="float-end text-danger "
                      style={{ marginTop: "13px" }}
                    />
                  )}
                </div>
              </Item>
            ))}
          </Menu>
        </div>
        <div className="col">
          {clicked !== -1 ? (
            <>
              <div className="col alert alert-primary square">
                <b>{course.lessons[clicked].title.substring(0, 30)}</b>
                {completedLessons.includes(course.lessons[clicked]._id) ? (
                  <span className="float-end pointer" onClick={markInCompleted}>
                    Mark as Incomplete
                  </span>
                ) : (
                  <span className="float-end pointer" onClick={markCompleted}>
                    Mark as Complete
                  </span>
                )}
              </div>
              {course.lessons[clicked].video &&
                course.lessons[clicked].video.Location && (
                  <>
                    <div className="wrapper">
                      <ReactPlayer
                        className="player"
                        url={course.lessons[clicked].video.Location}
                        width="100%"
                        height="100%"
                        controls
                        onEnded={() => markCompleted()}
                      />
                    </div>
                    {/* {JSON.stringify(course.lessons[clicked].content, null, 4)} */}
                    {/* <p>{course.lessons[clicked].content}</p> */}
                  </>
                )}
              <p>Content:{course.lessons[clicked].content}</p>
              <ReactMarkdown
                source={course.lessons[clicked].content}
                className="single-course"
              />
            </>
          ) : (
            <div className="d-flex justify-content-center p-5">
              <div className="text-center p-5">
                <PlayCircleOutlined className="text-primary display-1 p-5" />
                <p className="lead">Click on the lesson to start learning</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </StudentRoute>
  );
};

export default SingleCourse;
