import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import InstructorRoute from "../../../../components/routes/InstructorRoute";
import axios from "axios";
import { Avatar, Tooltip, Button, Modal, List } from "antd";
import {
  EditOutlined,
  CheckOutlined,
  UploadOutlined,
  QuestionOutlined,
  CloseOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";
import ReactMarkdown from "react-markdown";
import AddLessonForm from "../../../../components/forms/AddLessonForm";
import { toast } from "react-toastify";

const CourseView = () => {
  const [course, setCourse] = useState({});

  //for lessons
  const [visible, setVisible] = useState(false);

  const [values, setValues] = useState({
    title: "",

    content: "",
    video: {},
  });

  const [uploading, setUploading] = useState(false);
  const [uploadButtonText, setUploadButtonText] = useState("Upload Video");
  const [progress, setProgress] = useState(0);
  const [students, setStudents] = useState(0);
  const router = useRouter();
  const { slug } = router.query;

  useEffect(() => {
    loadCourse();
    console.log(slug);
  }, [slug]);

  useEffect(() => {
    course && studentCount();
  }, [course]);

  const studentCount = async () => {
    const { data } = await axios.post(`/api/instructor/student-count`, {
      courseId: course._id,
    });
    console.log("student count=>", data);
    setStudents(data.length);
  };
  const loadCourse = async () => {
    const { data } = await axios.get(`/api/course/${slug}`);
    setCourse(data);
  };

  //functions for add lesson
  const handleAddLesson = async (e) => {
    e.preventDefault();
    console.log("in handle add lesson", values);
    try {
      const { data } = await axios.post(
        `/api/course/lesson/${slug}/${course.instructor._id}`,
        values
      );
      console.log("in handle add lesson data", data);
      setValues({ ...values, title: "", content: "", video: {} });
      setProgress(0);
      setUploadButtonText("Upload Video");
      setVisible(false);
      setCourse(data);
      toast.success("Lesson Added");
    } catch (err) {
      console.log(err);
      toast.error("Lesson Add Failed ");
    }
  };

  const handleVideo = async (e) => {
    try {
      console.log("in handle video");
      const file = e.target.files[0];
      setUploadButtonText(file.name);
      setUploading(true);

      const videoData = new FormData();
      videoData.append("video", file);
      // save progress bar and send video as formdata to backend

      const { data } = await axios.post(
        `/api/course/video-upload/${course.instructor._id}`,
        videoData,
        {
          onUploadProgress: (e) => {
            setProgress(Math.round((100 * e.loaded) / e.total));
          },
        }
      );
      // Once response is received
      console.log("shubhamuyeda zalay");
      console.log(data);
      setValues({ ...values, video: data });
      setUploading(false);
    } catch (err) {
      console.log(err);
      setUploading(false);
      toast.error("video upload failed");
    }
  };

  const handleVideoRemove = async () => {
    try {
      setUploading(true);
      const { data } = await axios.post(
        `/api/course/video-remove/${course.instructor._id}`,
        values.video
      );
      console.log(data);
      console.log("shubham");
      setValues({ ...values, video: {} });
      setProgress(0);
      setUploading(false);
      setUploadButtonText("Upload another video");
    } catch (err) {
      console.log(err);
      setUploading(false);
      toast.error("Video Remove Failed");
    }
  };

  const handlePublish = async (e, courseId) => {
    console.log("publisged");
    try {
      let answer = window.confirm(
        "Once you publish the course ,it will be live on Learn-My-Way Platform for users to enroll."
      );

      if (!answer) return;
      const { data } = await axios.put(`/api/course/publish/${courseId}`);
      setCourse(data);

      toast.success("Congratulations, Your Course is Published");
    } catch (err) {
      console.log(err);
      toast.error("Course Publish Failed");
    }
  };

  const handleUnpublish = async (e, courseId) => {
    console.log("unpublished");
    try {
      let answer = window.confirm(
        "Once you Unpublish the course ,it will NOT be live on Learn-My-Way Platform."
      );
      if (!answer) return;
      const { data } = await axios.put(`/api/course/unpublish/${courseId}`);
      setCourse(data);
      toast.success("Your Course is Unpublished Now ");
    } catch (err) {
      console.log(err);
      toast.error("your Course is Still Published");
    }
  };

  return (
    <InstructorRoute>
      <div className="container-fluid pt-3">
        {/* <pre>{JSON.stringify(course, null, 4)}</pre> */}
        {course && (
          <div className="container-fluid pt-1">
            <div className="media-pt-2">
              <Avatar
                size={80}
                src={course.image ? course.image.Location : "/course.png"}
              />
              <div className="media-body pl-2">
                <div className="row">
                  <div className="col">
                    <h5 className="mt-2 text-primary">{course.name}</h5>
                    <p style={{ marginTop: "-10px" }}>
                      {course.lessons && course.lessons.length} Lessons
                    </p>
                    <p style={{ marginTop: "-15px", fontSize: "10px" }}>
                      {course.category}
                    </p>
                  </div>
                  <div class="d-flex justify-content-between">
                    <div>
                      <Tooltip title="Edit">
                        <EditOutlined
                          onClick={() =>
                            router.push(`/instructor/course/edit/${slug}`)
                          }
                          className="h5 pointer text-warning mr-4"
                        />
                      </Tooltip>
                    </div>
                    <div className="float-end">
                      <Tooltip title={`${students} Students Enrolled`}>
                        <UserSwitchOutlined
                          onClick={() =>
                            router.push(`/instructor/course/edit/${slug}`)
                          }
                          className="h5 pointer text-info mr-4"
                        />
                      </Tooltip>
                    </div>

                    {course.lessons && course.lessons.length < 5 ? (
                      <Tooltip title="Min 5 lessons required to published">
                        <QuestionOutlined className="h5 pointer text-danger" />
                      </Tooltip>
                    ) : course.published ? (
                      <Tooltip title="Unpublish">
                        <CloseOutlined
                          onClick={(e) => handleUnpublish(e, course._id)}
                          className="h5 pointer text-danger"
                        />
                      </Tooltip>
                    ) : (
                      <Tooltip title="Publish">
                        <CheckOutlined
                          onClick={(e) => handlePublish(e, course._id)}
                          className="h5 pointer text-success"
                        />
                      </Tooltip>
                    )}

                    {/* <div class="ml-auto">
                      <Tooltip title="Publish">
                        <CheckOutlined className="h5 pointer text-danger" />
                      </Tooltip>
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
            <hr />
            <div className="row">
              <div className="col">
                <ReactMarkdown>{course.description}</ReactMarkdown>
              </div>
            </div>
            <div className="row">
              <Button
                onClick={() => setVisible(true)}
                className="col-md-6 offset-md-3 text-center"
                type="primary"
                shape="round"
                icon={<UploadOutlined />}
              >
                Add Lesson
              </Button>
            </div>
            <br></br>
            <Modal
              title="+ Add Lesson"
              centered
              visible={visible}
              onCancel={() => setVisible(false)}
              footer={null}
            >
              <AddLessonForm
                values={values}
                setValues={setValues}
                handleAddLesson={handleAddLesson}
                uploading={uploading}
                uploadButtonText={uploadButtonText}
                handleVideo={handleVideo}
                progress={progress}
                handleVideoRemove={handleVideoRemove}
              />
            </Modal>

            <div className="row pb-5">
              <div className="col lesson-list">
                <h4 className="text-center">
                  {course && course.lessons && course.lessons.length} Lessons
                </h4>

                <List
                  itemLayout="horizontal"
                  dataSource={course && course.lessons}
                  renderItem={(item, index) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={<Avatar>{index + 1}</Avatar>}
                        title={item.title}
                      ></List.Item.Meta>
                    </List.Item>
                  )}
                ></List>
              </div>
            </div>
          </div>
        )}
      </div>
    </InstructorRoute>
  );
};

export default CourseView;
