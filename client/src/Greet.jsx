function Greet({ username, handleChanges }) {
  console.count("Welcome");
  return (
    <div className="greet">
      <p>Hello {username}👋</p>
      <button onClick={() => handleChanges({ type: "logOut" })}>Log out</button>
    </div>
  );
}
export default Greet;
