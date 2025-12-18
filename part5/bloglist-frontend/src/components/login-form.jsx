const LoginForm = ({ user, password, onUsernameChange, onPasswordChange, onSubmit }) => {
  return (
    <form onSubmit={onSubmit}>
      <div>
        <label>
        Username:
          <input
            type='text'
            value={user}
            onChange={onUsernameChange}
          ></input>
        </label>
      </div>
      <div>
        <label>
        Password:
          <input
            type='text'
            value={password}
            onChange={onPasswordChange}
          ></input>
        </label>
      </div>
      <button type='submit'>Login</button>
    </form>
  )}

export default LoginForm