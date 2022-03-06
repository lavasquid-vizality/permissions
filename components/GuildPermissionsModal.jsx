import React, { memo, useState, useEffect } from 'react';
import { getModule } from '@vizality/webpack';

import { Class } from '../constants';

const Modal = getModule(m => m.ModalRoot);
const Flex = getModule(m => m.displayName === 'Flex');
const { AdvancedScrollerThin } = getModule(m => m.AdvancedScrollerThin);
const HeaderBar = getModule(m => m.displayName === 'HeaderBar');
const GuildIconWrapper = getModule(m => m.displayName === 'GuildIconWrapper');
const TabBar = getModule(m => m.displayName === 'TabBar');
const { PermissionsList } = getModule(m => m.default && m.PermissionsList);

const Constants = getModule(m => m.API_HOST);
const { generateGuildPermissionSpec } = getModule(m => m.generateGuildPermissionSpec && m.generateChannelPermissionSpec);

const { clearButtonWrapper } = getModule('clearButtonWrapper');
const { icon } = getModule(m => m.title && m.icon && Object.keys(m).length === 2);
const { infoScroller } = Class.infoScroller;
const { row, roleDot, roleName } = getModule('row', 'roleName');
const { colorInteractiveActive } = getModule('colorInteractiveActive');
const { size14 } = getModule('size14', 'size32');

export default memo(({ transitionState, guild, description }) => {
  useEffect(() => {
    document.querySelector(`.P-GPScroller .${clearButtonWrapper}`)?.style.setProperty('display', 'none');
    document.querySelectorAll(`.P-GPScroller .${icon}`).forEach(icon => icon.style.setProperty('display', 'none'));
  }, []);

  const Roles = guild.roles;
  const [ role, setRole ] = useState(Object.keys(Roles)[0]);
  const GuildPermissionSpec = generateGuildPermissionSpec(guild);
  if (!description) {
    for (const category of GuildPermissionSpec) {
      category.permissions = category.permissions.map(permission => ({ ...permission, description: '' }));
    }
  }

  return <Modal.ModalRoot transitionState={transitionState} size={Modal.ModalSize.LARGE} aria-label={'Guild Permissions Modal'}>
    <Flex style={{ height: '100%' }}>
      <AdvancedScrollerThin className={`${infoScroller} P-GRScroller`} style={{ borderRight: '1px solid var(--background-modifier-accent)', width: `${description ? '100%' : null}` }}>
        <HeaderBar className={'P-GPHeaderBar'}>{[
          <GuildIconWrapper style={{ marginRight: '10px' }} guild={guild} size={GuildIconWrapper.Sizes.LARGE} animate={true} />,
          <HeaderBar.Title>{guild.name}</HeaderBar.Title>
        ]}</HeaderBar>
        <TabBar orientation={'vertical'} selectedItem={role} onItemSelect={setRole}>{
          Object.values(Roles).map(role => <TabBar.Item className={row} id={role.id}>{[
            <div className={roleDot} style={{ backgroundColor: role.colorString ?? `#${Constants.DEFAULT_ROLE_COLOR.toString(16)}` }} />,
            <div className={`${colorInteractiveActive} ${size14} ${roleName}`}>{role.name}</div>
          ]}</TabBar.Item>
          )
        }</TabBar>
      </AdvancedScrollerThin>
      <AdvancedScrollerThin className={`${infoScroller} P-GPScroller`}>
        <PermissionsList guild={guild} locked={true} role={Roles[role]} specs={GuildPermissionSpec} />
      </AdvancedScrollerThin>
    </Flex>
  </Modal.ModalRoot>;
});
