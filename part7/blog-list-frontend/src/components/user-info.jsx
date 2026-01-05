const UserInfo = ({ user, onLogout }) => {
  return (
    <div>
      {`${user.name} logged in`}
      <button type='submit' onClick={onLogout}>logout</button>
    </div>
  )
}

export default UserInfo