import React, { memo } from 'react';
import { SwitchItem } from '@vizality/components/settings';

import { DefaultSettings } from '../constants';

export default memo(({ getSetting, updateSetting, toggleSetting }) => {
  return <>
    <SwitchItem
      value={getSetting('GuildPermissionDescription', DefaultSettings.GuildPermissionDescription)}
      onChange={() => toggleSetting('GuildPermissionDescription')}
    >
      {'Guild Permission Description'}
    </SwitchItem>
    <SwitchItem
      description={'Includes all channel types and categories'}
      value={getSetting('ChannelPermissionDescription', DefaultSettings.ChannelPermissionDescription)}
      onChange={() => toggleSetting('ChannelPermissionDescription')}
    >
      {'Channel Permission Description'}
    </SwitchItem>
  </>;
});
