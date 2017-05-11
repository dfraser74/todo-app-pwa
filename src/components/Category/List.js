import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { withRouter } from 'react-router';
import {GridList, GridTile} from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import Subheader from 'material-ui/Subheader';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';
import CategoryService from '../../services/category';

import styles from './styles.js';

@observer
class Lists extends Component {

  render() {
    const categories = CategoryService.categoryList || {};

    return (
      <div style={styles.wrapperGridList}>
        <GridList
          cellHeight={180}
          style={styles.gridList}
        >
          <Subheader>List Category</Subheader>
          {Object.keys(categories).map((tile) => (
            <GridTile
              key={tile}
              title={<span><b>{categories[tile].title}</b></span>}
              subtitle={<span>{categories[tile].description}</span>}
              actionIcon={<IconButton><StarBorder color="white" /></IconButton>}
            >
              <img src={categories[tile].photoURL} />
            </GridTile>
          ))}
        </GridList>
      </div>
    )
  }
}

export default withRouter(Lists);
