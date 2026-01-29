type HeaderProps = {
  courseName: string;
};

interface CoursePartBase {
  name: string;
  exerciseCount: number;
}

interface CoursePartBasic extends CoursePartBase {
  description: string;
  kind: "basic";
}

interface CoursePartGroup extends CoursePartBase {
  groupProjectCount: number;
  kind: "group";
}

interface CoursePartBackground extends CoursePartBase {
  description: string;
  backgroundMaterial: string;
  kind: "background";
}

interface CoursePartSpecial extends CoursePartBase {
  description: string;
  requirements: string[];
  kind: "special";
}

const descriptionStyle = {
  fontStyle: "italic",
};

const basicStyle = {
  marginTop: 0,
};

const boldStyle = {
  fontWeight: "bold",
};

type CoursePart =
  | CoursePartBasic
  | CoursePartGroup
  | CoursePartBackground
  | CoursePartSpecial;

const Header = (props: HeaderProps) => <h1>{props.courseName}</h1>;

const Content = ({ coursePart }: { coursePart: CoursePart[] }) => {
  const splitBasedOnKind = (course: CoursePart) => {
    switch (course.kind) {
      case "basic":
        return (
          <>
            <p style={{ ...basicStyle, ...descriptionStyle }}>
              {course.description}
            </p>
          </>
        );
      case "group":
        return (
          <>
            <p style={basicStyle}>
              project exercises {course.groupProjectCount}
            </p>
          </>
        );
      case "background":
        return (
          <>
            <p style={{ ...basicStyle, ...descriptionStyle, marginBottom: 0 }}>
              {course.description}
            </p>
            <p style={basicStyle}>submit to {course.backgroundMaterial}</p>
          </>
        );
      case "special":
        return (
          <>
            <p style={{ ...basicStyle, ...descriptionStyle, marginBottom: 0 }}>
              {course.description}
            </p>
            <p style={basicStyle}>
              required skills: {course.requirements.join(", ")}
            </p>
          </>
        );
      default:
        return <></>;
    }
  };

  return (
    <div>
      {coursePart.map((course: CoursePart) => {
        return (
          <div>
            <p style={{ ...boldStyle, marginBottom: 0 }}>
              {course.name} {course.exerciseCount}
            </p>
            {splitBasedOnKind(course)}
          </div>
        );
      })}
    </div>
  );
};

const Total = ({ total }: { total: number }) => (
  <div>
    {" "}
    <p>Number of exercises {total}</p>
  </div>
);

const App = () => {
  const courseName = "Half Stack application development";
  const courseParts: CoursePart[] = [
    {
      name: "Fundamentals",
      exerciseCount: 10,
      description: "This is an awesome course part",
      kind: "basic",
    },
    {
      name: "Using props to pass data",
      exerciseCount: 7,
      groupProjectCount: 3,
      kind: "group",
    },
    {
      name: "Basics of type Narrowing",
      exerciseCount: 7,
      description: "How to go from unknown to string",
      kind: "basic",
    },
    {
      name: "Deeper type usage",
      exerciseCount: 14,
      description: "Confusing description",
      backgroundMaterial:
        "https://type-level-typescript.com/template-literal-types",
      kind: "background",
    },
    {
      name: "TypeScript in frontend",
      exerciseCount: 10,
      description: "a hard part",
      kind: "basic",
    },
    {
      name: "Backend development",
      exerciseCount: 21,
      description: "Typing the backend",
      requirements: ["nodejs", "jest"],
      kind: "special",
    },
  ];

  const totalExercises = courseParts.reduce(
    (sum, part) => sum + part.exerciseCount,
    0,
  );

  return (
    <div>
      <Header courseName={courseName} />
      <Content coursePart={courseParts} />
      <Total total={totalExercises}></Total>
    </div>
  );
};

export default App;
