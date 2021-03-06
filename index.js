import React, { lazy, Suspense } from 'react';
import { Plugin } from '@vizality/entities';
import { patch } from '@vizality/patcher';
import { getModule } from '@vizality/webpack';

import getContextMenuLazy from './modules/getContextMenuLazy';
import { DefaultSettings } from './constants';

const { MenuItem } = getModule(m => m.MenuItem);
const GuildPermissionsModal = lazy(() => import('./components/GuildPermissionsModal'));
const ChannelPermissionsModal = lazy(() => import('./components/ChannelPermissionsModal'));

const Constants = getModule(m => m.API_HOST);
const { openModalLazy } = getModule(m => m.openModalLazy);
const { getGuild } = getModule(m => m.getGuild);

export default class Permissions extends Plugin {
  start () {
    this.injectStyles('./style.css');
    this.patch();
  }

  patch () {
    getContextMenuLazy(getModule.bind(this, m => m.default?.toString().includes('MUTE_SERVER'))).then(module => patch(module, 'default', (args, res) => {
      const guild = args[0];

      return [
        <MenuItem action={() => openModalLazy(() => ModalArgs => <Suspense fallback={null}>
          <GuildPermissionsModal {...ModalArgs} guild={guild} description={this.settings.get('GuildPermissionDescription', DefaultSettings.GuildPermissionDescription)} />
        </Suspense>)} id={'guild-permissions'} label={'View Permissions'} />,
        res
      ];
    }));

    getContextMenuLazy(getModule.bind(this, m => m.getMuteSettings)).then(module => patch(module, 'default', (args, res) => {
      const channel = args[0];
      if (Constants.ChannelTypes[channel.type].includes('DM')) return res;
      const guild = getGuild(channel.guild_id);

      return [
        <MenuItem action={() => openModalLazy(() => ModalArgs => <Suspense fallback={null}>{
          <ChannelPermissionsModal {...ModalArgs} guild={guild} channel={channel} description={this.settings.get('ChannelPermissionDescription', DefaultSettings.ChannelPermissionDescription)} />
        }</Suspense>)} id={'channel-permissions'} label={'View Permissions'} />,
        res
      ];
    }));
    getContextMenuLazy(getModule.bind(this, m => m.default?.displayName === 'useChannelHideNamesItem')).then(module => patch(module, 'default', (args, res) => {
      const channel = args[0];
      const guild = getGuild(channel.guild_id);

      return [
        <MenuItem action={() => openModalLazy(() => ModalArgs => <Suspense fallback={null}>{
          <ChannelPermissionsModal {...ModalArgs} guild={guild} channel={channel} description={this.settings.get('ChannelPermissionDescription', DefaultSettings.ChannelPermissionDescription)} />
        }</Suspense>)} id={'channel-permissions'} label={'View Permissions'} />,
        res
      ];
    }));
  }
}
