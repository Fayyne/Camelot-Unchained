/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Andrew L. Jackson (jacksonal300@gmail.com)
 * @Date: 2017-03-03 16:12:13
 * @Last Modified by: Andrew L. Jackson (jacksonal300@gmail.com)
 * @Last Modified time: 2017-03-03 16:21:53
 */

import * as React from 'react';
import { BanesAndBoonsInfo, TraitMap } from '../../services/session/banesAndBoons';
import Trait, { TraitStyle } from './Trait';
import { styleConstants } from '../../styleConstants';

const Bane = (props: {
  trait: BanesAndBoonsInfo;
  onBaneClick: Function;
  onCancelBane: Function;
  onUpdateRankBane: Function;
  allPrerequisites: TraitMap;
  allExclusives: TraitMap;
  addedBanes: BanesAndBoonsInfo[];
  styles: Partial<TraitStyle>;
}) => {
  const {
    trait,
    onBaneClick,
    onCancelBane,
    onUpdateRankBane,
    allPrerequisites,
    allExclusives,
    addedBanes,
    styles
  } = props;
  const baneStyles = Object.assign(
    {},
    { trait: { ...styleConstants.marginLeft, ...styles.trait } },
    styles
  );
  return (
    <Trait
      type='Bane'
      trait={trait}
      onTraitClick={onBaneClick}
      onCancelTrait={onCancelBane}
      onUpdateRankTrait={onUpdateRankBane}
      allPrerequisites={allPrerequisites}
      allExclusives={allExclusives}
      addedTraits={addedBanes}
      primaryColor='#E85143'
      styles={baneStyles}
    />
  )
};

export default Bane;
