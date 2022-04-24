import { isEqual } from 'lodash';
import React, { memo, useState, useEffect } from 'react';
import { Messages } from '@vizality/i18n';
import { OverflowTooltip } from '@vizality/components';
import { getModule } from '@vizality/webpack';
const { isEmptyObject } = require('@vizality/util/object');

import DynamicAnimatedAvatar from './DynamicAnimatedAvatar';

import { Class } from '../constants';

const Modal = getModule(m => m.ModalRoot);
const PermissionsForm = getModule(m => m.displayName === 'PermissionsForm');
const Flex = getModule(m => m.displayName === 'Flex');
const { AdvancedScrollerThin } = getModule(m => m.AdvancedScrollerThin);
const HeaderBar = getModule(m => m.displayName === 'HeaderBar');
const GuildIconWrapper = getModule(m => m.displayName === 'GuildIconWrapper');
const TabBar = getModule(m => m.displayName === 'TabBar');
let SyncStatusCard = getModule(m => m.displayName === 'SyncStatusCard');
let GuildRole = getModule(m => m.displayName === 'GuildRole');
const SyncIcons = {
  Synced: getModule(m => m.displayName === 'Synced'),
  Unsynced: getModule(m => m.displayName === 'Unsynced')
};

const { makeEveryoneOverwrite } = getModule(m => m.makeEveryoneOverwrite);
const { generateChannelPermissionSpec } = getModule(m => m.generateGuildPermissionSpec && m.generateChannelPermissionSpec);
const { getChannel } = getModule(m => m.getChannel && m.hasChannel);
const { PermissionOverwriteType } = getModule(m => m.PermissionOverwriteType);
const { getUser } = getModule(m => m.getCurrentUser && m.getUser);

const { empty, emptyIconGuilds, emptyText } = Class.empty;
const { title } = getModule('title', 'caret');
const { icon } = getModule(m => m.title && m.icon && Object.keys(m).length === 2);
const { marginBottom40 } = getModule('marginBottom40');
const { infoScroller } = Class.infoScroller;
const { layoutStyle } = Class.xsmallAvatar;
let { card } = getModule(m => m.card && m.label && !m.channelContainer) ?? {};
let { role } = getModule('role', 'lock') ?? {};

export default memo(({ transitionState, guild, channel, description }) => {
  if (!SyncStatusCard) SyncStatusCard = getModule(m => m.displayName === 'SyncStatusCard');
  if (!GuildRole) GuildRole = getModule(m => m.displayName === 'GuildRole');
  if (!SyncIcons.Unsynced) SyncIcons.Unsynced = getModule(m => m.displayName === 'Unsynced');
  if (!card) ({ card } = getModule(m => m.card && m.label && !m.channelContainer) ?? {});
  if (!role) ({ role } = getModule('role', 'lock') ?? {});

  const { permissionOverwrites } = channel;
  if (isEmptyObject(permissionOverwrites)) {
    return <Modal.ModalRoot transitionState={transitionState} size={Modal.ModalSize.MEDIUM} aria-label={'Channel Permissions Modal'}>
      <div className={empty}>
        <div className={emptyIconGuilds}></div>
        <div className={emptyText}>{'No Permission Overwrites'}</div>
      </div>
    </Modal.ModalRoot>;
  }
  if (!permissionOverwrites[guild.id]) permissionOverwrites[guild.id] = makeEveryoneOverwrite(guild.id);

  useEffect(() => {
    document.querySelectorAll(`.P-CRScroller .${role}`).forEach(role => role.style.setProperty('box-sizing', 'border-box'));
    document.querySelectorAll(`.P-CPScroller .${icon}`).forEach(icon => icon.style.setProperty('display', 'none'));

    const SSCardStyle = document.querySelector(`.P-CPHeaderBar .${card}`)?.style;
    if (SSCardStyle) {
      SSCardStyle.setProperty('margin-top', '0');
      SSCardStyle.setProperty('min-width', 'max-content');
    }

    Promise.resolve().then(() => {
      const HBTitleStyle = document.querySelector(`.P-CPHeaderBar .vz-overflow-tooltip > .${title}`).style;
      if (HBTitleStyle) {
        HBTitleStyle.setProperty('display', 'inline-block');
        HBTitleStyle.setProperty('text-overflow', 'ellipsis');
        HBTitleStyle.setProperty('max-width', '100%');
        HBTitleStyle.setProperty('vertical-align', 'middle');
        HBTitleStyle.setProperty('padding-right', '8px');
      }
    });
  }, []);

  const [ selectedPermissionId, setSelectedPermissionId ] = useState(guild.id);
  const everyoneRoleSelected = selectedPermissionId === guild.id;
  const channelPermissionSpec = generateChannelPermissionSpec(guild.id, channel.type, everyoneRoleSelected);
  const permissionsForms = [];
  for (const [ index, category ] of Object.entries(channelPermissionSpec)) {
    const permissionOverwrite = permissionOverwrites[selectedPermissionId];
    if (!description) {
      category.permissions = category.permissions.map(permission => ({ ...permission, description: '' }));
    }

    permissionsForms.push(<PermissionsForm className={index !== `${channelPermissionSpec.length - 1}` ? marginBottom40 : null} allow={permissionOverwrite.allow} deny={permissionOverwrite.deny} spec={category} onChange={() => void 0} />);
  }

  const categoryChannel = getChannel(channel.parent_id);
  let synced = false;
  if (categoryChannel) {
    synced = isEqual(categoryChannel.permissionOverwrites, permissionOverwrites);
  }

  return <Modal.ModalRoot transitionState={transitionState} size={Modal.ModalSize.LARGE} aria-label={'Channel Permissions Modal'}>
    <HeaderBar className={'P-CPHeaderBar'}>{[
      <GuildIconWrapper style={{ marginRight: '10px', minWidth: '50px' }} guild={guild} size={GuildIconWrapper.Sizes.LARGE} animate={true} />,
      <OverflowTooltip tooltipClassName={'P-CPTooltip'} text={`${guild.name}\n${channel.name}`}><HeaderBar.Title>{`${guild.name} | ${channel.name}`}</HeaderBar.Title></OverflowTooltip>,
      categoryChannel && SyncStatusCard && <SyncStatusCard icon={SyncIcons[synced ? 'Synced' : 'Unsynced']} noticeText={Messages[synced ? 'CHANNEL_LOCKED_TO_CATEGORY' : 'PERMISSIONS_UNSYNCED'].format({ categoryName: categoryChannel.name })} />
    ]}</HeaderBar>
    <Flex style={{ height: '0%' }}>
      <AdvancedScrollerThin className={`${infoScroller} P-CRScroller`} style={{ borderRight: '1px solid var(--background-modifier-accent)', width: `${description ? '100%' : null}` }}>
        <TabBar orientation={'vertical'} selectedItem={selectedPermissionId} onItemSelect={setSelectedPermissionId}>{[
          [ Object.values(permissionOverwrites).filter(permissionOverwrite => permissionOverwrite.type === PermissionOverwriteType.ROLE)
            .map(permissionOverwrite => guild.roles[permissionOverwrite.id])
            .sort((a, b) => b.position - a.position)
            .map(role => {
              return GuildRole
                ? <GuildRole id={role.id} guild={guild} role={role} color={role.colorString}>{role.name}</GuildRole>
                : <TabBar.Item id={role.id} color={role.colorString}>{role.name}</TabBar.Item>;
            }) ],
          [ Object.values(permissionOverwrites).filter(permissionOverwrite => permissionOverwrite.type === PermissionOverwriteType.MEMBER)
            .map(permissionOverwrite => getUser(permissionOverwrite.id))
            .filter(permissionOverwrite => permissionOverwrite)
            .sort((a, b) => a.username.localeCompare(b.username))
            .map(user => {
              return GuildRole
                ? <GuildRole id={user.id} guild={guild}>
                  <DynamicAnimatedAvatar guildId={guild.id} user={user} />
                </GuildRole>
                : <TabBar.Item id={user.id}>
                  <DynamicAnimatedAvatar guildId={guild.id} user={user} />
                </TabBar.Item>;
            }) ]
        ]}</TabBar>
      </AdvancedScrollerThin>
      <AdvancedScrollerThin className={infoScroller}>
        <div className={layoutStyle}>{permissionsForms}</div>
      </AdvancedScrollerThin>
    </Flex>
    {!SyncStatusCard && <Modal.ModalFooter>
      <div style={{ color: 'red' }}>{'To show correct modal (with category sync) please open channel setting once.'}</div>
    </Modal.ModalFooter>}
  </Modal.ModalRoot>;
});
