import React from 'react';
import { Plugin } from '@vizality/entities';
import { patch } from '@vizality/patcher';
import { open } from '@vizality/modal';
import { getModule } from '@vizality/webpack';
import { findInReactTree } from '@vizality/util/react';

import GuildPermissionsModal from './components/GuildPermissionsModal';
import ChannelPermissionsModal from './components/ChannelPermissionsModal';

import { defaultSettings } from './constants';

const { MenuItem } = getModule(m => m.MenuItem);

export default class extends Plugin {
  start () {
    this.injectStyles('./style.css');
    this.patch();
  }

  patch () {
    patch(getModule(m => m.default?.displayName === 'GuildContextMenu'), 'default', (args, res) => {
      const { guild } = args[0];

      findInReactTree(res.props.children, m => m.children?.[0]?.props.id === 'mute-guild').children.unshift(<MenuItem action={() => open(() => <GuildPermissionsModal guild={guild} description={this.settings.get('GuildPermissionDescription', defaultSettings.GuildPermissionDescription)} />)} id={'guild-permissions'} label={'View Permissions'} />);

      return res;
    });

    patch(getModule(m => m.default?.displayName === 'ChannelListTextChannelContextMenu' && m.default.name === 'S'), 'default', (args, res) => {
      const { guild, channel } = args[0];

      findInReactTree(res.props.children, m => m.children?.[0]?.props.id === 'mute-channel').children.unshift(<MenuItem action={() => open(() => <ChannelPermissionsModal guild={guild} channel={channel} description={this.settings.get('ChannelPermissionDescription', defaultSettings.ChannelPermissionDescription)} />)} id={'category-permissions'} label={'View Permissions'} />);

      return res;
    });
    patch(getModule(m => m.default?.displayName === 'ChannelListTextChannelContextMenu' && m.default.name === 'O'), 'default', (args, res) => {
      const { guild, channel } = args[0];

      findInReactTree(res.props.children, m => m.children?.[0]?.props.id === 'mute-channel').children.unshift(<MenuItem action={() => open(() => <ChannelPermissionsModal guild={guild} channel={channel} description={this.settings.get('ChannelPermissionDescription', defaultSettings.ChannelPermissionDescription)} />)} id={'channel-permissions'} label={'View Permissions'} />);

      return res;
    });
    patch(getModule(m => m.default?.displayName === 'ChannelListVoiceChannelContextMenu' && m.default.name === 'b'), 'default', (args, res) => {
      const { guild, channel } = args[0];

      findInReactTree(res.props.children, m => m.children?.[0].props.id === 'hide-voice-names').children.push(<MenuItem action={() => open(() => <ChannelPermissionsModal guild={guild} channel={channel} description={this.settings.get('ChannelPermissionDescription', defaultSettings.ChannelPermissionDescription)} />)} id={'channel-permissions'} label={'View Permissions'} />);

      return res;
    });
  }
}
