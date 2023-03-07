import { useState, useEffect } from "react";
import InstructorRoute from "../../../../components/routes/InstructorRoute";
import axios from "axios";
import CourseCreateForm from "../../../../components/forms/CourseCreateForm";
import Resizer from "react-image-file-resizer";
import { toast } from "react-toastify";
import { Avatar, List, Modal } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import UpdateLessonForm from "../../../../components/forms/UpdateLessonForm";
const CourseEdit = () => {
  //state
  const [values, setValues] = useState({
    name: "",
    description: "",
    price: "100",
    uploading: false,
    paid: true,
    Category: "",
    loading: false,
    lessons: [],
  });
  const [image, setImage] = useState({});
  const [preview, setPreview] = useState("");
  const [uploadButtonText, setUploadButtonText] = useState("Upload Image");

  // state for lessons update

  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState({});
  const [uploadVideoButtonText, setuploadVideoButtonText] =
    useState("Upload Video");

  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  //router
  const router = useRouter();
  const { slug } = router.query;
  useEffect(() => {
    loadCourse();
  }, [slug]);

  const loadCourse = async () => {
    console.log("in load course");
    const { data } = await axios.get(`/api/course/${slug}`);
    console.log("data is your", data);
    if (data) setValues(data);

    if (data && data.image) {
      setImage(data.image);
    }
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    let file = e.target.files[0];

    setPreview(window.URL.createObjectURL(file));
    setUploadButtonText(file.name);
    setValues({ ...values, loading: true });

    //resize
    Resizer.imageFileResizer(file, 720, 500, "JPEG", 100, 0, async (uri) => {
      try {
        console.log("image rezie");
        let data = await axios.post("/api/course/upload-image", {
          image: uri,
        });
        console.log("Image Uploaded", data);

        //set image in the state
        setImage(data);
        setValues({ ...values, loading: false });
      } catch (err) {
        console.log("ithe aala");
        console.log(err);
        setValues({ ...values, loading: false });
        toast.error("Image upload failed, later");
      }
    });
  };

  const handleImageRemove = async () => {
    console.log("REMOVE IMAGE");
    try {
      setValues({ ...values, loading: true });
      const res = await axios.post("/api/course/remove-image", { image });
      console.log(res);
      setImage({});
      setPreview();
      setUploadButtonText("Upload Image");
      setValues({ ...values, loading: false });
    } catch (err) {
      setValues({ ...values, loading: false });
      console.log(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log("in handle submit");

      const { data } = await axios.put(`/api/course/${slug}`, {
        ...values,
        image,
      });
      console.log(data);
      console.log(image);
      console.log("below handle submit");
      toast.success("Course Updated");
      console.log("ka route hot nhiy");
      //   router.push("/instructor");
    } catch (err) {
      // toast.error("hihhdhfibfn");
      toast.error(err.response.data);
    }
  };

  const handleDrag = (e, index) => {
    console.log("On drag ==>", index);
    e.dataTransfer.setData("itemIndex", index);
  };

  const handleDrop = async (e, index) => {
    console.log("On drop ==>", index);
    const movingItemIndex = e.dataTransfer.getData("itemIndex");
    const targetItemIndex = index;
    let allLessons = values.lessons;
    let movingItem = allLessons[movingItemIndex]; //dragged item to reorder
    allLessons.splice(movingItemIndex, 1); // remove 1 item from the given index
    allLessons.splice(targetItemIndex, 0, movingItem); // push item after target item index

    setValues({ ...values, lessons: [...allLessons] });
    // save new order in db

    const { data } = await axios.put(`/api/course/${slug}`, {
      ...values,
      image,
    });
    console.log("lessobns rearrange response", data);

    console.log("all fucking values are ", values);
    toast.success("Lessons rearranged");
  };

  const handleDelete = async (index) => {
    console.log("delted");
    const answer = window.confirm("Are you sure want to delete it");

    if (!answer) return;
    console.log("all values", values);
    let allLessons = values.lessons;
    console.log("all lessons", allLessons);
    const removed = allLessons.splice(index, 1);
    console.log("Item", removed[0].slug);
    console.log("removed[0].id", removed[0]._id);
    console.log("removed item data", removed);

    setValues({ ...values, lessons: allLessons });
    // send re quest to server
    console.log("above data");
    const { data } = await axios.put(`/api/course/${slug}/${removed[0]._id}`);

    console.log("lesson deleted===>", data);
  };

  //lesson update function

  const handleVideo = async (e) => {
    console.log("in Handle video");
    if (current.video && current.video.Location) {
      const res = await axios.post(
        `/api/course/video-remove/${values.instructor._id}`,
        current.video
      );
      console.log("remove video ===>", res);
    }

    const file = e.target.files[0];
    setuploadVideoButtonText(file.name);
    setUploading(true);

    const videoData = new FormData();
    videoData.append("video", file);
    videoData.append("courseId", values._id);

    //save progress bar and send video as form data to baCKEND
    const { data } = await axios.post(
      `/api/course/video-upload/${values.instructor._id}`,
      videoData,
      {
        onUploadProgress: (e) =>
          setProgress(Math.round((100 * e.loaded) / e.total)),
      }
    );
    console.log(data);
    setCurrent({ ...current, video: data });
    setUploading(false);
  };

  const handleUpdateLesson = async (e) => {
    console.log("in handle Update Lesson");
    e.preventDefault();
    console.log("currrebnttttt", current);
    const { data } = await axios.put(
      `/api/course/lesson/${slug}/${current._id}`,
      current
    );
    console.log("dataaa", current);
    setuploadVideoButtonText("Upload video");
    setVisible(false);

    if (data.ok) {
      let arr = values.lessons;
      const index = arr.findIndex((el) => el._id === current._id);
      arr[index] = current;
      setValues({ ...values, lessons: arr });
      toast.success("Lesson Updated");
    }
  };

  return (
    <InstructorRoute>
      <h1 className="jumbotron text-center square">Update Course</h1>
      {/* {JSON.stringify(values)} */}

      <div className="pt-3 pb-3">
        <CourseCreateForm
          handleSubmit={handleSubmit}
          handleImage={handleImage}
          handleChange={handleChange}
          values={values}
          setValues={setValues}
          preview={preview}
          uploadButtonText={uploadButtonText}
          handleImageRemove={handleImageRemove}
          editPage={true}
        />
      </div>
      <hr />
      <div className="row pb-5">
        <div className="col lesson-list">
          <h4 className="text-center">
            {values && values.lessons && values.lessons.length} Lessons
          </h4>

          <List
            onDragOver={(e) => e.preventDefault()}
            itemLayout="horizontal"
            dataSource={values && values.lessons}
            renderItem={(item, index) => (
              <List.Item
                draggable
                onDragStart={(e) => handleDrag(e, index)}
                onDrop={(e) => handleDrop(e, index)}
              >
                <List.Item.Meta
                  onClick={() => {
                    setVisible(true);
                    setCurrent(item);
                  }}
                  avatar={<Avatar>{index + 1}</Avatar>}
                  title={item.title}
                ></List.Item.Meta>

                <DeleteOutlined
                  onClick={() => handleDelete(index)}
                  className="text-danger float-right"
                />
              </List.Item>
            )}
          ></List>
        </div>
      </div>
      <Modal
        title="Update lesson"
        centered
        visible={visible}
        onCancel={() => setVisible(false)}
        footer={null}
      >
        <UpdateLessonForm
          current={current}
          setCurrent={setCurrent}
          handleVideo={handleVideo}
          handleUpdateLesson={handleUpdateLesson}
          progress={progress}
          uploadVideoButtonText={uploadVideoButtonText}
          uploading={uploading}
        />
      </Modal>
    </InstructorRoute>
  );
};

export default CourseEdit;
