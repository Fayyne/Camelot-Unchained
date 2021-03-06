/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import styled from 'react-emotion';
import { webAPI } from 'camelot-unchained';

import { PatcherServer, ServerType } from '../../services/session/controller';
import { patcher, permissionsString, canAccessChannel } from '../../../../services/patcher';
import GameSelect from './components/GameSelect';
import CharacterInfo from './components/CharacterInfo';
import ToolsSelect from './components/ToolsSelect';

const ButtonContainer = styled('div')`
  display: flex;
`;

const HoverArea = styled('div')`
  position: absolute;
  width: 60px;
  height: 70%;
  left: 100px;
  top: -25px;
  transform: rotate(35deg);
  z-index: 10;
  cursor: pointer;
`;

const AccessLevelText = styled('div')`
  position: absolute;
  top: -25px;
  left: 15px;
  color: white;
  font-size: 14px;
  opacity: 0.5;
  margin-right: 30px;
`;

export interface CharacterButtonProps {
  character: webAPI.SimpleCharacter;
  selectedServer: PatcherServer;
  characters: {[id: string]: webAPI.SimpleCharacter};
  servers: {[id: string]: PatcherServer};
  serverType: ServerType;
  selectCharacter: (character: webAPI.SimpleCharacter) => void;
  selectServer: (server: PatcherServer) => void;
  selectServerType: (type: ServerType) => void;
  onNavigateToCharacterSelect: () => void;
}

export interface CharacterButtonState {
  hasAccess: boolean;
}

class CharacterButton extends React.PureComponent<CharacterButtonProps, CharacterButtonState> {
  constructor(props: CharacterButtonProps) {
    super(props);
    this.state = {
      hasAccess: true,
    };
  }

  public render() {
    const {
      servers,
      character,
      characters,
      selectedServer,
      onNavigateToCharacterSelect,
      serverType,
      selectServerType,
      selectServer,
    } = this.props;

    return (
      <ButtonContainer>
        {patcher.getPermissions() &&
          <AccessLevelText>
            Your Access Level: {permissionsString(patcher.getPermissions())}
          </AccessLevelText>
        }
        <HoverArea />
        {servers &&
          <GameSelect
            servers={servers}
            serverType={serverType}
            onSelectServerType={selectServerType}
          />
        }
        {serverType === ServerType.CHANNEL &&
          <ToolsSelect
            servers={servers}
            onSelectServer={selectServer}
            selectedServer={selectedServer}
          />
        }
        {serverType === ServerType.CUGAME &&
          <CharacterInfo
            character={character}
            characters={characters}
            selectedServer={selectedServer}
            hasAccessToServers={this.state.hasAccess}
            onNavigateToCharacterSelect={onNavigateToCharacterSelect}
          />
        }
      </ButtonContainer>
    );
  }

  public componentDidCatch(error: Error, info: any) {
    console.error(error);
    console.log(info);
  }

  public componentWillUpdate(nextProps: CharacterButtonProps) {
    const { selectedServer, character, characters } = nextProps;
    if (selectedServer === null || typeof selectedServer === 'undefined' || selectedServer.type !== this.props.serverType) {
      this.initializeSelectedServer(this.props);
    }

    if (!character || character === null || !characters[character.id] ||
        character.shardID.toString() !== character.shardID.toString()) {
      this.initializeSelectedCharacter(this.props);
    }
  }

  private initializeSelectedServer = (props: CharacterButtonProps) => {
    const values = [];
    const servers = props.servers;
    Object.keys(servers).forEach((key: string) => {
      if (servers[key].type === props.serverType &&
        canAccessChannel(patcher.getPermissions(), servers[key].channelPatchPermissions)) {
        values.push(servers[key]);
      }
    });
    if (values.length === 0) {
      this.setState({ hasAccess: false });
      this.props.selectServer(null);
      return;
    }

    if (props.serverType === ServerType.CHANNEL) {
      this.props.selectServer(values.find(value => value.name === 'Editor') || values[0]);
    } else {
      this.props.selectServer(values[0]);
    }
  }

  private initializeSelectedCharacter = (props: CharacterButtonProps) => {
    const { selectedServer, character, characters } = props;
    const serverCharacters: webAPI.SimpleCharacter[] = [];

    if (!selectedServer || !selectedServer.shardID) {
      this.props.selectCharacter(null);
      return;
    }

    Object.keys(characters).forEach((key) => {
      if (characters[key].shardID.toString() === selectedServer.shardID.toString()) {
        serverCharacters.push(characters[key]);
      }
    });

    if (serverCharacters) {
      serverCharacters.sort((a, b) => {
        return Date.parse(b.lastLogin) - Date.parse(a.lastLogin);
      });
    }

    if (!character || character === null || !characters[character.id] ||
        character.shardID.toString() !== selectedServer.shardID.toString()) {
      this.props.selectCharacter(serverCharacters[0]);
    }
  }
}

export default CharacterButton;
