import { Button, Progress, Switch } from "antd";
import { CloseCircleFilled, CloseCircleOutlined } from "@ant-design/icons";

import ReactPlayer from "react-player";
const UpdateLessonForm = ({
  current,
  setCurrent,
  handleUpdateLesson,
  uploading,
  uploadVideoButtonText,
  handleVideo,
  progress,
}) => {
  return (
    <div className="container pt-3">
      <form onSubmit={handleUpdateLesson}>
        <textarea
          className="form-control mt-3"
          cols="1"
          rows="1"
          onChange={(e) => setCurrent({ ...current, title: e.target.value })}
          value={current.title}
        ></textarea>
        <textarea
          className="form-control mt-3"
          cols="7"
          rows="7"
          onChange={(e) => setCurrent({ ...current, content: e.target.value })}
          value={current.content}
        ></textarea>
        <div>
          <div className="d-grid gap-2">
            {!uploading && current.video && current.video.Location && (
              <div className="pt-2 d-flex justify-content-center">
                <ReactPlayer
                  url={current.video.Location}
                  width="410px"
                  height="240px"
                  controls
                />
              </div>
            )}
            <label className="btn btn-dark btn-dark text-left mt-3">
              {uploadVideoButtonText}
              <input
                onChange={handleVideo}
                type="file"
                accept="video/*"
                hidden
              />
            </label>
          </div>
        </div>

        {progress > 0 && (
          <Progress
            className="d-flex justify-content-center pt-2 "
            percent={progress}
            steps={9}
          />
        )}
        {current.free_preview === undefined ? "ya" : "na"}
        <div className="d-flex justify-content-between pt-2">
          <span className="pt-3 font-weight-bold ">
            Turn on Switch to give FREE Preview of this lesson.
          </span>
          <Switch
            className="float-right mt-2"
            disabled={uploading}
            checked={current.free_preview}
            name="free_preview"
            onChange={(v) => setCurrent({ ...current, free_preview: v })}
          />
        </div>
        <div className="d-grid gap-2">
          <Button
            onClick={handleUpdateLesson}
            className="col mt-3"
            size="large"
            type="primary"
            loading={uploading}
            shape="round"
          >
            Save
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UpdateLessonForm;
