import { useState } from 'react'

const Button = ({ name, onClick }) => {
  return (
    <>
      <button type='submit' onClick={onClick}>{name}</button>
    </>
  )
}

const StatisticLine = ({text, value}) => {
  return (
    <>
      <tr>
        <td>{text}</td>
        <td>{value}</td>
      </tr>
    </>
  )
}

const Statistic = ({ good, bad, neutral }) => {
  const all = good + bad + neutral
  const score = good - bad
  const average = score/all
  const percentage = good / all * 100 + '%'
  return (
    <div>
      <h1>statistics</h1>
      {all === 0 ? (
          <><p>No feedback given</p></>
        ) : (
          <>
            <table>
              <tbody>
                <StatisticLine text='good' value={good}></StatisticLine>
                <StatisticLine text='neutral' value={neutral}></StatisticLine>
                <StatisticLine text='bad' value={bad}></StatisticLine>
                <StatisticLine text='all' value={all}></StatisticLine>
                <StatisticLine text='average' value={average}></StatisticLine>
                <StatisticLine text='positive' value={percentage}></StatisticLine>
              </tbody>
            </table>
          </>
        )}

    </div>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const all = good + bad + neutral

  const handleClick = (input) => {
    switch (input) {
      case 'good':
        setGood(good + 1)
        break
      case 'neutral':
        setNeutral(neutral + 1)
        break
      case 'bad':
        setBad(bad + 1)
        break
    }
    return
  }

  return (
    <div>
      <h1>give feedback</h1>
      <Button name='good' onClick={() => handleClick('good')}></Button>
      <Button name='neutral' onClick={() => handleClick('neutral')}></Button>
      <Button name='bad' onClick={() => handleClick('bad')}></Button>
      <Statistic good={good} bad={bad} neutral={neutral}></Statistic>
    </div>
  )
}

export default App