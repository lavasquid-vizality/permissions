import React from 'react';
import { Plugin } from '@vizality/entities';
import { getModule } from '@vizality/webpack';
import { findInReactTree } from '@vizality/util/react';

import GuildPermissionsModal from './components/GuildPermissionsModal';
import ChannelPermissionsModal from './components/ChannelPermissionsModal';

import patchContextMenuLazy from './modules/patchContextMenuLazy';
import { DefaultSettings } from './constants';

const { MenuItem } = getModule(m => m.MenuItem);

const { openModalLazy } = getModule(m => m.openModalLazy);

export default class Permissions extends Plugin {
  start () {
    this.injectStyles('./style.css');
    this.patch();
  }

  patch () {
    patchContextMenuLazy(getModule.bind(this, m => m.default?.displayName === 'GuildContextMenu'), 'default', (args, res) => {
      const { guild } = args[0];

      findInReactTree(res.props.children, m => m.children?.[m.children.length - 1]?.props.id === 'hide-muted-channels').children.unshift(<MenuItem action={() => openModalLazy(() => ModalArgs => <GuildPermissionsModal {...ModalArgs} guild={guild} description={this.settings.get('GuildPermissionDescription', DefaultSettings.GuildPermissionDescription)} />)} id={'guild-permissions'} label={'View Permissions'} />);

      return res;
    });

    patchContextMenuLazy(getModule.bind(this, m => m.default?.displayName === 'ChannelListTextChannelContextMenu' && m.default.name === 'm'), 'default', (args, res) => {
      const { guild, channel } = args[0];

      findInReactTree(res.props.children, m => m.children?.[m.children.length - 1]?.props.id === 'channel-notifications').children.unshift(<MenuItem action={() => openModalLazy(() => ModalArgs => <ChannelPermissionsModal {...ModalArgs} guild={guild} channel={channel} description={this.settings.get('ChannelPermissionDescription', DefaultSettings.ChannelPermissionDescription)} />)} id={'category-permissions'} label={'View Permissions'} />);

      return res;
    });
    patchContextMenuLazy(getModule.bind(this, m => m.default?.displayName === 'ChannelListTextChannelContextMenu' && m.default.name === 'g'), 'default', (args, res) => {
      const { guild, channel } = args[0];

      findInReactTree(res.props.children, m => m.children?.[m.children.length - 1]?.props.id === 'channel-notifications').children.unshift(<MenuItem action={() => openModalLazy(() => ModalArgs => <ChannelPermissionsModal {...ModalArgs} guild={guild} channel={channel} description={this.settings.get('ChannelPermissionDescription', DefaultSettings.ChannelPermissionDescription)} />)} id={'channel-permissions'} label={'View Permissions'} />);

      return res;
    });
    patchContextMenuLazy(getModule.bind(this, m => m.default?.displayName === 'ChannelListVoiceChannelContextMenu'), 'default', (args, res) => {
      const { guild, channel } = args[0];

      findInReactTree(res.props.children, m => m.children?.[0].props.id === 'hide-voice-names').children.push(<MenuItem action={() => openModalLazy(() => ModalArgs => <ChannelPermissionsModal {...ModalArgs} guild={guild} channel={channel} description={this.settings.get('ChannelPermissionDescription', DefaultSettings.ChannelPermissionDescription)} />)} id={'channel-permissions'} label={'View Permissions'} />);

      return res;
    });
  }
}
