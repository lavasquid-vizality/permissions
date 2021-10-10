import React, { memo } from 'react';
import { SwitchItem } from '@vizality/components/settings';

import { defaultSettings } from '../constants';

export default memo(({ getSetting, updateSetting, toggleSetting }) => {
  return <>
    <SwitchItem
      value={getSetting('GuildPermissionDescription', defaultSettings.GuildPermissionDescription)}
      onChange={() => toggleSetting('GuildPermissionDescription')}
    >
      {'Guild Permission Description'}
    </SwitchItem>
    <SwitchItem
      description={'Includes all channel types and categories'}
      value={getSetting('ChannelPermissionDescription', defaultSettings.ChannelPermissionDescription)}
      onChange={() => toggleSetting('ChannelPermissionDescription')}
    >
      {'Channel Permission Description'}
    </SwitchItem>
  </>;
});
