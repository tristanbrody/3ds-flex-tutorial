import Button from "./UI/Button";

const UserConfigurationForm = ({ handleConfigSubmit }) => {
  return (
    <form onSubmit={handleConfigSubmit}>
      <label htmlFor="card-number-select">Scenario</label>
      <select name="cards" id="card-number-select">
        <option value="4000000000001091">
          Successful step-up authentication
        </option>
        <option value="4000000000001109">Failed step-up authentication</option>
        <option value="4000000000001000">
          Successful frictionless authentication
        </option>
        <option value="4000000000001034">Attempts non-participating</option>
        <option value="4000000000001075">Timeout</option>
      </select>
      <Button buttonText="Start" />
    </form>
  );
};

export default UserConfigurationForm;
