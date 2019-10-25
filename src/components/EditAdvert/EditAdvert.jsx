import React from "react";
import axios from "axios";

import * as API from "../../services/APIService";
import Tags from "../Tags/Tags";
import Advert from "../Advert/Advert";

import './EditAdvert.css';

// Este componente se encarga de manejar la creación y la edición de un anuncio
export default class EditAdvert extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.resetAdvertCreationState();
  }

  // Cancela cualquier peticion que no se haya podido completar debido a que el componente se haya desmontado
  source = axios.CancelToken.source();

  // Estaría bien cambiar este método por 'static getDerivedStateFromProps(props, state)'
  UNSAFE_componentWillReceiveProps() {
    this.setState(this.resetAdvertCreationState());
  }

  componentDidMount() {
    this.fillFieldsIfEditingAdvert();
  }

  componentWillUnmount() {
    this.source.cancel('EditAdvert component');
  }

  resetAdvertCreationState = () => {
    return {
      advert: {
        id: "",
        name: "",
        price: "",
        description: "",
        photo: "",
        tags: [],
        type: ""
      },
      editingAdvert: false
    };
  };

  fillFieldsIfEditingAdvert = async () => {
    const { pathname } = this.props.location;

    const splittedPathname = pathname.split("/");
    // Compruebo si estoy en el pathname de actualizar
    if (splittedPathname[1].includes("edit-advert")) {
      // Compruebo si el id que me pasan es válido.
      const result = await API.getAdvertById(splittedPathname[2], this.source);
      if (result.success) {
        const advert = result.result;
        this.setState({ advert, editingAdvert: true });
      }
    }
  };

  onSubmit = async evt => {
    evt && evt.preventDefault();

    const { advert, editingAdvert } = this.state;
    const { success, result } = editingAdvert ? await API.updateAdvert(advert, this.source) : await API.createAdvert(advert, this.source);

    if ( success ) {
      this.props.history.push(`/advert/${result.id}?edit=true`);
      return;
    }

    // TODO: Show error toast    
  };

  onInputChange = evt => {
    const { name, value } = evt.target;
    this.updateState(name, value);
  };

  onRadioChange = evt => {
    const { id } = evt.target;
    this.updateState("type", id);
  };

  onSelectChange = selectedTags => {
    this.updateState("tags", selectedTags);
  };

  updateState = (name, value) => {
    this.setState(({ advert }) => ({
      advert: {
        ...advert,
        [name]: value
      }
    }));
  };

  render() {
    const { advert } = this.state;
    const { name, price, description, photo, tags, type } = advert;
    const updateOrCreateAdvert = this.state.editingAdvert ? 'Update advert' : 'Create advert';
    const photoFieldType = this.state.editingAdvert ? 'text' : 'url';
    return (
      <div className="">
        <h1 className="text-center mt-4">{updateOrCreateAdvert}</h1>
        <div className="create-edit-container mt-4">
          <form onSubmit={this.onSubmit}>
            <div className="form-group">
              <label className="input-label" htmlFor="name">Name</label>
              <input
                type="text"
                name="name"
                id="name"
                className="form-control"
                value={name}
                placeholder="Name"
                onChange={this.onInputChange}
              />
            </div>
            <div className="form-group">
            <label className="input-label" htmlFor="description">Description</label>
              <textarea
                name="description"
                id="description"
                className="form-control"
                value={description}
                placeholder="Write a description of the product"
                onChange={this.onInputChange}
              />
            </div>
            <div className="form-group">
              <label className="input-label" htmlFor="price">Price</label>
              <input
                type="number"
                name="price"
                id="price"
                className="form-control"
                value={price}
                placeholder="Price"
                onChange={this.onInputChange}
              />
            </div>
            <div className="form-group">
              <label className="input-label" htmlFor="tags-select">Tags</label>
              <Tags multiple={true} selectedTags={tags} onTagSelected={this.onSelectChange} />
            </div>
            <div className="form-group">
              <div>
                <span className="input-label">Type</span>
              </div>
              <div className="form-check form-check-inline">
                <input
                  type="radio"
                  name="type"
                  id="buy"
                  className="form-check-input"
                  value={type}
                  checked={type === 'buy'}
                  onChange={this.onRadioChange}
                />
                <label className="form-check-label" htmlFor="buy">Buy</label>
              </div>
              <div className="form-check form-check-inline">
                <input
                  type="radio"
                  name="type"
                  id="sell"
                  className="form-check-input"
                  value={type}
                  checked={type === 'sell'}
                  onChange={this.onRadioChange}
                />
                <label className="form-check-label" htmlFor="sell">Sell</label>
              </div>
            </div>
            <div className="form-group">
            <label className="input-label" htmlFor="photo">Photo</label>
              <input
                type={photoFieldType}
                name="photo"
                id="photo"
                className="form-control"
                value={photo}
                placeholder="URL of your advert photo"
                onChange={this.onInputChange}
              />
            </div>
            <h2 className="text-center mt-5">Preview</h2>
            <div id="advert-preview" className="mb-5rem">
              <Advert advert={advert} />
            </div>
            <button type="submit" className="btn btn-primary submit-btn">{updateOrCreateAdvert}</button>
          </form>

        </div>
      </div>
    );
  }
}
