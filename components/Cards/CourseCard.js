import { Card, Badge } from "antd";
import Link from "next/link";
import { currencyFormatter } from "../../utils/helpers";

const { Meta } = Card;

const CourseCard = ({ course }) => {
  const { name, instructor, price, image, slug, paid, Category } = course;
  console.log(course);
  return (
    <Link href={`/course/${slug}`}>
      <Card
        className="mb-4"
        cover={
          <img
            src={image.Location}
            alt={name}
            style={{ height: "200px", objectFit: "cover" }}
            className="p-1"
          />
        }
      >
        <h2 className="fonr-weight-bold">{course.name}</h2>
        <p>by {course.instructor.name}</p>
        <Badge
          count={Category}
          style={{ backgroundColor: "#03a9f4" }}
          className="pb-2 mr-2"
        />
        <h4 className="pt-2">
          {paid
            ? currencyFormatter({
                amount: price,
                currency: "inr",
              })
            : "Free"}
        </h4>
      </Card>
    </Link>
  );
};
export default CourseCard;
