import React from "react";
import { withRouter } from "react-router-dom";

class Advert extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  goDetailPage = () => {
    this.props.history.push(`/advert/${this.props.advert.id}`)
  };

  render() {
    const advert = this.props.advert;
    return (
      <div
        key={advert.id}
        style={{ border: "1px solid red", cursor: "pointer", margin: "1rem" }}
        onClick={this.goDetailPage}
      >
        <h1>{advert.name}</h1>
        <p>{advert.description}</p>
        <p>{advert.price} €</p>
        <p>{advert.type}</p>
        <div>
          {advert.tags.map( tag => <span key={`${advert.id}_${tag}`} className={`badge badge-${tag}`}>{tag} </span>)}
        </div>
      </div>
    );
  }
}

export default withRouter(Advert);