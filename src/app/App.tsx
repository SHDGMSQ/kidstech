import React, {useCallback} from "react";
import "./Styles.scss";
import {useState, useEffect} from "react";

const tags: string[] = [];
let initCourses: Array<CourseType> = [];

export const App = () => {
  const [courses, setCourses] = useState<CourseType[]>([]);

  useEffect(() => {
    fetch("https://logiclike.com/docs/courses.json")
      .then((res) => {
        if (res.status !== 200) {
          throw new Error("Something went wrong");
        } else {
          return res.json();
        }
      })
      .then((data) => {
        data.forEach((course: CourseType) => {
          tags.push(...course.tags);
        });
        setCourses(data);
        initCourses = data;
      })
      .catch(reason => {
        throw new Error(reason);
      });
  }, []);

  const unicTags = ["Все темы", ...Array.from(new Set(tags))];

  const onClickHandler = useCallback((id: string) => {
    if (id === "Все темы") {
      setCourses(initCourses);
    } else {
      setCourses(initCourses.filter((course) => course.tags.includes(id || "")));
    }
  }, []);

  return (
    <div className="app">
      <Sidebar tags={unicTags} onClickHandler={onClickHandler}/>
      <div className="coursesContainer">
        {courses.map((course) => {
          return (
            <Course
              course={course}
              key={course.id}
            />
          );
        })}
      </div>
    </div>
  );
};

const Sidebar: React.FC<SidebarPropsType> = React.memo(({tags, ...props}) => {
  const [active, setActive] = useState("Все темы");

  const onClickHandler = useCallback((id: string) => {
    setActive(id);
    props.onClickHandler(id);
  }, []);

  return (
    <div className="sidebarContainer">
      {tags.map((tag) => {
        return (
          <Tag
            key={tag}
            tag={tag}
            onClickHandler={onClickHandler}
            active={tag === active}
          />
        );
      })}
    </div>
  );
});

const Tag: React.FC<TagPropsType> = React.memo(({tag, active, ...props}) => {

  const onClickHandler = useCallback(() => {
    props.onClickHandler(tag);
  }, []);

  return (
    <button
      className={active ? "active" : ""}
      key={tag}
      onClick={onClickHandler}
    >{tag}
    </button>
  );
});

const Course: React.FC<CoursePropsType> = React.memo(({course}) => {

  return (
    <div className="course">
      <img
        alt="some image"
        className="image"
        src={course.image}
        style={{backgroundColor: course.bgColor}}
      />
      <div className="name">{course.name}</div>
    </div>
  );
});

//types
type CourseType = {
  name: string,
  id: string,
  image: string
  bgColor: string,
  tags: Array<string>
}

type CoursePropsType = {
  course: CourseType
  key: string
}

type SidebarPropsType = {
  tags: Array<string>
  onClickHandler: (id: string) => void
}

type TagPropsType = {
  tag: string
  active: boolean
  onClickHandler: (id: string) => void
}


