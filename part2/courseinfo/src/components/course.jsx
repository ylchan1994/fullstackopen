const Header = (props) => <h2>{props.course}</h2>

const Content = (props) => (
  <div>
    {props.parts.map(part => <Part part={part} key={part.id}></Part>)}
  </div>
)

const Part = (props) => (
  <p>
    {props.part.name} {props.part.exercises}
  </p>
)

const Total = (props) => <h4>Number of exercises {props.total}</h4>

const Course = (props) => {
  const courses = props.courses
  return (
    <div>
      <h1>Web development curriculum</h1>
      {courses.map(course =>
        <div key={course.id}>
          <Header course={course.name} />
          <Content parts={course.parts} />
          <Total
            total={course.parts.reduce((accumulator, part) => accumulator + part.exercises, 0)}
          />
        </div>
      )
      }
    </div>
  )
}

export default Course