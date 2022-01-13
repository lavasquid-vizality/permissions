import { isEqual } from 'lodash';
import React, { memo, useState, useEffect } from 'react';
import { OverflowTooltip } from '@vizality/components';
import { getModule } from '@vizality/webpack';
const { object: { isEmptyObject }, time: { sleep } } = require('@vizality/util');

import DynamicAnimatedAvatar from './DynamicAnimatedAvatar';

import { Class } from '../constants';

const Modal = getModule(m => m.ModalRoot);
const PermissionsForm = getModule(m => m.displayName === 'PermissionsForm');
const Flex = getModule(m => m.displayName === 'Flex');
const { AdvancedScrollerThin } = getModule(m => m.AdvancedScrollerThin);
const HeaderBar = getModule(m => m.displayName === 'HeaderBar');
const GuildIconWrapper = getModule(m => m.displayName === 'GuildIconWrapper');
const SyncStatusCard = getModule(m => m.displayName === 'SyncStatusCard');
const TabBar = getModule(m => m.displayName === 'TabBar');
const GuildRole = getModule(m => m.displayName === 'GuildRole');

const { generateChannelPermissionSpec } = getModule(m => m.generateGuildPermissionSpec && m.generateChannelPermissionSpec);
const { getChannel } = getModule(m => m.getChannel && m.hasChannel);

const { title } = getModule('title', 'caret');
const { card } = getModule(m => m.card && m.label && !m.channelContainer);
const { role } = getModule('role', 'lock');
const { icon } = getModule(m => m.icon && m.title && Object.keys(m).length === 2);
const { marginBottom40 } = getModule('marginBottom40');
const { layoutStyle } = getModule('layoutStyle');

export default memo(({ transitionState, guild, channel, description }) => {
  const { empty, emptyIconGuilds, emptyText } = getModule('empty', 'emptyIcon') ?? Class.empty;
  const { infoScroller } = getModule('infoScroller') ?? Class.infoScroller;

  const PermissionOverwrites = channel.permissionOverwrites;
  if (isEmptyObject(PermissionOverwrites)) {
    return <Modal.ModalRoot transitionState={transitionState} size={Modal.ModalSize.MEDIUM}>
      <div className={empty}>
        <div className={emptyIconGuilds}></div>
        <div className={emptyText}>{'No Permission Overwrites'}</div>
      </div>
    </Modal.ModalRoot>;
  }

  useEffect(() => {
    (async () => {
      await sleep(1);

      const HBTitleStyle = document.querySelector(`.P-CPHeaderBar .vz-overflow-tooltip > .${title}`)?.style;
      if (HBTitleStyle) {
        HBTitleStyle.setProperty('display', 'inline-block');
        HBTitleStyle.setProperty('text-overflow', 'ellipsis');
        HBTitleStyle.setProperty('max-width', '100%');
        HBTitleStyle.setProperty('vertical-align', 'middle');
        HBTitleStyle.setProperty('padding-right', '8px');
      }

      const SSCardStyle = document.querySelector(`.P-CPHeaderBar .${card}`)?.style;
      if (SSCardStyle) {
        SSCardStyle.setProperty('margin-top', '0');
        SSCardStyle.setProperty('min-width', 'max-content');
      }

      document.querySelectorAll(`.P-CRScroller .${role}`).forEach(role => role.style.setProperty('box-sizing', 'border-box'));
      document.querySelectorAll(`.P-CPScroller .${icon}`).forEach(icon => icon.style.setProperty('display', 'none'));
    })();
  }, []);

  const [ selectedPermissionOverwrites, setSelectedPermissionOverwrites ] = useState(Object.keys(PermissionOverwrites)[0]);
  const permissionOverwrites = PermissionOverwrites[selectedPermissionOverwrites];
  const ChannelPermissionSpec = generateChannelPermissionSpec(guild.id, channel.type, true);
  const PermissionsForms = [];
  for (const [ index, category ] of Object.entries(ChannelPermissionSpec)) {
    if (!description) {
      category.permissions = category.permissions.map(permission => ({ ...permission, description: '' }));
    }

    PermissionsForms.push(<PermissionsForm className={index !== `${ChannelPermissionSpec.length - 1}` ? marginBottom40 : null} allow={permissionOverwrites.allow} deny={permissionOverwrites.deny} spec={category} onChange={() => void 0} />);
  }

  const CategoryChannel = getChannel(channel.parent_id);
  let Synced = false;
  if (CategoryChannel) {
    Synced = isEqual(CategoryChannel.permissionOverwrites, PermissionOverwrites);
  }

  return <Modal.ModalRoot transitionState={transitionState} size={Modal.ModalSize.LARGE}>
    <HeaderBar className={'P-CPHeaderBar'}>{[
      <GuildIconWrapper style={{ marginRight: '10px', minWidth: '50px' }} guild={guild} size={GuildIconWrapper.Sizes.LARGE} animate={true} />,
      <OverflowTooltip tooltipClassName={'P-CPTooltip'} text={`${guild.name}\n${channel.name}`}><HeaderBar.Title>{`${guild.name} | ${channel.name}`}</HeaderBar.Title></OverflowTooltip>,
      (CategoryChannel && <SyncStatusCard icon={getModule(m => m.displayName === `${Synced ? 'Synced' : 'Unsynced'}`)} noticeText={Synced ? [ 'Permissions synced with category: ', <strong>{CategoryChannel.name}</strong> ] : 'Permissions not synced with category'} />)
    ]}</HeaderBar>
    <Flex style={{ height: 'calc(100% - 58px)' }}>
      <AdvancedScrollerThin className={`${infoScroller} P-CRScroller`} style={{ borderRight: '1px solid var(--background-modifier-accent)', width: `${description ? '100%' : null}` }}>
        <TabBar orientation={'vertical'} selectedItem={selectedPermissionOverwrites} onItemSelect={setSelectedPermissionOverwrites}>{
          // eslint-disable-next-line array-callback-return
          Object.values(PermissionOverwrites).map(permissionOverwrite => {
            switch (permissionOverwrite.type) {
              case 0: {
                const guildRole = guild.roles[permissionOverwrite.id];
                return <GuildRole id={permissionOverwrite.id} guild={guild} role={guildRole} color={guildRole.colorString}>{guildRole.name}</GuildRole>;
              }
              case 1: {
                return <GuildRole id={permissionOverwrite.id} guild={guild}>
                  <DynamicAnimatedAvatar guildId={guild.id} userId={permissionOverwrite.id} />
                </GuildRole>;
              }
            }
          })
        }</TabBar>
      </AdvancedScrollerThin>
      <AdvancedScrollerThin className={infoScroller}>
        <div className={layoutStyle}>{PermissionsForms}</div>
      </AdvancedScrollerThin>
    </Flex>
  </Modal.ModalRoot>;
});
