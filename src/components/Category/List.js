import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { withRouter } from 'react-router';
import {GridList, GridTile} from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';
import CategoryService from '../../services/category';

import styles from './styles.js';

@observer
class Lists extends Component {

  constructor(props) {
    super(props);
    this.renderItemContent = this.renderItemContent.bind(this);
  }

  renderItemContent(key, category) {
    return (
      <GridTile
        key={key}
        title={<span><b>{category.title}</b></span>}
        subtitle={<span>{category.description}</span>}
        actionIcon={<IconButton><StarBorder color="white" /></IconButton>}
        onTouchTap={() => (this.props.router.push(`/category/${key}`))}
      >
        <img src={category.photoURL} alt={category.title} />
      </GridTile>
    );
  }

  render() {
    const categories = CategoryService.categoryList || {};

    return (
      <div style={styles.wrapperGridList}>
        <GridList
          cellHeight={180}
          style={styles.gridList}
        >
          {Object.keys(categories).map((key) => this.renderItemContent(key, categories[key]))}
        </GridList>
      </div>
    )
  }
}

export default withRouter(Lists);
