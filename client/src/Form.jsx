import HandleFiles from "./HandleFiles";
function Form({ token }) {
  console.count("Form");
  return (
    <>
      <HandleFiles token={token} />
    </>
  );
}

export default Form;
