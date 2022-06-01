import React from 'react';
import PropTypes from 'prop-types';

class Settings extends React.Component {
  constructor() {
    super();
    this.state = {
      categories: [],
      difficulties: ['Any Difficulty', 'Easy', 'Medium', 'Hard'],
      types: [],
      categoryValue: '',
      difficultyValue: '',
      typeValue: '',
    };
  }

  async componentDidMount() {
    const response = await fetch('https://opentdb.com/api_category.php');
    const data = await response.json();
    this.setState({
      categories: [{ id: '', name: 'Any Category' }, ...data.trivia_categories],
      types: [
        { id: '', name: 'Any Type' },
        { id: 'multiple', name: 'Multiple Choice' },
        { id: 'boolean', name: 'True / False' },
      ],
    });
  }

  handleChange = ({ target }) => {
    const { name, value } = target;
    this.setState({ [name]: value });
  }

  saveChanges = () => {
    const { categoryValue, difficultyValue, typeValue } = this.state;
    localStorage.setItem('TriviaMOD', `https://opentdb.com/api.php?amount=5&
      category=${categoryValue}&difficulty=${difficultyValue}&type=${typeValue}`);
  }

  clearChanges = () => {
    localStorage.removeItem('TriviaMOD');
  }

  backHome = () => {
    const { history } = this.props;
    history.push('/');
  }

  render() {
    const {
      categories,
      difficulties,
      types,
      categoryValue,
      difficultyValue,
      typeValue } = this.state;
    return (
      <div data-testid="settings-title">
        {categories.length > 0 && (
          <>
            <h2>Choose how you want to play!</h2>
            <label htmlFor="categories">
              Category
              <select
                id="categories"
                name="categoryValue"
                onChange={ this.handleChange }
                value={ categoryValue }
              >
                {categories.map((category) => (
                  <option
                    key={ category.id }
                    value={ category.id }
                  >
                    {category.name}
                  </option>
                ))}
              </select>
            </label>

            <label htmlFor="difficulties">
              Difficulty
              <select
                id="difficulties"
                name="difficultyValue"
                onChange={ this.handleChange }
                value={ difficultyValue }
              >
                {difficulties.map((difficulty, index) => (
                  <option
                    key={ difficulty }
                    value={ index === 0 ? '' : difficulty.toLocaleLowerCase() }
                  >
                    { difficulty }
                  </option>
                ))}
              </select>
            </label>

            <label htmlFor="types">
              Type
              <select
                id="types"
                name="typeValue"
                onChange={ this.handleChange }
                value={ typeValue }
              >
                {types.map((type) => (
                  <option
                    key={ type.name }
                    value={ type.id }
                  >
                    { type.name }
                  </option>
                ))}
              </select>
            </label>

            <button type="button" onClick={ this.saveChanges }>Save Changes</button>
            <button type="button" onClick={ this.clearChanges }>Clear Changes</button>
            <button type="button" onClick={ this.backHome }>Home</button>
          </>
        )}
      </div>
    );
  }
}

Settings.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
};

export default Settings;
